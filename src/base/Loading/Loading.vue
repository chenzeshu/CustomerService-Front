<template>
    <div :class="{'loading':loading}" v-show="loading">
      <span class="loading-text">加载中{{loadingText}}</span>
    </div>
</template>

<script>
    export default {
        props:{
            loading:{
                type:Boolean,
                default:true  //true:有遮罩, false:无遮罩
            }
        },
        data(){
            return {
                loadingText:"......"
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .loading
    position absolute
    top 0
    left 0
    width: 80vw;
    height: 100vh;
    display block
    z-index 100
    background rgba(0,0,0,.1)
    .loading-text
      display block
      margin 25% auto
      font-size 24px
      font-weight 700
      line-height 40px
</style>
