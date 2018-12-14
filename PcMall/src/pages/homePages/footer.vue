<template>
    <div class="footer">
        <div class="line"></div>
        <div class="footer-up">
            <ul>
                <li class="first">品牌介绍</li>
                <li><a href="#">品牌故事</a></li>
                <li><a href="#">其他谢瑞麟网站</a></li>
            </ul>
            <ul>
                <li class="first">法律条款</li>
                <li><a href="#">隐私条款</a></li>
                <li><a href="#">用户条款</a></li>
            </ul>
            <ul>
                <li class="first">客户服务</li>
                <li><a href="#">分店网路</a></li>
                <li><a href="#">客服中心</a></li>
            </ul>
            <ul>
                <li class="first">珠宝</li>
                <li><a href="#">珠宝类型</a></li>
                <li><a href="#">珠宝系列</a></li>
            </ul>
            <ul>
                <li class="first">关注我们</li>
                <li>
                    <!-- <a href="#"><i class="iconfont">&#xe604;</i></a> -->
                    <a href="#"><i class="iconfont" >&#xe600;</i></a>
                    <!-- <a href="#"><i class="iconfont">&#xe6d0;</i></a> -->
                    <a href="#" class="weixin" @mouseenter="isShow = true" @mouseleave="isShow = false">
                        <i class="iconfont">&#xe62b;</i>
                        <div v-if="isShow" class="erweima"><img src="../../assets/icons/erweima.png"></div>
                    </a>
                </li>
            </ul>
        </div>
        <div style="clear:both"></div>
        <div class="footer-down">
            <span>版权所有&copy;2013，谢瑞麟珠宝（国际）有限公司保留一切权利</span>
            <span>京ICP备15035773号-1</span>
        </div>
    </div>
</template>

<script>
    export default {
        name:"vfooter",
        data () {
            return {
                isShow: false
            }
        }
    }
</script>
<style>

</style>

<style lang="stylus" scoped>
    @import "~styles/iconfont/iconfont.css";
    .footer
        width 1200px
        float left
        .footer-up
            margin-top 10px
        .line
            width 100%
            height 1px
            background-color  #727272  
        ul
            font-size 12px
            float left
            width 230px           
            li               
                line-height 30px
                a
                    color  #727272  
            .first
                font-size 14px
                color #000
                font-weight bold
                margin 20px 0
            .weixin
                position relative
                .erweima
                    position absolute
                    z-index 100
                    bottom -30px
                    right -96px
                    width 300px
                    height 300px
                    img 
                        width 100%
         ul:nth-of-type(1)
            margin-left 40px   
        .footer-down
            margin 40px 0 20px 40px
            font-size 12px
            color #aeaeae
            span:nth-of-type(2)
                float right
                margin-right 30px
        .footer-up
            ul:last-child
                i   
                    margin-right 30px
                

</style>