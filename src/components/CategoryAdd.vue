<template>
<div class="manage-item category-add-manage-cont">
  <title-cont :title="'分类列表 > 添加分类'" :back="true"></title-cont>
  <el-form class="merchant-add-form" :model="form" ref="form" label-width="80px" label-position="left" :rules="rules" :validate-on-rule-change="false">
    <el-form-item label="上级分类" prop="parent" placeholder="不选则为一级分类">
      <el-cascader
        clearable
        change-on-select
        v-model="form.parent"
        @change="handleChange"
        :options="goodsCategories"
      ></el-cascader>
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="desc">
      <el-input v-model="form.desc"></el-input>
    </el-form-item>
    <!-- <el-form-item label="上级" prop="parent">
      <el-input v-model="form.parent"></el-input>
    </el-form-item> -->
    <el-form-item v-if="iconInputShow" label="图标" prop="icon">
      <el-input v-model="form.icon"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">{{ category_id ? '确认添加' : '确认修改' }}</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import axios from 'axios'
import { origin } from '@/config.js'
import TitleCont from './TitleCont.vue'
import Upload from './Upload.vue'
import { formatCategoriesForCascader, formatCategoryForDefaultValue } from '@/utils.js'

export default {
  data () {
    return {
      serverCategories: [],
      goodsCategories: [],
      defaultCategory: [],
      validLevel: 2,
      category_id: this.$route.query._id,
      form: {
        name: '',
        desc: '',
        parent: [],
        icon: ''
      },
      iconInputShow: false,
      rules: {
        name: [{
          required: true,
          message: '输入分类名称'
        }],
        desc: [{
          required: true,
          message: '输入分类描述'
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
    if (this.category_id) {
      axios({
        url: origin + '/employ/category_detail',
        method: 'get',
        withCredentials: true,
        params: { _id: this.category_id }
      })
        .then(res => {
          if (!res.data.success) {
            return this.$message.error(res.data.msg)
          }
          if (res.data.data.level === 3) {
            this.iconInputShow = true
          }
          this.form = res.data.data
          this.defaultCategory = formatCategoryForDefaultValue(res.data.data, this.serverCategories)
          this.form.parent = [ ...this.defaultCategory ]
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  methods: {
    getGoodsCategories () {
      axios({
        url: origin + '/employ/goods_categories',
        withCredentials: true,
        method: 'get'
      })
        .then(res => {
          if (!res.data.success) {
            return this.$message.error('获取分类列表失败')
          }
          this.serverCategories = res.data.data
          this.goodsCategories = formatCategoriesForCascader(res.data.data, true)
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleChange (val) {
      if (val.length >= this.validLevel) {
        this.iconInputShow = true
        this.rules = {
          name: [{
            required: true,
            message: '输入分类名称'
          }],
          desc: [{
            required: true,
            message: '输入分类描述'
          }],
          icon: [{
            required: true,
            message: '上传icon或输入地址'
          }]
        }
      } else {
        this.iconInputShow = false
        this.rules = {
          name: [{
            required: true,
            message: '输入分类名称'
          }],
          desc: [{
            required: true,
            message: '输入分类描述'
          }]
        }
      }
    },
    submit () {
      this.$refs.form.validate(bool => {
        if (!bool) {
          this.$message('填写出错')
          return
        }
        let data = this.form.icon ? {
          name: this.form.name,
          desc: this.form.desc,
          parent: this.form.parent,
          icon: this.form.icon
        } : {
          name: this.form.name,
          desc: this.form.desc,
          parent: this.form.parent
        }
        axios({
          url: origin + '/employ/category_add',
          withCredentials: true,
          method: 'post',
          data: data
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
.merchant-add-form {
  padding: 20px;
  width: 500px;
  .el-cascader {
    width: 100%;
  }
}
</style>
