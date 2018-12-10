<template>
  <div id="mine">
    <header1></header1>
    <header2></header2>
    <div class="mine-content">
      <v-title :titleTpye="titleTpye"></v-title>
      <div class="mine-left">
        <div class="myBlock" >
          <div :class="headPortrait ? 'myBlock-bg blur' : 'myBlock-bg'" :style="blurStyle"></div>
          <div class="mine-actioin"><span class="pull-left" @click="pwdModal = true">设置</span><span class="pull-right" @click="logout">退出登录</span></div>
          <div class="head-portrait"><img :src="headPortrait" alt=""></div>
          <div class="base-info">
            <div v-if="isSessionStorage">
              <div>
                <p class="gender-img" v-if="userGender == 1"><img src="../../assets/icons/icon_female.png" alt=""></p>
                <p class="gender-img" v-if="userGender == 0"><img src="../../assets/icons/icon_male.png" alt=""></p>
                <p class="nickname">{{ nickName}}</p>
                <p class="edit-icon" @click="baseInfoModel = true"><img src="../../assets/icons/icon_edit.png" alt=""></p>
              </div>
              <p class="tsl-member">TSL会员</p>
              
            </div>
            <div v-else><router-link to="/signin">登录</router-link></div>
          </div>
        </div>
        <Row class="myitems">
          <Col span="6"><router-link tag="a" to="/myCollection" >我的收藏 <p> {{colletionNum}}</p></router-link></Col>
          <Col span="6"><router-link tag="a" to="/shoppingCart">我的购物袋 <p> {{bagNum}} </p></router-link></Col>
          <Col span="6"><router-link tag="a" to="/myCoupons">我的优惠券 <p> {{couponNum}} </p></router-link></Col>
          <Col span="6"><router-link tag="a" to="/myDiscountCard">我的折扣码 <p> {{discountCardNum}}</p></router-link></Col>
        </Row>
      </div>
      <div class="mine-right">
        <div class="myOrder" @click="goOrders(0)"><span style="vertical-align: middle;">查看全部订单</span> <Icon type="ios-arrow-forward" /></div>
        <div class="order-status-tab clearfix">
          <div @click="goOrders(1)">
              <span>{{unpayOrderNum}}</span>
              <img src="../../assets/icons/odr_pay.png" style="display:block;margin:5px auto;width:50px;" alt="" >
              <p>待付款 </p>
          </div>
          <div @click="goOrders(2)">
              <span>{{pendingDeliveryNum}}</span>
              <img src="../../assets/icons/odr_process.png" style="display:block;margin:5px auto;width:50px;" alt="" >
              <p>待发货</p>
          </div>
          <div @click="goOrders(3)">
              <span>{{pendingReceiveNum}}</span>
              <img src="../../assets/icons/odr_transfer.png" style="display:block;margin:5px auto;width:50px;" alt="" >
              <p>待收货</p>
          </div>
          <div @click="goOrders(4)">
              <span>{{finishedNum}}</span>
              <img src="../../assets/icons/odr_done.png" style="display:block;margin:5px auto;width:50px;" alt="" >
              <p>已完成 </p>
          </div>
          <div @click="goOrders(-1)">
              <span>{{asOrderNum}}</span>
              <img src="../../assets/icons/odr_repair.png" style="display:block;margin:5px auto;width:50px;" alt="" >
              <p>售后</p>
          </div>
        </div>
        <div class="myicons">
          <div onclick="qimoChatClick()">
            <img src="../../assets/icons/odr_call.png" style="display:block;margin:5px auto;width:50px;" alt="" >
            <span>联系客服</span> 
          </div>
          <div>
            <router-link to="/address">
              <img src="../../assets/icons/odr_repair.png" style="display:block;margin:5px auto;width:50px;" alt="" >
              <span>我的收货地址</span> 
            </router-link>
            
          </div>
        </div>

      </div>

     
      
    </div>
    <!-- 修改个人信息 -->
    <Modal v-model="baseInfoModel" footerHide class="baseinfo-modal" :z-index="400" :mask-closable="false">
      <p solt="header" style="font-size: 24px;color: #352665;text-align: left;margin-left: 30px;">修改个人信息</p>
      <Form ref="baseInfoFormItem" :model="baseInfoFormItem" :label-width="80" class="edit-form">
        <Row>
          <Col span="6">
            <div class="head-cell-box" @click="uploadImg">
              <div class="head-portrait"><img :src="headPortrait" alt=""></div>
              <div class="avatar-btn">上传头像</div>
            </div>  
          </Col>
          <Col span="18">
            <FormItem label="昵称">
                <Input v-model="baseInfoFormItem.nickName" :maxlength="25" ></Input>
            </FormItem>
            <FormItem label="性别">
                <Select v-model="baseInfoFormItem.gender" style="width:130px">
                  <Option value="0">男</Option>
                  <Option value="1">女</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div  style="margin: 30px 0; text-align: center;" >
          <Button @click="baseInfoModel = false" style="margin-right: 30px; width: 200px;height: 50px;font-size: 16px;">返回</Button>
          <Button @click.native="saveBothData" :disabled="isLoad" style="width: 200px;height: 50px;font-size: 16px; background-color: #352665;color: #fff;">保存</Button>
      </div>
    </Modal>

    <!-- 设置 -->
    <Modal v-model="pwdModal" footerHide class="baseinfo-modal" :z-index="400" :mask-closable="false">
      <p solt="header" style="font-size: 24px;color: #352665;text-align: left;margin-left: 30px;">设置</p>
      <Form ref="pwdItem" :model="pwdItem" :label-width="80" class="edit-form">
        <FormItem label="当前密码">
            <Input v-model="pwdItem.currPwd" placeholder="请输入当前密码" type="password"></Input>
        </FormItem>
        <FormItem label="新密码">
            <Input v-model="pwdItem.newPwd" placeholder="请输入6-16位密码" type="password"></Input>
        </FormItem>
        <FormItem label="确认密码">
            <Input v-model="pwdItem.confNewPwd" placeholder="请输入6-16位密码" type="password"></Input>
        </FormItem>
        <FormItem label="绑定手机">
            <Input v-model="mobile" placeholder="15622793181" disabled></Input>
        </FormItem>
          
        </Row>
      </Form>
      <div  style="margin: 30px 0; text-align: center;" >
          <Button @click="pwdModal = false" style="margin-right: 30px; width: 200px;height: 50px;font-size: 16px;">返回</Button>
          <Button @click.native="updatePw" :disabled="isLoad" style="width: 200px;height: 50px;font-size: 16px; background-color: #352665;color: #fff;">确认修改</Button>
      </div>
    </Modal>
    <div v-transfer-dom class="myInfo-div">
      <popup v-model="show" position="top" :hide-on-blur="false">
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
            <x-button class="custom-btn" mini @click.native="updateAvatar">确定</x-button>
            <x-button class="custom-btn" mini @click.native="myCroppa.remove()">重选</x-button>
            <x-button class="custom-btn" mini @click.native="show = false">取消</x-button>
          </div>
        </div>
      </popup>
    </div>
    <v-footer></v-footer>
    <loading :scope="false" v-if="isLoad"></loading>
    <!-- <group gutter="10px">
      <cell title="客服" is-link>
        <div slot="icon"><img src="../../assets/icons/servicers.svg"  style="fill:#352665;margin:0px 5px -6px 0px;"></div>
      </cell>
    </group> -->
    <!-- <subTab :index="2"></subTab> -->
    
  </div>
