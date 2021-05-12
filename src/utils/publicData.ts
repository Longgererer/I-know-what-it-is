type RoomType = {
  value: string
  id: number
}
const roomTypeList: RoomType[] = [
  { value: '综合', id: 0 },
  { value: '动物', id: 1 },
  { value: '物体', id: 2 },
  { value: '饮食', id: 3 },
]
export {
  RoomType,
  roomTypeList
}