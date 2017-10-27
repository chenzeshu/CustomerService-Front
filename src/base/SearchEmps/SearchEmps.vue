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
        <Option v-for="(emp, index) in emps" :value="emp.id" :key="index">{{emp.name}}</Option>
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
        emps: [],
      }
    },
    props:{
      type: {
        type: String,
        default:'PM'
      }
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

        if(this.dataArr[this.updateIndex] !== 'undefined'){
          let data = []
          switch (this.type){
            case 'PM':
              if(this.dataArr[this.updateIndex].PM !== 'undefined'){
                for (let i of this.dataArr[this.updateIndex].PM){
                  data.push(i.name)
                }
                return data
              }
              break
            case 'TM':
              if(this.dataArr[this.updateIndex].TM !== 'undefined'){
                for (let i of this.dataArr[this.updateIndex].TM){
                  data.push(i.name)
                }
                return data
              }

              break
            case 'MAN':
              for (let i of this.dataArr[this.updateIndex].man){
                data.push(i.name)
              }
              return data
              break
            case 'CUS':
              for (let i of this.dataArr[this.updateIndex].customer){
                data.push(i.name)
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
        if(this.dataArr[this.updateIndex] !== 'undefined'){
          let data = []
          switch (this.type){
            case 'PM':
              for (let i of this.dataArr[this.updateIndex].PM){
                data.push(i.id)
              }
              this.result = data
              break
            case 'TM':
              for (let i of this.dataArr[this.updateIndex].TM){
                data.push(i.id)
              }
              this.result = data
              break
            case 'MAN':
              for (let i of this.dataArr[this.updateIndex].man){
                data.push(i.id)
              }
              this.result = data
              break
            case 'CUS':
              for (let i of this.dataArr[this.updateIndex].customer){
                data.push(i.id)
              }
              this.result = data
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
          this.emps = []
        }
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
