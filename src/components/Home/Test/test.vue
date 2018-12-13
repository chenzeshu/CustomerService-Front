<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    width: 50%;
  }
  .layout-header-bar{
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
  }
</style>

<template>
    <button @click="tryit">试试</button>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import {selectMixin} from 'common/js/baseMixin'

  export default {
      computed:{
        value(){
            return this.$store.state.username
        },
        ...mapGetters([
            'visitModel','username'
        ])
      },
      watch:{
          username(newV){
                console.log(newV)
          }
      },
      methods:{
          tryit(){
            this.$http.get('/test').then(res=>{
                console.log(res)
            })
          },
        ...mapMutations({
          'setVisitModel' : "SET_VISIT_MODEL",
          'setUsername' : "SET_USERNAME"
        })
      }
  }
</script>
