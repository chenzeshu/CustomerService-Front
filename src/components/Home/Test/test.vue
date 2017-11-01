<template>
    <div class="test">
        <DatePicker type="date" placeholder="选择日期" style="width: 200px" v-model="time1" @on-change="setUTime1"></DatePicker>
    </div>
</template>

<script>
    export default {
      data () {
        return {
          time1: null,
          }
      },
      created(){

      },
      methods: {
          setUTime1(date){
              console.log(date)
          }
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
