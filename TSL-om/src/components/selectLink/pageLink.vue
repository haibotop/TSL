<template>
  <div id="pageLink">
    <Modal v-model="flag" title="页面" width="900">
      <Table :columns="column1" :data="data1" height="400"></Table>
      <div slot="footer">
        <!-- <Button type="primary" @click="onOk">确定</Button>
        <Button @click="onCancel">取消</Button> -->
      </div>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as pageAPI from '../../services/homePage.es6'
  export default {
    name: 'pageLink',
    data () {
      return {
        column1: [
          {title: '页面名称', key: 'name'},
          {title: '页面分类', key: 'classify'},
          {title: '更新时间', key: 'updateDate'},
          {
            title: '选择',
            render: (h, params) => {
              return h('Button', {
                props: {type: 'primary'},
                on: {
                  'click': () => {
                    this.selectPage(params.row)
                  }
                }
              }, '选择')
            }
          }
        ],
        data1: []
      }
    },
    props: {
      value: [Boolean]
    },
    methods: {
      getPageList () {
        this.$http.get(...pageAPI.getTemplates()).then(res => {
          if (res.data.code === 200) {
            let template = []
            for (let i of res.data.template) {
              if (i.status === 1) {
                template.push(i)
              }
            }
            this.data1 = template
          }
        })
      },
      selectPage (page) {
        this.$emit('selected', {
          linkName: page.name,
          link: `/page/${page.classify}/${page.name}/${page.id}`
        })
        this.flag = false
      }
    },
    computed: {
      flag: {
        get () {
          if (this.value) {
            this.getPageList()
            return this.value
          } else {
            return false
          }
        },
        set (flag) {
          this.$emit('input', flag)
        }
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
</style>