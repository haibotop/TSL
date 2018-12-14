<template>
    <div class="coupons nouse">
        <div class="coupons-title">
            <h2>￥{{coupon.subtract / 100}}</h2>
            <p v-show="coupon.rules === 2">直减</p>
            <p v-show="coupon.rules === 1">满{{coupon.fullSubtract / 100}}元使用</p>
        </div>
        <div class="coupons-content">
            <!-- <p>适用范围：全场通用</p> -->
            <p style="font-size:16px">{{coupon.name}}</p>
            <p class="p2">有效期：{{(coupon.startDate || '').split(' ')[0]}}至{{(coupon.endDate || '').split(' ')[0]}}</p>
            <!-- <p>查看使用说明<Icon type="ios-arrow-down" size="18"/></p> -->
        </div>
        <div class="coupons-footer" v-bind:hidden="hiddenbukeyong == 4">
            <span v-show="status === 0 && !check" @click="receiveCoupon(coupon)">立即领取</span>
            <span v-show="status === 1 && !check" @click="receiveCoupon(coupon)">去使用</span>
            <p v-show="status === 2">已使用</p>
            <p v-show="status === 3">已失效</p>
            <p v-show="status === 4">不可用</p>
        </div>
        <div v-show="status === 2 || status === 3 || status === 4" class="mask"></div>
    </div>
</template>

<script>
    export default {
        name: 'coupon',
        props: {
            coupon: {
                default: function () {
                    return {}
                },
                type: Object
            },

            status: {
                type: Number
            },
            hiddenbukeyong: {
                type: Number
            },
            check: {
                default: function () {
                    return false
                },
                type: Boolean
            },
        },
        data () {
            return {
                // status: 0, // 0未领取 1未使用 2已使用 3已失效
            }
        },
        methods: {
        // 获取优惠券列表,点击领取
            receiveCoupon (coupon) {
                console.log('coupon', coupon)
                this.$emit('eventCoupon', coupon)
            }
        },
        computed: {
            amountSize () {
                if (this.amount > 9999) {
                    return 'font-size: 23px;'
                } else if (this.amount > 999) {
                    return 'font-size: 27px;'
                } else {
                    return ''
                }
            },
            couponPadding () {
                if (this.status === 2) {
                    return 'padding: 0px'
                } else {
                    return this.check ? 'width:100%' : 'padding: 0px 5px;'
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>
@import "~styles/common/common.styl";
    .coupons
        width 225px
        font-size 12px
        overflow hidden
        $ml(25px)
        $mb(20px)
        float left
        position relative
        .coupons-title
            color #fff
            background-color $blue
            height 100px
            font-size 16px
            text-align center
            h2
                line-height 60px
        .coupons-content
            width inherit
            padding 25px 20px 25px 20px 
            $border(border-left,1px)
            $border(border-right,1px)
            position relative
            p
                line-height 16px
            .p2
                margin 10px 0
            &::after
                content ''
                position absolute
                width 20px
                height 40px
                background-color $blue
                border-radius 20px 0 0 20px
                right  -2px
                bottom  -21px
            &::before
                content ''
                position absolute
                z-index 2
                width 18px
                height 38px
                background-color #fff
                border-radius 19px 0 0 19px
                right -1px
                bottom -20px
        .coupons-footer
            $border(1,1px)
            border-top 1px dashed $blue
            height 70px
            width inherit
            text-align center
            display table-cell
            vertical-align middle
            position relative
            span
                display inline-block
                text-align center
                width 150px
                height 30px
                line-height 30px
                border 1px solid #000
                color #000
                cursor pointer
            p
                color #000
            &::after
                content ''
                position absolute
                width 20px
                height 40px
                background-color $blue
                border-radius 0 20px 20px 0
                left -2px
                top -20px
            &::before
                content ''
                position absolute
                z-index 2
                width 18px
                height 38px
                background-color #fff
                border-radius 0 19px 19px 0
                left -1px
                top -19px
        .mask
            position absolute
            width 100%
            height 100%
            left 0
            top 0
            background-color #ccc
            opacity 0.5


</style>