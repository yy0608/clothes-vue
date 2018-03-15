<template>
<div class="title-cont">
  <div class="title">{{title}}</div>
  <div class="buttons-cont">
    <el-button v-for="(item, index) in buttons" size="mini" :key="index" @click="item.func">{{item.label}}</el-button>
    <el-button v-if="back" @click="goBack" size="mini" icon="el-icon-arrow-left">返回</el-button>
  </div>
</div>
</template>

<script>
export default {
  props: [
    'title',
    'buttons',
    'back'
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
