<template>
<div class="manage-item topics-manage-cont">
  <title-cont :title="'帖子列表'" :buttons="[{label: '添加帖子', func: goAdd}]" :back="false"></title-cont>
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
      this.$router.push('/home/topic_add')
    }
  }
}
</script>
