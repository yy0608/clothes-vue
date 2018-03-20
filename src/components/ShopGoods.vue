<template>
<div class="manage-item goods-manage-cont">
  <title-cont :title="'商家列表 > 店铺列表 > 商品列表'" :buttons="[{label: '添加商品', func: goAdd}]" :back="true"></title-cont>
</div>
</template>

<script>
import TitleCont from './TitleCont.vue'

export default {
  components: {
    TitleCont
  },
  methods: {
    goAdd () {
      let _id = this.$route.params._id
      this.$router.push({
        path: '/home/goods_add/' + _id
      })
    }
  }
}
</script>
