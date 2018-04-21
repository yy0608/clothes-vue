<template>
<div class="manage-item goods-add-manage-cont">
  <title-cont :title="shop_id ? '商家列表 > 店铺列表 > 商品列表 > 添加商品' : '商品列表 > 添加商品'" :back="true"></title-cont>
  <el-form class="goods-add-form" :model="form" ref="form" label-width="80px" label-position="left" :rules="rules">
    <el-form-item label="店铺id" prop="shop_id">
      <el-input :disabled="!!shop_id || !!goods_id" v-model="form.shop_id"></el-input>
    </el-form-item>
    <el-form-item label="类别" prop="category">
      <el-cascader
        clearable
        v-model="form.category"
        :disabled="!!goods_id"
        :options="goodsCategories"
      ></el-cascader>
    </el-form-item>
    <el-form-item label="名称" prop="title">
      <el-input v-model="form.title"></el-input>
    </el-form-item>
    <el-form-item label="大概价格" prop="valuation">
      <el-input type="number" v-model.number="form.valuation"></el-input>
    </el-form-item>
    <el-form-item label="封面图片" prop="cover">
      <upload :multiple="false" ref="coverUpload" :dirname="'goods/cover'" :onSuccess="uploadCoverSuccess"></upload>
    </el-form-item>
    <el-form-item label="轮播图片" prop="figure_imgs">
      <upload :multiple="true" ref="figureUpload" :dirname="'goods/figure'" :onSuccess="uploadFigureSuccess"></upload>
    </el-form-item>
    <el-form-item label="内容详情" prop="detail_imgs">
      <upload :multiple="true" ref="detailUpload" :dirname="'goods/detail'" :onSuccess="uploadDetailSuccess"></upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">{{goods_id ? '确认修改' : '确认添加'}}</el-button>
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
      categoryList: [],
      goodsCategories: [],
      shop_id: this.$route.params._id ? this.$route.params._id : '',
      goods_id: this.$route.query._id ? this.$route.query._id : '',
      form: {
        shop_id: this.$route.params._id ? this.$route.params._id : '',
        title: '',
        category: [],
        valuation: '',
        cover: '',
        figure_imgs: [],
        detail_imgs: []
      },
      rules: {
        shop_id: [{
          required: true,
          message: '请输入正确的店铺id',
          validator: null
        }],
        title: [{
          required: true,
          message: '输入商品标题'
        }],
        category: [{
          required: true,
          message: '输入商品分类'
        }],
        valuation: [{
          required: true,
          message: '输入大概价格'
        }],
        cover: [{
          required: true,
          message: '上传封面图片'
        }],
        figure_imgs: [{
          required: true,
          message: '上传轮播图片'
        }],
        detail_imgs: [{
          required: true,
          message: '上传详情图片'
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
    if (this.goods_id) {
      this.getGoodsDetail()
    }
    this.changeRules()
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
          this.categoryList = res.data.data
          this.goodsCategories = formatCategoriesForCascader(res.data.data, undefined)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getGoodsDetail () {
      axios({
        url: origin + '/employ/goods_detail',
        method: 'get',
        params: { _id: this.goods_id },
        withCredentials: true
      })
        .then(res => {
          if (!res.data.success) {
            return this.$message.error(res.data.msg)
          }
          let tempData = { ...res.data.data }
          delete tempData.createdAt
          delete tempData.created_ts
          delete tempData.updatedAt
          delete tempData._id
          delete tempData.merchant_id
          // this.timer = setInterval(() => {},)
          this.form = {
            ...tempData,
            valuation: tempData.valuation / 100,
            category: formatCategoryForDefaultValue(tempData.category_id, this.categoryList, true) // 此处待优化，不知道哪个请求快，this.categoryList可能为空
          }
          delete this.form.category_id
          this.origin_cover = tempData.cover
          this.origin_figure_imgs = [ ...tempData.figure_imgs ]
          this.origin_detail_imgs = [ ...tempData.detail_imgs ]
          this.$refs.coverUpload.uploadKeyList = [ res.data.data.cover ]
          this.$refs.figureUpload.uploadKeyList = [ ...tempData.figure_imgs ]
          this.$refs.detailUpload.uploadKeyList = [ ...tempData.detail_imgs ]
          this.categoryList = null
          tempData = null
        })
        .catch(err => {
          console.log(err)
          this.$message.error('请求出错')
        })
    },
    changeRules () {
      if (this.shop_id) {
        this.$set(this.rules, 'shop_id', null)
      } else {
        this.$set(this.rules, 'shop_id', [{
          required: true,
          trigger: 'blur', // change
          validator: (rule, value, callback) => {
            if (!value.match(/^[0-9a-fA-F]{24}$/)) {
              return callback(new Error('请输入正确店铺id'))
            }
            axios({
              url: origin + '/employ/shop_detail',
              method: 'get',
              params: { shop_id: value }
            })
              .then(res => {
                // console.log(res.data)
                if (res.data.success) {
                  callback()
                } else {
                  callback(new Error(res.data.msg))
                }
              })
              .catch(err => {
                console.log(err)
                callback(new Error('请求出错'))
              })
          }
        }])
      }
    },
    uploadCoverSuccess (val) {
      this.form.cover = val[0]
    },
    uploadFigureSuccess (val) {
      this.form.figure_imgs = val
    },
    uploadDetailSuccess (val) {
      this.form.detail_imgs = val
    },
    submit () {
      this.$refs.form.validate(bool => {
        if (!bool) {
          return this.$message.error('填写出错')
        }
        let data = {
          ...this.form,
          category_id: this.form.category[this.form.category.length - 1],
          valuation: this.form.valuation * 100
        }
        delete data.category
        if (this.goods_id) {
          data.goods_id = this.goods_id
          data.origin_cover = this.origin_cover
          data.origin_figure_imgs = [ ...this.origin_figure_imgs ]
          data.origin_detail_imgs = [ ...this.origin_detail_imgs ]
          delete data.category_id
          delete data.shop_id
        }
        let url = this.goods_id ? origin + '/employ/goods_edit' : origin + '/employ/goods_add'
        axios({
          url,
          method: 'post',
          withCredentials: true,
          data: data
        })
          .then(res => {
            console.log(res.data)
            if (res.data.success) {
              this.$message.success(res.data.msg)
              setTimeout(() => {
                this.$router.go(-1)
              }, 1000)
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
.goods-add-form {
  padding: 20px;
  width: 500px;
  .el-cascader {
    width: 100%;
  }
}
</style>
