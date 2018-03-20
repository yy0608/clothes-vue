<template>
<div class="manage-item goods-manage-cont">
  <title-cont :title="'分类列表'" :buttons="[{label: '添加分类', func: goAdd}]" :back="true"></title-cont>
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
      this.$router.push('/home/category_add')
    }
  }
}
</script>
