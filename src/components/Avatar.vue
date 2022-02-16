<template>
  <avatar
    :circleColor="realAvatar?.circleColor"
    :accessoriesType="realAvatar?.accessoriesType"
    :clotheType="realAvatar?.clotheType"
    :clotheColor="realAvatar?.clotheColor"
    :eyebrowType="realAvatar?.eyebrowType"
    :eyeType="realAvatar?.eyeType"
    :facialHairColor="realAvatar?.facialHairColor"
    :facialHairType="realAvatar?.facialHairType"
    :graphicType="realAvatar?.graphicType"
    :hairColor="realAvatar?.hairColor"
    :mouthType="realAvatar?.mouthType"
    :skinColor="realAvatar?.skinColor"
    :topType="realAvatar?.topType"
    :topColor="realAvatar?.topColor"
  ></avatar>
</template>

<script setup lang="ts">
import Avatar from 'vuejs-avataaars/src/Avataaars.vue'
import { FreeObjT } from '@/@types'
import { avatarData, avatarDataOrderList } from '@utils/publicData'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{ avatar: string }>(),
  { avatar: undefined }
)

const realAvatar: FreeObjT = computed(() => {
  const avatar = props.avatar.split(',')
  const res = {}
  if (avatar && avatar.length) {
    avatarDataOrderList.forEach((key: string, index) => {
      const list = avatarData[key]
      res[key] = list[avatar[index]]
    })
  }
  return res
})

</script>

<style lang="scss">
</style>