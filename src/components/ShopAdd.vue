<template>
<div class="manage-item merchant-add-cont">
  <title-cont :title="'商家列表 > 店铺列表 > 添加店铺'" :back="true"></title-cont>
  <el-form class="merchant-add-form" :model="form" ref="form" label-width="100px" label-position="left" :rules="rules">
    <el-form-item label="名称" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="desc">
      <el-input type="textarea" resize="none" v-model="form.desc"></el-input>
    </el-form-item>
    <el-form-item class="upload-form-item" label="logo" prop="logo">
      <el-upload
        class="logo-uploader"
        action="https://upload-z2.qiniup.com"
        :data="uploadData"
        :show-file-list="false"
        :on-success="handleLogoSuccess"
        :before-upload="beforeLogoUpload">
          <img v-if="form.logo" :src="imgUrl" class="logo">
          <i v-else class="el-icon-plus logo-uploader-icon"></i>
        </el-upload>
      <el-input type="textarea" resize="none" v-model="form.logo" @change="inputLogoUrl"></el-input>
    </el-form-item>
    <el-form-item label="地址" prop="address">
      <el-input v-model="form.address"></el-input>
    </el-form-item>
    <el-form-item label="经纬度坐标" prop="location">
      <el-input v-model="form.location" placeholder="类似114.001432,22.681253"></el-input>
    </el-form-item>
    <el-form-item label="负责人" prop="manager">
      <el-input v-model="form.manager"></el-input>
    </el-form-item>
    <el-form-item label="电话" prop="phone">
      <el-input v-model="form.phone"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input type="textarea" resize="none" v-model="form.remark" placeholder="填写微信qq或其他信息"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">添加</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import axios from 'axios'
import { origin, imgOrigin } from '@/config.js'
import { parseDate } from '@/utils.js'
import TitleCont from './TitleCont.vue'
import { mapState } from 'vuex'
import md5 from 'js-md5'

export default {
  data () {
    return {
      uploadData: {
        key: '',
        token: ''
      },
      imgUrl: '',
      parseDate: parseDate,
      form: {
        name: '',
        desc: '',
        logo: '',
        address: '',
        location: '',
        manager: '',
        phone: '',
        remark: ''
      },
      rules: {
        name: [{
          required: true,
          message: '输入名称'
        }],
        desc: [{
          required: true,
          message: '输入描述'
        }],
        logo: [{
          required: true,
          message: '上传logo'
        }],
        address: [{
          required: true,
          message: '输入地址'
        }],
        location: [{
          required: true,
          message: '输入经纬度坐标'
        }],
        manager: [{
          required: true,
          message: '输入负责人名字'
        }],
        phone: [{
          required: true,
          message: '输入手机号'
        }]
      }
    }
  },
  computed: mapState([
    'userInfo'
  ]),
  components: {
    TitleCont
  },
  created () {
    axios({
      url: origin + '/employ/get_qiniu_upload_token',
      method: 'post',
      withCredentials: true
    })
      .then(res => {
        this.uploadData.token = res.data.data
      })
      .catch(err => {
        this.$message.error('获取七牛上传文件的token失败')
        console.log(err)
      })
  },
  methods: {
    submit () {
      this.$refs.form.validate(bool => {
        if (!bool) {
          this.$message('填写出错')
          return
        }
        let _id = this.$route.params._id
        var data = Object.assign({}, this.form, {
          merchant_id: _id
        })
        axios({
          url: origin + '/employ/shop_add',
          method: 'post',
          data,
          withCredentials: true
        })
          .then(res => {
            if (res.data.success) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              setTimeout(() => {
                this.$router.go(-1)
              }, 1000)
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          })
          .catch(err => {
            console.log(err)
            this.$message({
              message: '请求出错',
              type: 'error'
            })
          })
      })
    },
    inputLogoUrl () {
      this.imgUrl = this.form.logo
    },
    handleLogoSuccess (res, file) {
      this.form.logo = this.uploadData.key
      this.imgUrl = imgOrigin + this.form.logo
    },
    beforeLogoUpload (file) {
      let isValidImg = file.type === 'image/jpeg' || file.type === 'image/png'
      let isLt2M = file.size / 1024 / 1024 < 2
      if (isValidImg && isLt2M) {
        let extension = file.type === 'image/jpeg' ? '.jpg' : '.png'
        let filename = md5(Date.now() + this.$route.params._id + Math.random()) + extension
        this.uploadData.key = 'shop_logo/' + filename
      }

      if (!isValidImg) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isValidImg && isLt2M
    }
  }
}
</script>

<style lang="scss">
.merchant-add-form {
  padding: 20px;
  width: 500px;
  .sms-cont .el-form-item__content {
    display: flex;
    align-items: center;
  }
  .send-code {
    width: 112px;
    margin-left: 10px;
  }
  .logo-uploader {
    height: 60px;
  }
  .logo-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .logo-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .logo-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
  .logo {
    width: 60px;
    height: 60px;
    display: block;
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
