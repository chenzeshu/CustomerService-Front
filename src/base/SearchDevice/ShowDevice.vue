<template>
    <div class="show-device">
      <FormItem label="选择设备" prop="devices">
        <Select
          v-model="device_id"
          :placeholder="device_name"
          @on-change="_selectDevice"
          ref="sel"
          :disabled="disabledFlag">
          <Option :value="cv.id" v-for="cv in devices" :key="cv.id">{{ cv.device_id }} : {{ cv.ip }}</Option>
        </Select>
      </FormItem>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
      data(){
        return {
          devices:[],
          device_id: null,
          device_name: '请先选择单位',
          total:null,
          disabledFlag:true
        }
      },
      computed:{
        ...mapGetters([
            'company_id'
        ])
      },
      watch:{
        company_id(newId, oldId){
            this._search(newId)
        }
      },
      methods:{
        _search(id){
          if(id.length === 0){
            return
          }
            this.loading = true
            this._httpRequest(id)
        },
        _httpRequest(id){
          this.$http
            .get(`/employees/sd/${id}`)
            .then(res => {
              this.loading = false
              this.devices = res.data.data.data
              this.total = res.data.data.sTotal
              this.disabledFlag = false
              this.device_name = `检索到${this.total}个设备, 下拉选择`
              this.$Message.info({
                content:`检索到${this.total}个设备`,
                duration: 3
              })
            })
        },
        _selectDevice(device_id){
          this.$emit('selectDevice', device_id)
        },
        _reset(){
          this.devices = []
          this.device_name = '请先选择单位'
          this.disabledFlag = true
        }
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
