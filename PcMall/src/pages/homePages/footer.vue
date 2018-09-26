<template>
    <div class="footer">
        <div class="line"></div>
        <div class="footer-up">
            <ul>
                <li class="first">关于我们</li>
                <li><a href="#">谢瑞麟通讯</a></li>
                <li><a href="#">常见问题</a></li>
                <li><a href="#">其他谢瑞麟网站</a></li>
                <li><a href="#">网站地图</a></li>
            </ul>
            <ul>
                <li class="first">法律条款</li>
                <li><a href="#">使用条款</a></li>
                <li><a href="#">条款和条件</a></li>
                <li><a href="#">隐私条款</a></li>
                <li><a href="#">版权所有</a></li>
            </ul>
            <ul>
                <li class="first">客户服务</li>
                <li><a href="#">预约钻石咨询服务</a></li>
                <li><a href="#">珠宝保养</a></li>
            </ul>
            <ul>
                <li class="first">企业</li>
                <li><a href="#">谢瑞麟（国际）集团</a></li>
                <li><a href="#">假如我们</a></li>
            </ul>
            <ul>
                <li class="first">关注我们</li>
                <li>
                    <a href="#"><i class="iconfont">&#xe604;</i></a>
                    <a href="#"><i class="iconfont" >&#xe600;</i></a>
                    <a href="#"><i class="iconfont">&#xe6d0;</i></a>
                    <a href="#"><i class="iconfont">&#xe62b;</i></a>
                </li>
            </ul>
        </div>
        <div class="footer-down">
            <span>版权所有&copy;2013，谢瑞麟珠宝（国际）有限公司保留一切权利</span>
            <span>京ICP备15035773号-1</span>
        </div>
    </div>
</template>

<script>
    export default {
        name:"vfooter"
    }
</script>
<style>

</style>

<style lang="stylus" scoped>
    @import "~styles/iconfont/iconfont.css";
    .footer
        margin-top 40px
        width 1200px
        float left
        .footer-up
            overflow hidden
            margin-top 10px
            overflow hidden
        .line
            width 100%
            height 1px
            background-color  #727272  
            position relative
            left 40px
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