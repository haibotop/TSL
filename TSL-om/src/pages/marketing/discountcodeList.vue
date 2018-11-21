<style lang="scss" rel="stylesheet/scss" scoped>
  #couponList {
    min-width: 1000px;
  }
  .my-breadcrumb {
    margin: 0px 10px;
  }
  .ccContent {
    margin:20px;
  }
  .ccItem {
    display: inline-block;
    width: 27%;
  }
  .ccItemNew {
    margin:0 20px 20px;
    text-align: right;
  }
  .ccHandle{
    width: 30%;
  }
  .btnsize{
    margin: 0px 5px;
    width: 80px;
  }
  .ccTable{
    width: 95%;
    margin: 0 auto;
  }
  .cpRange {
    table {
      border-collapse :collapse;
    }
    table tr td {
      text-align: center;
      border: 1px solid black;
    }
  }
  .tdImg {
    width: 60px;
    height: 40px;
    margin: 2px;
    vertical-align: middle;
  }
</style>
<style>
  .ccTable #pTable .page-class {
    margin:10px;
    text-align: center;
  }
  .modal-pTable .page-class {
    position: absolute;
    bottom: 10px;
  }
</style>
<template>
  <div id="couponList">
    <div class="ccTitle">
      <Breadcrumb class="my-breadcrumb">
        <BreadcrumbItem>营销管理</BreadcrumbItem>
        <BreadcrumbItem>折扣码列表</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="ccContent">
      <div class="ccSearch">
        <Form :label-width="140">
          <div class="ccItem">
            <FormItem label="折扣码活动名称：">
              <Input placeholder="折扣码活动名称" style="width: 150px" v-model="name"></Input>
            </FormItem>
          </div>
          <div class="ccItem">
            <Button class="btnsize" @click="searchCoupon">搜索</Button>
          </div>
        </Form>
      </div>
      <div class="ccHandle">
        <!-- <Button class="btnsize" @click="toCreateCoupon">添加</Button> -->
        <Button class="btnsize" style="width:120px" @click="handleDown">下载折扣码模板</Button>
        <Button class="btnsize" :disabled="deleteIdsBoolean" @click="selectDelete">删除</Button>
      </div>
    </div>
    <div class="ccTable">
      <pTable :pTableCoulmns="ccTable" :pTableData="ccData" :pageParams="pageParams" :tempPro="pTempPro" :refleshPage="handleComponentPageChange"></pTable>
    </div>
    <!-- modal -->
    <Modal v-model="couponDetailBoolean" title="折扣码活动详细信息" width="600">
      <div ref="pageOne">
        <div style="display: flex" class="cpDetail">
          <div class="" style="flex: 1; width: 32%;word-wrap:break-word;">
            <ul>
              <li>折扣码活动名称{{cpDetailData.name}}</li>
              <li>开始时间：{{cpDetailData.startDate}}</li>
              <li>修改时间：{{cpDetailData.updateDate}}</li>
            </ul>
          </div>
          <div style="flex: 1; width: 32%; word-wrap:break-word;">
            <ul>
              <li>折扣码活动描述：{{cpDetailData.memo === '' ? '无' : cpDetailData.memo}}</li>
              <li>结束时间：{{cpDetailData.endDate}}</li>
              <li>满{{cpDetailData.minExpense}}减{{cpDetailData.discountAmount}}</li>
            </ul>
          </div>
          <div style="flex: 1; width: 32%">
            <ul>
              <li>类型：{{cpDetailData.typeName}}</li>
              <li>创建时间：{{cpDetailData.createDate}}</li>
              <li>折扣码可使用次数：{{cpDetailData.circleTimes}}</li>
            </ul>
          </div>
        </div>
        <div style="margin: 5px;font-size: 20px">
          <span>折扣码使用范围</span>
        </div>
      </div>
      <div class="cpRange">
        <table ref="cpTable" v-show="cpType===1">
          <tr>
            <td width="250">类目编码</td>
            <td width="250">分类名称</td>
          </tr>
          <tr v-for="item in cpDetailData.productCateInfo">
            <td width="250">{{item.barCode}}</td>
            <td width="250" >{{item.name}}</td>
          </tr>
        </table>
        <table ref="cpTable" v-show="cpType===2">
          <tr>
            <td width="300">类目编码</td>
            <td width="300">分类名称</td>
          </tr>
          <tr v-for="item in cpDetailData.productCateInfo">
            <td width="300">{{item.id}}</td>
            <td width="300">{{item.cateName}}</td>
          </tr>
        </table>
        <Page :current="dtParams.pageNum" :total="dtParams.pageTotal" :page-size="dtParams.pageSize"
              @on-change="dtpageChange" show-total></Page>
      </div>
      <div slot="footer">
        <Button type="primary" @click="couponDetailBoolean=false">确认</Button>
        <Button @click="couponDetailBoolean=false">取消</Button>
      </div>
    </Modal>
    <Modal v-model="couponListBoolean" title="券码列表" width="800">
      <div class="ccSearch">
        <Form :label-width="120">
          <div class="ccItem">
            <FormItem label="折扣码：">
              <Input placeholder="折扣码" v-model="couponTabsData.discountCode"></Input>
            </FormItem>
          </div>
          <div class="ccItem">
            <FormItem label="员工编号：">
              <Input placeholder="员工编号" v-model="couponTabsData.operator"></Input>
            </FormItem>
          </div>
          <div class="ccItem">
            <FormItem label="订单编号：">
              <Input placeholder="订单编号"  v-model="couponTabsData.consumeOrder"></Input>
            </FormItem>
          </div>
          <div class="ccItemNew">
            <Button class="btnsize" @click="handdleCouponTabSearch">查询</Button>
            <Button class="btnsize" @click="handdleCouponTabReset">重置</Button>
          </div>
        </Form>
      </div>
      <Tabs type="card" @on-click="couponTabsCheck">
        <TabPane label="未兑换折扣码">
          <cpTableCm :dataList="couponListData"></cpTableCm>
        </TabPane>
        <TabPane label="已兑换折扣码">
          <cpTableCm :dataList="couponListData"></cpTableCm>
        </TabPane>
        <TabPane label="已使用折扣码">
          <cpTableCm :dataList="couponListData"></cpTableCm>
        </TabPane>
        <TabPane label="全部折扣码">
          <cpTableCm :dataList="couponListData"></cpTableCm>
        </TabPane>
      </Tabs>
      <Page :current="clParams.pageNum" :total="clParams.pageTotal" :page-size="clParams.pageSize"
            @on-change="clpageChange" show-total></Page>
      <div slot="footer">
        <Button type="primary" @click="couponListBoolean=false">确认</Button>
        <Button @click="couponListBoolean=false">取消</Button>
      </div>
    </Modal>
    <Modal v-model="ProsConfirmFlag" width="960" title="产品信息确认">
      <Table :columns="ProsConfirmColumns" :data="ProsConfirmData"></Table>
      <div slot="footer">
        <Button type="primary" @click="postImportData">确定</Button>
        <Button type="ghost" @click="ProsConfirmFlag = false">取消</Button>
      </div>
    </Modal>
    <input v-show="false" ref="importDraftExcel" type="file" @change="importfxx(this)"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
    <iframe style="display:none;" ref="excelTem" id="excelTem" name="excelTem"></iframe>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as mkAPI from '../../services/marketing.es6'
  import * as config from '../../services/config.es6'
  import pTable from '../../components/pTable.vue'
  import cpTableCm from '../../components/discountcodeTable.vue'
  import cityData from '../../libs/cityData.js'
  import Loading from '../../components/loading.vue'
  import * as tool from '../../services/tool.es6'
  export default {
    name: 'couponList',
    components: {
      pTable,
      cpTableCm,
      Loading
    },
    data () {
      return {
        name: '',
        cpDetailData: {},
        pTempPro: [],
        ccTable: [
          {
            type: 'selection',
            align: 'center',
            width: 80
          },
          {
            key: 'name',
            title: '折扣码活动名称',
            align: 'center',
            width: 150
          },
          {
            key: 'type',
            title: '类型',
            align: 'center',
            width: 100,
            render: (h, params) => {
              let cpTypeName = ''
              if (params.row.rule === 1) {
                cpTypeName = '满减优惠'
              } else if (params.row.rule === 2) {
                cpTypeName = '直降优惠'
              } else if (params.row.rule === 3) {
                cpTypeName = '满件折优惠'
              }
              return h('div', cpTypeName)
            }
          },
          {
            key: 'circleTimes',
            // title: '每人可领张数',
            title: '折扣码可使用次数',
            align: 'center',
            width: 100
          },
          {
            key: 'startDate',
            title: '开始时间',
            width: 200,
            align: 'center'
          },
          {
            key: 'endDate',
            title: '结束时间',
            width: 200,
            align: 'center'
          },
          {
            title: '操作',
            align: 'center',
            width: 320,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      // 查看详情modal
                      this.couponDetailBoolean = true
                      this.getCouponDetail(params)
                    }
                  }
                }, '查看详情'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      // 导入折扣码
                      this.clRow = params.row
                      this.importDraftData()
                    }
                  }
                }, '导入折扣码'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      // 券码列表modal
                      this.couponListBoolean = true
                      this.clRow = params.row
                      this.checkAllCoupons(0)
                    }
                  }
                }, '查看折扣码'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        content: '是否删除这条记录',
                        onOk: () => {
                          let self = this
                          setTimeout(() => {
                            self.delByDiscountIds({couponIds:[params.row.id]}, () => {
                              self.$Message.success({content: '操作成功'})
                              self.handleCouponList()
                            })
                          }, 500)
                        }
                      })
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        ccData: [],
        cpType: 0,
        // 券码
        couponLabel: '',
        clRow: {},
        couponListData: [],
        vipData: [],
        vipTempPro: [],
        vipCheckedLength: 0,
        vipRow: {},
        provinceList: cityData,
        cityList: null,
        ProsLoading: false,
        ProsConfirmFlag: false,
        ProsConfirmData: [],
        ProsConfirmColumns: [
          {key: 'discountCode', title: '折扣码'},
          {key: 'operator', title: '系统员工编号'}
        ],
        couponTabsData: {
          discountCode: '',
          operator: '',
          consumeOrder: ''
        },
        memberDecription: [
          {
            value: 0,
            decription: '双籍会员'
          },
          {
            value: 1,
            decription: '普通会员'
          }
        ],
        // 分页
        pageParams: {
          pageSize: 20,
          pageNum: 1,
          pageTotal: 0
        },
        dtParams: {
          pageSize: 10,
          pageNum: 1,
          pageTotal: 0
        },
        clParams: {
          pageSize: 10,
          pageNum: 1,
          pageTotal: 0
        },
        vipParams: {
          pageSize: 20,
          pageNum: 1,
          pageTotal: 0
        },
        // 搜索条件
        search_c: {
          buyEndDate: '',
          buyStartDate: '',
          city: '',
          creatEndDate: '',
          creatStartDate: '',
          id: '',
          memberType: '',
          loginEndDate: '',
          loginStartDate: '',
          mobile: '',
          province: ''
        },
        couponDetailBoolean: false,
        couponListBoolean: false,
        deleteIdsBoolean: true,
        // 加载
        loading: false
      }
    },
    mounted () {
      this.handleCouponList()
      this.$refs.importDraftExcel.addEventListener('click', this.handlefileclear, false)
    },
    beforeDestroy: function () {
      this.$refs.importDraftExcel.removeEventListener('click', this.handlefileclear, false)
    },
    methods: {
      /* -----------接口调用----------- */
      // 获取列表
      discountCodeList (params, callback) {
        // 查所有
        if (!params.name) {
          params.name = ''
        }
        this.$http.post(...mkAPI.discountCodeList({name: params.name}, params.pageSize, params.pageNum)).then((res) => {
          if (res.data.code === 200) {
            if (typeof callback === 'function') {
              callback(res.data)
            }
          }
        })
      },
      // 查看活动码折扣详情
      discountCodeLists (couponId, callback) {
        this.$http.post(...mkAPI.discountCodeLists(couponId)).then((res) => {
          if (typeof callback === 'function') {
            callback(res)
          }
        })
      },
      // 根据类目优惠券获取类目商品Id
      productSkuCidsInfo (params, callback) {
        this.$http.post(...mkAPI.productSkuCidsInfo(params.arr, params.pageNum, params.pageSize))
          .then((res) => {
            if (res.data.code === 200) {
              if (typeof callback === 'function') {
                callback(res)
              }
            }
          })
      },
      // 根据单品优惠券获取类目商品Id
      productSkuPidsInfo (params, callback) {
        this.$http.post(...mkAPI.productSkuPidsInfo(params.arr, params.pageNum, params.pageSize))
          .then((res) => {
            if (res.data.code === 200) {
              if (typeof callback === 'function') {
                callback(res)
              }
            }
          })
      },
      // 根据获取类目商品Id查询对应类目名称
      getCatalogs (callback) {
        this.$http.get(mkAPI.getCatalogs())
            .then((res) => {
              if (res.data.code === 200) {
                if (typeof callback === 'function') {
                  callback(res)
                }
              }
            })
      },
      // 查看活动码折扣使用情况列表
      dCodeByConditionsLists (params, callback) {
        console.log(params.setObj)
        this.$http.post(...mkAPI.dCodeByConditionsLists(params.setObj, params.pageSize, params.pageNum))
          .then((res) => {
            if (res.data.code === 200) {
              if (typeof callback === 'function') {
                callback(res)
              }
            }
          })
      },
      // 根据ID删除折扣码。
      delByDiscountIds (id, callback) {
        this.$http.post(...mkAPI.delByDiscountIds(id))
          .then((res) => {
            if (res.data.code === 200) {
              if (typeof callback === 'function') {
                callback(res)
              }
            }
          })
      },
      // 获取会员信息
      postSendCoupons (params, callback) {
        this.$http.post(...mkAPI.postSendCoupons(params))
          .then((res) => {
            if (res.data.code === 200) {
              if (typeof callback === 'function') {
                callback(res)
              }
            }
          })
      },
      // 派券接口
      postSaveCouponUser (couponId, ids, callback) {
        this.$http.post(...mkAPI.postSaveCouponUser(couponId, ids))
          .then((res) => {
            if (res.data.code === 200) {
              if (typeof callback === 'function') {
                callback(res)
              }
            }
          })
      },
      // 派券数量限制接口
      getCouponCount (couponId, callback) {
        this.$http.get(mkAPI.couponCount(couponId))
          .then((res) => {
            if (res.data.code === 200) {
              if (typeof callback === 'function') {
                callback(res)
              }
            }
          })
      },
      /* ------------数据处理------------ */
      handleCouponList () {
        this.discountCodeList(this.pageParams, (d) => {
          let cpInfo = d.discountCoderesultStatusListInner
          console.log(cpInfo)
          this.ccData = cpInfo.list
          this.pageParams = {
            pageSize: cpInfo.pageSize,
            pageNum: cpInfo.pageNum === 0 ? 1 : cpInfo.pageNum,
            pageTotal: cpInfo.total
          }
        })
      },
      // 子组件pageChange 复选操作
      handleComponentPageChange () {
        this.handleCouponList((data) => {
          for (let t of this.pTempPro) {
            for (let l of data.couponInfo.list) {
              if (t === l.id) {
                l._checked = true
                break
              }
            }
          }
        })
        console.log(this.pTempPro)
      },
      /* --------批量删除功能---------- */
      selectDelete () {
        let params = {
          couponIds: []
        }
        for (let p of this.pTempPro) {
          params.couponIds.push(p)
        }
        console.log(params)
        this.$Modal.confirm({
          content: `是否删除${this.pTempPro.length}条记录`,
          onOk: () => {
            let self = this
            setTimeout(() => {
              self.delByDiscountIds(params, () => {
                self.handleCouponList()
                // reset 缓存数组
                self.pTempPro = []
              })
            }, 500)
          }
        })
      },
      /* --------下载模板------------ */
      handleDown: function () {
        const params = {
          templateName: '折扣码模板.xlsx',
          fileName: '折扣码模板'
        }
        let formhtml = `<form id="exceTem" target="excelTem" method="get" action="/${config.SERVER_PATH}${mkAPI.excelTem()}">`
        for (let key in params) {
          formhtml += `<input type="hidden" name="${key}" value="${params[key]}" />`
        }
        formhtml += '</form>'
        this.$refs.excelTem.contentWindow.document.getElementsByTagName('body')[0].innerHTML = formhtml
        const formelm = this.$refs.excelTem.contentWindow.document.getElementById('exceTem')
        formelm.submit()
        formelm.parentNode.removeChild(formelm)
      },
      /* --------查看详情功能---------- */
      getCouponDetail (params) {
        // (请求优惠券详情)
        this.discountCodeLists({id:params.row.id}, (res) => {
          let dtData = res.data
          let dtArr = []
          // dtData.type ===1 单品
          if (dtData.type === 1) {
            this.cpType = 1
            if (dtData.productIds.length > 0) {
              for (let p of dtData.productIds) {
                dtArr.push(p.id)
              }
            }
            this.dtParams.arr = dtArr
            this.proSkuIdsInfo(dtData)
            // dtData.type ===2 类目
          } else if (dtData.type === 2) {
            this.cpType = 2
            if (dtData.categoryId.length > 0) {
              for (let p of dtData.categoryId) {
                dtArr.push(p.id)
              }
            }
            console.log(dtArr)
            this.dtParams.arr = dtArr
            this.proSkuCidsInfo(dtData)
          }
        })
      },
      // 单品根据商品ID 查询类目ID 分页!
      proSkuIdsInfo (dtData) {
        // 根据商品ID 查询类目ID (请求商品ID对应的类目ID)
        this.productSkuPidsInfo(this.dtParams, (res) => {
          console.log(res.data.pageInfo)
          // 处理克数
          for (let r of res.data.pageInfo.list) {
            r.name = this.$tool.handleName(r.name)
            r.picUrl = `${r.picUrl}!56`
          }
          // set pageInfo
          this.dtParams.pageNum = res.data.pageInfo.pageNum
          this.dtParams.pageSize = res.data.pageInfo.pageSize
          this.dtParams.pageTotal = res.data.pageInfo.total
          dtData.productCateInfo = res.data.pageInfo.list
          this.reviewCouponDetail(dtData)
        })
      },
      // 类目根据商品ID 查询类目ID (请求商品ID对应的类目ID) 分页!
      proSkuCidsInfo (dtData) {
        this.productSkuCidsInfo(this.dtParams, (res) => {
          let cateArr = []
          for (let r of res.data.pageInfo.list) {
            cateArr.push(r.categoryId)
          }
          // set pageInfo
          this.dtParams.pageNum = res.data.pageInfo.pageNum
          this.dtParams.pageSize = res.data.pageInfo.pageSize
          this.dtParams.pageTotal = res.data.pageInfo.total
          console.log(this.dtParams)
          // 根据类目ID 查询 运营类目名称(请求类目ID对应类目名称)
          this.getCatalogs((res) => {
            // 获取优惠券分类名称
            dtData.productCateInfo = this.handleCateName(cateArr, res.data.operateCategory)
            this.reviewCouponDetail(dtData)
          })
        })
      },
      // 类目ID对应类目名称
      handleCateName (cateIds, category) {
        let cateNameArr = []
        console.log(cateIds)
        for (let id of cateIds) {
          for (let cateL1 of category) {
            if (id === cateL1.id) {
              cateNameArr.push({
                id: id,
                cateName: cateL1.name
              })
              break
            } else {
              if (cateL1.secondCategory.length > 0) {
                for (let cateL2 of cateL1.secondCategory) {
                  if (id === cateL2.id) {
                    cateNameArr.push({
                      id: id,
                      cateName: cateL2.name
                    })
                    break
                  } else {
                    if (cateL2.threeCategory.length > 0) {
                      for (let cateL3 of cateL2.threeCategory) {
                        if (id === cateL3.id) {
                          cateNameArr.push({
                            id: id,
                            cateName: cateL3.name
                          })
                          break
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return cateNameArr
      },
      // 渲染优惠券详情
      reviewCouponDetail (dtData) {
        // 类型
        dtData.typeName = dtData.rule === 1 ? '满减优惠' : '直降优惠'
        console.log(dtData)
        // 分转元
        // dtData.couponTypeMemo = dtData.fullSubtract === null ? `立减${this.$tool.handlePrice(dtData.subtract)}元` : `满${this.$tool.handlePrice(dtData.fullSubtract)}减${this.$tool.handlePrice(dtData.subtract)}`
        this.cpDetailData = dtData
      },
      // 优惠券详情分页
      dtpageChange (dtNum) {
        console.log(dtNum)
        this.dtParams.pageNum = dtNum
        if (this.cpDetailData.type === 1) {
          this.proSkuIdsInfo(this.cpDetailData)
        } else if (this.cpDetailData.type === 2) {
          this.proSkuCidsInfo(this.cpDetailData)
        }
      },
      /* -----------查看券码---------- */
      couponTabsCheck (name) {
        this.couponLabel = name
      },
      checkAllCoupons (status) {
        let params = {
          setObj: {
            status: status == 3 ? '' : Number(status) + 1,
            id: this.clRow.id,
            discountCode: this.couponTabsData.discountCode,
            operator: this.couponTabsData.operator,
            consumeOrder: this.couponTabsData.consumeOrder
          },
          pageSize: this.clParams.pageSize,
          pageNum: this.clParams.pageNum
        }
        this.dCodeByConditionsLists(params, (res) => {
          this.handleListData(res)
        })
      },
      clpageChange (clnum) {
        console.log(clnum)
        this.clParams.pageNum = clnum
        console.log(this.couponLabel)
        this.checkAllCoupons(this.couponLabel)
      },
      handleListData (res) {
        for (let r of res.data.discountCoderesultStatusListInners.list) {
          switch (r.status) {
            case 0: {
              r.statusName = '未兑换'
              break
            }
            case 1: {
              r.statusName = '已兑换'
              break
            }
            case 2: {
              r.statusName = '已使用'
              break
            }
          }
        }
        this.couponListData = res.data.discountCoderesultStatusListInners.list
        this.clParams.pageSize = res.data.discountCoderesultStatusListInners.pageSize
        if (res.data.discountCoderesultStatusListInners.pageNum === 0) {
          this.clParams.pageNum = 1
        } else {
          this.clParams.pageNum = res.data.discountCoderesultStatusListInners.pageNum
        }
        this.clParams.pageTotal = res.data.discountCoderesultStatusListInners.total
        console.log(this.couponListData)
      },
      // 渲染列表
      /* -----------派券功能----------- */
      // 列表搜索功能
      searchCoupon () {
        console.log(this.name)
        this.pageParams.name = this.name
        this.handleCouponList()
      },
      // 日期处理
      setTheDate: function (val, tp) {
        this.search_c[tp] = val
      },
      // 会员派券状态回显
      vipCheckedCoupon (res) {
        for (let r of res.data.sendCouponInfos.list) {
          if (r.status === '1') {
            r._checked = true
            r._disabled = true
          }
        }
      },
      // 重置搜索栏
      vipInfoReset () {
        this.$refs['buyerListForm'].resetFields()
        this.search_c.memberType = ''
      },
      // 省份城市选择
      changeProvince: function (val) {
        for (let i = 0; i < this.provinceList.length; i++) {
          if (this.provinceList[i].text === val) {
            this.cityList = this.provinceList[i].children
            break
          }
        }
      },
      importDraftData: function () {
        this.$refs.importDraftExcel.click()
      },
      importfxx: function (obj) {
        this.ProsLoading = true
        tool.importfxx(obj, (data) => {
          let data_ = []
          for (let i of data) {
            data_.push({
              'discountCode': i['折扣码'],
              'operator': i['系统员工编号']
            })
          }
          this.ProsConfirmData = data_
          this.ProsConfirmFlag = true
          this.ProsLoading = false
        })
      },
      postImportData: function () {
        var setObj = {
          couponIds: this.ProsConfirmData,
          id: this.clRow.id
        }
        this.$http.post(...mkAPI.discountCodeimportListsList(setObj)).then(res => {
          if (res.data.code === 200) {
            var discountCodedata = res.data.discountCodeFailsImporresult
            var msgArry = ''
            if (discountCodedata.length > 0) {
              for (var i = 0; discountCodedata.length > i; i++) {
                msgArry = msgArry + discountCodedata[i].discountCode + ','
              }
              this.$Message.success('折扣码为' + msgArry + '已存在')
            } else {
              this.$Message.success('发布成功')
            }
            this.ProsConfirmFlag = false
          } else {
            this.$Message.success('发布失败')
            this.ProsConfirmFlag = false
          }
        })
      },
      handlefileclear: function (e) {
        e.target.value = ''
      },
      handdleCouponTabReset: function () {
        this.couponTabsData = {
          discountCode: '',
          operator: '',
          consumeOrder: ''
        }
      },
      handdleCouponTabSearch: function () {
        this.clParams.pageNum = 1
        this.checkAllCoupons(this.couponLabel)
      }
    },
    watch: {
      couponDetailBoolean: function () {
        if (!this.couponDetailBoolean) {
          this.dtParams = {
            pageSize: 10,
            pageNum: 1,
            pageTotal: 0
          }
          this.cpDetailData = {}
        }
      },
      pTempPro: function () {
        if (this.pTempPro.length > 0) {
          this.deleteIdsBoolean = false
        } else {
          this.deleteIdsBoolean = true
        }
      },
      couponListBoolean: function () {
        if (this.couponListBoolean) {
          console.log(111)
        }
      },
      couponLabel: function () {
        this.clParams.pageNum = 1
        this.checkAllCoupons(this.couponLabel)
      }
    }
  }
</script>




