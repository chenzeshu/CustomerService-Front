<template>
    <div class="chat">
      <div class="chat-wrapper">
        <span>聊天人员列表</span>
        <span>聊天窗口BFC</span>
      </div>
    </div>
</template>

<script>
    export default {}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .chat
    position fixed
    width 50%
    height 40%
    top 100px
    left 30%
    z-index 150
    .chat-wrapper
      display block
      height 50%
      width 40%
      background #fff
      border 1px solid #000000
</style>
