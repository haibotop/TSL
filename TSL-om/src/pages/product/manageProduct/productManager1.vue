<style lang="scss" rel="stylesheet/scss" scoped>
#productManager1 {
min-width: 1110px;
}

.my-breadcrumb {
margin: 0px 10px;
}

.pmSearch {
margin: 20px;
}

.controlAll {
margin: 0 50px 10px;
}

.newProduct {
float: right;
}

.pmTable {
width: 95%;
margin: 0 auto;
}

.onSearch {
display: inline-block;
}

.footer {
width: 95%;
margin: 20px auto;
text-align: center;
}

.Font {
font-size: 12px;
color: red;
}

.margin-left-15{
  margin-left: 15px;
}
.pros-pop{
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 990;
  top: 0;
  left: 0;
  overflow: auto;
}
.pop-bg{
  width: 100%;
  height: 720px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 999;
  background: rgba(55,55,55,.6);
}

  .pros-in{
    height: 624px;
    position: absolute;
    top: 2%;
    left: 50%;
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);
    z-index: 9998;
  }
.pros-pop img{
    height:100%;
    width:auto;
  }
.pros-pop .pro-frame{
    position: absolute;
    top: 11.8%;
    left: 50%;
    width: 90%;
    height: 76%;
    margin-left: -45%;
    background: #fff;
  }
  .iphone-hd{
    height: 8%;
    text-align: center;
    background: #f2f2f2;
    color: #000;
    line-height: 40px;
    font-weight: 500;
    position: relative;
  }
  .iphone-hd .ivu-icon{
    position: absolute;
    left: 16px;
    font-size: 20px;
    top: 10px;
    cursor: pointer;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
    z-index: 99;
  }
  #phone-wrap{
    width: 100%;
    height: 100%;
  }
  .iphone-hd span{
    position: absolute;
    display: block;
    width: 100%;
    text-align: center;
    top: 50%;
    font-size: 16px;
    white-space: nowrap;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }
