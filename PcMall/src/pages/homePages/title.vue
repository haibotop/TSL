<template>
    <div class="title">
        <!-- <slot></slot> -->
        <div class="title-t">{{titleName}} <span v-for="(item,index) in titleArray" :key="index"><span class="xiegang"></span>{{item}}</span></div>
    </div>
</template>

<script>
    export default {
        props: {
            titleTpye: {
                type: Array,
            }
        },
        data (){
            return {
                titleName :""
            }
        },
        computed: {
            titleArray(){
                let arr = [...this.titleTpye]
                this.titleName = arr.shift()
                return arr
            }
        }
    }
</script>

<style scoped lang="stylus">
@import "~styles/common/common.styl";
.title 
    padding 30px 0     
    text-align center
    background #fafafa
    .title-t 
        position relative
        display inline-block
        text-align center
        font-size 20px
        color #0f0f0f
        &:after
            content ''
            position absolute
            bottom -20px
            left 50%
            $ml(-20px)
            display inline-block
            width 40px
            height 2px
            background-color $blue
        .xiegang:after
            content ''
            position relative
            top 8px
            margin 0 15px
            display inline-block
            width 1px
            height 30px
            background-color $blue
            transform rotate(30deg)
</style>