</template>
<script type="text/ecmascript-6">
import header1 from "../homePages/header1";
import header2 from "../homePages/header2";
import { Group, Cell, Badge, Popup, XButton, TransferDom, debounce, base64 } from "vux";
import * as mkApi from "@/services/API/marketing.es6";
import vTitle from "@/pages/homePages/title.vue";
import vFooter from "@/pages/homePages/footer.vue";
import * as tool from "@/services/myTool.es6";
import axios from "axios";
import * as myAPI from "@/services/API/mineServices.es6";
import * as scAPI from "@/services/API/shoppingCartServices.es6";
import loading from "@/components/loading.vue";
import * as orderAPI from "@/services/API/orderServices.es6";


export default {
  name: "mine",
  directives: { TransferDom },
  components: {
    Group,
    Cell,
    Badge,
    header1,
    header2,
    vTitle,
    Popup,
    XButton,
    debounce,
    loading,
    vFooter
  },
  data() {
    return {
      existCoupons: false,
      isSessionStorage: JSON.parse(sessionStorage.getItem("userInfo")),
      titleTpye: ["首页", "我的"],
      myCroppa: {}, // 头像上传组件
      show: false,
      mobile: "",
      nickName: '',
      userGender: JSON.parse(sessionStorage.getItem("userInfo")).sex, // 0男 1女 2无
      baseInfoModel: false,
      baseInfoFormItem: {
        nickName: JSON.parse(sessionStorage.getItem("userInfo")).nickName === null ? "未命名": JSON.parse(sessionStorage.getItem("userInfo")).nickName,
        gender: this.userGender
      },
      couponNum: 0, // 优惠券数量
      colletionNum: 0, // 收藏夹数量
      bagNum: 0, // 购物袋数量
      isLoad: false,
      unpayOrderNum: 0, // 待付款
      pendingDeliveryNum: 0, // 待发货
      pendingReceiveNum: 0, // 待收货
      finishedNum: 0, // 已完成
      asOrderNum: 0, // 售后
      discountCardNum: 0, // 折扣码
      pwdModal: false,
      pwdItem: {
        currPwd: '',
        newPwd: '',
        confNewPwd: ''
      },
      headPortrait: '' //头像
    };
  },
  mounted() {
    if (sessionStorage.getItem("userInfo")) {
      if (sessionStorage.getItem("userInfo").headPortrait) {
        this.headPortrait = this.isSessionStorage.headPortrait.replace('!56', '!352') || ''
      }
      this.nickName = this.isSessionStorage.nickName === null ? "未命名": this.isSessionStorage.nickName
      if (this.isSessionStorage.sex === 0) {
        this.baseInfoFormItem.gender = "0";
      } else if (this.isSessionStorage.sex === 1) {
        this.baseInfoFormItem.gender = "1";
      } else {
        this.baseInfoFormItem.gender = "0";
      }

      this.mobile = this.isSessionStorage.mobile;
      if (!sessionStorage.getItem("sendCoupons")) {
        this.getMyCoupon(1, 1, 99);
        this.readyTrade()
      }

      // 获取收藏数量
      this.$http
        .get(...myAPI.getProductCollect({ pageNum: 1, pageSize: 1000 }))
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.pageInfo.list) {
              this.colletionNum = res.data.pageInfo.list.length;
            }
          }
        })
        .catch(() => {});

      // 接口-获取购物车数据
      this.$http.get(scAPI.getshoppingCart1()).then(res => {
        if (res.data.code === 200) {
          if (res.data.list && res.data.list.length > 0) {
            this.bagNum = res.data.list[0].productItem.length;
          } else {
            this.bagNum = 0
          }
        }
      });

      this.getOrders(1);
      this.getOrders(2);
      this.getOrders(3);
      this.getOrders(4);
      this.getOrders(0);
      this.getAsOrders();
    }
  },
  computed: {
    bgImg() {
      // return require('../../assets/images/mine-bk.png')
    },
    blurStyle: {
      get() {
        console.log(this.headPortrait);
        if (this.headPortrait) {
          return `background:url(${
            this.headPortrait
          }) no-repeat center;background-size: 200% 200%;`;
        } else {
          return `background-image: url(${this.bgImg});background-size: cover;`;
        }
      }
    }
  },
  watch: {
   
  },
  methods: {
    // availabledDiscountCard () { // 已兑换折扣码
    //   let params = {
    //       status: 1, // 1：已兑换2：已使用3：已失效 ,
    //       userId: JSON.parse(sessionStorage.getItem('userInfo')).memberId
    //     }
    //   this.$http.post(...disAPI.getDiscountList(params))
    //     .then(res => {
    //       if (res.data.couponIds && res.data.couponIds.length > 0) {
    //         this.discountCardNum = res.data.couponIds.length
    //       }
    //     })
    // },
    logout () {
      this.$http.delete(...myAPI.logout())
      sessionStorage.removeItem('userInfo')
      sessionStorage.removeItem('setPw')
      this.$router.push({path: '/home'})
    },
    getOrders(parmas) {
      // 订单
      let params = { status: parmas, pageSize: 1000, pageNum: 1 };
      this.$http.get(...orderAPI.getOrderList(params)).then(res => {
        if (res.data.code === 200) {
          if (parmas === 1) {
            this.unpayOrderNum = res.data.orderItems.list.length; // 待付款
          } else if (parmas === 2) {
            this.pendingDeliveryNum = res.data.orderItems.list.length;  // 待发货
          } else if (parmas === 3) {
            this.pendingReceiveNum = res.data.orderItems.list.length; // 待收货
          } else if (parmas === 4) {
            this.finishedNum = res.data.orderItems.list.length; // 已完成
          }
        }
      }); 
    },
    getAsOrders() {
      // 售后订单
      this.$http
        .get(orderAPI.getAsOrders(1000, 1)) // pageSize, pageNum
        .then(res => {
          if (res.data.code === 200) {
            this.asOrderNum = res.data.afterSaleOrderItems.list.length;
          }
        });
    },
    goSet() {
      this.$router.push({ path: "/mySet" });
    },
    goOrders(status) {
      if (status === -1) {
        this.$router.push({ path: "/asOrders" });
      } else {
        this.$router.push({ path: `/myOrders/${status}` });
      }
    },
    goAsOrders() {
      this.$router.push({ path: `/asOrders` });
    },
    clickNickname() {
      if (sessionStorage.getItem("userInfo")) {
        this.goInfo();
      } else {
        this.$router.push({ path: "/signin" });
      }
    },
    getMyCoupon(status, pageNum, pageSize) {
      this.$http
        .post(mkApi.getMyCoupon(status, pageNum, pageSize))
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.pageInfo) {
              if (res.data.pageInfo.list.length > 0) {
                this.couponNum = res.data.pageInfo.list.length;
                this.existCoupons = true;
              }
            }
          }
        });
    },
      readyTrade () { // 已兑换折扣码
          this.loading = true
          let params = {
              status: 1, // 1：已兑换2：已使用3：已失效 ,
              userId: JSON.parse(sessionStorage.getItem('userInfo')).memberId
          }
          this.$http.post(...mkApi.getDiscountList(params))
              .then(res => {
                  if (res.data.couponIds) {
                      if (res.data.couponIds.length > 0) {
                          this.discountCardNum = res.data.couponIds.length;
                          this.existCoupons = true;
                      }
                  }
                  // console.log('this.readyTradeItem', this.readyTradeItem)
              })
      },
    // --------------------上传头像--------------------
    uploadImg() {
      if (tool.isOnline()) {
        this.show = true;
        // this.$refs.photograph.click()
      } else {
        this.$Modal.error({
          title: '无网络状态',
          content: '无网络状态'
        });
        // this.$vux.toast.show({
        //   type: "text",
        //   text: `无网络状态`,
        //   width: "200px"
        // });
      }
      // this.$refs.camera.click()
    },
    updateAvatar() {
      if (this.myCroppa.hasImage()) {
        this.myCroppa.generateBlob(blob => {
          let fd = new FormData();
          let config = {
            header: { "Content-Type": "multipart/form-data" }
          };
          fd.append("file", blob, "head.jpeg");
          this.$http.post("/resource/uploadImage", fd, config).then(res => {
            console.log(res);
            if (res.data.code === 200) {
              this.$http
                .put(...myAPI.updateHeadPortrait(res.data.data.pic_56))
                .then(response => {
                  if (response.data.code === 200) {
                    this.$Modal.success({
                      title: '修改成功',
                      content: '修改头像成功!'
                    });
                    this.headPortrait = res.data.data.pic_56
                    let userInfo = JSON.parse(
                      sessionStorage.getItem("userInfo")
                    );
                    userInfo.headPortrait = res.data.data.pic_56;
                    sessionStorage.setItem(
                      "userInfo",
                      JSON.stringify(userInfo)
                    );
                    this.myCroppa.remove();
                    this.show = false;
                  } else {
                    // this.$vux.toast.show({
                    //   type: "text",
                    //   text: `修改失败`,
                    //   width: "200px"
                    // });
                    this.$Modal.error({
                      title: '修改失败',
                      content: '修改头像失败！'
                    });
                    this.myCroppa.remove();
                  }
                  // this.$vux.loading.hide();
                });
            }
          });
        });
      }
    },
    updateNickname() {
      return axios.put(...myAPI.updateNickName(this.baseInfoFormItem.nickName));
    },
    updateSex() {
      return axios.put(
        ...myAPI.updateSex({
          sex: parseInt(this.baseInfoFormItem.gender),
          phone: this.mobile
        })
      );
    },
    saveBothData() {
      // res1 = nickname res2= sex;
      if (this.baseInfoFormItem.nickName === "") {
        this.$Message.warning("请输入昵称");
        this.loading = false;
      } else if (this.baseInfoFormItem.nickName.length < 3) {
        this.$Message.warning("昵称限输入3-25个字符");
        this.loading = false;
      } else if (!this.baseInfoFormItem.gender){
        this.$Message.warning("请选择性别");
      } else {
        this.isLoad = true;
        axios
          .all([this.updateNickname(), this.updateSex()]) // res1 = nickname res2= sex;
          .then(
            axios.spread((res1, res2) => {
              this.baseInfoModel = false;
              //两个请求现在都执行完成
              setTimeout(() => {
                this.isLoad = false;
              }, 100);

              let params = JSON.parse(sessionStorage.getItem("userInfo"));
              if (res1.data.code === 200) {
                this.nickName = this.baseInfoFormItem.nickName;
                params.nickName = this.baseInfoFormItem.nickName;
                sessionStorage.setItem("userInfo", JSON.stringify(params));
              }

              if (res2.data.code === 200) {
                this.userGender = parseInt(this.baseInfoFormItem.gender);
                params.sex = parseInt(this.baseInfoFormItem.gender);
                sessionStorage.setItem("userInfo", JSON.stringify(params));
                this.bus.$emit("userNickName");
              } else {
                this.baseInfoFormItem.gender = params.sex;
              }
              this.$Message.success("修改成功");
            })
          );
      }
    },
    updatePw () {
      if (this.pwdItem.currPwd === '') {
        this.$Message.warning("请输入当前密码");
      } else if (this.pwdItem.newPwd.length < 6 || this.pwdItem.newPwd.length > 16) {
        this.$Message.warning("设置新密码(6-16位)");
      } else if (this.pwdItem.confNewPwd.length < 6 || this.pwdItem.confNewPwd.length > 16) {
        this.$Message.warning("`确认新密码(6-16位)");
      } else if (this.pwdItem.currPwd === this.pwdItem.newPwd) {
        this.$Message.warning("新密码不可与当前密码一致");
      } else if (this.pwdItem.newPwd !== this.pwdItem.confNewPwd) {
        this.$Message.warning("两次密码不一致");
      } else {
        console.log(base64.encode(this.pwdItem.currPwd))
        this.$http.get(...myAPI.checkPw(this.pwdItem.currPwd)).then(res => {
          if (res.data.code === 200) {
            this.$http.put(...myAPI.updatePw({phone: this.mobile, newPwd: this.pwdItem.newPwd})).then(res => {
              if (res.data.code === 200) {
                this.$Message.success(`修改成功`)
                this.pwdItem.currPwd = ''
                this.pwdItem.newPwd = ''
                this.pwdItem.confNewPwd = ''
                this.pwdModal = false
              }
            })
          } else if (res.data.code === 6013 || res.data.message === '密码不正确') {
            this.$Message.error(`当前密码不正确`)
          }
        })
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
#mine {
  position: relative;
  height: 100%;
}
.mine-content {
  background-color: #fafafa;
  padding: 15px 15px 125px;

  &:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  .title {
    margin-bottom: 30px;
  }
}

.mine-left {
  width: 460px;
  float: left;
  background: #fff;
  padding: 30px;
  height: 330px;

  .ivu-col-span-6 {
    text-align: center;
    border-right: 1px solid #eee;

    &:last-child {
      border-right: none;
    }
  }

  .mine-actioin {
    color: #4a90e2;

    .pull-left {
      float: left;
    }

    .pull-right {
      float: right;
    }

    > span {
      cursor: pointer;
      display: inline-block;
    }

    &:after {
      content: ".";
      display: block;
      height: 0;
      clear: both;
      visibility: hidden;
    }
  }

  .base-info {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 20px;

    p {
      display: inline-block;

      img {
        width: 10px;
      }

      &.edit-icon {
        cursor: pointer;
      }

      &.nickname {
        margin: 0 26px;
        font-size: 16px;
      }
    }
  }
}
.mine-right {
  float: left;
  width: 690px;
  margin-left: 20px;
  background-color: #fff;
  padding: 30px 30px 40px;
  height: 330px;
}
.myBlock {
  .myBlock-bg {
    position: absolute;
    width: 100%;
  }
  .blur {
    -webkit-filter: blur(10px);
    -moz-filter: blur(10px);
    -o-filter: blur(10px);
    -ms-filter: blur(10px);
    filter: blur(10px);
  }

  .nickname {
    text-align: center;
    color: #4a4a4a;
  }

  .tsl-member {
    color: #352665;
    border: 1px solid #352665;
    padding: 2px 30px;
    display: inline-block;
    font-size: 13px;
    margin-top: 10px;
  }
}
.order-status-tab {
  border-bottom: 1px solid #eee;
  padding-bottom: 30px;

  &:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  div {
    width: 20%;
    float: left;
    text-align: center;
    font-size: 12px;
    color: #4d4d4d;
    letter-spacing: 0.16px;
    cursor: pointer;
    position: relative;

    span {
      position: absolute;
      background-color: red;
      width: 24px;
      height: 20px;
      border-radius: 25px;
      display: inline-block;
      color: #fff;
      top: -7px;
      text-align: center;
      right: 24px;
    }
  }
}
.myicons {
  padding-top: 30px;

  div {
    width: 20%;
    float: left;
    text-align: center;
    font-size: 12px;
    color: #4d4d4d;
    letter-spacing: 0.16px;
    cursor: pointer;

    a {
      color: #4d4d4d;
    }
  }

  &:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}
.allOrder {
  position: absolute;
  top: 50%;
  right: 30px;
  font-size: 14px;
  transform: translateY(-50%);
  // color: #c5c5c5;
}
#mini {
  .weui-cell:before {
    margin-left: 15px;
  }
}
.list-item {
  width: 100%;
  background: #fff;
}
.myOrder {
  float: right;
  margin-bottom: 30px;
  cursor: pointer;
}
.baseinfo-modal {
  width: 850px;

  .ivu-select-dropdown {
    min-width: 130px;
    width: 130px;
  }
  .ivu-modal-mask,
  .ivu-modal-wrap {
    z-index: 300 !important;
  }
}
.head-cell-box {
  text-align: center;
}
.head-portrait {
  width: 90px;
  height: 90px;
  margin: 0 auto;
  background-color: #ddd;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #ddd;

  img {
    display: block;
    width: 100%;
    height: 100px;
  }
}
.avatar-btn {
  font-size: 12px;
  border: 1px solid #ddd;
  display: inline-block;
  padding: 2px 14px;
  border-radius: 3px;
  margin: 20px 0 10px;
}
.myInfo-div {
  .vux-popup-dialog {
    z-index: 1000;
    padding: 30px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: auto;
  }
}
.edit-form {
  margin: 45px 0;
}
.croppa-cls {
  background-color: #fff;
  cursor: pointer;
}
.ivu-modal .gender-dropdown .ivu-select-dropdown {
  min-width: 1px !important;
  width: 130px !important;
}
.myitems {
  margin-top: 30px;

  a {
    color: inherit;
  }

  p {
    font-size: 16px;
    color: #352665;
    margin-top: 10px;
  }
}
</style>
