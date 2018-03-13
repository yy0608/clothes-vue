<template>
<div class="title-cont">
  <div class="title">{{title}}</div>
  <el-button v-if="btnTitle" size="mini" @click="btnEvent">{{btnTitle}}</el-button>
  <el-button v-else @click="goBack" size="mini" icon="el-icon-arrow-left">返回</el-button>
</div>
</template>

<script>
export default {
  props: [
    'title',
    'btnTitle',
    'btnEvent'
  ],
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.title-cont {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
}
</style>
