<template>
    <div class="search-company">
      <FormItem label="选择单位" prop="company_id">
        <Select
          v-model="c_id"
          :label="company_name"
          filterable
          remote
          :remote-method="_search"
          :loading="loading"
          @on-change="_selectCompany"
          ref="sel">
          <Option :value="cv.id" v-for="cv in companies" :key="cv.id">{{cv.name}}</Option>
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
              if(typeof this.dataArr[this.updateIndex] !== 'undefined'){
                if(this.updateIndex !== null && this.dataArr[this.updateIndex].company){
                  return this.dataArr[this.updateIndex].company.name
                }
                //create 情况 一打开就赋值this.updateIndex = null
                if(this.updateIndex === null){
                  return null
                }
              }

          }
        },
        watch:{
            company_name(){
                if(typeof this.dataArr[this.updateIndex] !== 'undefined'){
                  if(this.updateIndex !== null && this.dataArr[this.updateIndex].company) {
                    this.c_id = this.dataArr[this.updateIndex].company.id
                  }
                  if(this.updateIndex === null){
                    this.c_id = null
                  }
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
                this.companies = []
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
