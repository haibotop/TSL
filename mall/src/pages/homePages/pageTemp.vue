<template>
  <div id="pageTemp">
    <div v-for="(item, index) in domData" :key="index">
      <template v-if="item.type === 0"><cube :config="item.config"></cube></template>
      <richText v-else-if="item.type === 1" :config="item.config"></richText>
      <productBlock v-else-if="item.type === 2 || item.type === 9" :config="item.config"></productBlock>
      <imgBlock v-else-if="item.type === 3" :config="item.config"></imgBlock>
      <!-- <swiperBlock v-else-if="item.type === 4" :config="item.config"></swiperBlock> -->
      <vuxswiper v-else-if="item.type === 4" :config="item.config"></vuxswiper>
      <emptySeat v-else-if="item.type === 5" :height="item.config"></emptySeat>
      <partingLine v-else-if="item.type === 6" :config="item.config"></partingLine>
      <iconNav v-else-if="item.type === 7" :config="item.config"></iconNav>
      <videoBlock v-else-if="item.type === 8" :config="item.config"></videoBlock>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import richText from './richText.vue'
  import cube from './cube.vue'
  import productBlock from './productBlock.vue'
  import imgBlock from './imgBlock.vue'
  import swiperBlock from './swiperBlock.vue'
  import vuxswiper from './vuxSwiper.vue'
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
      vuxswiper,
      swiperBlock,
      emptySeat,
      partingLine,
      videoBlock
    },
    props: {
      template: String
    },
    computed: {
      domData () {
        return this.template ? JSON.parse(this.template) : []
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
#pageTemp {
  overflow: visible;
}
</style>

