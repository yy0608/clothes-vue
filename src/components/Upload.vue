<template>
<div class="upload-temp-cont">
  <!-- action="https://upload-z2.qiniup.com" -->
  <el-upload
    class="resource-uploader"
    accept="image/png, image/jpeg"
    :action="origin"
    :multiple="true"
    :data="uploadData"
    :show-file-list="false"
    :on-change="handleChange"
    :before-upload="beforeUpload"
    :on-success="handleSuccess"
    :on-error="handleError"
    :http-request="uploadRequest">
      <img v-if="fileList.length" v-for="(item, index) in fileList" :src="URL.createObjectURL(item.raw)" :key="index" class="uploader-img">
      <i class="el-icon-plus uploader-icon"></i>
    </el-upload>
</div>
</template>

<script>
import axios from 'axios'
import { origin, imgOrigin, qiniuDirname } from '@/config.js'
import { generateGuid } from '@/utils.js'

export default {
  data () {
    return {
      uploadData: {
        key: '',
        token: ''
      },
      origin: origin,
      imgUrl: '',
      fileList: [],
      URL: window.URL
    }
  },
  props: {
    dirname: {
      type: String,
      default: 'unspecified'
    },
    imgOrigin: {
      type: String,
      default: imgOrigin
    },
    onSuccess: {
      type: Function
    },
    onError: {
      type: Function
    },
    uploadRequest: {
      type: Function,
      required: true
    }
  },
  created () {
    // this.getUploadToken()
  },
  methods: {
    getUploadToken () {
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
    handleChange (file, fileList) {
      // console.log(111, file)
      // console.log(222, fileList)
      this.fileList.push(file)
    },
    beforeUpload (file) {
      let isValidImg = file.type === 'image/jpeg' || file.type === 'image/png'
      let isLt2M = file.size / 1024 / 1024 < 2
      if (isValidImg && isLt2M) {
        let extension = file.type === 'image/jpeg' ? '.jpg' : '.png'
        let filename = generateGuid() + extension
        this.uploadData.key = qiniuDirname + '/' + this.dirname + '/' + filename
      }

      if (!isValidImg) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isValidImg && isLt2M
    },
    handleSuccess (res, file) {
      console.log(res)
      // this.form.logo = this.uploadData.key
      // this.imgUrl = this.imgOrigin + this.uploadData.key
      this.imgUrl = URL.createObjectURL(file.raw)
      this.$message.success('上传文件成功')
      this.onSuccess && this.onSuccess(this.uploadData.key)
    },
    handleError (err) {
      this.$message.error('上传文件失败')
      this.onError && this.onError(err)
    }
  }
}
</script>

<style lang="scss">
.resource-uploader {
  height: 60px;
   .el-upload {
    position: relative;
    overflow: hidden;
  }
  .uploader-icon {
    border-radius: 6px;
    cursor: pointer;
    border: 1px dashed #d9d9d9;
    font-size: 28px;
    color: #8c939d;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    &:hover {
      border-color: #409EFF;
    }
  }
  .uploader-img {
    border-radius: 6px;
    margin-right: 5px;
    float: left;
    width: 60px;
    height: 60px;
  }
}
</style>
