<template>
    <div class="front-page">
      <Alert type="warning">提示: 尊敬的 {{ username }} ， 欢迎您的使用， 您上次的登陆时间为xxx， 登陆IP为xxx</Alert>
      <Row :gutter="16">
        <i-col span="24">
          <MyCard title="平台单位总数"></MyCard>
        </i-col>
      </Row>
      <Split type="xi" style="margin:10px 0"></Split>
      <Row :gutter="16">
        <i-col span="6">
          <MyCard title="普通合同总数"></MyCard>
        </i-col>
        <i-col span="6">
          <MyCard color="green" title="普通服务总数"></MyCard>
        </i-col>
        <i-col span="6">
          <MyCard color="red" title="信道合同总数"></MyCard>
        </i-col>
        <i-col span="6">
          <MyCard color="purple" title="信道服务总数"></MyCard>
        </i-col>
      </Row>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import MyCard from 'base/MyCard/MyCard'
    import Split from 'base/Split/Split'
    export default {
        computed:{
          ...mapGetters([
              'username'
          ])
        },
        created(){

        },
        methods:{
          _getData(){
              this.$http.get("").then(res=>{

              })
          }
        },
        components:{
              MyCard, Split
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"

</style>
