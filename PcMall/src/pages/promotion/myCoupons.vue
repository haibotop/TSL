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
                    <div class="null-coupons" v-if="Couponlist.length < 1">
                        <img src="../../assets/images/nullCoupon.png" alt="">
                        <div style="color:#C8C8C8;">{{statusTitle}}</div>
                    </div>
                    <coupon v-else v-for="(item, index) in Couponlist" :key="index" :status="status" class="coupon-margin" :coupon="item"  @eventCoupon="receiveCoupon"></coupon>
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
import coupon from './coupon.vue'
import * as mkApi from '@/services/API/marketing.es6'
let interval
    export default {
        name: 'myCoupons',
        components: {
            header1,
            header2,
            vFooter,
            loading,
            vTitle,
            coupon
        },
        data () {
            return {
                titleTpye: ['首页','我的','优惠券'],
                imgArr: [
                    {src:require('../../assets/icons/coupons1.png'),content:'未领取'},
                    {src:require('../../assets/icons/coupons2.png'),content:'未使用'},
                    {src:require('../../assets/icons/coupons3.png'),content:'已使用'},
                    {src:require('../../assets/icons/coupons4.png'),content:'已失效'}
                ],
                liIndex: 0,
                pageNum: 1,
                pageSize: 500,
                loading: false,
                Couponlist: [],
                status: 0, // 0未领取 1未使用 2已使用 3已失效
                // pullupDefaultConfig: {
                //     content: '上拉刷新',
                //     pullUpHeight: 60,
                //     height: 40,
                //     autoRefresh: false,
                //     downContent: '释放后加载',
                //     upContent: '已到底端',
                //     loadingContent: '加载中...',
                //     clsPrefix: 'xs-plugin-pullup-'
                // }
            }
        },
        watch: {
            status (param) {
                this.pageNum = 1
                this.Couponlist = []
                this.getMyCoupon(this.status, this.pageNum, this.pageSize)
            }
        },
        computed: {
            statusTitle () {
                let title = ['暂无未领取的优惠券', '您还没有未使用的优惠券', '您还没有已使用的优惠券', '您还没有已失效的优惠券']
                return title[this.status]
            }
        },
        methods: {
            init (index) {
                this.liIndex = index
                this.status = index
            },
            getMyCoupon (status, pageNum, pageSize, callback) {
                this.loading = true
                this.$http.post(mkApi.getMyCoupon(status, pageNum, pageSize))
                .then(res => {
                    // this.$vux.loading.hide()
                    this.showLoading = false
                    this.loading = false
                    if (res.data.code === 200) {
                        if (res.data.pageInfo) {
                            // this.Couponlist = this.Couponlist.concat(res.data.pageInfo.list)
                            this.Couponlist = res.data.pageInfo.list
                            if (typeof (callback) === 'function' && res.data.pageInfo !== null) {
                                callback()
                            }   
                        }
                    }
                    if (typeof callback === 'function') {
                        callback(res)
                    }
                })
            },
            receiveCoupon (coupon) {
                console.log('coupon',coupon)
                if (this.status === 0) { // 未领取状态事件为去领取该优惠券
                    this.$http.get(mkApi.receiveCoupon(coupon.id, coupon.code))
                    .then(res => {
                        // this.init()
                        this.$Message.success({content:'领取成功',duration: 3})
                        this.getMyCoupon(this.status, this.pageNum, this.pageSize)
                    })
                } else if (this.status === 1) {  //已领取的优惠券去使用事件
                    this.$router.push({path: '/couponPl', query: {'couponId': coupon.id}})
                }
            },
            addLoad () {
                this.pageNum = this.pageNum + 1
                this.getMyCoupon (this.status, this.pageNum, this.pageSize, () => {
                    this.$refs.scroller.donePullup()
                    this.$nextTick(() => {
                        this.$refs.scroller.reset()
                    })
                })
            }
        },
        beforeMount () {
            this.loading = true
            // this.$vux.loading.show()
            this.showLoading = true
        },
        mounted () {
            this.getMyCoupon(this.status, this.pageNum, this.pageSize)
            interval = setInterval(() => {
                if (this.$refs.scroller) {
                    this.$refs.scroller.reset()
                    clearInterval(interval)
                }
            }, 0)
        }
        
    }
</script>

<style lang="stylus" scoped>
@import "~styles/common/common.styl";
    .myCoupons
        background #fafafa
        padding 0 60px 100px 60px 
        .myCoupons-content
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
                padding 40px 0 0 5px
                float left
                width 780px
                background #fff
                min-height 400px
                text-align center
                .null-coupons
                    $mt(100px)
                    img
                        width 200x
                        height 80px
                        $mb(20px)


                
</style>