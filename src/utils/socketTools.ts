import Socket from '@utils/socket'
import CONFIG from '@utils/CONFIG'
import { FreeObjT } from '@/@types'

export function buildWS(): Socket {
  return new Socket(CONFIG.WS_URL)
}

export function switchType(type: string | number): number | string | void {
  if (typeof type === 'string') {
    return CONFIG.WS_TYPE[type]
  } else {
    const list = Object.entries((CONFIG.WS_TYPE as FreeObjT))
    for (let i = 0;i < list.length;i++) {
      if (type === list[i][1]) {
        return list[i][0]
      }
    }
  }
}