<template>
    <FormItem label="故障">
      <Select
        v-model="ids"
        :label="names"
        filterable
        remote
        :remote-method="searchProblem"
        :loading="loading"
        @on-change="selectProblem">
        <Option v-for="problem of problems" :key="problem.problem_id" :value="problem.problem_id">{{problem.problem_desc}}</Option>
      </Select>
    </FormItem>
</template>

<script>
  var MySet;
  const DELAY = 800;

  export default {
    data(){
      return {
        ids: [],
        names: [],
        problems: [],
        loading: false,
      }
    },
    methods: {
      searchProblem(query){
        if(query instanceof Array || !query) return

        if(MySet){
          clearTimeout(MySet)
        }

        MySet = setTimeout(()=>{
          this.loading = true

          this.$http.get(`/problem/s/${query}`).then(res=>{
            res = res.data
            this.problems = res.data
            console.log(this.problems)
            res.data.length > 0
              ? this.$Message.success(res.msg)
              : this.$Message.warning('暂无数据')

            this.loading = false
          })
        }, DELAY)
      },
      selectProblem(v){
         this.$emit('on-select', v)
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
