<style lang="scss" rel="stylesheet/scss" scoped>
.my-page {
  text-align: left;
  width: 700px;
  display: inline-block;
}
</style>
<template>
  <Modal v-model="selecting" :width="1000" id="selectProduct">
    <Form inline>
      <FormItem label="商品名称：" :label-width="120">
        <Input v-model.trim="name"></Input>
      </FormItem>
      <FormItem label="商品分类：" :label-width="90">
        <Select style="width: 130px;" v-model="cate1" not-found-text="加载中..." @on-change="getCateData2">
          <Option v-for="(item, index) in cateData" :key="index" :value="item.id">{{item.name}}</Option>
        </Select>
        <Select style="width: 130px;" v-model="cate2" not-found-text="加载中..." @on-change="getCateData3">
          <Option v-for="(item, index) in cateData2" :key="index" :value="item.id">{{item.name}}</Option>
        </Select>
        <Select style="width: 130px;" v-model="cate3" not-found-text="加载中...">
          <Option v-for="(item, index) in cateData3" :key="index" :value="item.id">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="0">
        <Button type="primary" @click="searchProduct">搜索</Button>
        <Button @click="regetProduct">重置</Button>
      </FormItem>
    </Form>
    <Table :columns="column1" :data="data1" @on-selection-change="selectP" :height="400"></Table>
    <div slot="footer">
      <Page :total="totalCount" show-elevator :page-size="pageSize" :current="currentPage" class="my-page" @on-change="pageChange"></Page>
      <Button type="primary" @click="saveP">保存</Button>
      <Button @click="closeSelectModal">取消</Button>
    </div>
  </Modal>
</template>
<script type="text/ecmascript-6">
  import * as cateAPI from '../services/operationCate.es6'
  import * as pmAPI from '../services/productManager.es6'
  import * as tool from '../services/tool.es6'
  export default {
    name: 'selectProduct',
    data () {
      return {
        column1: [
          {
            type: 'selection',
            width: 60
          },
          {
            title: '图片',
            width: 70,
            render: (h, params) => {
              return h('img', {
                domProps: {
                  src: params.row.defaultPicture
                },
                style: {
                  width: '50px',
                  height: '50px',
                  margin: '5px 0px 0px 0px'
                }
              })
            }
          },
          {
            title: '商品名称',
            render: (h, params) => {
              return h('span',{},tool.handleName(params.row.skuName))
            }
          },
          {
            title: '售价',
            width: 100,
            render: (h, params) => {
              return h('span',{},tool.handleName(params.row.price))
            }
          },
          {
            title: '类目',
            render: (h, params) => {
              // return [params.row.firstCategory, params.row.secondCategory, params.row.threeCategory].join('>>')
              return h('span',{},`${params.row.firstCategory}>>${params.row.secondCategory}>>${params.row.threeCategory}`)
            }
          }
        ],
        data1: [],
        name: '',
        cate1: '',
        cate2: '',
        cate3: '',
        cateData: [],
        cateData2: [],
        cateData3: [],
        currentPage: 1, // 第N页
        pageSize: 20, // 条数/页
        totalCount: 0, // 总数据条数
        pList: [],
        searchParams: {}
      }
    },
    props: {
      value: Boolean,
      pNum: Number // 父组件已选商品数量
    },
    mounted: function () {
      this.searchParams = {name: '*'}
    },
    methods: {
      initial () {
        this.getCate(() => {
          this.regetProduct()
        })
      },
      selectP (selection) {
        this.pList = selection
        console.log(this.pList)
      },
      saveP () {
        if (this.pNum === -4 && this.pList.length > 1) {
          this.$Message.warning('所选商品不可超1个')
        } else if (this.pList.length + this.pNum > 4) {
          this.$Message.warning('所选商品不可超4个')
        } else {
          this.$emit('on-select', this.pList)
          this.selecting = false
        }
      },
      closeSelectModal () {
        this.selecting = false
      },
      // 获取类目数据-接口
      getCate (callback) {
        this.$http.get(cateAPI.getCate()).then(response => {
          if (response.data.code === 200) {
            this.cateData = response.data.operateCategory
            callback()
          }
        }).catch(error => {
          console.log(error)
        })
      },
      getCateData2 () {
        this.cateData2 = []
        this.cateData3 = []
        this.cate2 = ''
        this.cate3 = ''
        for (let i of this.cateData) {
          if (i.id === this.cate1) {
            this.cateData2 = i.secondCategory
          }
        }
      },
      getCateData3 () {
        this.cateData3 = []
        this.cate3 = ''
        for (let i of this.cateData2) {
          if (i.id === this.cate2) {
            this.cateData3 = i.threeCategory
          }
        }
      },
      searchProduct () {
        this.searchParams = {}
        if (this.name) {
          this.searchParams.name = this.name
        }
        if (this.cate3) {
          this.searchParams.categoryId = this.cate3
        } else if (this.cate2) {
          this.searchParams.categoryId = this.cate2
        } else if (this.cate1) {
          this.searchParams.categoryId = this.cate1
        }
        this.getProduct()
      },
      // 获取商品
      getProduct () {
        this.$http.post(...pmAPI.onsell(this.currentPage, this.pageSize, this.searchParams)).then((res) => {
          if (res.data.code === 200) {
            let list = res.data.pageInfo.list
            let data1 = []
            if (list.length > 0) {
              list.forEach(e => {
                let obj = {
                  defaultPicture: e.productPicture ? e.productPicture.replace(/!+[0-9]+$/, '') : '',
                  skuName: e.skuName,
                  price: e.price,
                  defaultSkuId: e.defaultSkuId
                }
                for (let i of this.cateData) {
                  if (i.id === e.categoryId) {
                    obj.firstCategory = i.name
                  } else {
                    for (let j of i.secondCategory) {
                      if (j.id === e.categoryId) {
                        obj.firstCategory = i.name
                        obj.secondCategory = j.name
                      } else {
                        for (let k of j.threeCategory) {
                          if (k.id === e.categoryId) {
                            obj.firstCategory = i.name
                            obj.secondCategory = j.name
                            obj.threeCategory = k.name
                          }
                        }
                      }
                    }
                  }
                }
                data1.push(obj)
              })
            }
            console.log('data1',data1)
            this.data1 = data1
            this.totalCount = res.data.pageInfo.total
          }
        })
      },
      // 重置
      regetProduct () {
        this.currentPage = 1
        this.name = ''
        this.cateData2 = []
        this.cateData3 = []
        this.cate1 = ''
        this.cate2 = ''
        this.cate3 = ''
        this.pList = []
        this.searchParams = {}
        this.getProduct()
      },
      pageChange (num) {
        this.currentPage = num
        this.pList = []
        this.getProduct()
      }
    },
    computed: {
      selecting: {
        get () {
          if (this.value) {
            setTimeout(() => {
              this.initial()
            }, 300)
            return this.value
          } else {
            return false
          }
        },
        set (val) {
          this.$emit('input', val)
        }
      }
    }
  }
</script>
