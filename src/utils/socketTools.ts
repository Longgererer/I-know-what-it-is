import Socket from '@utils/socket'
import CONFIG from '@utils/CONFIG'

export function buildWS(): Socket {
  return new Socket(CONFIG.WS_URL)
}

