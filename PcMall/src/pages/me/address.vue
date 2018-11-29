<template>
    <div class="myAddress">
      <header1></header1>
      <header2></header2>
      <div class="main-content">
        <v-title :titleTpye="titleTpye"></v-title>
        <address-list></address-list>
      </div>
      <!-- <div class="account">
            <span class="title">配送地址：</span>
            <div >
                <div v-if="address" class="address">
                    <div class="address-bar1"><span class="receiverName">{{address.receiverName}}</span><span class="receiverMobile">{{address.receiverMobile}}</span></div>
                    <div class="address-bar2"><p>{{address.receiverAddress}}</p></div>
                    <span class="change-address" @click="showAddressModel">更换地址</span>
                </div>
                <div v-else class="no-address">
                    <p style="padding-bottom:20px;color: #111;">目前您没有设置配送地址</p>
                
                    <p style="color: #4A90E2;cursor: pointer;" @click="showCreatAddressModel">
                        <Icon type="ios-add-circle-outline" style="position: relative;top: -3px;margin-right: 5px;font-size: 20px;"/>
                        增加配送地址
                    </p>
                </div>
            </div>
        </div> -->
      
      <v-footer></v-footer>
      <Modal v-model="listModal" footerHide :styles="{width: '1000px',top: '100px'}">
        <address-list></address-list>
      </Modal>
      <Modal v-model="addNewAddressModal" footerHide :styles="{width: '1000px',top: '100px'}">
        <create-address @hideModelCreat="hideModelCreat"></create-address>
      </Modal>
      <Modal v-model="editAddressModal" footerHide :styles="{width: '1000px',top: '100px'}">
          <edit-address @hideModelEdit="hideModelEdit"></edit-address>
      </Modal>
    </div>
  </template>
  <script type="text/ecmascript-6">
    import header1 from '../homePages/header1'
    import header2 from '../homePages/header2'
    import vTitle from "@/pages/homePages/title.vue";
    import vFooter from '../homePages/footer.vue'
    import addressList from '../me/addressList'
    import createAddress from '../me/CreateAddress'
    import editAddress from '../me/editAddress'

    export default {
      components: { 
        addressList,
        createAddress,
        editAddress,
        header1,
        header2,
        vFooter,
        vTitle
      },
      data () {
        return {
          addNewAddressModal: false,
          editAddressModal: false,
          listModal: false,
          address: '',
          titleTpye: ["首页", "我的", "收货地址"],
        }
      }, 
      mounted() {

        this.bus.$emit('fun')
        if (this.$store.state.address.id !== '') {
          this.address = this.$store.state.address
        } else {
          this.address = ''
        }

        // this.getSelfLiftingAddress()
      },
      methods: {
        //增加配送地址
        showCreatAddressModel(){
            this.addNewAddressModal = true
        },//编辑配送地址
        showEditAddressModel(){
            this.editAddressModal = !this.editAddressModal
        },
        //隐藏新建收获地址
        hideModelCreat(){
          this.addNewAddressModal = !this.addNewAddressModal
        },
        //隐藏编辑收货地址
        hideModelEdit(){
            this.editAddressModal = !this.editAddressModal
        },
        getSelfLiftingAddress () {  //获取地址信息
          this.$http.get(myAPI.selfLiftingAddress()).then(res => {
            if (res.data.code === 200) {
                console.log('2222222222222222222',res.data.addressInfos)
              this.selfLiftingAddress_bs = res.data.addressInfos
              this.selfLiftingAddress = res.data.addressInfos
            }
          })
        },

      }

    }
  </script>

   
  <style>
    .myAddress .Mfooter {
        display: none;
      }
    .main-content {
      background-color: #fafafa;
      padding: 15px 15px 125px;
    }

    .myAddress #addressList {
      background-color: #fff;
      height: auto !important;
    }
    .myAddress #addressList  > p {
      display: none;
    }
    .myAddress #addressList .addressContentBig {
      height: auto !important;
    }
  </style>
  