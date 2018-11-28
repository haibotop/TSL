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
    width: 20%;
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
        <BreadcrumbItem>优惠券列表</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="ccContent">
      <div class="ccSearch">
        <Form :label-width="100">
          <div class="ccItem">
            <FormItem label="优惠券名称:">
              <Input placeholder="优惠券名称" width="50" v-model="couponName"></Input>
            </FormItem>
          </div>
          <div class="ccItem">
            <Button class="btnsize" @click="searchCoupon">搜索</Button>
          </div>
        </Form>
      </div>
      <div class="ccHandle">
        <Button class="btnsize" @click="toCreateCoupon">添加</Button>
        <Button class="btnsize" :disabled="deleteIdsBoolean" @click="selectDelete">删除</Button>
      </div>
    </div>
    <div class="ccTable">
      <pTable :pTableCoulmns="ccTable" :pTableData="ccData" :pageParams="pageParams" :tempPro="pTempPro" :refleshPage="handleComponentPageChange"></pTable>
    </div>
    <!-- modal -->
    <Modal v-model="couponDetailBoolean" title="优惠券详细信息" width="600">
      <div ref="pageOne">
        <div style="display: flex" class="cpDetail">
          <div class="" style="flex: 1; width: 32%;word-wrap:break-word;">
            <ul>
              <li>优惠券：{{cpDetailData.name}}</li>
              <li>开始时间：{{cpDetailData.start_date}}</li>
              <li>修改时间：{{cpDetailData.update_date}}</li>
              <li>限领张数：{{cpDetailData.limitGet}}</li>
            </ul>
          </div>
          <div style="flex: 1; width: 32%; word-wrap:break-word;">
            <ul>
              <li>优惠券描述：{{cpDetailData.memo === '' ? '无' : cpDetailData.memo}}</li>
              <li>结束时间：{{cpDetailData.end_date}}</li>
              <li>{{cpDetailData.couponTypeMemo}}</li>
            </ul>
          </div>
          <div style="flex: 1; width: 32%">
            <ul>
              <li>类型：{{cpDetailData.typeName}}</li>
              <li>创建时间：{{cpDetailData.create_date}}</li>
              <li>生成张数：{{cpDetailData.total}}</li>
            </ul>
          </div>
        </div>
        <div style="margin: 5px;font-size: 20px">
          <span>优惠券使用范围</span>
        </div>
      </div>
      <div class="cpRange">
        <table ref="cpTable" v-show="cpType===1">
          <tr>
            <td width="100">货品图片</td>
            <td width="250">SKU编码</td>
            <td width="250">货品名称</td>
          </tr>
          <tr v-for="item in cpDetailData.productCateInfo">
            <td width="100"><img :src="item.picUrl" alt="货品图片" class="tdImg"></td>
            <td width="250">{{item.barCode}}</td>
            <td width="250" >{{item.name}}</td>
          </tr>
        </table>
        <table ref="cpTable" v-show="cpType===2">
          <tr>
            <td width="300">分类编码</td>
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
    <Modal v-model="couponListBoolean" title="券码列表">
      <Tabs type="card" @on-click="couponTabsCheck">
        <TabPane label="所有券码">
          <cpTableCm :dataList="couponListData"></cpTableCm>
        </TabPane>
        <TabPane label="未领取券码">
          <cpTableCm :dataList="couponListData"></cpTableCm>
        </TabPane>
        <TabPane label="已领取券码">
          <cpTableCm :dataList="couponListData"></cpTableCm>
        </TabPane>
        <TabPane label="已使用券码">
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
    <Modal v-model="couponSendBoolen" title=" " :styles="{top:'20px'}" width="1300" @on-ok="confirmSendCoupon">
      <Form inline style="" :label-width="100" ref="buyerListForm" :model="search_c">
        <FormItem style="width: 24%" label="会员ID：" prop="id">
          <Input v-model="search_c.id"></Input>
        </FormItem>
        <FormItem style="width: 34%" label="所在地区：">
          <FormItem style="width: 150px; margin-right: 2%" prop="province">
            <Select v-model="search_c.province" placeholder="省" @on-change="changeProvince">
              <Option v-for="item in provinceList" :value="item.text" :key="item.value">{{item.text}}</Option>
            </Select>
          </FormItem><!--
      --><FormItem style="width: 130px" prop="city">
          <Select v-model="search_c.city" placeholder="市">
            <Option v-for="item in cityList" :value="item.text" :key="item.value">{{item.text}}</Option>
          </Select>
        </FormItem>
        </FormItem>
        <FormItem style="width: 39%" label="注册时间：">
          <FormItem prop="creatStartDate">
            <DatePicker width="150" format="yyyy-MM-dd HH:mm" placeholder="开始时间" class="my-date" type="datetime" :value="search_c.creatStartDate" @on-change="(val)=>{setTheDate(val,'creatStartDate')}"></DatePicker>
          </FormItem>
          <FormItem prop="creatEndDate">
            <DatePicker width="150" format="yyyy-MM-dd HH:mm" placeholder="结束时间" class="my-date" type="datetime" :value="search_c.creatEndDate" @on-change="(val)=>{setTheDate(val,'creatEndDate')}"></DatePicker>
          </FormItem>
        </FormItem>
        <FormItem style="width: 39%" label="最近购买：">
          <FormItem prop="buyStartDate">
            <DatePicker format="yyyy-MM-dd HH:mm" placeholder="开始时间" class="my-date" type="datetime" :value="search_c.buyStartDate" @on-change="(val)=>{setTheDate(val,'buyStartDate')}"></DatePicker>
          </FormItem>
          <FormItem prop="buyEndDate">
            <DatePicker format="yyyy-MM-dd HH:mm" placeholder="结束时间" class="my-date" type="datetime" :value="search_c.buyEndDate" @on-change="(val)=>{setTheDate(val,'buyEndDate')}"></DatePicker>
          </FormItem>
        </FormItem>
        <FormItem style="width: 39%" label="最近登录：">
          <FormItem prop="loginStartDate">
            <DatePicker format="yyyy-MM-dd HH:mm" placeholder="开始时间" class="my-date" type="datetime" :value="search_c.loginStartDate" @on-change="(val)=>{setTheDate(val,'loginStartDate')}"></DatePicker>
          </FormItem>
          <FormItem prop="loginEndDate">
            <DatePicker format="yyyy-MM-dd HH:mm" placeholder="结束时间" class="my-date" type="datetime" :value="search_c.loginEndDate" @on-change="(val)=>{setTheDate(val,'loginEndDate')}"></DatePicker>
          </FormItem>
        </FormItem>
        <FormItem label="会员类型：">
          <i-select v-model="search_c.memberType" placeholder="请选择会员类型" :transfer="true">
            <i-option v-for="item in memberDecription" :value="item.value" :key="item.decription">{{item.decription}}</i-option>
          </i-select>
        </FormItem>
        <FormItem style="width: 24%" label="会员手机：" prop="mobile">
          <Input v-model="search_c.mobile"></Input>
        </FormItem>
        <div style="margin: 10px;">
          <Button @click="vipInfoSearch" style="width: 100px;">查询</Button>
          <Button @click="vipInfoReset" style="margin-left:50px;width: 100px;">重置</Button>
        </div>
      </Form>
      <pTable :pTableBorder="true" class="modal-pTable" :pTableCoulmns="vipClms" :pTableData="vipData" :pageParams="vipParams" :tempPro="vipTempPro" :refleshPage="handleVipComponentPageChange"></pTable>
      <div slot="footer">
        <Button type="primary" @click="confirmSendCoupon">确认</Button>
        <Button @click="couponSendBoolen=false">取消</Button>
      </div>
      <Loading :isload="loading" class="pop-loading"></Loading>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as mkAPI from '../../services/marketing.es6'
  import pTable from '../../components/pTable.vue'
  import cpTableCm from '../../components/couponTable.vue'
  import cityData from '../../libs/cityData.js'
  import Loading from '../../components/loading.vue'
  export default {
    name: 'couponList',
    components: {
      pTable,
      cpTableCm,
      Loading
    },
    data () {
      return {
        couponName: '',
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
            title: '优惠券名称',
            align: 'center',
            width: 150
          },
          {
            key: 'cptype',
            title: '类型',
            align: 'center',
            width: 100,
            render: (h, params) => {
              let cpTypeName = ''
              if (params.row.rules === 1) {
                cpTypeName = '满减优惠'
              } else if (params.row.rules === 2) {
                cpTypeName = '直降优惠'
              }
              return h('div', cpTypeName)
            }
          },
          {
            key: 'limitGet',
            title: '每人可领张数',
            align: 'center',
            width: 90
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
                      // 券码列表modal
                      this.couponListBoolean = true
                      this.clRow = params.row
                      this.checkAllCoupons()
                    }
                  }
                }, '查看券码'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      // sit
                     window.location.href = `/platform/om/OperationManagement/v1/ExportCouponCoding?couponId=${params.row.id}`
                      // uat
                      // window.location.href = `/platform/om/OperationManagement/v1/ExportCouponCoding?couponId=${params.row.id}`
                    }
                  }
                }, '导出券码'),
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
                            self.deleteByCouponId(params.row.id, () => {
                              self.$Message.success({content: '操作成功'})
                              self.handleCouponList()
                            })
                          }, 500)
                        }
                      })
                    }
                  }
                }, '删除'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      // 派券modal
                      this.couponSendBoolen = true
                      this.vipRow = params.row
                      console.log(this.vipRow)
                    }
                  }
                }, '派券')
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
        // 派券
        vipClms: [
          {
            type: 'selection',
            align: 'center',
            width: 80
          },
          {
            title: '会员ID',
            key: 'id',
            width: 180
          },
          {
            title: '会员手机',
            key: 'mobile',
            width: 130
          },
          {
            title: '昵称',
            key: 'nickName',
            width: 140
          },
          {
            title: '注册时间',
            key: 'createDate',
            width: 210
          },
          {
            title: '省份',
            key: 'province',
            width: 100
          },
          {
            title: '城市',
            key: 'city',
            width: 100
          },
          {
            title: '最近登录时间',
            key: 'loginDate',
            width: 210
          },
          {
            title: '购物时间',
            key: 'buyDate',
            width: 210
          }
        ],
        vipData: [],
        vipTempPro: [],
        vipCheckedLength: 0,
        vipRow: {},
        provinceList: cityData,
        cityList: null,
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
        couponSendBoolen: false,
        deleteIdsBoolean: true,
        // 加载
        loading: false
      }
    },
    mounted () {
      this.handleCouponList()
    },
    methods: {
      /* -----------接口调用----------- */
      // 获取优惠券列表
      getCouponByName (params, callback) {
        // 查所有
        if (!params.name) {
          params.name = 'name'
        }
        this.$http.get(mkAPI.getCouponByName(params.name, params.pageSize, params.pageNum))
            .then((res) => {
              if (res.data.code === 200) {
                if (typeof callback === 'function') {
                  callback(res.data)
                }
              }
            })
      },
      // 获取优惠券详情
      getCouponById (couponId, callback) {
        this.$http.get(mkAPI.getCouponById(couponId))
            .then((res) => {
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
      // 获取全部券码
      getCouponCoding (params, callback) {
        this.$http.get(mkAPI.getCouponCoding(params.couponId, params.pageSize, params.pageNum))
          .then((res) => {
            if (res.data.code === 200) {
              if (typeof callback === 'function') {
                callback(res)
              }
            }
          })
      },
      // 查询已领取券码
      getCouponCodingGet (params, callback) {
        this.$http.get(mkAPI.getCouponCodingGet(params.couponId, params.pageSize, params.pageNum))
          .then((res) => {
            if (res.data.code === 200) {
              if (typeof callback === 'function') {
                callback(res)
              }
            }
          })
      },
      // 查询未领取券码
      getCouponCodingNotGet (params, callback) {
        this.$http.get(mkAPI.getCouponCodingNotGet(params.couponId, params.pageSize, params.pageNum))
          .then((res) => {
            if (res.data.code === 200) {
              if (typeof callback === 'function') {
                callback(res)
              }
            }
          })
      },
      // 查询已使用券码
      getCouponCodingUse (params, callback) {
        this.$http.get(mkAPI.getCouponCodingUse(params.couponId, params.pageSize, params.pageNum))
          .then((res) => {
            if (res.data.code === 200) {
              if (typeof callback === 'function') {
                callback(res)
              }
            }
          })
      },
      // 删除单个优惠券
      deleteByCouponId (id, callback) {
        this.$http.delete(mkAPI.deleteByCouponId(id))
          .then((res) => {
            if (res.data.code === 200) {
              if (typeof callback === 'function') {
                callback(res)
              }
            }
          })
      },
      // 批量删除优惠券
      deleteByCouponIdArr (ids, callback) {
        this.$http.post(...mkAPI.deleteByCouponIds(ids))
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
        this.getCouponByName(this.pageParams, (d) => {
          let cpInfo = d.couponInfo
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
          params.couponIds.push({
            productsIds: p
          })
        }
        console.log(params)
        this.$Modal.confirm({
          content: `是否删除${this.pTempPro.length}条记录`,
          onOk: () => {
            let self = this
            setTimeout(() => {
              self.deleteByCouponIdArr(params, () => {
                self.handleCouponList()
                // reset 缓存数组
                self.pTempPro = []
              })
            }, 500)
          }
        })
      },
      /* --------添加优惠券------------ */
      toCreateCoupon () {
        this.$router.push({path: 'createCoupon'})
      },
      /* --------查看详情功能---------- */
      getCouponDetail (params) {
        // (请求优惠券详情)
        console.log('参数',params)
        this.getCouponById(params.row.id, (res) => {
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
          console.log('这个参数',this.dtParams)
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
        dtData.typeName = dtData.rules === 1 ? '满减优惠' : '直降优惠'
        console.log(dtData)
        // 分转元
        dtData.couponTypeMemo = dtData.fullSubtract === null ? `立减${this.$tool.handlePrice(dtData.subtract)}元` : `满${this.$tool.handlePrice(dtData.fullSubtract)}减${this.$tool.handlePrice(dtData.subtract)}`
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
      checkAllCoupons () {
        let params = {
          couponId: this.clRow.id,
          pageSize: this.clParams.pageSize,
          pageNum: this.clParams.pageNum
        }
        this.getCouponCoding(params, (res) => {
          this.handleListData(res)
        })
      },
      checkUnreceivedCoupons () {
        let params = {
          couponId: this.clRow.id,
          pageSize: this.clParams.pageSize,
          pageNum: this.clParams.pageNum
        }
        this.getCouponCodingNotGet(params, (res) => {
          this.handleListData(res)
        })
      },
      checkReceiveCoupons () {
        let params = {
          couponId: this.clRow.id,
          pageSize: this.clParams.pageSize,
          pageNum: this.clParams.pageNum
        }
        this.getCouponCodingGet(params, (res) => {
          this.handleListData(res)
        })
      },
      checkUsedCoupons () {
        let params = {
          couponId: this.clRow.id,
          pageSize: this.clParams.pageSize,
          pageNum: this.clParams.pageNum
        }
        this.getCouponCodingUse(params, (res) => {
          this.handleListData(res)
        })
      },
      clpageChange (clnum) {
        console.log(clnum)
        this.clParams.pageNum = clnum
        console.log(this.couponLabel)
        switch (this.couponLabel) {
          case 0: {
            this.checkAllCoupons()
            break
          }
          case 1: {
            this.checkUnreceivedCoupons()
            break
          }
          case 2: {
            this.checkReceiveCoupons()
            break
          }
          case 3: {
            this.checkUsedCoupons()
            break
          }
        }
      },
      handleListData (res) {
        for (let r of res.data.productName.list) {
          switch (r.status) {
            case 0: {
              r.statusName = '未领取'
              break
            }
            case 1: {
              r.statusName = '已领取'
              break
            }
            case 2: {
              r.statusName = '已使用'
              break
            }
          }
        }
        this.couponListData = res.data.productName.list
        this.clParams.pageSize = res.data.productName.pageSize
        if (res.data.productName.pageNum === 0) {
          this.clParams.pageNum = 1
        } else {
          this.clParams.pageNum = res.data.productName.pageNum
        }
        this.clParams.pageTotal = res.data.productName.total
        console.log(this.couponListData)
      },
      // 渲染列表
      /* -----------派券功能----------- */
      // 列表搜索功能
      searchCoupon () {
        this.pageParams.name = this.couponName
        this.handleCouponList()
      },
      // 派券 会员信息搜索功能
      formValid: function () {
        if (new Date(this.search_c.creatStartDate) > new Date(this.search_c.creatEndDate)) {
          this.$Message.warning('创建时间结束时间不能小于开始时间')
          return false
        }
        if (new Date(this.search_c.buyStartDate) > new Date(this.search_c.buyEndDate)) {
          this.$Message.warning('最近购买结束时间不能小于开始时间')
          return false
        }
        if (new Date(this.search_c.loginStartDate) > new Date(this.search_c.loginEndDate)) {
          this.$Message.warning('最近登录结束时间不能小于开始时间')
          return false
        }
        return true
      },
      // 日期处理
      setTheDate: function (val, tp) {
        this.search_c[tp] = val
      },
      // 派券列表查询
      vipInfoSearch (callback) {
        const self = this
        if (this.formValid() === false) {
          return
        }
        const params = {
          'buyEndDate': self.search_c.buyEndDate,
          'buyStartDate': self.search_c.buyStartDate,
          'city': self.search_c.city,
          'creatEndDate': self.search_c.creatEndDate,
          'creatStartDate': self.search_c.creatStartDate,
          'id': self.search_c.id,
          'loginEndDate': self.search_c.loginEndDate,
          'loginStartDate': self.search_c.loginStartDate,
          'mobile': self.search_c.mobile,
          'memberType': self.search_c.memberType,
          'couponId': self.vipRow.id, // 根据couponId获取对应coupon会员状态
          'pageNum': self.vipParams.pageNum,
          'pageSize': self.vipParams.pageSize,
          'province': self.search_c.province === '-请选择-' ? '' : self.search_c.province
        }
        console.log(params)
        this.postSendCoupons(params, (res) => {
          if (typeof callback === 'function') {
            callback(res)
          }
          this.vipCheckedCoupon(res)
          this.vipData = res.data.sendCouponInfos.list
          this.vipParams.pageNum = res.data.sendCouponInfos.pageNum
          this.vipParams.pageTotal = res.data.sendCouponInfos.total
          this.loading = false
        })
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
      // 派券 子组件pageChange 复选操作
      handleVipComponentPageChange () {
        this.loading = true
        this.vipInfoSearch((res) => {
          for (let t of this.vipTempPro) {
            for (let l of res.data.sendCouponInfos.list) {
              if (t === l.id) {
                l._checked = true
                break
              }
            }
          }
        })
      },
      // 派券
      confirmSendCoupon () {
        console.log('vipRow', this.vipRow)
        // 当前选择项
        console.log(this.vipTempPro.length)
        if (this.vipTempPro.length === 0) {
          this.$Message.warning({content: '请选择需要派券的会员'})
          return
        }
        let memberIds = []
        for (let v of this.vipTempPro) {
          memberIds.push(v)
        }
        console.log(memberIds)
        this.loading = true
        this.getCouponCount(this.vipRow.id, (res) => {
          if (this.vipTempPro.length > res.data.couponCount) {
            this.$Modal.warning({content: `券码数量还支持派券${res.data.couponCount}人，超出派券人数，请重新派券`})
            this.couponSendBoolen = false
          } else {
            this.postSaveCouponUser(this.vipRow.id, memberIds, (res) => {
              console.log(res)
              this.$Message.success({content: res.data.message})
              this.couponSendBoolen = false
            })
          }
        })
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
      couponSendBoolen: function () {
        if (this.couponSendBoolen) {
          this.loading = true
          this.vipInfoSearch()
        } else {
          // reset Info
          this.vipTempPro = []
          this.vipParams = {
            pageSize: 20,
            pageNum: 1,
            pageTotal: 0
          }
          this.vipCheckedLength = 0
          this.loading = false
        }
      },
      couponListBoolean: function () {
        if (this.couponListBoolean) {
          console.log(111)
        }
      },
      couponLabel: function () {
        switch (this.couponLabel) {
          case 0: {
            this.checkAllCoupons()
            break
          }
          case 1: {
            this.checkUnreceivedCoupons()
            break
          }
          case 2: {
            this.checkReceiveCoupons()
            break
          }
          case 3: {
            this.checkUsedCoupons()
            break
          }
        }
      }
    }
  }
</script>




