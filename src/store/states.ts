import { local } from '@utils/storage'

export default {
  username: local.get('username') || '',
  avatar: local.get('avatar') || '',
  userId: 0,
}