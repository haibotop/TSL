<template>
    <div class="myAddress">
      <header1></header1>
      <header2></header2>
      <div class="main-content">
        <v-title :titleTpye="titleTpye"></v-title>
        <address-list></address-list>
      </div>
      
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
  