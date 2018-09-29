<template>
    <div class="header">
        <div class="header-left">
            <Dropdown trigger="custom"  :visible="visible" style="margin-left: 6px;padding-left:10px" :class="{bgColor:bgColor}" >
                <a href="javascript:void(0)" @click.stop="handleOpen">
                    <span>每日金价</span>
                    <Icon :type="type" size="16"></Icon>
                </a>  
                <DropdownMenu  slot="list" class="dayprice" >
                        <h3>香港金价（每两）</h3>
                        <table>
                            <tr>
                                <th>  </th>
                                <th>卖出（HKD）</th>
                                <th>买入（HKD）</th>
                            </tr>
                            <tr>
                                <td>足金饰品</td>
                                <td>12940</td>
                                <td>11440</td>
                            </tr>
                            <tr>
                                <td>铂金饰品</td>
                                <td>-</td>
                                <td>7190</td>
                            </tr>
                            <tr>
                                <td>足金金条</td>
                                <td>11840</td>
                                <td>11300</td>
                            </tr>
                        </table>
                        <h3>内定金价（每克）</h3>
                        <table>
                            <tr>
                                <th>  </th>
                                <th>卖出（HKD）</th>
                                <th>  </th>
                            </tr>
                            <tr>
                                <td>足金饰品</td>
                                <td>12940</td>
                                <td></td>
                            </tr>
 
                            <tr>
                                <td>足金金条</td>
                                <td>11840</td>
                                <td></td>
                            </tr>
                        </table>
                        <p>*以上进价仅供参考，请以具体门店报价为准<br>
                            最后更新：2018/09/25 09:40:00
                        </p>
                </DropdownMenu>
            </Dropdown>
        </div>     
        <div class="header-right">
            <router-link tag="a" to="/login">     
                <i><img src="../../assets/icons/icon_call.png" width="24" style="vertical-align:middle"></i>
                <span>在线客服</span>
            </router-link>
            <router-link tag="a" to="/login">     
                <Icon type="ios-contact-outline" size="20"/>
                <span>登录/注册</span>
            </router-link>
            <router-link tag="a" to="/" >              
                <Icon type="md-heart-outline" size="20"/>
                <span>我的收藏</span>
            </router-link>
            <!-- <router-link tag="a" to="/">              
                <Icon  type="ios-lock-outline" size="20"/>
                <span>购物袋</span>
            </router-link> -->
            <Dropdown trigger="custom"  :visible="visible2" style="margin-left: -10px;padding-left:10px" :class="{bgColor:bgColor2}" >
                <a href="javascript:void(0)" @click.stop="handleClick" >              
                    <Icon  type="ios-lock-outline" size="20"/>
                    <span>购物袋</span>
                </a>
                <DropdownMenu slot="list" class="shopCart">
                    <template>
                        <Table height="250" :columns="columns1" :data="data2"  size="small"></Table>
                    </template>     
                </DropdownMenu>
            </Dropdown>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                visible: false,
                visible2: false,
                bgColor:false,
                bgColor2:false,
                type:"ios-arrow-down",
                columns1: [
                    {
                        title: '购物袋',
                        key: 'name'
                    },
                    {
                        title: 'Age',
                        key: 'age'
                    },
                    {
                        title: 'Address',
                        key: 'address'
                    }
                ],
                data2: [
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park',
                        date: '2016-10-01'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        date: '2016-10-02'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        date: '2016-10-04'
                    },
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park',
                        date: '2016-10-01'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        date: '2016-10-02'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        date: '2016-10-04'
                    }
                ]    
            }
        },
        methods: {   
            handleOpen () {
                this.bgColor = !this.bgColor
                this.visible =  !this.visible
                this.type = this.type === "ios-arrow-down"?"ios-arrow-up":"ios-arrow-down"
            },
            handleClick(){
                this.bgColor2 = !this.bgColor2
                this.visible2 =  !this.visible2
            },
            bind(){
                document.onclick = ()=>{
                    if(this.bgColor){
                        this.handleOpen ()
                    }  
                    if(this.bgColor2){
                        this.handleClick ()
                    }   
                },
                document.getElementsByClassName('ivu-select-dropdown')[0].onclick=(e)=>{
                    e.stopPropagation()
                }
                document.getElementsByClassName('ivu-select-dropdown')[1].onclick=(e)=>{
                    e.stopPropagation()
                }
            }           
        },
        mounted () {
            this.bind()
        }
    }
</script>

<style>
    .header .header-left .ivu-select-dropdown{
        padding: 0;
        margin: 0;
        left: 100px!important
    }
    .header .header-right .ivu-select-dropdown{
        padding: 0;
        margin: 0;
        left: 724px!important
    }
</style>

<style lang="stylus" scoped>
@import "~styles/common/common.styl";  
    .header
        height 40px
        line-height 40px
        background-color #fff
        .header-left
            $ml(60px)
            float left
            i 
                color $blue
            .bgColor              
                background-color $blue
                span 
                    color #fff
                i 
                    color #fff
                .dayprice
                    padding-left 10px     
                    width 350px
                    height 450px
                    $border(b,1px)
                    $border(border-left,8px)
                    padding 0
                    text-align center
                    h3
                        font-size 16px
                        line-height 50px
                        text-align center
                        color $blue
                    table                                    
                        font-size 12px
                        display inline-block
                        tr:nth-of-type(1)
                            color #000  
                            display block
                            $border(border-bottom,1px)
                            th
                                width 100px
                           
                        td
                            width 100px
                            text-align center
                            line-height 25px
                            color $blue
                    p
                        font-size 12px
                        line-height 18px
                        $mt(10px)
                        color $blue                  
        span,a
            color #000
            margin-right 10px
        .header-right
            float right
            .bgColor              
                background-color $blue
                a 
                    i,span 
                        color #fff   
                .shopCart    
                    width 550px
                    height 300px
                    $border(b,1px)
                    $border(border-left,8px)
                    padding 0
                    text-align center    
            a
                $mr(20px)
                i 
                    color $blue
</style>