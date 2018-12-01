<template>
  <div class="user">
    <div class="user__message"
         ref="message"
         v-if="message"
         :style="{ left: `${x}px`, top: `${y}px` }">
      {{ message }}
    </div>
    <img :src="isFace ? face : avatar"
         :width="width"
         class="user__avatar"
         :style="{ left: `${x-width/2}px`, top: `${y-width/2}px` }">
    <div class="user__name"
         :style="{ left: `${x}px`, top: `${y}px` }">
      {{ name }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['message', 'x', 'y', 'avatar', 'name', 'face', 'isFace'],
  data: () => ({
    width: 100,
  }),
  watch: {
    message(v) {
      this.$refs.message && this.$refs.message.classList.add('new')
      setTimeout(() => this.$refs.message.classList.remove('new'), 150)
    },
  },
}
</script>

<style lang="scss" scoped>
.user {
  /* position: absolute; */
  display: grid;
  /* justify-items: center; */
  &__message {
    position: absolute;
    display: inline-block;
    transform-origin: bottom center;
    transform: translateX(-50%) translateY(calc(-100%-58px));
    background-color: #dddddd;
    border-radius: 8px;
    padding: 4px 8px;
    max-width: 150px;
    &.new {
      animation: popup 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    /* &::before {
      transform: rotate(45deg);
      content: '123123';
      width: 10px;
      height: 10px;
      background-color: #dddddd;
    } */
  }
  &__avatar {
    position: absolute;
    cursor: none;
    border-radius: 100%;
  }
  &__name {
    position: absolute;
    transform: translateX(-50%) translateY(55px);
  }
}
@keyframes popup {
  from {
    transform: scale(0) translateX(-50%) translateY(calc(-100%-58px));
  }
  to {
    transform: scale(1) translateX(-50%) translateY(calc(-100%-58px));
  }
}
</style>
