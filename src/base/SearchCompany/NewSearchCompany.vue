<template>
  <div class="newSearchCompany">
    <FormItem label="选择单位" prop="company_id">
      <i-select
        v-model="model"
        :label="names"
        filterable
        remote
        :remote-method="remoteMethod"
        :loading="loading"
        @on-change="wannaUpdate">
        <i-option v-for="(option, index) in options" :value="option.id" :key="option.id">{{option.name}}</i-option>
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
    watch:{
      updateObj(newObj){
        if(typeof newObj === 'undefined' || this.updateIndex === null){
          return
        }
        if(!!newObj.company){
          this.model = newObj.company.id
          this.names = newObj.company.name
        }
      }
    },
    created(){
        this.$watch('query', debounce(()=>{
          if(typeof this.query === "object" || !!this.query === false || (typeof this.updateObj.company !== 'undefined' && this.query === this.updateObj.company.name && !!this.updateIndex)) return;
          this.loading = true;
          this.$http
            .get(`/employees/sc/${this.query}`)
            .then(res=>{
              this.loading = false;
              this.options = res.data.data.data
            })
        }, 1000))
    },
    methods: {
      wannaUpdate(v){
        if(!v) return;
        this.$emit('on-select', v)
      },
      _reset(){
          this.model = [],
          this.names = []
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
