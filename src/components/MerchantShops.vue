<template>
<div class="manage-item merchant-shop-cont">
  <title-cont :title="'商家列表 > 店铺列表'" :buttons="[{label: '添加店铺', func: goAdd}]" :back="true"></title-cont>
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
        path: '/home/shop_add/' + _id
      })
    }
  }
}
</script>
