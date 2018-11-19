<style lang="scss" rel="stylesheet/scss">
  #selectLink {
    .ivu-form-item {
      margin: 10px 0px;
    }
    .ivu-input-wrapper {
      width: calc(100% - 10px);
    }
  }
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
  #selectLink {
    .link-name {
      color: #2d8cf0;
      font-size: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 220px;
      display: block;
      float: left;
    }
    .btn-delete {
      color: #ed3f14;
      font-size: 12px;
      margin: 0px 0px 0px 20px;
      float: left;
    }
  }
</style>
<template>
  <div id="selectLink">
    <Form inline :label-width="90">
      <FormItem label="选择链接：">
        <Select style="width:110px;" v-model="linkModel">
          <Option value="0">功能链接</Option>
          <Option value="1">自定义链接</Option>
        </Select>
        <Select style="width:110px;" v-if="linkModel === '0'" :value="optionName">
          <Option v-for="(item, index) in list" :key="index" :value="item.name" @click.native="clickOption(item)">{{item.name}}</Option>
        </Select>
        <Input v-if="linkModel === '1'" v-model="link" class="diy-link"></Input>
      </FormItem>
    </Form>
    <Form :label-width="90">
      <FormItem label="已选择：" v-if="linkName !== ''">
        <span class="link-name">{{linkName}}</span><a href="javacript:" class="btn-delete" @click="deleteLink">删除</a>
      </FormItem>
    </Form>
    <cateLink v-model="list[0].flag" @selected="getFuncLink"></cateLink>
    <productLink v-model="list[1].flag" @selected="getFuncLink"></productLink>
    <pageLink v-model="list[2].flag" @selected="getFuncLink"></pageLink>
  </div>
</template>
<script type="text/ecmascript-6">
  import cateLink from './cateLink.vue'
  import productLink from './productLink.vue'
  import pageLink from './pageLink.vue'
  export default {
    name: 'selectLink',
    components: {
      cateLink,
      productLink,
      pageLink
    },
    data () {
      return {
        list: [
          {name: '类目', flag: false, link: ''},
          {name: '商品', flag: false, link: ''},
          {name: '页面', flag: false, link: ''},
          {name: '我的订单', flag: false, link: '/myOrders'},
          {name: '购物车', flag: false, link: '/shoppingCart'},
          {name: '账户中心', flag: false, link: '/mine'}
        ],
        modalFlag: false
      }
    },
    props: {
      value: [String, Object]
    },
    methods: {
      clickOption (val) {
        if (val.name !== this.optionName) {
          this.linkObj = {
            linkModel: '0',
            linkName: '',
            optionName: val.name,
            link: ''
          }
        }
        if (['类目', '商品', '页面'].indexOf(val.name) !== -1) {
          for (let i in this.list) {
            if (val.name === this.list[i].name) {
              this.list[i].flag = true
            }
          }
        } else {
          this.linkObj = {
            linkModel: '0',
            linkName: val.name,
            optionName: val.name,
            link: val.link
          }
        }
      },
      getFuncLink (val) {
        this.linkObj = {
          linkModel: this.linkObj.linkModel,
          linkName: val.linkName,
          optionName: this.linkObj.optionName,
          link: val.link
        }
      },
      deleteLink () {
        this.linkObj = {
          linkModel: '0',
          linkName: '',
          optionName: '',
          link: ''
        }
      }
    },
    computed: {
      linkObj: {
        get () {
          if (this.value) {
            return this.value
          } else {
            return {
              linkModel: '1',
              linkName: '',
              optionName: '',
              link: 'javascript:'
            }
          }
        },
        set (val) {
          this.$emit('input', val)
        }
      },
      linkModel: {
        get () {
          return this.linkObj.linkModel
        },
        set (val) {
          if (val === '0') {
            this.linkObj = {
              linkModel: val,
              linkName: this.linkObj.linkName,
              optionName: this.linkObj.optionName,
              link: this.linkObj.link
            }
          } else if (val === '1') {
            this.linkObj = {
              linkModel: val,
              linkName: '',
              optionName: '',
              link: this.linkObj.link
            }
          }
        }
      },
      linkName: {
        get () {
          return this.linkObj.linkName
        },
        set (val) {
          this.linkObj = {
            linkModel: this.linkObj.linkModel,
            linkName: val,
            optionName: this.linkObj.optionName,
            link: this.linkObj.link
          }
        }
      },
      optionName: {
        get () {
          return this.linkObj.optionName
        },
        set (val) {
          this.linkObj = {
            linkModel: this.linkObj.linkModel,
            linkName: this.linkObj.linkName,
            optionName: val,
            link: this.linkObj.link
          }
        }
      },
      link: {
        get () {
          return this.linkObj.link
        },
        set (val) {
          this.linkObj = {
            linkModel: this.linkObj.linkModel,
            linkName: this.linkObj.linkName,
            optionName: this.linkObj.optionName,
            link: val
          }
        }
      }
    }
  }
</script>

