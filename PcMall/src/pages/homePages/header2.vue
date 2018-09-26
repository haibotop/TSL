<template>
    <div class="header">
        <div class="header-left">
            <a href="javascript:void(0)" @click="handleClick(1)">
                品牌介绍
                <Icon :type="arrow === 1 ? 'ios-arrow-up' : 'ios-arrow-down'" size="16"></Icon>
            </a>                                            
            <a href="javascript:void(0)" @click="handleClick(2)">
                珠宝类型
                <Icon :type="arrow === 2 ? 'ios-arrow-up' : 'ios-arrow-down'" size="16"></Icon>
            </a>              
            <a href="javascript:void(0)" @click="handleClick(3)">
                珠宝系列
                <Icon :type="arrow === 3 ? 'ios-arrow-up' : 'ios-arrow-down'" size="16"></Icon>
            </a>              
        </div>
        <div class="header-right">
            <search></search>
        </div>
        <div v-if="isShow" class="headertype" style="border-left:8px solid blue">
            <headertype :headertype="headertype"></headertype>
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
                headertype: 0
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
    .header
        position relative
        background blue
        height 120px
        line-height 120px
        .header-left
            width 35%
            margin-left 35%
            float left
            a
                color #fff
                margin-right 60px
        .header-right
            float right 
            margin-right 40px
        .headertype
            position absolute
            background-color #fff
            top 100%
            width 100%
            z-index 99
            float left

</style>