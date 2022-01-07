<template>
  <div class="loader" :class="`loader--${size}`">
    <div class="loader-item"></div>
    <div class="loader-item"></div>
    <div class="loader-item"></div>
    <div class="loader-item"></div>
    <div class="loader-item"></div>
    <div class="loader-item"></div>
    <div class="loader-item"></div>
    <div class="loader-item"></div>
    <div class="loader-item"></div>
    <div class="loader-item"></div>
    <div class="loader-item"></div>
    <div class="loader-item"></div>
    <div class="loader-item"></div>
    <div class="loader-item"></div>
    <div class="loader-item"></div>
    <div class="loader-item"></div>
    <div class="loader-item"></div>
    <div class="loader-item"></div>
    <div class="loader-item"></div>
    <div class="loader-item"></div>
    <div class="loader-item"></div>
    <div class="loader-item"></div>
    <div class="loader-item"></div>
    <div class="loader-item"></div>
    <div class="loader-item"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: string
}
const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
})
</script>

<style lang="scss">
.loader {
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(5, max-content);
  grid-template-rows: repeat(5, max-content);
  place-content: center;
  .loader-item {
    background-color: $main;
    --m: calc(0.5 * 4);
    --abs-i: max(var(--m) - var(--i), var(--i) - var(--m));
    --abs-j: max(var(--m) - var(--j), var(--j) - var(--m));
    animation: grow 2s infinite backwards;
    animation-delay: calc(0.5 * (var(--abs-i) + var(--abs-j)) / var(--m) * 1s);
    &:nth-child(n + 1) {
      --j: 0;
    }
    &:nth-child(n + 6) {
      --j: 1;
    }
    &:nth-child(n + 11) {
      --j: 2;
    }
    &:nth-child(n + 16) {
      --j: 3;
    }
    &:nth-child(n + 21) {
      --j: 4;
    }
    &:nth-child(5n + 1) {
      --i: 0;
    }
    &:nth-child(5n + 2) {
      --i: 1;
    }
    &:nth-child(5n + 3) {
      --i: 2;
    }
    &:nth-child(5n + 4) {
      --i: 3;
    }
    &:nth-child(5n + 5) {
      --i: 4;
    }
  }
  @keyframes grow {
    50% {
      transform: scale(0);
    }
    0%,
    100% {
      transform: scale(1);
    }
  }
}
@each $size in (small, medium) {
  .loader--#{$size} {
    .loader-item {
      width: map-get($loader-size, $size);
      height: map-get($loader-size, $size);
      border-radius: calc(map-get($loader-size, $size) / 5);
    }
  }
}
</style>