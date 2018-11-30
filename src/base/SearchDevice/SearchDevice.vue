<template>
    <Select
      v-model="device_id"
      :label="label"
      filterable
      remote
      :remote-method="searchDevice"
      :loading="loading"
      :loading-text="loadingText"
      :not-found-text="notFoundText"
      @on-change="selectDevice"
    >
      <Option v-for="(device, key) in devices" :key="key" :value="device.id">{{device.device_id}} - [ip:{{device.ip}}]</Option>
    </Select>
</template>

<script>
  const DELAY_TIME = 2000
  var mySet = null

  export default {
      props:{
        deviceProp: {
          type: Object
        }
      },
    mounted(){
        if(this.deviceProp){
          this.device_id = this.deviceProp.id
          this.label = `${this.deviceProp.device_id} - [ip:${this.deviceProp.ip}]`
        }
    },
      data(){
        return {
          device_id: null,
          label: null,
          loading: false,
          devices: [],
          total:0,
          loadingText:"",
          notFoundText: "请输入数据"
        }
      },
      methods:{
        /**
         * debounce型搜索
         * @param searchWord
         */
          searchDevice(searchWord){
            if(!searchWord) return

            this.notFoundTextChange("准备检索")

            if(mySet){
              clearTimeout(mySet)
            }

            mySet = setTimeout(()=>{
               this.searchDeviceMethod(searchWord)
            }, DELAY_TIME)
          },
          searchDeviceMethod(searchWord){
            this.loading = true
            this.loadingTextChange("正在检索中...")
            let url = `devices/s/${searchWord}/1/10`
            this.$http
              .get(url)
              .then(res=>{
                res = res.data.data
                this.devices = res.data
                this.total = res.total
                this.loading = false

                res.total === 0 ? this.notFoundTextChange("无匹配数据") : this.notFoundTextChange("请输入数据")
            })
          },
        selectDevice(device_id){
            this.$emit('select-device', device_id)
        },
        loadingTextChange(text){
            this.loadingText = text
        },
        notFoundTextChange(text){
            this.notFoundText = text
        }
      }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
