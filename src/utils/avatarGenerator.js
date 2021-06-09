import { getRandomNumber } from '/@utils/tools'

class AvatarGenerator {
  constructor() {
    if (!AvatarGenerator.instance) {
      Object.assign(this, {
        id: ''
      })
      this.createAvatarId()
      AvatarGenerator.instance = this
    }
    return AvatarGenerator.instance
  }
  createAvatarId () {
    // 获取头像id，由6个两位数的数字（范围为00-47）组成
    const numList = new Array(6).fill(0)
    this.id = numList.map(() => {
      let num = getRandomNumber(0, 47, {})
      return `${num < 10 ? '0' : ''}${num}`
    }).join('')
    return this
  }
  getAvatarSVGUrl () {
    return this.id
  }
}

export default AvatarGenerator