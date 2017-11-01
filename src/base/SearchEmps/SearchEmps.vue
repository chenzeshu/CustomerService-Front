<template>
  <div class="search-emps">
    <FormItem :label="label" :prop="curProp">
      <Select
        v-model="result"
        :label="defaultValue"
        multiple
        filterable
        remote
        :remote-method="_search"
        :loading="loading"
        @on-change="_selectEmp"
        ref="sel">
        <Option v-for="emp in emps" :value="emp.id" :key="emp.id" v-if="emps.length > 0">{{emp.name}}</Option>
      </Select>
    </FormItem>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Vue from 'vue'
  export default {
    data(){
      return {
        result:[],  //ids  names为defaultValue
        loading: false,
        sTotal: null,
        emps: [{id:0, name:"未选择"}],
      }
    },
    props:{
      type: {
        type: String,
        default:'PM'
      }
    },
    created(){
      debugger
    },
    computed:{
      label(){
        switch (this.type){
          case 'PM':
            return "项目经理"
          case 'TM':
            return "技术经理"
          case 'MAN':
            return "服务人员"
          case 'CUS':
            return "客户联系人"
          default:
            break
        }
      },
      curProp(){
        switch (this.type){
          case 'PM':
            return "PM"
          case 'TM':
            return "TM"
          case 'MAN':
            return "MAN"
          case 'CUS':
            return "CUS"
          default:
            break
        }
      },
      defaultValue(){
        if(this.updateIndex === null){  //用于关闭update打开create时, 避免出现残留痕迹
            return null
        }
        let arr = this.dataArr[this.updateIndex]
        if(typeof arr !== 'undefined'){
          let data = []
          switch (this.type){
            case 'PM':
              let pm = arr.PM
              if( typeof pm !== 'undefined' && pm.length){
//                for(let i = 0 ; i < (pm.length - 1); i++){
//                  data.push(pm[i].name)
//                }
                for (let i of pm){
                  data.push(i.name)
                }
                return data
              }
              break
            case 'TM':
              let tm = arr.TM
              if( typeof tm!== 'undefined' && tm.length){
//                for(let i = 0 ; i < (tm.length - 1); i++){
//                    data.push(tm[i].name)
//                }
                for (let i of tm){
                  data.push(i.name)
                }
                return data
              }

              break
            case 'MAN':
              let man = arr.man
              if( typeof man !== 'undefined' && man.length) {
//                for(let i = 0 ; i < (man.length - 1); i++){
//                  data.push(man[i].name)
//                }
                for (let i of man) {
                  data.push(i.name)
                }
              }
              return data
              break
            case 'CUS':
              let cus = arr.customer
              if( typeof cus !== 'undefined' && cus.length) {
//                for(let i = 0 ; i < (cus.length - 1); i++){
//                  data.push(cus[i].name)
//                }
                for (let i of cus) {
                  data.push(i.name)
                }
              }
              return data
              break
            default:
              break
          }
        }
      },
      ...mapGetters([
        'dataArr', 'updateIndex'
      ]),
    },
    watch:{
      defaultValue(newValue){  //names
        if(newValue === null){
            this.result = []
            return
        }
        let arr = this.dataArr[this.updateIndex]
        if(typeof arr !== 'undefined'){
          let data = []
          switch (this.type){
            case 'PM':
              if( typeof arr.pm !== 'undefined'){
                  for(let i of arr.pm){
                      data.push(i.id)
                  }
//                for(let i = 0 ; i < (pm.length - 1); i++){
//                  data.push(pm[i].id)
//                }
                this.result = data
              }
              break
            case 'TM':
              if( typeof arr.tm !== 'undefined'){
                  for(let i of arr.tm){
                      data.push(i.id)
                  }
//                for(let i = 0 ; i < (tm.length - 1); i++){
//                  data.push(tm[i].id)
//                }
                this.result = data
              }
              break
            case 'MAN':
              if( typeof arr.man !== 'undefined') {
                  for(let i of arr.man){
                      data.push(i.id)
                  }
//                for (let i = 0; i < (man.length - 1); i++) {
//                  data.push(man[i].id)
//                }
                this.result = data
              }
              break
            case 'CUS':
              if( typeof arr.customer !== 'undefined') {
                  for( let i of arr.cus){
                      data.push(i.id)
                  }
//                for (let i = 0; i < (cus.length - 1); i++) {
//                  data.push(cus[i].id)
//                }
                this.result = data
              }
              break
            default:
              break
          }
        }
      },
    },
    methods:{
      _selectEmp(v){
        this.$emit('selectEmp', this.result)
      },
      _search(query){
        if(query && query !== ''){
          this.loading = true
          setTimeout(()=>{
            this.$http
              .get(`/employees/se/${query}`)
              .then(res=>{
                this.loading = false
                res = res.data.data
                this.emps = res.data
              })
          }, 1000)
        }
        else {
          this.emps = [{id:0, name:"未选择"}]
        }
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
