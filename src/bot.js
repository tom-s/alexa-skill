import botBuilder from 'claudia-bot-builder'
import stringify from 'json-stringify'
import get from 'lodash.get'

/** Handlers  **/
const exitHandler = (msg=`Bye`) => speechResponse(msg, true)

const spellingHandler = ({text}) => text
  ? speechResponse(`Speller says ${text} is spelled ${text.toUpperCase().split('').join('. ')}.`)
  : exitHandler()

const HANDLERS = {
  'GetSpelling': spellingHandler,
  'ExitApp': exitHandler
}


/** Utils **/
const getIntentName = (alexaPayload) => get(alexaPayload, 'request.intent.name')

const response = (response) => ({
  response: {
    outputSpeech: {
      type: 'PlainText',
      text: stringify(response)
    },
    shouldEndSession: true
  }
})

const speechResponse = (msg = 'I dunno what to say', endSession = false) => ({
  response: {
    outputSpeech: {
      type: 'PlainText',
      text: msg
    },
    shouldEndSession: endSession
  }
})

/** Main **/
export default botBuilder((message, { body }) => {
  const intentName = getIntentName(body)
  const handler = HANDLERS[intentName]

  return handler
    ? handler(message)
    : exitHandler('No handler has been found')
}, { platforms: ['alexa'] })
