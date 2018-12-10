<template>
<div>
<header1></header1>
<header2></header2>
<div class="myCoupons">
    <v-title :titleTpye="titleTpye"></v-title>
    <div class="myCoupons-content">
        <div class="myCoupons-left">
            <ul>
                <li v-for="(item,index) in imgArr" :key="index" :class="{active:index===liIndex}" @click="init(index)">
                    <img :src="item.src" alt="">
                    <span>{{item.content}}</span>
                </li>
            </ul>
        </div>
        <div class="myCoupons-right">
            <loading v-if="loading"></loading>
            <div class="discountBottom">
                <input type="text" v-model="cashingDiscount" placeholder="请输入要添加的折扣码">
                <span class="exchange" @click="changeDiscount">兑换</span>
            </div>
            <div class="null-coupons" v-if="readyTradeItem.length < 1">
                <img src="../../assets/images/nullCoupon.png" alt="">
                <div style="color:#C8C8C8;">{{statusTitle}}</div>
            </div>
            <div >
                <discount :readyTradeItem="readyTradeItem" :status="status"></discount>
            </div>
        </div>
    </div>
</div>
<v-footer></v-footer>
</div>
</template>

<script>
import header1 from '@/pages/homePages/header1'
import header2 from '@/pages/homePages/header2'
import vFooter from '@/pages/homePages/footer.vue'
import loading from '@/pages/homePages/loading.vue'
import vTitle from '@/pages/homePages/title.vue'
import discount from './discount.vue'
import * as disAPI from '@/services/API/marketing.es6'
export default {
    name: 'myCoupons',
    components: {
        header1,
        header2,
        vFooter,
        loading,
        vTitle,
        discount
    },
    data () {
        return {
            titleTpye: ['首页','我的','折扣码'],
            imgArr: [
                {src:require('../../assets/icons/coupons2.png'),content:'已兑换'},
                {src:require('../../assets/icons/coupons3.png'),content:'已使用'},
                {src:require('../../assets/icons/coupons4.png'),content:'已失效'}
            ],
            liIndex: 0,
            pageNum: 1,
            pageSize: 500,
            loading: false,
            Couponlist: [],
            status: 1, // 1 已兑换 2 已使用 3 已失效
            userId: '', // memberId
            readyTradeItem: [],
            readyUsedItem: [],
            loseEfficacyItem: [],
            cashingDiscount: '' // 输入折扣码
        }
    },
    watch: {
        status (index) {

            this.readyTrade(index)
        }
    },
    computed: {
        statusTitle () {
            let title = [ '您还没折扣码，赶紧兑换一个吧', '您还没有已使用的折扣码', '您还没有已失效的折扣码']
            return title[this.status]
        }
    },
    mounted () {
        this.userId = JSON.parse(sessionStorage.getItem('userInfo')).memberId
        this.readyTrade(1) // 已兑换
    },
    methods: {
        init (index) {
            this.Couponlist = []
            this.liIndex = index
            this.status = index + 1
        },
        changeDiscount () { // 兑换折扣码
            let parms = {
                couponIds: [this.cashingDiscount],
                userId: this.userId
            }
            this.$http.post(...disAPI.cashingDiscountcode(parms))
                .then(res => {
                    if (res.data.code === 200) {
                        this.$Modal.confirm({
                            title: '提示',
                            content: res.data.message
                        })
                        this.readyTrade(1) // 已兑换折扣码
                    } else {
                        this.$Modal.confirm({
                            title: '提示',
                            content: res.data.message
                        })
                    }
                })
        },
        disUseNow (id) {
            this.$router.push({path: '/couponPl', query: {'discountcode': id}})
        },
        readyTrade (index) { // 已兑换
            this.loading = true
            let params = {
                status: index, // 1：已兑换2：已使用3：已失效 ,
                userId: this.userId
            }
            this.$http.post(...disAPI.getDiscountList(params))
                .then(res => {
                    this.loading = false
                    this.readyTradeItem = res.data.couponIds || []
                    // console.log('this.readyTradeItem', this.readyTradeItem)
                })
        },
    },
    beforeMount () {
        this.loading = true
    },
}
</script>

<style lang="stylus" scoped>
@import "~styles/common/common.styl";
    .myCoupons
        background #fafafa
        padding 0 60px 100px 60px 
        .myCoupons-content
            margin-top 2%
            color $blue
            overflow hidden
            .myCoupons-left
                width 280px
                height 400px
                padding-top 40px 
                background-color #fff
                $mr(10px)
                float left
                li
                    text-align center
                    margin 10px 40px
                    cursor pointer
                    img 
                        width 40px
                        height 40px
                        vertical-align middle
                        $mr(20px)
                    span 
                        line-height 60px
                .active
                    $border(1,2px)
            .myCoupons-right
                float left
                width 780px
                min-height 400px
                .null-coupons
                    $mt(100px)
                    text-align center
                    img
                        width 200x
                        height 80px
                        $mb(20px)

.discountBottom{
    padding: 15px;
    background-color: #F8F8F8;
    z-index: 9;
    input{
        padding-left: 15px;
        width: 80%;
        height: 50px;
        outline: none;
        border-color: transparent;
        font-size: 18px;
    }
    span{
        display: inline-block;
        width: 20%;
        height: 50px;
        line-height: 50px;
        font-size: 20px;
        text-align: center;
        background: #352665;
        color: #fff;
        float: right;
        cursor pointer
    }
}

                
</style>