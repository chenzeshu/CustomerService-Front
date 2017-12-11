<template>
    <div class="show-detail" ref="showDetailWrapper" v-show="DFlag">
      <slot></slot>
    </div>
</template>

<script>
    export default {
        data(){
            return {
              DFlag:false
            }
        },
        methods:{
          showManDetail(e){
            this.DFlag = true
            //获得焦点的坐标
            let rect = e.target.getBoundingClientRect()
            let x = rect.left + 64
            let y = rect.top + 32
            this.$refs.showDetailWrapper.style.position = "fixed"
            this.$refs.showDetailWrapper.style.top = `${y}px`
            this.$refs.showDetailWrapper.style.left = `${x}px`
          },
          closeDetail(){
              this.DFlag = false
          }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.show-detail
    display flex
    flex-direction column
    justify-content space-around
    align-items flex-start
    width 340px
    height 140px
    padding 4px 20px
    border 1px solid rgba(7,17,27,0.2)
    border-radius 5px
    box-shadow 2px 2px 2px rgb(7,17,27)
    background #fff
    font-size 14px
    z-index 100
</style>
