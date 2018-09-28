<template>
    <transition>
        <div v-if="headertype === 1" class="content">
            <div class="content-left">
                <img src="" alt="">
            </div>
            <div class="content-right">
                <h2>品牌介绍</h2>
                <p>TSL谢瑞麟是亚洲区著名珠宝集团 ，主要从事珠宝首饰设计、零售、出口及制造业务。</p>
                <p>TSL谢瑞麟于1971年成立，并在1987年于香港联合交易所有限公司上市。</p>
                <p>目前集团分别在亚洲区多个大城市经营逾360多间分店及销售点，包括北京、上海、广州、重庆、深圳、香港、澳门及吉隆坡等地。另外，集团的出口业务在欧洲及美国均拥有多元化的客户网络。</p>
                <Button  class="button">阅读更多 →</Button>
            </div>
        </div>
        <div v-else class="contentlist">
            <ul>
                <li v-for="(item,index) in type" :key="index" :class="{active:active === index}" @click="handleClick(index)">
                    <a>
                        <img :src="item.img" alt="">
                        <span>{{item.name}}</span>
                        <i v-if="index!=3"></i>
                    </a>
                </li>
            </ul>
        </div>
    </transition>
</template>

<script>
    export default {
        props:{
            headertype:{
                default: 1,                
            }
        },
        data () {
            return {
                active: 0,
                list:[
                    [
                        {
                            name: "戒指",
                            img: "static/aaa.jpg"
                        },
                        {
                            name: "项链",
                            img: "static/aaa.jpg"
                        },
                        {
                            name: "耳环",
                            img: "static/aaa.jpg"
                        },
                        {
                            name: "吊坠",
                            img: "static/aaa.jpg"
                        }                        
                    ],
                    [
                        {
                            name: "The 12 treasures",
                            img: "static/aaa.jpg"
                        },
                        {
                            name: "Altelier",
                            img: "static/aaa.jpg"
                        },
                        {
                            name: "Nova",
                            img: "static/aaa.jpg"
                        },                     
                        {
                            name: "Raindrop & Eernity",
                            img: "static/aaa.jpg"
                        },
                        {
                            name: "motion",
                            img: "static/aaa.jpg"
                        }
                    ]
                ]
            }
        },
        methods: {
            handleClick(index){
                this.active = index
            }
        },
        computed: {
            type(){
                return this.list[this.headertype-2]
            }
        }
    }
</script>

<style lang="stylus" scoped>
@import "~styles/common/common.styl";

        .v-enter,v-leave-to
            opacity :0
        .v-enter-active,v-leave-active
            transition opacity 1s
        .content
            color $blue
            .content-left
                width 250px
                height 200px
                float left
            h2
                line-height 60px
            p
                font-size 14px
                color $blue
                line-height 18px
                padding 10px 0 
            .button
                float left
                margin 20px 0
                width 180px
        .contentlist
            border-left 4px solid $blue
            // background yellow              
            ul
                // height 60px
                margin 10px 20px
                
                li
                    float left
                    width 21.5% 
                    margin-right 40px
                    height 60px
                    line-height 60px
                    text-align center
                    margin-top 10px
                    margin-bottom 10px
                    span 
                        color #000  
                        margin-left 10px
                    img 
                        margin-left -10px   
                        vertical-align middle                                    
                    &.active
                        border 2px solid $blue
                    &:hover
                        border 2px solid $blue
                    a
                        position relative   
                        display inline-block
                        width 100%
                        height inherit
                        i                              
                            display inline-block
                            vertical-align middle
                            background-color $blue
                            position absolute
                            width 2px
                            height 20px
                            right -2px
                            top:31%
                        

</style>