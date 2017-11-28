<template>
  <div class="newSearchEmps">
    <FormItem :label="label" :prop="curProp">
      <i-select
        v-model="cid"
        :label="cname"
        filterable
        remote
        :remote-method="remoteMethod"
        :loading="loading"
        @on-change="wannaUpdate">
        <i-option v-for="(option, index) in options" :value="option.id" :key="index">{{option.name}}</i-option>
      </i-select>
    </FormItem>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {debounce} from 'common/js/utils'
  import {selectMixin} from 'common/js/baseMixin'

  export default {
    mixins:[selectMixin],
    data () {
      return {
        cid:null,
        curProp:"",
        selected:'',
        searchType:null,
      }
    },
    props:{
      type:{
        type:String,
        default:"CHECKER"
      }
    },
    computed:{
      label(){
        switch (this.type){
          default:
            this.curProp = 'checker'
            return "责任人"
            break
        }
      },
      cname(){
          if(typeof this.stepObj.checker !== 'undefined'){
            return this.stepObj.checker.name
          }

      },
      ...mapGetters([
          'stepObj'
      ])
    },
    watch:{
      cname(newname){
        if(typeof this.stepObj.checker === 'undefined'){
          return
        }
        this.cid =  this.stepObj.checker.id
      }
    },
    created(){
      this.$watch('query', debounce(()=>{
        //switch高阶写法
        this.searchType = { 'CUS' : "out"}[this.type] || "inner"

        this.loading = true;
        this.$http
          .get(`/employees/se/${this.searchType}/${this.query}`)
          .then(res=>{
            this.loading = false;
            res = res.data.data
            this.options = res.data
          })
      }, 1000))
    },
    methods: {
      wannaUpdate(v){
        this.$emit('on-select', v)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
