import { ClientWSMessage } from '../../../types/Messages'

export const parseBufferToMessage = (buffer: Buffer): ClientWSMessage | null => {
  try {
    return JSON.parse(buffer.toString('utf8'))
  } catch (e: any) {
    console.error('Error when parsing message buffer: ', e.message)
  }
  return null
}

export const parseMessageToBuffer = (message: object): Buffer | null => {
  try {
    return Buffer.from(JSON.stringify(message))
  } catch (e: any) {
    console.error('Error with converting message to Node Buffer')
  }
  return null
}
