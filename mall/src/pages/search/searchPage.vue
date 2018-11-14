<template>
  <div id="searchPage">
    <Search
     ref="mySearch"
     :placeholder="placeholder"
     v-model.trim="keyword"
     cancel-text=" "
     @on-submit="onSubmit"
     @on-result-click="onResultClick"
     auto-scroll-to-top>
      <a slot="right" href="javascript:" class="weui-search-bar__cancel-btn my-cancel" @click="onCancel">取消</a>
     </Search>
  </div>
</template>
<script type="text/ecmascript-6">
  import { Search } from 'vux'
  let interval
  export default {
    name: 'search',
    components: {
      Search
    },
    data () {
      return {
        keyword: '',
        // pl replace到 search 带上的keyword，用于'取消'replace到pl
        pl2searchKeyword: ''
      }
    },
    mounted: function () {
      this.setFocus()
      this.getParamsFromUrl()
    },
    methods: {
      getParamsFromUrl () {
        if (this.$route.params.keyword) {
          this.keyword = this.$route.params.keyword
          this.pl2searchKeyword = this.$route.params.keyword
        }
        console.log(this.keyword)
      },
      setFocus () {
        clearInterval(interval)
        interval = setInterval(() => {
          if (this.$refs.mySearch) {
            this.$refs.mySearch.setFocus()
            clearInterval(interval)
          }
        }, 0)
      },
      setBlur () {
        clearInterval(interval)
        interval = setInterval(() => {
          if (this.$refs.mySearch) {
            this.$refs.mySearch.setBlur()
            clearInterval(interval)
          }
        }, 0)
      },
      isEmpty (val) {
        return /^[' ']*$/.test(val)
      },
      onSubmit () {
        if (this.isEmpty(this.keyword)) {
          return
        }
        this.setBlur()
        let path
        if (this.keyword) {
          console.log('keyword', this.keyword.replace(/\s+/g, ''))
          path = `../pl/${this.keyword}`
        } else {
          path = 'pl'
        }
        this.$router.replace({path: path})
      },
      onCancel () {
        this.setBlur()
        this.pl2searchKeyword ? this.$router.replace({path: `/pl/${this.pl2searchKeyword}`}) : this.$router.go(-1)
      },
      onResultClick () {}
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
<style lang="scss" rel="stylesheet/scss" scoped>
.my-cancel {
  margin: 0px;
}
</style>

