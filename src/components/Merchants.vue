<template>
<div class="manage-item merchants-manage-cont">
  <title-cont :title="'商家列表'" :btnTitle="'添加分类'" :btnEvent="goAdd"></title-cont>
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
      this.$router.push('/home/merchant_add')
    }
  }
}
</script>

<style lang="scss">
</style>
