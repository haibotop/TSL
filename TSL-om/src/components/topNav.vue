<style rel="stylesheet/scss" lang="scss" scoped>
  #topNav {
    min-width: 1000px;
  }
  .logo {
    width: 200px;
    height: 40px;
    margin: 10px;
    float: left;
    img {
      display: block;
      width: calc(100% - 20px);
      margin: 5px 10px;
    }
  }
  .user {
    position: absolute;
    top: 0px;
    right: 20px;
    color: #fff;
  }
  .user i {
    margin: 0px 10px;
  }
  .user a {
    color: #FFF;
  }
  // ---------
  .my-dropdown-menu {
    width: 350px;
    position: relative;
    .title {
      font-size: 16px;
      font-weight: 400;
    }
  }
  .my-dropdown-close {
    position: absolute;
    right: 10px;
    top: 10px;
  }
  .my-dropdown-list {
    height: 400px;
    overflow-y: scroll;
    background-color: #f3f3f3;
  }
  .my-card {
    position: relative;
    width: 300px;
    margin: 10px;
    color: #000;
    .title-slot {
      overflow: hidden;
      .title { float: left;font-size: 16px;font-weight: 400;line-height: 30px; }
      .time { float: right;font-size: 12px;line-height: 30px; }
    }
    .content-slot {
      overflow: hidden;
      height: 40px;
      margin: 0px 0px 10px 0px;
      .warning { opacity: 0.4; }
      p {
        float: right;
        font-size: 12px;
        font-weight: 400;
        width: 200px;
        line-height: 20px;
        word-break: break-all;
        white-space: initial;
      }
    }
    .footer-slot {
      text-align: right;
      line-height: 30px;
      .readed {
        margin: 0px 10px 0px 0px;
      }
    }
  }
