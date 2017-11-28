<template>
  <div class="newSearchContract">
    <FormItem label="选择合同" :prop="curProp">
      <i-select
        v-model="model"
        :label="names"
        filterable
        remote
        :remote-method="remoteMethod"
        :loading="loading"
        @on-change="wannaUpdate">
        <i-option v-for="(option, index) in options" :value="option.id" :key="index">{{option.contract_id}}</i-option>
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
    props:{
      type:{
          type:String,
          default:"normal"
      }
    },
    computed:{
      curProp(){
          return this.type === "normal" ? "contract_id" : "contractc_id"
      }
    },
    watch:{
      updateObj(newObj){
        if(typeof newObj === 'undefined' || this.updateIndex === null){
          return
        }
        //精准布尔
        this.model = (!!newObj.contractc) ? newObj.contractc.id : newObj.contract.id
        this.names = (!!newObj.contractc) ? newObj.contractc.contract_id : newObj.contract.contract_id
      }
    },
    created(){
      this.$watch('query', debounce(()=>{
        this.loading = true;

        if(this.type === "channel"){
          this.$http
            .get(`/employees/sconc/${this.query}`)
            .then(res=>{
              this.loading = false;
              this.options = res.data.data.data
            })
        }else {
          this.$http
            .get(`/employees/scon/${this.query}`)
            .then(res=>{
              this.loading = false;
              this.options = res.data.data.data
            })
        }
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