</style>
<template>
  <div id="productManager1">
    <div class="pmTitle">
      <Breadcrumb class="my-breadcrumb">
        <BreadcrumbItem>商品后台管理</BreadcrumbItem>
        <BreadcrumbItem>在售商品管理</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="pmSearch">
      <Form :label-width="90" :model="localsearch">
        <div class="inline">
          <div class="onSearch">
            <FormItem label="商品编码 :">
              <Input v-model="localsearch.code" placeholder="请输入" size="small" style="width: 140px"></Input>
            </FormItem>
          </div>
          <div class="onSearch">
            <FormItem label="上架时间 :">
              <Row>
                <DatePicker v-model="startTime" @on-clear="clearStartDate()" type="datetime" format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期和时间" size="small" style="width: 170px"></DatePicker>
                <DatePicker v-model="endTime" @on-clear="clearEndDate()" type="datetime" format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期和时间" size="small" style="width: 170px"></DatePicker>
              </Row>
            </FormItem>
          </div>
        </div>
        <div class="inline">
          <div class="onSearch">
            <FormItem label="商品名称 :">
              <Input v-model="localsearch.name" placeholder="请输入" size="small" style="width: 140px"></Input>
            </FormItem>
          </div>
          <div class="onSearch">
            <FormItem label="商品类目 :">
              <Select v-model="model1" size="small" style="width:113px" placeholder="一级类目" @on-change="firstCheck">
                <Option v-for="item1 in list1" :value="item1.id" :key="item1.value">{{ item1.value }}</Option>
              </Select>
              <Select v-model="model2" size="small" style="width:113px" placeholder="二级类目" @on-change="secondCheck">
                <Option v-for="item2 in list2" :value="item2.id" :key="item2.value">{{ item2.value }}</Option>
              </Select>
              <Select v-model="model3" size="small" style="width:113px" placeholder="三级类目" @on-change="threeCheck">
                <Option v-for="item3 in list3" :value="item3.id" :key="item3.value">{{ item3.value }}</Option>
              </Select>
            </FormItem>
          </div>
          <div class="margin-left-15">
            <Button class="searchAndResetBtn margin-right-10" @click="handleSearch()">查询</Button>
            <Button class="searchAndResetBtn" @click="handleReset()">重置</Button>
          </div>
        </div>
      </Form>
    </div>
    <div class="controlAll">
      <Button @click="handleMorePro" ref="morePro" :disabled="discheck">批量手动下架</Button>
      <Button @click="addIndexes" :disabled="disAddIndex">H5商品索引生成</Button>
      <Button class="newProduct" @click="toAddProduct">添加新商品</Button>
    </div>
    <div class="pmTable">
      <Table :columns="columns1" :data="onsellData" @on-selection-change="onsellCheck"
             @on-sort-change="handleSort" height="500"></Table>
    </div>
    <div class="footer">
      <Page :current="pageParams.pageNum" :total="pageParams.pageTotal" :page-size="pageParams.pageSize"
            @on-change="pageChange" show-total></Page>
    </div>
    <div class="pmConfirm">
      <Modal title="手动下架" v-model="takePro" width="400">
        <p>确认下架，商品不能被购买</p>
        <div slot="footer">
          <Button @click="confirmPro()">确认</Button>
          <Button @click="cancelPro()">取消</Button>
        </div>
      </Modal>
      <Modal title="批量下架" v-model="MorePro" width="400">
        <p>确认下架 {{checklength}} 件商品 ?</p>
        <div slot="footer">
          <Button @click="confirmMorePro()">确认</Button>
          <Button @click="cancelMorePro()">取消</Button>
        </div>
      </Modal>
      <Modal title="修改价格" v-model="editPrice" :mask-closable="false" width="800">
        <div>
          <Table :columns="editColumns" :data="skuData"></Table>
        </div>
        <div slot="footer">
          <Button @click="editConfirm">确定</Button>
          <Button @click="editPrice=false">取消</Button>
        </div>
      </Modal>
      <!--<Modal title="商城商品详情页二维码" v-model="showQc" :mask-closable="false" width="300">-->
        <!--<div style="text-align: center" :src="popUrl()">-->
          <!--<canvas id="qrccode-canvas"></canvas>-->

        <!--</div>-->
        <!--<div slot="footer">-->
          <!--<Button @click="showQc=false">确认</Button>-->
          <!--<Button @click="showQc=false">取消</Button>-->
        <!--</div>-->
      <!--</Modal>-->
    </div>
    <!--弹窗预览-->
    <div class="pros-pop"  v-show='isShow'>
        <div class="pop-bg" @click="hidePop">
        </div>
        <div class="pros-in">
          <img src="../../../assets/images/iphone.png" alt="" class="iphone-bg">
          <div class="pro-frame">
            <div class="iphone-hd">
                <Icon type="close-round" @click="hidePop"></Icon>
                <span>TSL | 謝瑞麟 线上珠宝店</span>
            </div>
            <div id="phone-wrap">

            </div>
            <!--<iframe :src="prosSrc"  width="100%" height="92%" frameborder="0" scrolling=no>-->
            <!--</iframe>-->
          </div>
        </div>
    </div>
    <!-- 弹出修改框 -->
    <Modal
      v-model="subConfirm" width="960"
      :styles="{'margin-bottom': '100px'}"
      class-name="open-modal">
      <!-- 此处上架编辑框弹出的是修改单品还是修改sku组合商品   alo单品   cba组合 -->
      <aloOnsale :productInfo="productInfo" v-if="productInfo.alo" ref="saveSingleModal"></aloOnsale>
      <cbaOnsale :productInfo="productInfo" v-if="productInfo.cba" ref="saveModal"></cbaOnsale>
      <div slot="footer"><Button type="primary" @click="saveToback">保存</Button></div>
    </Modal>
    <!-- Loading -->
    <Loading :isload="loading"></Loading>
  </div>
