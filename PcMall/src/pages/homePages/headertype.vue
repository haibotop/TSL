<template>
    <transition>
        <div v-if="headertype === 1" class="content">
            <div class="content-left">
                <img src="src/assets/images/12treasures.png" alt="">
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
                    <router-link tag="a" to="/">
                        <div>
                            <img :src="item.img">
                        </div>                      
                        <span>{{item.name}}</span>
                        <i v-if="index!=3"></i>
                    </router-link>
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
                active: '',
                list:[
                    [
                        {
                            name: "戒指",
                            img: "src/assets/images/jiezhi.png"
                        },
                        {
                            name: "项链",
                            img: "src/assets/images/xianglian.png"
                        },
                        {
                            name: "耳环",
                            img: "src/assets/images/erhuan.png"
                        },
                        {
                            name: "吊坠",
                            img: "src/assets/images/diaozhui.png"
                        }                        
                    ],
                    [
                        {
                            name: "The 12 treasures",
                            img: "src/assets/images/12treasures.png"
                        },
                        {
                            name: "Altelier",
                            img: "src/assets/images/Atelier.png"
                        },
                        {
                            name: "Nova",
                            img: "src/assets/images/momentoflove.png"
                        },                     
                        {
                            name: "Raindrop & Eernity",
                            img: "src/assets/images/diaozhui.png"
                        },
                        {
                            name: "motion",
                            img: "src/assets/images/saxx.png"
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
    .v-enter,.v-leave-to
        opacity :0
    .v-enter-active
        transition opacity .6s
    .v-leave-active
        transition opacity .3s
    .content
        color $blue
        .content-left
            width 250px
            height 200px
            float left
            img
                margin-top 60px
                margin-left 30px
        h2
            line-height 60px
            font-weight 400
        p
            font-size 14px
            color #000
            line-height 18px
            padding 10px 0 
        .button
            float left
            margin 20px 0
            width 180px
    .contentlist
        border-left 4px solid $blue          
        ul
            // height 60px
            margin 10px 20px
            
            li
                float left
                width 25%
                // width 21.5% 
                // margin-right 40px
                height 70px
                line-height 70px
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
                    div
                        display inline-block
                        width 66px
                        height 66px
                        img 
                            width 100%
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