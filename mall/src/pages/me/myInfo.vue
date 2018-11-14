<template>
  <div id="myInfo">
    <x-header :left-options="{ backText: '' }" title="个人信息"></x-header>
    <group>
      <cell-box @click.native="uploadImg" is-link>
        <div class="head-cell-box">
          <div class="head-portrait"><img :src="headPortrait" alt=""></div>
          <div class="value-label">上传头像</div>
        </div>
      </cell-box>
      <cell title="昵称" :value="nickname" @click.native="goNickname" is-link></cell>
      <cell title="性别" :value="showSex" @click.native="sexFlag = true" is-link></cell>
    </group>
    <form :action="actionUrl" method="post" ref="imgform" target="frame1" enctype="multipart/form-data">
      <!-- <input type="file" accept="image/*" capture="camera" ref="camera" style="display: none;"> -->
      <!-- <input type="file" name="file" apture="microphone" accept="image/*" ref="photograph" style="display: none;" @change="selectedImg"> -->
    </form>
    <!-- <iframe v-show="false" ref="frame1" name="frame1" @load="getImgUrl"></iframe> -->
    <div v-transfer-dom class="myInfo-div">
      <popup v-model="show" position="top">
        <div class="select-img">
          <croppa v-model="myCroppa"
            placeholder="请选择图片上传为头像！"
            accept="image/*"
            :prevent-white-space="true"
            :show-remove-button="false"
            :width="220"
            :height="220"
            class="croppa-cls"
          >
          </croppa>
          <div>
            <x-button class="custom-btn" mini @click.native="save">保存</x-button>
            <x-button class="custom-btn" mini @click.native="myCroppa.remove()">重选</x-button>
            <x-button class="custom-btn" mini @click.native="show = false">取消</x-button>
          </div>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="sexFlag" style="overflow-y: visible;" id="sex-popup">
        <div class="sex-popup">
          <group gutter="0px">
            <cell title="男" @click.native="sex = 0">
              <div>
                <x-icon v-show="sex === 0 || sex === '0'" type="ios-checkmark-empty" size="35px" style="fill: #352665;position:absolute;right:0px;top:50%;transform: translate(-10px, -50%);;"></x-icon>
              </div>
            </cell>
            <cell title="女"  @click.native="sex = 1">
              <div>
                <x-icon v-show="sex === 1 || sex === '1'" type="ios-checkmark-empty" size="35px" style="fill: #352665;position:absolute;right:0px;top:50%;transform: translate(-10px, -50%);;"></x-icon>
              </div>
            </cell>
          </group>
        </div>
      </popup>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as tool from '@/services/myTool.es6'
  import * as myAPI from '@/services/API/mineServices.es6'
  import { XHeader, XButton, Group, Cell, CellBox, TransferDom, Popup, debounce } from 'vux'

  let updateSexFunc
  export default {
    name: 'myInfo',
    directives: { TransferDom },
    components: { XHeader, XButton, Group, Cell, CellBox, Popup, debounce },
    data () {
      return {
        nickname: '',
        sex: '', // 0男 1女 2无
        sexFlag: false,
        mobile: '',
        headPortrait: '',
        show: false,
        // 头像上传组件
        myCroppa: {}
      }
    },
    mounted: function () {
      if (sessionStorage.getItem('userInfo')) {
        this.nickname = JSON.parse(sessionStorage.getItem('userInfo')).nickName || '未命名'
        this.sex = JSON.parse(sessionStorage.getItem('userInfo')).sex
        this.mobile = JSON.parse(sessionStorage.getItem('userInfo')).mobile
        this.headPortrait = JSON.parse(sessionStorage.getItem('userInfo')).headPortrait.replace('!56', '!352') || ''
      }
    },
    methods: {
      goNickname () {
        this.$router.push({path: '/myNickname'})
      },
      updateSex: debounce(function () {
        this.$http.put(...myAPI.updateSex({sex: this.sex, phone: this.mobile}).concat({
          cancelToken: new this.$http.CancelToken(function (cancel) {
            if (typeof updateSexFunc === 'function') {
              updateSexFunc()
            }
            updateSexFunc = cancel
          })
        })).then(res => {
          let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
          if (res.data.code === 200) {
            this.$vux.toast.show({type: 'text', text: `修改成功`, width: '200px'})
            userInfo.sex = this.sex
            sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
            this.sexFlag = false
          } else {
            this.sex = userInfo.sex
          }
        })
      }, 500),
      // --------------------上传头像--------------------
      uploadImg () {
        if (tool.isOnline()) {
          this.show = true
          // this.$refs.photograph.click()
        } else {
          this.$vux.toast.show({type: 'text', text: `无网络状态`, width: '200px'})
        }
        // this.$refs.camera.click()
      },
      // selectedImg () {
      //   if (this.$refs.photograph.value !== '') {
      //     this.$vux.loading.show()
      //     this.$refs.imgform.submit()
      //   }
      // },
      // getImgUrl () {
      //   // console.log(arguments)
      //   let json = this.$refs.frame1.contentDocument.getElementsByTagName('body')[0].innerText
      //   json = json.replace(/<[^>]*>/g, '')
      //   // let json = this.$refs.frame1.contentDocument.getElementsByTagName('pre')[0] ? this.$refs.frame1.contentDocument.getElementsByTagName('pre')[0].innerText : ''
      //   if (json === '') {
      //     this.$vux.loading.hide()
      //     return
      //   }
      //   let data
      //   try {
      //     data = JSON.parse(json)
      //   } catch (e) {
      //     this.$vux.loading.hide()
      //     this.$vux.toast.show({type: 'text', text: `上传失败`, width: '200px'})
      //     return
      //   }
      //   if (data.code === 200) {
      //     let headPortrait = data.data.pic_56
      //     this.$http.put(...myAPI.updateHeadPortrait(headPortrait)).then(res => {
      //       if (res.data.code === 200) {
      //         this.$vux.toast.show({type: 'text', text: `修改成功`, width: '200px'})
      //         this.headPortrait = data.data.pic_56
      //         let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      //         userInfo.headPortrait = data.data.pic_56
      //         sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
      //         this.myCroppa.remove()
      //         this.show = false
      //       } else {
      //         this.$vux.toast.show({type: 'text', text: `修改失败`, width: '200px'})
      //         this.myCroppa.remove()
      //       }
      //       this.$vux.loading.hide()
      //     })
      //   } else {
      //     this.$vux.toast.show({type: 'text', text: `上传失败`, width: '200px'})
      //     this.$vux.loading.hide()
      //   }
      // },
      save () {
        if (this.myCroppa.hasImage()) {
          this.myCroppa.generateBlob((blob) => {
            let fd = new FormData()
            let config = {
              header: {'Content-Type': 'multipart/form-data'}
            }
            fd.append('file', blob, 'head.jpeg')
            this.$http.post('/resource/uploadImage', fd, config).then(res => {
              console.log(res)
              if (res.data.code === 200) {
                this.$http.put(...myAPI.updateHeadPortrait(res.data.data.pic_56)).then(response => {
                  console.log(response)
                  if (response.data.code === 200) {
                    this.$vux.toast.show({type: 'text', text: `修改成功`, width: '200px'})
                    this.headPortrait = res.data.data.pic_56
                    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
                    userInfo.headPortrait = res.data.data.pic_56
                    sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
                    this.myCroppa.remove()
                    this.show = false
                  } else {
                    this.$vux.toast.show({type: 'text', text: `修改失败`, width: '200px'})
                    this.myCroppa.remove()
                  }
                  this.$vux.loading.hide()
                })
              }
            })
          })
        }
      }
    },
    computed: {
      showSex () {
        if (this.sex === '0' || this.sex === 0) {
          return '男'
        } else if (this.sex === '1' || this.sex === 1) {
          return '女'
        } else if (this.sex === '2' || this.sex === 2) {
          return ''
        }
      },
      actionUrl () {
        return `${this.$http.defaults.baseURL}resource/uploadImage`
      }
    },
    watch: {
      sex (newV, oldV) {
        if (newV !== oldV && oldV !== '' && this.mobile !== '') {
          this.updateSex()
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .head-cell-box {
    width: 100%;
    overflow: hidden;
    .head-portrait {
      width: 50px;
      height: 50px;
      background-color: #eee;
      border-radius: 50%;
      overflow: hidden;
      float: left;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .value-label {
      float: right;
      line-height: 50px;
      color: #999999;
      margin: 0px 15px 0px 0px;
    }
  }
  .select-img {
    background-color: #fff;
    color: #000;
    text-align: center;
    padding: 15px;
    margin: 0 15px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    button {
      &.custom-btn {
        background: #352665;
        color: #fff;
        margin: .7em .7em;
        width: 25%;
        padding: 0 1em;
      }
      display: inline-block;
      width: 30%;
    }
  }
  .myInfo-div .vux-popup-dialog {
    background: transparent;
    top: 100px;
  }
  .croppa-cls {
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }
</style>