</template>
<script>
  import * as pmAPI from '../../../services/productManager.es6'
  import * as ocAPI from '../../../services/operationCate.es6'
  import * as gpAPI from '../../../services/goldPrice.es6'

  import Loading from '../../../components/loading.vue'
  import aloOnsale from '../../../pages/product/manageProduct/alter/aloOnSale'
  import cbaOnsale from '../../../pages/product/manageProduct/alter/cbaOnSale'

  import QRCode from 'qrcode'
  export default {
    name: 'categoryAssociation',
    components: {
      aloOnsale,
      cbaOnsale,
      Loading
    },
    data () {
      return {
        model1: '',
        model2: '',
        model3: '',
        startTime: '',
        endTime: '',
        checklength: '',
        canvas: '',
        skuDataSpuId: '',
        prosSrc: '',
        isShow: false,
        list1: [],
        list2: [],
        list3: [],
        onsellData: [],
        // 在售修改的信息
        productInfo: {},
        // 在售信息弹窗
        subConfirm: false,
        skuData: [],
        listData: [],
        cateArr: {},
        checkParams: [],
        goldPrice: [],
        columns1: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '商品编码',
            key: 'code',
            width: 180,
            algin: 'center'
          },
          {
            title: '所属类目',
            key: 'categoryName',
            align: 'center',
            width: 250,
            render: (h, params) => {
              let allLev
              let lev3
              let lev2
              let lev1
              let cateTemp = this.returnSecAndFirCate(params.row.categoryId)
              if (cateTemp.length > 0) {
                for (let a of cateTemp) {
                  switch (a.level) {
                    case 3: {
                      lev3 = a.name
                      break
                    }
                    case 2: {
                      lev2 = a.name
                      break
                    }
                    case 1: {
                      lev1 = a.name
                      break
                    }
                  }
                }
                allLev = `${lev1} > ${lev2} > ${lev3}`
              }
              return h('div', {}, allLev)
            }
          },
          {
            title: '商品信息',
            width: 300,
            key: 'pMessage',
            render: (h, params) => {
              return h('div', [
                h('img', {
                  domProps: {
                    src: params.row.productPicture,
                    alt: 'anmoqi'
                  },
                  style: {
                    width: '40px',
                    marginRight: '5px',
                    verticalAlign: 'middle',
                    display: 'inline-block'
                  }
                }),
                h('div', {
                  props: 'text',
                  size: 'small',
                  style: {
                    width: '160px',
                    verticalAlign: 'middle',
                    display: 'inline-block'
                  }
                }, params.row.productName)
              ])
            }
          }, {
            title: '设计编号',
            key: 'barcode',
            align: 'center',
            width: 150
          }, {
            title: '总库存',
            key: 'stock',
            align: 'center',
            width: 130,
            sortable: true
          }, {
            title: '总销量',
            key: 'sales',
            align: 'center',
            width: 130,
            sortable: true
          }, {
            title: '最新上架时间',
            key: 'putawayDate',
            align: 'center',
            width: 180,
            sortable: true
          }, {
            title: '操作',
            align: 'center',
            width: 200,
            render: (h, params) => {
              return h('div', [
              //   h('Button', {
              //     props: {
              //       type: 'text',
              //       size: 'small'
              //     },
              //     on: {
              //       click: () => {
              //         console.log(params.row.defaultSkuId)
              //         this.showQc = true
              //         this.createQrc(params.row.defaultSkuId)
              //       }
              //     }
              //   }, '预览'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.isShow = true
                      this.createPop(params.row.defaultSkuId)
                      this.prosSrc = this.createPop(params.row.defaultSkuId)
                    }
                  }
                }, '预览'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.handleEdit(params)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.handlePro(params)
                    }
                  }
                }, '手动下架')
              ])
            }
          }
        ],
        editColumns: [
          {
            title: 'SKU编码',
            align: 'center',
            key: 'skuCode',
            width: 175
          },
          {
            title: '商品信息',
            align: 'center',
            key: 'skuName',
            width: 250,
            render: (h, params) => {
              let dom = []
              console.log(params)
              let img = h('img', {
                domProps: {
                  src: params.row.picture
                },
                style: {
                  width: '40px',
                  marginRight: '5px',
                  verticalAlign: 'middle',
                  display: 'inline-block'
                }
              })
              let content = h('p', {
                props: 'text',
                size: 'small',
                style: {
                  verticalAlign: 'middle',
                  display: 'inline-block',
                  textAlign: 'left',
                  width: '160px'
                }
              }, params.row.skuName)
              if (params.row.picture === '') {
                dom.push(content)
              } else {
                dom.push(img, content)
              }
              return h('div', {}, dom)
            }
          },
          {
            title: '库存',
            align: 'center',
            key: 'stock',
            width: 80,
            render: (h, params) => {
              if (params.row.stock === null) {
                params.row.stock = 0
              }
              return h('div', {}, params.row.stock)
            }
          },
          {
            title: '价格',
            align: 'center',
            width: 300,
            render: (h, params) => {
              if (params.row.type === 1) {
                let faa = params.row.skuPriceOrManualFee
                return h('div', [
                  h('span', {}, '一口价 :'),
                  h('Input', {
                    props: {size: 'small', value: faa},
                    style: {width: '80px', margin: '3px'},
                    on: {
                      'on-change': (val) => {
                        val.target.value = val.target.value.split('.')[0]
                        faa = val.target.value
                        console.log(faa)
                      },
                      'on-blur': () => {
                        this.skuData[params.index].skuPriceOrManualFee = parseInt(faa)
                        faa = this.skuData[params.index].skuPriceOrManualFee
                        console.log(this.skuData[params.index].skuPriceOrManualFee)
                      }
                    }
                  }),
                  h('span', {}, '元')
                ])
              } else if (params.row.type === 2) {
                let skuData = this.skuData[params.index]
                let fee = skuData.skuPriceOrManualFee.split('+') // fee[1] 手工费
                let gp = fee[0].split('*') // gp[0] 克数 * gp[1] 参数（value=>金价） + 手工费
                let xp
                for (let a of this.goldPrice) {
                  if (gp[1] === a.key) {
                    xp = a
                  }
                }
                skuData.fee = fee[1]
                skuData.allfee = gp[0] * xp.value + parseFloat(fee[1])
                skuData.newSkuPriceOrManualFee = `${fee[0]}+${fee[1]}`

                let dom = h('div', [
                  h('ul', {style: {fontSize: '10px'}}, [
                    h('li', {style: {width: '60px', display: 'inline-block'}}, [
                      h('p', xp.name),
                      h('Input', {
                        props: {size: 'small', value: xp.value, disabled: true},
                        style: {width: '60px'}
                      })
                    ]),
                    h('li', {style: {width: '60px', marginLeft: '10px', display: 'inline-block'}}, [
                      h('p', '手工费(元)'),
                      h('Input', {
                        props: {size: 'small', value: fee[1]},
                        style: {width: '60px'},
                        on: {
                          'on-change': (val) => {
                            fee[1] = val.target.value.split('.')[0]
                          },
                          'on-blur': () => {
                            console.log(fee[1])
                            skuData.skuPriceOrManualFee = `${fee[0]}+${fee[1]}`
                            skuData.newSkuPriceOrManualFee = `${fee[0]}+${fee[1]}`
                            skuData.allfee = gp[0] * xp.value + fee[1]
                            this.skuData = JSON.parse(JSON.stringify(this.skuData))
                            console.log(fee)
                          }
                        }
                      })
                    ]),
                    h('li', {style: {width: '70px', marginLeft: '20px', display: 'inline-block'}}, [
                      h('p', '计算总价(元)'),
                      h('Input', {
                        props: {size: 'small', value: skuData.allfee, disabled: true},
                        style: {width: '70px'}
                      })
                    ])
                  ])
                ])
                return dom
              }
            }
          }
        ],
        localsearch: {
          name: null,
          categoryId: null,
          startTime: null,
          endTime: null,
          code: null,
          barCode: null
        },
        searchParams: {
          categoryId: null,
          name: null,
          endTime: null,
          startTime: null,
          code: null,
          barCode: null,
          sort: null
        },
        pageParams: {
          pageTotal: 0,
          pageNum: 1,
          pageSize: 20
        },
        discheck: true,
        takePro: false,
        MorePro: false,
        editPrice: false,
        loading: false,
        showQc: false,
        disAddIndex: true
      }
    },
    mounted () {
      this.loading = true

      this.getOnSell((response) => {
        this.getCategoryList((res) => {
          this.showcategoryList(res)
          this.takeOnsellData(response)
        })
      })
      this.$nextTick(function () {
        // DOM操作
        this.canvas = document.getElementById('qrccode-canvas')
      })
    },
    methods: {
      // -----------接口调用-----------
      // 获取初始数据，操作分页
      getOnSell (callback) {
        this.searchParams.sort = 2
        this.$http.post(...pmAPI.onsell(this.pageParams.pageNum, this.pageParams.pageSize, this.searchParams))
          .then((response) => {
            if (response.data.code === 200) {
              if (typeof callback === 'function') {
                callback(response)
              }
            }
          })
      },
      // 获取搜索类目
      getCategoryList (callback) {
        this.$http.get(ocAPI.getCate())
          .then((response) => {
            if (response.data.code === 200) {
              if (typeof callback === 'function') {
                callback(response)
              }
            }
          })
      },
      // 下架接口(批量/单个)
      postDelProduct (callback) {
        this.$http.post(...pmAPI.delProduct(this.checkParams))
          .then((response) => {
            if (response.data.code === 200) {
              if (typeof callback === 'function') {
                callback()
              }
            }
          })
      },
      // 获取商品进入修改的信息
      getOnsellInfo (spuId, categoryId, callback) {
        this.isLoad = true
        this.$http.get(pmAPI.getOnsellInfo(spuId, categoryId))
          .then(res => {
            if (res.data.code === 200) {
              if (typeof callback === 'function') {
                callback(res.data.productInfo)
              }
            }
          })
      },
      // ================  保存修改商品信息
      saveToback () {
        if (this.productInfo.cba) {
          this.$refs.saveModal.$emit('saveToback')
        } else if (this.productInfo.alo) {
          this.$refs.saveSingleModal.$emit('saveToback')
        }
      },
      // 获取Spu的SKU信息
      getSkuInfo (spuId, callback) {
        this.$http.get(pmAPI.getSkuInfo(spuId))
          .then((response) => {
            if (response.data.code === 200) {
              if (typeof callback === 'function') {
                callback(response)
              }
            }
          })
      },
      // 保存修改后SKU价格
      postSkuInfo (params, callback) {
        this.$http.post(...pmAPI.postSkuInfo(params))
          .then((response) => {
            if (response.data.code === 200) {
              if (typeof callback === 'function') {
                callback(response)
              }
            }
          })
      },
      // 获取金价
      getGoldPrice (callback) {
        this.$http.get(gpAPI.getGoldPrice())
          .then((response) => {
            if (response.data.code === 200) {
              if (typeof callback === 'function') {
                callback(response)
              }
            }
          })
      },
      // H5商品索引生成
      addIndexes () {
        this.$http.post(...pmAPI.addSkuIndex(this.checkParams))
          .then((response) => {
            if (response.data.code === 200) {
              this.$Message.success('索引生成成功')
            }
          })
      },
      // ----------数据处理-----------
      takeOnsellData (response) {
        let pageInfo = response.data.pageInfo
        this.onsellData = pageInfo.list
        this.pageParams = {
          pageTotal: pageInfo.total,
          pageSize: pageInfo.pageSize,
          pageNum: pageInfo.pageNum
        }
        this.loading = false
      },
      showcategoryList (response) {
        this.listData = response.data.operateCategory
        let a = this.listData
        for (let i in a) {
          if (a[i].secondCategory.length > 0) {
            a[i].value = a[i].name
            this.list1.push({
              id: a[i].id,
              value: a[i].value
            })
          }
        }
        this.bulidThreeCate()
      },
      bulidThreeCate () {
        let arr1 = []
        let arr2 = []
        let arr3 = []
        if (this.listData.length > 0) {
          for (let a of this.listData) {
            arr1.push(a)
            if (a.secondCategory.length > 0) {
              for (let b of a.secondCategory) {
                arr2.push(b)
                if (b.threeCategory.length > 0) {
                  for (let c of b.threeCategory) {
                    arr3.push(c)
                  }
                }
              }
            }
          }
        }
        this.cateArr = {
          lev1: arr1,
          lev2: arr2,
          lev3: arr3
        }
      },
      firstCheck (val) {
        if (this.list1.length !== 0) {
          for (let a of this.list1) {
            if (val === a.id) {
              for (let b of this.listData) {
                if (a.id === b.id) {
                  for (let i of b.secondCategory) {
                    i.value = i.name
                  }
                  if (this.model1 !== '') {
                    this.model2 = b.secondCategory[0].id
                    this.list2 = b.secondCategory
                    this.secondCheck (b.secondCategory[0].id)
                  }
                }
              }
            }
          }
        }
      },
      secondCheck (val) {
        if (this.list2.length !== 0) {
          for (let a of this.list2) {
            if (val === a.id) {
              for (let b of this.listData) {
                for (let c of b.secondCategory) {
                  if (a.id === c.id) {
                    for (let i of c.threeCategory) {
                      i.value = i.name
                    }
                    if (this.model2 !== '') {
                      this.list3 = c.threeCategory
                      this.model3 = c.threeCategory[0].id
                      this.localsearch.categoryId = val
                    }
                  }
                }
              }
            }
          }
        }
      },
      threeCheck (val) {
        for (let i of this.list3) {
          if (i.id === val) {
            this.localsearch.categoryId = val
          }
        }
      },
      // 查询在售商品
      handleSearch () {
        if (this.localsearch.endTime !== null && this.startTime > this.endTime) {
          this.$Message.warning({content: '结束时间不可早于开始时间'})
        } else {
          this.searchParams = this.localsearch
          console.log(this.searchParams)
          this.loading = true
          this.pageParams.pageNum = 1
          this.getOnSell((response) => {
            this.takeOnsellData(response)
          })
        }
      },
      // 重置
      isNull () {
        this.model1 = ''
        this.model2 = ''
        this.model3 = ''
        this.list2 = []
        this.list3 = []
        this.endTime = ''
        this.startTime = ''
        this.localsearch = {
          categoryId: null,
          name: null,
          endTime: null,
          startTime: null,
          code: null,
          barCode: null,
          sort: this.searchParams.sort
        }
        this.searchParams = this.localsearch
      },
      handleReset () {
        this.isNull()
        this.pageParams.pageNum = 1
        this.loading = true
        this.getOnSell((response) => {
          this.takeOnsellData(response)
        })
      },
      clearStartDate () {
        if (this.localsearch.startTime !== null) {
          this.localsearch.startTime = null
        }
      },
      clearEndDate () {
        if (this.localsearch.endTime !== null) {
          this.localsearch.endTime = null
        }
      },
      // -----------------下架操作--------------
      // 单品下架操作
      handlePro (params) {
        this.takePro = true
        if (this.checkParams.length > 0) {
          this.checkParams = []
        }
        this.checkParams.push(params.row.spuId)
      },
      confirmPro () {
        this.postDelProduct(() => {
          this.takePro = false
          this.$Message.success({content: '成功下架'})
          this.getOnSell((response) => {
            this.takeOnsellData(response)
          })
        })
      },
      cancelPro () {
        this.takePro = false
      },
      // 批量下架操作
      // checkProduct
      onsellCheck (val) {
        let params = []
        for (let i of val) {
          params.push(i.spuId)
        }
        if (params.length > 0) {
          this.discheck = false
          this.disAddIndex = false
          this.checkParams = params
          this.checklength = params.length
        } else {
          this.discheck = true
          this.disAddIndex = true
        }
      },
      handleMorePro () {
        if (this.checkParams.length === 0) {
          this.$Message.warning({content: '请选择下架商品'})
        } else {
          this.MorePro = true
        }
      },
      confirmMorePro () {
        console.log(this.checkParams)
        this.postDelProduct(() => {
          this.MorePro = false
          this.$Message.success({content: '成功下架'})
          this.getOnSell((response) => {
            this.takeOnsellData(response)
          })
        })
      },
      cancelMorePro () {
        this.getOnSell((response) => {
          this.takeOnsellData(response)
          this.discheck = true
          this.disAddIndex = true
          this.MorePro = false
        })
      },
      // 分页
      pageChange (val) {
        this.pageParams.pageNum = val
        this.loading = true
        this.getOnSell((response) => {
          this.takeOnsellData(response)
        })
      },
      // 添加新商品
      toAddProduct () {
        this.$router.push({path: 'addProduct'})
      },
      // 排序操作
      handleSort (val) {
        // if (val.order !== 'normal') {
        //   this.searchParams.sort = val.order
        // } else {
        //   this.searchParams.sort = null
        // }
        // this.loading = true
        // this.getOnSell((response) => {
        //   this.takeOnsellData(response)
        // })
      },
      // 编辑
      handleEdit (params) {
        console.log(params.row)
        this.productInfo = {}
        this.getOnsellInfo(params.row.spuId, params.row.categoryId, res => {
          console.log('sku', res)
          this.productInfo = res
          if (this.productInfo.skuInfos.cateSelect.length === 0) {
            // 单品
            this.productInfo.cba = false
            this.productInfo.alo = true
          } else {
            // 多品
            this.productInfo.status = params.row.status
            this.productInfo.alo = false
            this.productInfo.cba = true
          }
          this.isLoad = false
          this.subConfirm = true
        })
        // this.getSkuInfo(params.row.spuId, (response) => {
        //   this.skuData = response.data.list
        //   for (let a of response.data.list) {
        //     a.spuId = params.row.spuId
        //   }
        // })
        // this.getGoldPrice((response) => {
        //   this.goldPrice = response.data.goldPrice
        // })
        // this.editPrice = true
      },
      editConfirm () {
        console.log(this.skuData)
        let params = []
        for (let a of this.skuData) {
          if (a.newSkuPriceOrManualFee) {
            if (a.fee.length > 0) {
              params.push({
                spuId: a.spuId,
                skuId: a.skuId,
                skuPriceOrManualFee: a.newSkuPriceOrManualFee
              })
            } else {
              this.$Message.warning({content: '请输入正确手工费'})
              return
            }
          } else {
            params.push({
              spuId: a.spuId,
              skuId: a.skuId,
              skuPriceOrManualFee: a.skuPriceOrManualFee
            })
          }
        }
        this.loading = true
        setTimeout(() => {
          this.postSkuInfo(params, () => {
            this.editPrice = false
            params = []
            this.loading = false
            this.$Message.success('操作成功')
          })
        }, 500)
      },
      returnSecAndFirCate (cateId) {
        let cateTemp = []
        if (this.cateArr.lev3) {
          for (let a of this.cateArr.lev3) {
            // 找到对应3级目录
            if (a.id === cateId) {
              cateTemp.push(a)
              if (this.cateArr.lev2) {
                for (let b of this.cateArr.lev2) {
                  // 找到对应2级目录
                  if (a.parentId === b.id) {
                    cateTemp.push(b)
                    if (this.cateArr.lev1) {
                      for (let c of this.cateArr.lev1) {
                        if (b.parentId === c.id) {
                          cateTemp.push(c)
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return cateTemp
      },
      // 生成二维码
      createQrc (skuId) {
        // pro环境下
        // QRCode.toCanvas(this.canvas, `http://eshop.tslj.cn/#/previewPd/${skuId}`, (error) => {
        // uat环境下
        QRCode.toCanvas(this.canvas, `http://eshopuat.tslj.cn/#/previewPd/${skuId}`, (error) => {
        // sit环境
        // QRCode.toCanvas(this.canvas, `http://www.isszp.com/#/previewPd/${skuId}`, (error) => {
          if (error) {
            console.log(error)
          } else {
            console.log('success')
          }
        })
      },
      popUrl: function (skuId) {
        // pro环境下
        // return `http://eshop.tslj.cn/#/previewPd/${skuId}`
        // uat环境下
        return `http://eshopuat.tslj.cn/#/previewPd/${skuId}`
        // sit环境
        // return `http://www.isszp.com/#/previewPd/${skuId}`
      },
      createPop: function (skuId) {
        // pro环境下
        // let url = `http://eshop.tslj.cn/#/previewPd/${skuId}`
        // uat环境下
        let url = `http://eshopuat.tslj.cn/#/previewPd/${skuId}`
        // sit环境
      //  let url = `http://www.isszp.com/#/previewPd/${skuId}`
        let phoneWrap = document.getElementById('phone-wrap')
        phoneWrap.innerHTML = ''
        let iframe = document.createElement('iframe')
        iframe.src = url
        iframe.style.border = '0'
        iframe.style.width = '100%'
        iframe.style.height = '92%'
        phoneWrap.appendChild(iframe)
      },
      hidePop: function (event) {
        this.isShow = false
        event.stopPropagation()
      }
    },
    watch: {
      takePro: function () {
        if (!this.takePro) {
          if (this.checkParams.length > 0) {
            this.checkParams = []
            console.log(this.checkParams)
          }
        }
      },
      endTime: function () {
        if (this.endTime !== '') {
          let date = this.endTime
          let Y = `${1900 + date.getYear()}`
          let M = `${date.getMonth() + 1}`
          let D = `${date.getDate()}`
          if (D < 10) {
            D = '0' + D
          }
          let h = `${date.getHours()}`
          if (h < 10) {
            h = '0' + h
          }
          let m = `${date.getMinutes()}`
          if (m < 10) {
            m = '0' + m
          }
          let s = `${date.getSeconds()}`
          if (s < 10) {
            s = '0' + s
          }
          this.localsearch.endTime = Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
        }
      },
      startTime: function () {
        if (this.startTime !== '') {
          let date = this.startTime
          let Y = `${1900 + date.getYear()}`
          let M = `${date.getMonth() + 1}`
          let D = `${date.getDate()}`
          if (D < 10) {
            D = '0' + D
          }
          let h = `${date.getHours()}`
          if (h < 10) {
            h = '0' + h
          }
          let m = `${date.getMinutes()}`
          if (m < 10) {
            m = '0' + m
          }
          let s = `${date.getSeconds()}`
          if (s < 10) {
            s = '0' + s
          }
          this.localsearch.startTime = Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
        }
      }
    }
  }
</script>
