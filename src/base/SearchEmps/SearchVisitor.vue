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
        :label-in-value="allback"
        @on-change="wannaUpdate($event)">
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
        cid:null,
        cname:null,
        curProp:"",
        selected:'',
        searchType:null,
        allback:true,
      }
    },
    props:{
      type:{
        type:String,
        default:"visitor"
      }
    },
    computed:{
      label(){
        switch (this.type){
          default:
            this.curProp = 'visitor'
            return "回访人"
            break
        }
      },
      ...mapGetters([
          'visitObj'
      ])
    },
    watch:{
      visitObj(newModel){
          if(typeof newModel.employees !== 'undefined' && newModel.employees.length > 0){
              let data = newModel.employees.slice()
              this.cname = data[0].name
              this.cid =  data[0].id
          }else{
              this.cname = null
              this.cid = null
          }
      },
    },
    created(){
      this.$watch('query', debounce(()=>{
        //switch高阶写法
        if(typeof this.query === "object" || !!this.query === false) return;
        this.loading = true;
        this.$http
          .get(`/employees/se/inner/${this.query}`)
          .then(res=>{
            this.loading = false;
            res = res.data.data
            this.options = res.data
          })
      }, 1000))
    },
    methods: {
      wannaUpdate(v){
        if(!!v.label){
          this.cname = v.label
          this.cid = v.value
        }
        this.$emit('on-select', v.value)
      },
      clickOption(){
          console.log(1)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
