<template>
    <div class="search-company">
      <FormItem label="选择公司" prop="company_id">
        <Select
          v-model="c_id"
          :label="company_name"
          filterable
          remote
          :remote-method="_search"
          :loading="loading"
          @on-change="_selectCompany"
          ref="sel">
          <Option :value="cv.id" v-for="(cv, ck) in companies" :key="ck">{{cv.name}}</Option>
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
            companies:[],
          }
        },
        computed:{
          ...mapGetters([
              'dataArr', 'updateIndex'
          ]),
          company_name(){
              //不能写成if(this.updateIndex) 因为当index为0 时也会被剔除
            //尽量少使用prop, 多使用vuex?
              if(this.updateIndex !== null && this.dataArr[this.updateIndex].company){
                return this.dataArr[this.updateIndex].company.name
              }
              //create 情况 一打开就赋值this.updateIndex = null
          }
        },
        watch:{
            company_name(){
              if(this.updateIndex !== null && this.dataArr[this.updateIndex].company) {
                this.c_id = this.dataArr[this.updateIndex].company.id
              }
            }
        },
        methods:{
            _selectCompany(company_id){
                this.$emit('selectCompany', company_id)
            },
            _search(query){
              if(query && query !== ''){
                this.loading = true
                setTimeout(()=>{
                  this.$http
                    .get(`/employees/sc/${query}`)
                    .then(res=>{
                      this.loading = false
                      res = res.data.data
                      this.companies = res.data
                    })
                }, 1000)
              }
              else {
                this.emps = []
              }
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .search-company
    .no-result
      color #ff9900!important
    .waiting
      color #ed3f14!important
</style>
