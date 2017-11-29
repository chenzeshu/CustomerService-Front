<template>
  <div class="newSearchEmps">
    <FormItem :label="label" :prop="curProp">
      <i-select
        v-model="model"
        :label="names"
        multiple
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
        selected:'',
        searchType:null,
      }
    },
    props:{
      type:{
          type:String,
          default:"PM"
      }
    },
    computed:{
      label(){
          //switch高阶写法
          let name = {"TM":"技术经理", "CUS":"客户联系人", "MAN":"服务人员", "VISITOR":"回访人员", "REFER":"申请人"}[this.type] || "项目经理"
          return name
      },
      curProp(){
          //switch高阶写法
          let prop = {"TM":"TM", "CUS":"customer", "MAN":"MAN", "VISITOR":"visitor", "REFER":"refer_man"}[this.type] || "PM"
          return prop
      }
    },
    watch:{
      updateObj(newObj){
        if(typeof newObj === 'undefined' || this.updateIndex === null){
            return
        }
        let names = [], ids = [], objs = []

        switch (this.type){
          case "TM":
            if(newObj.TM && newObj.TM.length > 0){
              objs = newObj.TM
            }
            break
          case "CUS":
            if(newObj.customer && newObj.customer.length > 0){
              objs = newObj.customer
            }
            break
          case "VISITOR":
            if(newObj.visitor && newObj.visitor.length > 0){
              objs = newObj.visitor
            }
            break
          case "MAN":
            if(newObj.man && newObj.man.length > 0){
              objs = newObj.man
            }
            break
          case "REFER":
            if(newObj.refer_man && newObj.refer_man.length > 0){
              objs = newObj.man
            }
            break
          default://PM
            if(newObj.PM && newObj.PM.length > 0){
              objs = newObj.PM
            }
            break
        }

        for(let i of objs){
          names.push(i.name)
          ids.push(i.id)
        }

        this.model = ids
        this.names = names
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
        this.select(v)
        this.$emit('on-select', this.selected)
      },
      select(v){
        let selected = ''
        for(let i of v){
          selected += i + ','
        }
        selected = selected.substring(0, selected.length - 1)
        this.selected = selected
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
