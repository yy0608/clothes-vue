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
        :disabled="isEdit"
        :options="goodsCategories"
      ></el-cascader>
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="desc">
      <el-input v-model="form.desc"></el-input>
    </el-form-item>
    <el-form-item v-if="iconInputShow" class="upload-form-item" label="图标" prop="icon">
      <upload
        :multiple="false"
        :onSuccess="uploadSuccess"
        :onError="uploadError"
        :dirname="'icon'"
        :measure="'60px'"
        :defaultKeyList="defaultKeyList"
        ref="upload"></upload>
      <el-input type="textarea" resize="none" v-model="form.icon" @change="inputIconUrl"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">{{ category_id ? '确认修改' : '确认添加' }}</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import axios from 'axios'
import { origin, imgOrigin } from '@/config.js'
import TitleCont from './TitleCont.vue'
import Upload from './Upload.vue'
import { formatCategoriesForCascader, formatCategoryForDefaultValue } from '@/utils.js'

export default {
  data () {
    return {
      serverCategories: [],
      goodsCategories: [],
      defaultCategory: [],
      defaultKeyList: [],
      validLevel: 2,
      category_id: this.$route.query._id,
      isEdit: !!this.$route.query._id,
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
        }],
        icon: null
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
      this.getCategoryDetail()
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
          this.$message.error('获取分类列表失败')
        })
    },
    getCategoryDetail () {
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
          if (res.data.data.level === 3) { // icon输入框显示
            this.$set(this.rules, 'icon', [{
              required: true,
              message: '上传icon或输入地址'
            }])
            this.iconInputShow = true
          }

          // 设置父级cascader
          this.defaultCategory = formatCategoryForDefaultValue(res.data.data, this.serverCategories)

          // 设置form
          this.origin_icon = res.data.data.icon
          let icon = /(http:\/\/)|(https:\/\/)/.test(res.data.data.icon) ? res.data.data.icon : imgOrigin + res.data.data.icon
          this.form = {
            ...res.data.data,
            parent: [ ...this.defaultCategory ],
            icon
          }

          // 设置子组件upload的图片
          if (this.iconInputShow) {
            this.$nextTick(() => {
              let key = icon.replace(imgOrigin, '')
              this.$refs.upload.uploadKeyList = [ key ]
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleChange (val) {
      if (val.length >= this.validLevel) {
        this.iconInputShow = true
        this.$set(this.rules, 'icon', [{
          required: true,
          message: '上传icon或输入地址'
        }])
      } else {
        this.form.icon = ''
        this.iconInputShow = false
        this.$set(this.rules, 'icon', null)
      }
    },
    submit () {
      this.$refs.form.validate(bool => {
        if (!bool) {
          return this.$message.error('填写出错')
        }
        let icon = this.form.icon.replace(imgOrigin, '')
        let url = this.isEdit ? origin + '/employ/category_edit' : origin + '/employ/category_add'
        let data = null
        if (this.isEdit) { // 编辑状态
          data = {
            _id: this.form._id,
            name: this.form.name,
            desc: this.form.desc,
            icon
          }
          if (icon === this.origin_icon) { // 图标没修改
            delete data.icon
          } else {
            data.origin_icon = this.origin_icon
          }
          console.log(data)
        } else { // 添加状态
          data = {
            ...this.form,
            icon
          }
        }
        axios({
          url,
          withCredentials: true,
          method: 'post',
          data: data
        })
          .then(res => {
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
    },
    inputIconUrl () {
      let key = this.form.icon.replace(imgOrigin, '')
      this.$refs.upload.uploadKeyList = [ key ]
    },
    uploadSuccess (keyList) {
      let src = imgOrigin + keyList[0]
      this.form.icon = src
    },
    uploadError (err, file) {
      console.log(err, file)
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
  .upload-form-item {
    .el-form-item__content {
      display: flex;
      align-items: center;
      .el-textarea {
        margin-left: 20px;
      }
    }
  }
}
</style>
