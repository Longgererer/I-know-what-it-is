import { RgbT, HexT, BaseT } from "@/@types"

const randomInteger = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const hex2Rgb = (color: HexT): RgbT => {
  const rgb1 = color.slice(1, 3)
  const rgb2 = color.slice(3, 5)
  const rgb3 = color.slice(5, 7)
  const res: RgbT = `rgb(${parseInt('0x' + rgb1)},${parseInt('0x' + rgb2)},${parseInt('0x' + rgb3)})`
  return res
}

const isColorDeep = (color: RgbT): boolean => {
  const arr = color.replace('rgb(', '').replace(')', '').split(',').map(Number)
  const grayLevel = arr[0] * 0.299 + arr[1] * 0.587 + arr[2] * 0.114
  return grayLevel < 192
}

const copyInfo = (info: string | number | symbol) => {
  info = info.toString()
  if (navigator.clipboard) {
    navigator.clipboard.writeText(info)
  } else {
    const input:HTMLInputElement = document.createElement('input')
    input.value = info.toString()
    document.body.appendChild(input)
    input.select()
    document.execCommand('Copy')
    document.body.removeChild(input)
  }
}

export {
  randomInteger,
  hex2Rgb,
  isColorDeep,
  copyInfo
}