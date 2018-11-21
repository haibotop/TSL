<template>
    <div id="vueLoading" :class="{loading_:scope}" ref="vueLoading">
        <vue-loading class="loading-pic" color="#fff" :size="{ width: '50px', height: '50px' }"></vue-loading>  
    </div>
</template>

<script>
    export default {
        props: {
            'scope':{
                type: Boolean,
                default: false,
                required: false
            }
        },
        mounted () {
            if(this.scope){
                this.$refs.vueLoading.parentNode.style.position = 'relative'
            }
        }
    }
</script>

<style lang="stylus" scoped>
    #vueLoading.loading_
        position absolute
        width 100%
        height 100%
    #vueLoading
        position: fixed
        left 0
        top 0 
        width 100%
        height 100%
        background #000
        z-index 999
        opacity 0.5 
        .loading-pic
            position absolute
            left 50%
            top 50%
            margin-top -25px
            margin-left -25px

</style>