<template>
    <div>
        <Modal 
        v-model="show"
        :mask-closable=false
        :footer-hide=true
        :styles='styles'>
            <div class="sendCoupons">
                <h1>谢瑞麟送您<span class="num">{{list.length}}</span>张优惠券</h1>
                <div class="content">
                    <coupon v-for="(item, index) in list" :key="index" :coupon="item" :status="status[index]" @eventCoupon="eventCoupon" class="coupon-margin"></coupon>
                </div>
                <div class="footer">
                    <Button class="btn1" @click.native="show=false" >返回首页</Button>
                    <!-- <Button class="btn2" >全部领取</Button> -->
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
import coupon from './coupon.vue'
import * as mkApi from '@/services/API/marketing.es6'
    export default {
        name: 'sendCoupons',
        components: {
            coupon
        },
        data () {
            return {
                styles:{
                    width: '820px',
                    height: '400px',
                },
                show: false,
                status: [],
                list: []
            }
        },
        methods: {
            close () {
                this.show = false
            },
            getMyCoupon (status, pageNum, pageSize) {
                this.$http.post(mkApi.getMyCoupon(status, pageNum, pageSize)).then(res => {
                if (res.data.code === 200) {
                    if (res.data.pageInfo) {
                        if (res.data.pageInfo.list.length > 0) {
                            this.status = []
                            res.data.pageInfo.list.forEach(element => {
                                this.status.push(0)
                            })
                            this.list = res.data.pageInfo.list
                            this.show = true
                            // sessionStorage.setItem('sendCoupons', 1)
                        }
                    }
                }
                })
            },
            eventCoupon (coupon) {
                for (let i in this.list) {
                    if (this.list[i].code === coupon.code) {
                        if (this.status[i] === 0) {
                            console.log(coupon.id)
                            this.getCoupon(coupon.id, coupon.code, i)
                            return
                        }
                        else {
                            this.$router.push({path: '/couponPl', query: {'couponId': coupon.id}})
                            return
                        }
                    }
                }
                if (this.list.length === 0) {
                    this.show = false
                }
            },
            getCoupon (id, code, index) {
                this.$http.get(mkApi.receiveCoupon(id, code)).then(res => {
                    if (res.data.code === 200) {
                        this.$set(this.status, index, 1)
                        // this.$vux.toast.show({text: '领取成功', type: 'text', width: '200px'})
                        this.$Message.success({content:'领取成功',duration:3});
                    }
                })
            }
        },
        mounted: function () {
            if (sessionStorage.getItem('userInfo')) {
                if (!sessionStorage.getItem('sendCoupons')) {
                    this.getMyCoupon(0, 1, 99)
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>
@import "~styles/common/common.styl";
    .sendCoupons
        height 450px
        h1
            font-size 16px
            color $blue
            line-height 50px
            text-indent 20px
            .num
                $ml(2px)
                $mr(2px)
                font-size 18px
        .content
            margin 20px 20px 20px 0
            height 292px
            overflow-y auto
        .footer
            text-align center
            .btn1
                margin-right 30px
                width 200px
                height 40px
                font-size 16px
            .btn2
                padding-bottom 8px
                width 200px
                height 40px
                font-size 16px
                color #fff
                background-color $blue
            
</style>