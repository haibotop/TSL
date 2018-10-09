<template>
    <div class="header">
        <div class="header-logo">
            <router-link tag="div" to="/">

            </router-link>
        </div>
        <div class="header-left">
            <a href="javascript:void(0)" @mouseenter="handleClick(1)" @mouseleave="handleClick(1)">
                品牌介绍
                <Icon :type="arrow === 1 ? 'ios-arrow-up' : 'ios-arrow-down'" size="16"></Icon>
            </a>                                            
            <a href="javascript:void(0)" @mouseenter="handleClick(2)" @mouseleave="handleClick(2)" >
                珠宝类型
                <Icon :type="arrow === 2 ? 'ios-arrow-up' : 'ios-arrow-down'" size="16"></Icon>
            </a>              
            <a href="javascript:void(0)" @mouseenter="handleClick(3)" @mouseleave="handleClick(3)">
                珠宝系列
                <Icon :type="arrow === 3 ? 'ios-arrow-up' : 'ios-arrow-down'" size="16"></Icon>
            </a>              
        </div>
        <div class="header-right">
            <search></search>
        </div>
        <div class="headertype" @mouseenter="handleClick(headertype)" @mouseleave="handleClick(headertype)">
            <headertype v-if="isShow" :headertype="headertype"></headertype>
        </div>
    </div>
</template>

<script>
    import search from '@/pages/search/searchPage'
    import headertype from './headertype'
    export default {
        data () {
            return {
                isShow: false,
                arrow:'ios-arrow-down',
                headertype: 0,
            }
        },
        components: {
            search,
            headertype
        },
        methods: {
            handleClick(index) {    
                this.headertype = index
                this.isShow = this.arrow === index? false: true
                this.arrow = this.arrow === index? false: index                                      
            }          
        }
    }
</script>

<style lang="stylus" scoped>
@import "~styles/common/common.styl";
    .header
        position relative
        height 120px
        line-height 120px
        background-color #fff
        .header-logo
            div
               float left
               width 35%
               height 120px
               background url("../../assets/images/tsl_logo.png") no-repeat 60px 
               background-size 66%
               cursor pointer
        .header-left            
            float left
            a
                color #000
                $mr(60px)
                display inline-block
                i 
                    color $blue
        .header-right
            float right 
            $mr(30px)
        .headertype
            position absolute
            background-color #fff
            top 100%
            width 100%
            z-index 99
            float left
            $border(border-left,8px)

</style>