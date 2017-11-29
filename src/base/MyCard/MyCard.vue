<template>
    <div class="myCard" :class="{'my-blue':myColor === 'my-blue',
                                 'my-red':myColor === 'my-red',
                                 'my-purple':myColor === 'my-purple',
                                 'my-green':myColor === 'my-green'}">
        <div class="card-icon">
          <Icon :type="iconType"></Icon>
        </div>
        <div class="content">
            <div class="title">
              {{ title }}
            </div>
            <div class="num">
              {{ num }}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {

            }
        },
        props:{
           title:{
              type:String,
              default:""
           },
           color:{
              type:String,
              default:"blue"
           },
            num:{
              type:Number,
              default:0
            }
        },
        computed: {
            myColor(){
              return {'green': "my-green", 'red': "my-red", "purple": "my-purple"}[this.color] || "my-blue"
            },
            iconType(){
              return {'平台单位总数': "home", '中网员工总数': "happy", "客户联系人总数": "person-stalker",
                      '普通合同总数': "soup-can", '普通服务总数': "podium", "信道合同总数": "soup-can-outline", "信道服务总数":"podium" }[this.title] || "person"
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable.styl"
  .myCard
    display flex
    flex-direction row
    justify-content space-between
    align-items center
    padding 0 30px
    height 100px
    border none
    border-radius 5px
    color #fff
    &.my-blue
      background $color-blue
    &.my-green
      background $color-green
    &.my-red
      background $color-red
    &.my-purple
      background $color-purple
    .card-icon
      font-size 62px
    .content
      display flex
      flex-direction column
      justify-content space-around
      align-items bottom
      vertical-align top
      height 62px
      .title
        font-size 14px
      .num
        font-size 20px
        font-weight:700
</style>
