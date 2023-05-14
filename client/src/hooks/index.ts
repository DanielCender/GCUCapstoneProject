import { useEffect } from 'react'
import { createSocketConnection } from '../utils/ws'

export const useWebSocketConnection = () => {
  useEffect(() => {
    const unsetEventHandler = createSocketConnection()

    return unsetEventHandler
  }, [])
}