</style>
<style>
.my-badge {
  box-shadow: none !important;
  right: 5px !important;
}
</style>
<template>
  <div id="topNav">
    <Menu mode="horizontal" :theme="theme" :active-name="select">
      <div class="logo">
        <img src="../assets/images/tsl_logo2.png" alt="">
      </div>
      <div class="nav">
        <!-- <MenuItem name="productManage">商品管理</MenuItem>
        <MenuItem name="dealManage">交易管理</MenuItem>
        <MenuItem name="sysManage">系统管理</MenuItem> -->
      </div>
      <div class="user">
        <Dropdown trigger="custom" :visible="visible" placement="bottom" style="position:absolute;right:195px;">
          <Badge :count="notReadNum" class-name="my-badge">
            <Icon type="ios-bell-outline" :size="30" style="cursor:pointer" @click.native="visible = !visible"></Icon>
          </Badge>
          <DropdownMenu slot="list" class="my-dropdown-menu">
            <DropdownItem style="border-bottom:1px solid #eee"><span class="title">我的信息</span><Icon type="close-round" class="my-dropdown-close" @click.native="visible = false"></Icon></DropdownItem>
            <div class="my-dropdown-list">
              <Card class="my-card" v-for="item in list" :key="item.id">
                <div class="title-slot"><span class="title">{{typeArray[item.type]}}</span><span class="time">{{item.createDate}}</span></div>
                <div class="content-slot">
                  <Icon type="alert-circled" size="40" class="warning"></Icon>
                  <p>{{item.content}}</p>
                </div>
                <div class="footer-slot">
                  <Button size="small" type="primary" class="readed" @click="dropdownRead(item.id)">标为已读</Button><Button size="small" type="primary" @click="dropdownRemove(item.id)">删除</Button>
                </div>
              </Card>
            </div>
            <DropdownItem style="text-align:right;border-top:1px solid #eee">
              <Button size="small" type="primary" @click="readAll">全部标记为已读</Button>
              <Button size="small" type="primary" @click="openModal">查看更多信息</Button>
              <Button size="small" type="primary" @click="visible = false">关闭</Button>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <span>您好：{{uName}} </span><i>|</i>
        <!-- <a href="javascript:">密码修改</a><i>|</i> -->
        <a @click="outLogin">安全退出</a>
      </div>
    </Menu>
    <Modal v-model="modalFlag" title="我的信息列表" width="1100px" :styles="{top: '20px'}">
      <Button type="primary" style="margin:0 10px 0 0" @click="modalRead"><Icon type="ios-flag" :size="18" style="margin:0 5px 0 0"></Icon>标为已读</Button>
      <Button type="primary" @click="modalRemove"><Icon type="ios-trash" :size="18" style="margin:0 5px 0 0"></Icon>删除</Button>
      <Table :data="data1" :columns="column1" :height="400" style="margin:10px 0 0 0" @on-selection-change="onSelectionChange"></Table>
      <div slot="footer">
        <Page :total="total" :page-size="pageSize" :current="pageNum" @on-change="pageChange" :styles="{float: 'left'}"></Page>
        <Button type="primary" @click="modalFlag = false">确定</Button>
        <Button @click="modalFlag = false">取消</Button>
      </div>
      <Loading :isload="loading" class="pop-loading"></Loading>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  import Loading from './loading.vue'
  import cryptoJs from 'crypto-js'
  export default {
    name: 'topNav',
    components: {Loading},
    data () {
      return {
        theme: 'dark',
        visible: false,
        list: [],
        modalFlag: false,
        loading: false,
        data1: [],
        column1: [
          {
            width: 60,
            type: 'selection'
          },
          {
            width: 90,
            title: '状态',
            render: (h, params) => {
              let type = ''
              if (params.row.isRead === '1') {
                // 未读
                type = 'android-mail'
              } else if (params.row.isRead === '2') {
                // 已读
                type = 'android-drafts'
              }
              let dom = h('Icon', {
                props: {type: type, size: 24}
                // <Icon type="android-drafts"></Icon>
              })
              return dom
            }
          },
          {
            width: 200,
            title: '标题',
            render: (h, params) => {
              return this.typeArray[params.row.type]
            }
          },
          {
            title: '内容摘要',
            key: 'content'
          },
          {
            width: 200,
            title: '时间',
            key: 'createDate'
          }
        ],
        selected: [],
        typeArray: ['', '库存预警', '运营平台登录'],
        pageNum: 1,
        pageSize: 20,
        total: 0,
        notReadNum: 0
      }
    },
    methods: {
      outLogin () {
        this.$router.push({path: '/login'})
      },
      getSessionPower (callback) {
        if (sessionStorage.getItem('userInfo')) {
          let pwdUserInfo = sessionStorage.getItem('userInfo')
          let us = cryptoJs.AES.decrypt(pwdUserInfo, 'key', 'conf')
          let qxContent = JSON.parse(us.toString(cryptoJs.enc.Utf8))
          callback(qxContent.operatorVoList)
        }
      },
      openModal () {
        this.modalFlag = true
        this.pageNum = 1
        this.getMessagrRemind()
      },
      onSelectionChange (selection) {
        let canceled = []
        for (let i of this.data1) {
          if (JSON.stringify(selection).indexOf(i.id) === -1) {
            canceled.push(i)
          }
        }
        // 判重已加入
        let obj = {}
        for (let i of this.selected) {
          if (!obj[i.id]) {
            obj[i.id] = 1
          }
        }
        for (let i of selection) {
          if (!obj[i.id]) {
            this.selected.push(i)
            obj[i.id] = 1
          }
        }
        // 判重已删除
        let obj2 = {}
        for (let i of canceled) {
          if (!obj2[i.id]) {
            obj2[i.id] = 1
          }
        }
        let selected = []
        for (let i of this.selected) {
          if (!obj2[i.id]) {
            selected.push(i)
          }
        }
        this.selected = selected
      },
      getNoReadMessage () {
        this.$http.post(`om/OperationManagement/v1/messageRemind?pageNum=1&pageSize=99&isRead=1`).then(res => {
          if (res.data.code === 200) {
            this.notReadNum = res.data.notReadNum
            this.list = res.data.MessageInfo.list
            this.selected = []
          }
        })
      },
      pageChange (index) {
        this.pageNum = index
        this.getMessagrRemind(res => {
          if (res.data.code === 200) {
            this.resetTableItemChecked()
          }
        })
      },
      resetTableItemChecked () {
        if (this.data1) {
          let obj = {}
          for (let i of this.selected) {
            if (!obj[i.id]) {
              obj[i.id] = 1
            }
          }
          for (let i in this.data1) {
            if (obj[this.data1[i].id]) {
              this.data1[i]._checked = true
            } else {
              this.data1[i]._checked = false
            }
          }
          this.data1 = JSON.parse(JSON.stringify(this.data1))
        }
      },
      getMessagrRemind (callback) {
        this.loading = true
        this.$http.post(`om/OperationManagement/v1/messageRemind?pageNum=${this.pageNum}&pageSize=${this.pageSize}&isRead=0`).then(res => {
          if (res.data.code === 200) {
            this.data1 = res.data.MessageInfo.list
            this.total = res.data.MessageInfo.total
          }
          if (typeof callback === 'function') {
            callback(res)
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      readMessage (ids) {
        if (this.modalFlag) { this.loading = true }
        this.$http.post(`om/OperationManagement/v1/messageRead`, ids).then(res => {
          if (res.data.code === 200) {
            this.pageNum = 1
            this.selected = []
            this.getNoReadMessage()
            if (this.modalFlag) {
              this.getMessagrRemind()
            }
          }
          if (this.modalFlag) { this.loading = false }
        }).catch(() => {
          if (this.modalFlag) { this.loading = false }
        })
      },
      removeMessage (ids) {
        if (this.modalFlag) { this.loading = true }
        this.$http.post(`om/OperationManagement/v1/message`, ids).then(res => {
          if (res.data.code === 200) {
            this.pageNum = 1
            this.selected = []
            this.getNoReadMessage()
            if (this.modalFlag) {
              this.getMessagrRemind()
            }
          }
          if (this.modalFlag) { this.loading = false }
        }).catch(() => {
          if (this.modalFlag) { this.loading = false }
        })
      },
      readAll () {
        let arr = []
        this.list.forEach(e => {
          arr.push(e.id)
        })
        if (arr.length > 0) {
          this.readMessage(arr)
        }
      },
      dropdownRead (id) {
        let config = {
          title: '提示',
          content: `是否标为已读信息`,
          onOk: () => {
            this.readMessage([id])
          }
        }
        this.$Modal.confirm(config)
      },
      dropdownRemove (id) {
        let config = {
          title: '提示',
          content: `是否删除信息`,
          onOk: () => {
            this.removeMessage([id])
          }
        }
        this.$Modal.confirm(config)
      },
      modalRemove () {
        let ids = []
        this.selected.forEach(e => {
          ids.push(e.id)
        })
        console.log(ids)
        if (ids.length > 0) {
          let config = {
            title: '提示',
            content: `是否删除信息`,
            onOk: () => {
              this.removeMessage(ids)
            }
          }
          this.$Modal.confirm(config)
        }
      },
      modalRead () {
        let ids = []
        this.selected.forEach(e => {
          ids.push(e.id)
        })
        console.log(ids)
        if (ids.length > 0) {
          let config = {
            title: '提示',
            content: `是否标为已读信息`,
            onOk: () => {
              this.readMessage(ids)
            }
          }
          this.$Modal.confirm(config)
        }
      }
    },
    mounted: function () {
      this.getNoReadMessage()
      setTimeout(() => {
        this.getNoReadMessage()
      }, 1800000)
    },
    computed: {
      uName: function () {
        let uName
        this.getSessionPower((userMsg) => {
          if (userMsg) {
            uName = userMsg[0].userName
          } else {
            uName = '配置角色'
          }
        })
        return uName
      }
    },
    props: ['select']
  }
</script>
