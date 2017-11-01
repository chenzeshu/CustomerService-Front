<template>
    <div class="search-contract">
      <FormItem label="选择合同" prop="contract_id">
        <Select
          v-model="c_id"
          :label="contract_name"
          filterable
          remote
          :remote-method="_search"
          :loading="loading"
          @on-change="_selectContract"
          ref="sel">
          <Option :value="cv.id" v-for="(cv, ck) in contracts" :key="ck">{{cv.contract_id}}</Option>
        </Select>
      </FormItem>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        data(){
          return {
            c_id:null,
            loading:false,
            sTotal:null,
            contracts:[],
          }
        },
        computed:{
          ...mapGetters([
              'dataArr', 'updateIndex'
          ]),
          contract_name(){
              //不能写成if(this.updateIndex) 因为当index为0 时也会被剔除
            //尽量少使用prop, 多使用vuex?
            let con = this.dataArr[this.updateIndex]
            if(typeof con !== 'undefined'){

              if(this.updateIndex !== null && typeof con.contract !== 'undefined'){
                return con.contract.contract_id
              }
              //create 情况 一打开就赋值this.updateIndex = null
              if(this.updateIndex === null){
                return null
              }
            }

          }
        },
        watch:{
            contract_name(){
              let con = this.dataArr[this.updateIndex]
              if(typeof con !== 'undefined'){
                if(this.updateIndex !== null && typeof con.contract !== 'undefined') {
                  this.c_id = con.contract.id
                }
                if(this.updateIndex === null){
                  this.c_id = null
                }
              }
            }
        },
        methods:{
           _selectContract(contract_id){
                this.$emit('selectcontract', contract_id)
            },
            _search(query){
              if(query && query !== ''){
                this.loading = true
                setTimeout(()=>{
                  this.$http
                    .get(`/employees/scon/${query}`)
                    .then(res=>{
                      this.loading = false
                      res = res.data.data
                      this.contracts = res.data
                    })
                }, 1000)
              }
              else {
                this.contracts = []
              }
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .search-contract
    .no-result
      color #ff9900!important
    .waiting
      color #ed3f14!important
</style>
