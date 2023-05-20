import { useEffect } from 'react'
import { createSocketConnection } from '../utils/ws'

/**
 * @deprecated Use useWebSocketContext instead
 */
export const useWebSocketConnection = () => {
  useEffect(() => {
    const unsetEventHandler = createSocketConnection()

    return unsetEventHandler
  }, [])
}
