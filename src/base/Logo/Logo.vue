<template>
    <div class="base-logo">
      <span class="logo" v-show="!logined">{{logoName}}</span>

      <transition name="normal"
                  @enter="enter"
                  @after-enter="afterEnter"
                  @leave="leave"
                  @after-leave="afterLeave">
        <div v-show="logined">
          <span class="logo2" ref="logo">{{logoName}}</span>
        </div>
      </transition>
    </div>
</template>

<script>
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'
  import {mapGetters, mapMutations} from 'vuex'

  const transform = prefixStyle('transform');
  const transitionDuration = prefixStyle('transitionDuration');
    export default {
        computed:{
          ...mapGetters([
              'logined', 'logoName'
          ])
        },
        mounted(){

        },
        methods:{
          enter(el, done){
            let animation = {
              0: {
                transform : `translate3d(45vw, 20px, 0) scale(2)`,
                color:`red`,
              },
              // 0, 0, 0表示大cd的中心
              60: {
                transform : `translate3d(25, 25, 0) scale(1.5)`,
                color:`blue`,
              },
              100: {
                transform : `translate3d(0, 0, 0) scale(1)`,
                color:`yellow`,
              }
            }

            animations.registerAnimation({
              name: 'move',
              animation,
              presets:{
                duration: 1000, //动画的间隔
                easing: 'linear', //缓动
              }
            })

            animations.runAnimation(this.$refs.logo, 'move', done)
          },
          afterEnter(){
            animations.unregisterAnimation('move')
            this.$refs.logo.style.animation = ''
          },
          leave(el, done){
            this.$refs.logo.style.transition = 'all 0.4s'
            this.$refs.logo.style[transform] =`translate3d(0, 0, 0) scale(1)`
            this.$refs.logo.addEventListener('transitionend', done)
          },
          afterLeave(){
            this.$refs.logo.style.transition = ''
            this.$refs.logo.style[transform] = ''
          },
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .logo
    display block
    margin-top 6vh
    font-size 32px
    letter-spacing 8px
    color #ffffff
  .logo2
    display block
    position absolute
    top 10px
    left 25px
    font-size 18px
    color #9ba7b5
    letter-spacing 6px
  &.normal-enter-active, &.normal-leave-active
    transition: all 0.4s
    .top, .bottom
      transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
  &.normal-enter, &.normal-leave-to
    opacity: 0
</style>
