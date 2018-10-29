<template>
  <div id="mySet">
    <x-header :left-options="{backText: ''}" title="设置"></x-header>

    <group>
      <div class="user-info">
        <div class="head-portrait"><img :src="headPortrait" alt=""></div>
        <div class="nickname">{{nickname}}</div>
      </div>
      <cell title="账户安全" is-link @click.native="goAccount"></cell>
    </group>

    <!-- <group>
      <cell title="意见反馈" is-link></cell>
      <cell title="关于" is-link></cell>
    </group> -->

    <div class="logout-btn" @click="logout">退出登录</div>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as myAPI from '@/services/API/mineServices.es6'
  import { XHeader, Group, Cell } from 'vux'
  export default {
    name: 'mySet',
    components: { XHeader, Group, Cell },
    data () {
      return {
        nickname: '',
        headPortrait: ''
      }
    },
    mounted: function () {
      if (sessionStorage.getItem('userInfo')) {
        this.nickname = JSON.parse(sessionStorage.getItem('userInfo')).nickName || '未命名'
        this.headPortrait = (JSON.parse(sessionStorage.getItem('userInfo')).headPortrait || '').replace('!56', '!352') || ''
      }
    },
    methods: {
      goAccount () {
        this.$router.push({path: '/myAccount'})
      },
      logout () {
        this.$http.delete(...myAPI.logout())
        sessionStorage.removeItem('userInfo')
        sessionStorage.removeItem('setPw')
        this.$router.push({path: '/mine'})
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .user-info {
    padding: 10px 15px;
    overflow: hidden;
  }
  .head-portrait {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #eee;
    float: left;
    overflow: hidden;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .nickname {
    float: right;
    line-height: 50px;
    color: #4d4d4d;
  }
  .logout-btn {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    position: absolute;
    bottom: 0;
    background-color: #352665;
    font-size: 18px;
    color: #fff;
    letter-spacing: .18px;
    border-radius: 0;
  }
</style>

