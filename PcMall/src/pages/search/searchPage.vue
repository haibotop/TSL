<template>
    <div class="input">
        <Input 
        ref="mySearch"
        search placeholder="搜索" size="large" style="width:250px" icon="ios-search"           
        v-model.trim="keyword"
        @on-enter="onSubmit"
        @on-click="onSubmit"  
        />           
        <!-- <a slot="right" href="javascript:" class="weui-search-bar__cancel-btn my-cancel" @click="onCancel">取消</a> -->
    </div>
</template>

<script type="text/ecmascript-6">
 
  let interval
  export default {
    name: 'search',
    components: {
    //   Search
    },
    data () {
      return {
        keyword: '',
        // pl replace到 search 带上的keyword，用于'取消'replace到pl
        // pl2searchKeyword: ''
      }
    },
    mounted: function () {
    //   this.setFocus()
      // this.getParamsFromUrl()
    },
    methods: {
      // getParamsFromUrl () {
      //   if (this.$route.params.keyword) {
      //     this.keyword = this.$route.params.keyword
      //     // this.pl2searchKeyword = this.$route.params.keyword
      //   }
      //   console.log(this.keyword)
      // },
    //   setFocus () {
    //     clearInterval(interval)
    //     interval = setInterval(() => {
    //       if (this.$refs.mySearch) {
    //         // this.$refs.mySearch.setFocus()
    //         console.log(this.$refs)
    //         clearInterval(interval)
    //       }
    //     }, 0)
    //   },
    //   setBlur () {
    //     clearInterval(interval)
    //     interval = setInterval(() => {
    //       if (this.$refs.mySearch) {
    //         this.$refs.mySearch.setBlur()
    //         clearInterval(interval)
    //       }
    //     }, 0)
    //   },
      // 是否输入为空
      isEmpty (val) {
        return /^[' ']*$/.test(val)
      },
      onSubmit () {
        if (this.isEmpty(this.keyword)) {
          return
        }
        // this.setBlur()
        let path
        if (this.keyword) {
          console.log('keyword', this.keyword.replace(/\s+/g, ''))
          this.keyword = this.keyword.replace(/\/+/g, '')
          path = `../pl/${this.keyword}`
        } else {
          path = 'pl'
        }
        this.bus.$emit('changData',this.keyword)
        this.$router.replace({path: path,query: {type: "搜索结果",typeName:this.keyword}})
        
      },
      // onCancel () {
      //   // this.setBlur()
      //   this.pl2searchKeyword ? this.$router.replace({path: `/pl/${this.pl2searchKeyword}`}) : this.$router.go(-1)
      // },
      
    },
    computed: {
      placeholder () {
        if (localStorage.getItem('defaultKeyword')) {
          return localStorage.getItem('defaultKeyword')
        } else {
          return ''
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      setTimeout(() => {
        next()
      }, 500)
    }
  }
</script>


<style lang="stylus" scoped>
   
</style>