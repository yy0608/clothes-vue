<template>
<div class="manage-item goods-add-manage-cont">
  <title-cont :title="'商家列表 > 店铺列表 > 商品列表 > 添加商品'" :back="true"></title-cont>
  <el-form class="goods-add-form" :model="form" ref="form" label-width="80px" label-position="left" :rules="rules">
    <el-form-item label="类别" prop="category">
      <el-cascader
        clearable
        v-model="form.category"
        @change="handleChange"
        :options="goodsCategories"
      ></el-cascader>
    </el-form-item>
    <el-form-item label="名称" prop="title">
      <el-input v-model="form.title"></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="desc">
      <el-input v-model="form.desc"></el-input>
    </el-form-item>
    <el-form-item label="轮播图片" prop="figure_imgs">
      <upload :multiple="true" :dirname="'goods'" :onSuccess="uploadSuccess" :onError="uploadError"></upload>
    </el-form-item>
    <el-form-item label="大概价格" prop="valuation">
      <el-input type="number" v-model.number="form.valuation"></el-input>
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
import { formatCategoriesForCascader } from '@/utils.js'

export default {
  data () {
    return {
      goodsCategories: [],
      form: {
        title: '',
        desc: '',
        category: [],
        valuation: '',
        figure_imgs: []
        // detail_imgs: []
      },
      rules: {
        title: [{
          required: true,
          message: '输入商品标题'
        }],
        desc: [{
          required: true,
          message: '输入商品描述'
        }],
        category: [{
          required: true,
          message: '输入商品分类'
        }],
        valuation: [{
          required: true,
          message: '输入大概价格'
        }],
        figure_imgs: [{
          required: true,
          message: '上传轮播图片'
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
          if (!res.data.success) {
            return this.$message.error('获取分类列表失败')
          }
          this.goodsCategories = formatCategoriesForCascader(res.data.data, undefined)
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleChange (val) {},
    uploadSuccess (val) {
      console.log(val)
    },
    uploadError (err) {
      console.log(err)
    },
    submit () {
      this.$refs.form.validate(bool => {
        if (!bool) {
          console.log(this.form)
          this.$message('填写出错')
          return
        }
        let data = {
          title: this.form.title,
          desc: this.form.desc,
          category_id: this.form.category[this.form.category.length - 1],
          valuation: this.form.valuation,
          figure_imgs: this.form.figure_imgs
        }
        axios({
          url: origin + '/employ/goods_add',
          method: 'post',
          withCredentials: true,
          data: data
        })
        console.log(this.form)
      })
    }
  }
}
</script>

<style lang="scss">
.goods-add-form {
  padding: 20px;
  width: 500px;
  .el-cascader {
    width: 100%;
  }
}
</style>
