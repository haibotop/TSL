<template>
    <div style="padding: 0 15px;">
        <div class="cardList" v-for="(item,index) in readyTradeItem" v-bind:hidden="item.discountAmount == null && item.discountcodePiecediscountList == null">
            <div class="cardList_left" :class="{blackG: status == 2 || status == 3 }">
                <p class="disPrice" v-if="item.rule  === 1 || item.rule  === 2">￥{{item.discountAmount/100}}</p>
                <p class="disPrice" v-if="item.rule   === 3">{{item.discountcodePiecediscountList[0].discountRatio/10}}折</p>
                <p class="manjian" v-if="item.rule   === 2">直减</p>
                <div class="manjian" v-if="item.rule   === 3" >
                    <p >满{{item.discountcodePiecediscountList[0].min_quantity}}件打{{item.discountcodePiecediscountList[0].discountRatio/10}}折</p>
                </div>
                <p class="manjian" v-if="item.rule === 1">满{{item.minExpense/100}}减{{item.discountAmount/100}}</p>
                <p class="reUse"><img src="../../assets/icons/icon_overlay.png" alt=""><span>可叠加使用</span></p>
            </div>
            <div class="cardList_center">
                <p class="zkmCode">折扣码：{{item.discountcode}}</p>
                <p class="expiryDate">有效期：{{(item.startDate || '').replace("T", " ").split(' ')[0]}}至{{(item.endDate || '').replace("T", " ").split(' ')[0]}}</p>
                <p class="explain" >说明：<span v-if="item.memo">{{item.memo || '无'}}</span></p>
            </div>
            <div class="cardList_right" v-show="status == 1">
                <p class="useNow" @click="disUseNow(item.id)">立即使用</p>
                <p class="lookDetail" @click="disUseNow(item.id)">查看适用商品<Icon type="ios-arrow-forward" /></p>
            </div>
            <div class="cardList_right" v-show="status == 2">
                <p style="margin-top: 20px; color: #8b8b8b;">已使用</p>
            </div>
            <div class="cardList_right" v-show="status == 3">
                <p style="margin-top: 20px; color: #8b8b8b;">已失效</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'discount',
        props: {
            readyTradeItem: {
                default: function () {
                    return {}
                },
                // type: Object
            },
            status: {
                type: Number
            },
        },
        data () {
            return {
                discountItem: '' // 3种折扣码存储
                // status: 0, // 0未领取 1未使用 2已使用 3已失效
            }
        },
        methods: {
            disUseNow (id) {
                this.$router.push({path: '/couponPl', query: {'discountcode': id}})
            },
            lookDetail (status) { // 查看明细
                this.lookDetailIndex1 = this.lookDetailIndex1 == status ? -1 : status
            },

        },
        mounted: function () {
            console.log(this.status)
        },
    }
</script>

<style lang="stylus" scoped>
@import "~styles/common/common.styl";
.cardList{
    position: relative;
    margin-top: 10px;
    background-color: #fff;
    font-size: 16px;
    line-height: 25px;
    .name{
        color: #352665;
    }
    .zkmCode,.expiryDate,.explain{
        color: #8b8b8b;
    }
    .explain{
        display inline-block
        line-height 25px
    }
    .cardList_left{
        display inline-block
        padding: 20px 0;
        width: 26%;
        background-color: #352665;
        color: #fff;
        text-align: center;
        .disPrice{
            font-size: 40px;
            line-height: 50px;
        }
        img{
            width: 10px;
            margin-right: 3px;
        }
    }
    .cardList_left.blackG{
        background-color #8b8b8b;
    }
    .cardList_center{
        display inline-block
        width 52%
        padding 0 5%
        padding-top 25px
        vertical-align top
    }
    .cardList_right{
        display: inline-block;
        width 20%
        text-align center
        vertical-align: top;
        padding-top: 30px;
        .useNow{
            display: inline-block;
            padding: 10px 30px;
            color #111
            border: 1px solid #111;
            cursor pointer
        }
        .lookDetail{
            position: relative;
            top: 20px;
            color: #4A90E2;
            cursor pointer
            i{
                margin-left: 10px;
                font-size: 18px;
                margin-top: -2px;
            }
        }
    }
}

.myCoupons-right .cardList:first-child{
    margin-top: 0;
}
</style>