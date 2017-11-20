<template>
  <div :class="{'split-cu':type === 'cu', 'split-xi':type === 'xi', 'split-zhong':type === 'zhong'}">

  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus">
  .split-cu
    height 16px
    width 100%
    background #f3f5f7
    border-top 1px solid rgba(7,17,27,0.1)
    border-bottom 1px solid rgba(7,17,27,0.1)
  .split-zhong
    height 2px
    width 100%
    background #f3f5f7
    border-top 1px solid rgba(7,17,27,0.2)
  .split-xi
    height 1px
    width 100%
    background #f3f5f7
    border-top 1px solid rgba(7,17,27,0.1)
</style>

<script>
  export default {
    data() {
      return {}
    },
    props:{
      type:{
          type:String,
          defaut:'cu'
      }
    },
    components: {}
  }
</script>
