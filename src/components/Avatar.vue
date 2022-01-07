<template>
  <avatar
    :circleColor="avatar?.circleColor"
    :accessoriesType="avatar?.accessoriesType"
    :clotheType="avatar?.clotheType"
    :clotheColor="avatar?.clotheColor"
    :eyebrowType="avatar?.eyebrowType"
    :eyeType="avatar?.eyeType"
    :facialHairColor="avatar?.facialHairColor"
    :facialHairType="avatar?.facialHairType"
    :graphicType="avatar?.graphicType"
    :hairColor="avatar?.hairColor"
    :mouthType="avatar?.mouthType"
    :skinColor="avatar?.skinColor"
    :topType="avatar?.topType"
    :topColor="avatar?.topColor"
  ></avatar>
</template>

<script setup lang="ts">
import { FreeObjT } from '../@types'
import Avatar from 'vuejs-avataaars/src/Avataaars.vue'

const props = withDefaults(
  defineProps<{ avatar: FreeObjT }>(),
  { avatar: undefined }
)
</script>

<style lang="scss">
</style>