<template>
  <div id="pageTemp" :style="style">
    <div v-for="(item, index) in domData" :key="index">
      <template class="mrbt" v-if="item.type === 0"><cube :config="item.config"></cube></template>
      <richText class="mrbt" v-else-if="item.type === 1" :config="item.config"></richText>
      <!-- <productBlock class="mrbt pdl" v-else-if="item.type === 2 || item.type === 9" :config="item.config"></productBlock> -->
      <imgBlock class="mrbt" v-else-if="item.type === 3" :config="item.config"></imgBlock>
      <iviewswiper class="mrbt" v-else-if="item.type === 4" :config="item.config"></iviewswiper>
      <!-- <vuxswiper v-else-if="item.type === 4" :config="item.config"></vuxswiper> -->
      <emptySeat class="mrbt" v-else-if="item.type === 5" :height="item.config"></emptySeat>
      <partingLine class="mrbt" v-else-if="item.type === 6" :config="item.config"></partingLine>
      <iconNav class="mrbt" v-else-if="item.type === 7" :config="item.config"></iconNav>
      <videoBlock class="mrbt" v-else-if="item.type === 8" :config="item.config"></videoBlock>   
      <productBlock v-else-if="item.type === 2 || item.type === 9" :config="item.config"></productBlock>  
    </div> 
  </div>
</template>
<script type="text/ecmascript-6">
  import productBlock from './productBlock.vue'
  import richText from './richText.vue'
  import cube from './cube.vue'
  import imgBlock from './imgBlock.vue'
  import iviewswiper from './iviewswiper.vue'
  import emptySeat from './emptySeat.vue'
  import partingLine from './partingLine.vue'
  import videoBlock from './videoBlock.vue'
  export default {
    name: 'pageTemplate',
    components: {
      richText,
      cube,
      productBlock,
      imgBlock,
      iviewswiper,
      emptySeat,
      partingLine,
      videoBlock,
    },
    data () {
      return {
        style:{}  
      }
    },
    props: {
      template: String
    },
    created () {
      this.style = {
        'height': document.documentElement.clientHeight - 339 + 'px',
        'backgroundColor': '#eee'
      }
    },
    computed: {
      domData () {
        // return this.template ? JSON.parse(this.template) : []
        if ( this.template ) {
          this.style = ''
          return JSON.parse(this.template)
        } else {
          return []
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
#pageTemp {
  overflow: visible;
  .mrbt{
    margin-bottom: 15px
  }
}
</style>