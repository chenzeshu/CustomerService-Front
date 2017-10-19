<template>
    <div class="search-company">
      <FormItem label="选择公司" prop="company_id">
        <Select
          v-model.trim="companyWord"
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
            companyWord:null,
            loading:false,
            sTotal:null,
            companies:[]
          }
        },
        computed:{
          ...mapGetters([
              'dataArr'
          ])
        },
        props:{
            index: {
              type: Number,
              default: null
            }
        },
        watch:{
            index(){
                this.$refs.sel.setQuery(this.dataArr[this.index].company.name)
            }
        },
        methods:{
            _selectCompany(company_id){
                this.$emit('selectCompany', company_id)
            },
            _search(query){
                if(query !== '' && query !== this.companyWord){
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
