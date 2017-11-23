import {mapGetters} from 'vuex'

export const selectMixin = {
  data(){
    return {
      model: [],
      names: [],
      options: [],
      loading: false,
      query:null
    }
  },
  computed:{
    ...mapGetters([
      'updateObj', 'updateIndex'
    ]),
  },
  watch:{
    updateIndex(nIndex){
      if(nIndex === null){
        this.model = []
        this.names = []
      }
    },
  },
  methods:{
    remoteMethod (query) {
      if (query !== '') {
        if(this.names.length>0 && (query[0] === this.names[0] || query[0] === "")){  //坑点:这个query在输入东西后是个对象
          return
        }
        this.query = query
        //搜索放在created的$watch - debounce里
      } else {
        this.options = [];
      }
    }
  }
}
