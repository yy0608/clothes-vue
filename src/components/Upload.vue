<template>
<div class="upload-resource-cont">
  <div class="imgs-cont" v-if="fileSrcList.length">
    <div class="img-item"
      v-for="(item, index) in fileSrcList"
      :key="index">
      <img class="uploader-img"
        :src="item"
        @click="showImgView(index)">
        <i class="el-icon el-icon-circle-close"
          @click="deleteImg(index)"></i>
    </div>
  </div>
  <template v-if="showView">
    <image-view
      :imgArr="fileSrcList"
      :showImageView="true"
      :imageIndex="curIndex"
      @hideImage="hideImageView"></image-view>
  </template>
  <!-- action="https://upload-z2.qiniup.com" -->
  <el-upload
    class="resource-uploader"
    accept="image/png, image/jpeg"
    :action="origin"
    :multiple="multiple"
    :data="uploadData"
    :show-file-list="false"
    :on-success="handleSuccess"
    :before-upload="checkValidImage"
    :on-error="handleError"
    :http-request="uploadRequest">
      <i class="el-icon-plus uploader-icon"></i>
    </el-upload>
  <el-button @click="testUpload">测试上传</el-button>
</div>
</template>

<script>
import axios from 'axios'
import imageView from 'vue-imageview'
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
      URL: window.URL,
      showView: false,
      curIndex: 0
    }
  },
  props: {
    dirname: {
      type: String,
      default: 'unspecified'
    },
    multiple: {
      type: Boolean,
      default: false
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
  computed: {
    fileSrcList () {
      let resArr = []
      for (let item of this.fileList) {
        resArr.push(window.URL.createObjectURL(item))
      }
      return resArr
    }
  },
  components: {
    imageView
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
    checkValidImage (file) {
      let isValidImg = file.type === 'image/jpeg' || file.type === 'image/png'
      let isLt2M = file.size / 1024 / 1024 < 2
      if (isValidImg && isLt2M) {
        let extension = file.type === 'image/jpeg' ? '.jpg' : '.png'
        let filename = generateGuid() + extension
        this.uploadData.key = qiniuDirname + '/' + this.dirname + '/' + filename
        this.fileList.push(file)
      }

      if (!isValidImg) {
        this.$message.error('只能是 JPG 或 PNG 格式的图片!')
      }
      if (!isLt2M) {
        this.$message.error('只能是大小不能超过 2MB 的图片!')
      }
      return isValidImg && isLt2M
    },
    handleSuccess (res, file) {
      // this.form.logo = this.uploadData.key
      // this.imgUrl = this.imgOrigin + this.uploadData.key
      this.imgUrl = URL.createObjectURL(file.raw)
      this.$message.success('上传文件成功')
      this.onSuccess && this.onSuccess(this.uploadData.key)
    },
    handleError (err) {
      this.$message.error('上传文件失败')
      this.onError && this.onError(err)
    },
    showImgView (index) {
      this.showView = true
      this.curIndex = index
    },
    hideImageView () {
      this.showView = false
    },
    deleteImg (index) {
      this.fileList.splice(index, 1)
    },
    testUpload () {
      axios({
        url: origin + '/employ/upload_to_qiniu',
        method: 'post',
        data: {
          fileList: this.fileList,
          key: this.uploadData.key
        },
        withCredentials: true
      })
        .then(res => {
          console.log(res.data)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss">
.upload-resource-cont {
  height: 60px;
  .imgs-cont {
    float: left;
    height: 60px;
  }
  .img-item {
    position: relative;
    float: left;
    margin-right: 10px;
    cursor: pointer;
    cursor: zoom-in;
    &:hover .el-icon {
      opacity: 1;
      pointer-events: initial;
    }
    .el-icon {
      position: absolute;
      right: -6px;
      top: -6px;
      font-size: 20px;
      z-index: 2;
      color: red;
      background-color: #fff;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      transition: opacity .2s ease;
      cursor: pointer;
    }
  }
  .uploader-img {
    border-radius: 6px;
    width: 60px;
    height: 60px;
  }
}
.resource-uploader {
  float: left;
  height: 60px;
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
    box-sizing: border-box;
    &:hover {
      border-color: #409EFF;
    }
  }
}
</style>
