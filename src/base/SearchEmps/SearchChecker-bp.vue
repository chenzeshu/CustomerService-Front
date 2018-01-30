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
        @on-change="wannaUpdate"
        >
        <i-option v-for="(option, index) in options" :value="option.id" :key="index">{{option.name}}</i-option>
      </i-select>
    </FormItem>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
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
        finalName:null,
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
          if(this.finalName){
            return this.finalName
          }
          if(this.updateIndex === null && this.options.length === 0){  //用于关闭update打开create时, 避免出现残留痕迹
            return null
          }
          else if(typeof this.stepObj.checker !== 'undefined' && this.stepObj.checker !== null){
            return this.stepObj.checker.name
          }
      },
      ...mapGetters([
          'stepObj', 'updateIndex'
      ])
    },
    watch:{
      cname(newname){
        if(typeof this.stepObj.checker === 'undefined'){
            return
        }
        this.cid =  this.stepObj.checker.id
      },
      updateIndex(newIndex){
          this.options = []
      }
    },
    created(){
      this.$watch('query', debounce(()=>{
        //switch高阶写法
        this.searchType = { 'CUS' : "out"}[this.type] || "inner"
        if(typeof this.query === "object" || !!this.query === false) return;
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
          this.options.forEach((item, index)=>{
              if(item.id === v){
                  this.finalName = item.name
              }
          })
        this.$emit('on-select', v)
      },
      rebuild(){
          this.finalName = null
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
