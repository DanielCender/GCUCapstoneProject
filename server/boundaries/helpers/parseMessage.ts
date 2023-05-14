import { WSMessage } from '../../../types/Messages'

export const parseBufferToMessage = (buffer: Buffer): WSMessage => {
  let parsedMessage = { type: '', body: {} }
  try {
    parsedMessage = JSON.parse(buffer.toString('utf8'))
  } catch (e: any) {
    console.error('Error when parsing message buffer: ', e.message)
  } finally {
    return parsedMessage
  }
}
