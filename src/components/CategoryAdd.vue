<template>
<div class="manage-item category-add-manage-cont">
  <title-cont :title="'分类列表 > 添加分类'" :back="true"></title-cont>
  <el-form class="merchant-add-form" :model="form" ref="form" label-width="80px" label-position="left" :rules="rules">
    <el-form-item label="名称" prop="label">
      <el-input v-model="form.label"></el-input>
    </el-form-item>
    <el-form-item label="上级分类" prop="parent">
      <el-cascader
        clearable
        change-on-select
        v-model="form.parent"
        @change="handleChange"
        :options="goodsCategories"
      ></el-cascader>
    </el-form-item>
    <el-form-item v-if="iconInputShow" label="图标" prop="icon">
      <el-input v-model="form.icon"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">添加</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import axios from 'axios'
import { origin } from '@/config.js'
import TitleCont from './TitleCont.vue'
import Upload from './Upload.vue'
import { generateGuid } from '@/utils.js'

export default {
  data () {
    return {
      goodsCategories: [],
      form: {
        label: '',
        parent: [],
        icon: ''
      },
      iconInputShow: false,
      rules: {
        label: [{
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
  created () {
    this.getGoodsCategories()
  },
  methods: {
    getGoodsCategories () {
      axios({
        url: origin + '/employ/goods_categories',
        withCredentials: true,
        method: 'get'
      })
        .then(res => {
          console.log(111, res.data.data)
          if (!res.data.success) {
            return this.$message.error('获取分类列表失败')
          }
          this.goodsCategories = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleChange (value) {
      // this.form.parent = value
      switch (value.length) {
        case 0:
          this.iconInputShow = false
          this.rules = {
            label: [{
              required: true,
              message: '输入分类名称'
            }]
          }
          break
        case 1:
          this.iconInputShow = false
          this.rules = {
            label: [{
              required: true,
              message: '输入分类名称'
            }]
          }
          break
        case 2:
          this.iconInputShow = true
          this.rules = {
            label: [{
              required: true,
              message: '输入分类名称'
            }],
            icon: [{
              required: true,
              message: '上传icon或输入地址'
            }]
          }
          break
      }
      console.log(this.form.parent)
    },
    submit () {
      this.$refs.form.validate(bool => {
        if (!bool) {
          console.log(this.form)
          this.$message('填写出错')
          return
        }
        axios({
          url: origin + '/employ/category_add',
          withCredentials: true,
          method: 'post',
          data: {
            value: generateGuid(),
            parent: this.form.parent,
            label: this.form.label,
            icon: this.form.icon
          }
        })
          .then(res => {
            if (res.data.success) {
              this.getGoodsCategories()
              this.$refs.form.resetFields()
              this.$message.success(res.data.msg)
            } else {
              this.$message.error(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
            this.$message.error('请求出错')
          })
      })
    }
  }
}
</script>

<style lang="scss">
.category-add-manage-cont {
  .el-form {
    padding: 20px;
    width: 500px;
    .el-cascader {
      width: 100%;
    }
  }
}
</style>
