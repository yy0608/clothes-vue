<template>
<div class="manage-item topic-add-manage-cont">
  <title-cont :title="'帖子列表 > 添加帖子'" :back="true"></title-cont>
  <el-form class="merchant-add-form" :model="form" ref="form" label-width="80px" label-position="left" :rules="rules" :validate-on-rule-change="false">
    <el-form-item
      v-for="(item, index) in form.content"
      :key="item.key"
      :label="item.type === 1 ? '文本内容' : '图片内容'">
        <el-input
          v-if="item.type === 1"
          v-model="item.value"
          type="textarea"
          resize="none"></el-input>
        <upload
          v-if="item.type === 2"
          :ref="'upload' + index"
          :onSuccess="uploadSuccess"
          :onError="uploadError"
          :dirname="'topic'"></upload>
      </el-form-item>
    <el-form-item class="around-btns">
      <el-button @click="addContent(1)">添加文字</el-button>
      <el-button @click="addContent(2)">添加图片</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">确认添加</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
// import axios from 'axios'
// import { origin, imgOrigin } from '@/config.js'
import TitleCont from './TitleCont.vue'
import Upload from './Upload.vue'

export default {
  data () {
    return {
      form: {
        content: [{
          value: '',
          type: 1,
          key: Date.now()
        }]
      },
      rules: {
        name: [{
          required: true,
          message: '输入分类名称'
        }]
      }
    }
  },
  components: {
    TitleCont,
    Upload
  },
  methods: {
    submit () {
      console.log(this.form)
    },
    addContent (type) {
      this.form.content.push({
        type,
        value: '',
        key: Date.now()
      })
    },
    uploadSuccess (keyList) {
      // let src = imgOrigin + keyList[0]
      // this.form.icon = src
      console.log(keyList)
    },
    uploadError (err, file) {
      console.log(err, file)
    }
  }
}
</script>

<style lang="scss">
.topic-add-manage-cont {
  .around-btns .el-form-item__content {
    display: flex;
    justify-content: space-between;
  }
}
</style>
