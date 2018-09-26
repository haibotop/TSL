<template>
    <div class="header">
        <div class="header-left">
            <Dropdown trigger="click">
                <a href="javascript:void(0)">
                    <span>每日金价</span>
                    <Icon type="ios-arrow-down" size="16"></Icon>
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem>1</DropdownItem>
                    <DropdownItem>2</DropdownItem>
                    <DropdownItem>3</DropdownItem>
                    <DropdownItem>4</DropdownItem>
                    <DropdownItem>5</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>     
        <div class="header-right">
            <router-link tag="a" to="/login">     
                <Icon type="ios-contact-outline" size="20" color="#000"/>
                <span>登录/注册</span>
            </router-link>
            <router-link tag="a" to="/" >              
                <Icon type="md-heart-outline" size="20"/>
                <span>我的收藏</span>
            </router-link>
            <router-link tag="a" to="/">              
                <Icon type="ios-lock-outline" size="20"/>
                <span>购物袋</span>
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="stylus" scoped>
    .header
        height 40px
        line-height 40px
        .header-left
            margin-left 100px
            float left
        span,a
            color #464c5b
            margin-right 10px
        .header-right
            float right
            a
                margin-right 20px
</style>