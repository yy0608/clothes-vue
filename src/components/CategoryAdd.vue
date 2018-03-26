<template>
<div class="manage-item merchants-manage-cont">
  <title-cont :title="'分类列表 > 添加分类'" :back="true"></title-cont>
  <upload :dirname="'category_icon'" :multiple="true" :onSuccess="handleSuccess" :onError="handleError" :measure="'100px'"></upload>
  <el-form class="merchant-add-form" :model="form" ref="form" label-width="80px" label-position="left" :rules="rules">
    <el-form-item label="名称" prop="value">
      <el-input v-model="form.value"></el-input>
    </el-form-item>
    <el-form-item label="上级分类" prop="id">
      <el-cascader
        :options="options"
        change-on-select
      ></el-cascader>
    </el-form-item>
    <el-form-item label="logo" prop="logo">
      <el-input v-model="form.logo"></el-input>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import axios from 'axios'
import { origin } from '@/config.js'
import TitleCont from './TitleCont.vue'
import Upload from './Upload.vue'

export default {
  data () {
    return {
      // options: [{
      //   label: 'ccc',
      //   value: 'aaa',
      //   children: [{
      //     label: '111',
      //     value: 'sss',
      //     children: [{
      //       label: 'ggg',
      //       value: '222'
      //     }]
      //   }]
      // }]
      options: [],
      form: {
        value: '',
        id: '',
        logo: ''
      },
      rules: {
        value: [{
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
    getGoodsCategories () {
      axios({
        url: origin + '/employ/goods_categories',
        withCredentials: true,
        method: 'get'
      })
        .then(res => {
          console.log(res.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSuccess (data) {
      console.log(data)
    },
    handleError (err) {
      console.log(err)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  padding: 20px;
  width: 500px;
}
</style>
