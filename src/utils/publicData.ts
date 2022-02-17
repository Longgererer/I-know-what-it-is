import { FreeObjT, ListItemT } from '../@types'

const avatarData: FreeObjT = {
  accessoriesType: ["Blank", "Kurt", "Prescription01", "Prescription02", "Round", "Sunglasses", "Wayfarers"],
  circleColor: ['#6fb8e0', '#551253', '#09389d', '#a9e965', '#2fa3b9', '#d7e048'],
  clotheType: ["BlazerShirt", "BlazerSweater", "CollarSweater", "GraphicShirt", "Hoodie", "Overall", "ShirtCrewNeck", "ShirtScoopNeck", "ShirtVNeck"],
  clotheColor: ["Black", "Blue01", "Blue02", "Blue03", "Gray01", "Gray02", "Heather", "PastelBlue", "PastelGreen", "PastelOrange", "PastelRed", "PastelYellow", "Pink", "Red", "White"],
  eyebrowType: ["Angry", "AngryNatural", "Default", "DefaultNatural", "FlatNatural", "RaisedExcited", "RaisedExcitedNatural", "SadConcerned", "SadConcernedNatural", "UnibrowNatural", "UpDown", "UpDownNatural"],
  eyeType: ["Close", "Cry", "Default", "Dizzy", "EyeRoll", "Happy", "Hearts", "Side", "Squint", "Surprised", "Wink", "WinkWacky"],
  facialHairColor: ["Auburn", "Black", "Blonde", "BlondeGolden", "Brown", "BrownDark", "PastelPink", "Platinum", "Red", "SilverGray"],
  facialHairType: ["Blank", "BeardMedium", "BeardLight", "BeardMagestic", "MoustacheFancy", "MoustacheMagnum"],
  graphicType: ["Bat", "Cumbia", "Deer", "Diamond", "Hola", "Pizza", "Resist", "Selena", "Bear", "SkullOutline", "Skull"],
  hairColor: ["Auburn", "Black", "Blonde", "BlondeGolden", "Brown", "BrownDark", "PastelPink", "Platinum", "Red", "SilverGray"],
  mouthType: ["Concerned", "Default", "Disbelief", "Eating", "Grimace", "Sad", "ScreamOpen", "Serious", "Smile", "Tongue", "Twinkle", "Vomit"],
  skinColor: ["Tanned", "Yellow", "Pale", "Light", "Brown", "DarkBrown", "Black"],
  topType: ["NoHair", "Eyepatch", "Hat", "Hijab", "Turban", "WinterHat1", "WinterHat2", "WinterHat3", "WinterHat4", "LongHairBigHair", "LongHairBob", "LongHairBun", "LongHairCurly", "LongHairCurvy", "LongHairDreads", "LongHairFrida", "LongHairFro", "LongHairFroBand", "LongHairStraight", "LongHairStraight2", "ShortHairDreads01", "ShortHairDreads02", "ShortHairFrizzle", "ShortHairShortFlat", "ShortHairShortRound", "ShortHairShortWaved", "ShortHairSides", "ShortHairTheCaesar"],
  topColor: ["Black", "Blue01", "Blue02", "Blue03", "Gray01", "Gray02", "Heather", "PastelBlue", "PastelGreen", "PastelOrange", "PastelRed", "PastelYellow", "Pink", "Red", "White"]
}

const avatarDataOrderList: string[] = [
  'accessoriesType', 'circleColor', 'clotheType', 'clotheColor', 'eyebrowType', 'eyeType', 'facialHairColor', 'facialHairType', 'graphicType', 'hairColor', 'mouthType', 'skinColor', 'topType', 'topColor'
]

const themeList: ListItemT[] = [
  { label: '综合', value: 0 },
  { label: '水果', value: 1 },
  { label: '动物', value: 2 },
  { label: '物品', value: 3 },
]

const pointList: number[] = [10, 30, 60, 100, 120, 150, 200, 300]

const palette: string[] = [
  '#000000',
  '#FF0000',
  '#5D5D41',
  '#E9520F',
  '#FFA200',
  '#00FF08',
  '#FFFF00',
  '#001D56',
  '#0000FF',
  '#FF00FF',
  '#1890FF',
  '#00F0FF',
  '#00FFF0',
  '#F0F0F0'
]

const canvasBgc: string = '#F8F8F8'

export {
  avatarData,
  avatarDataOrderList,
  themeList,
  pointList,
  palette,
  canvasBgc
}