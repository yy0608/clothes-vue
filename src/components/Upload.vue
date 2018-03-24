<template>
<div
  :class="[multiple ? '' : 'single', 'upload-resource-cont']"
  :style="{minHeight: measure}">
  <div class="imgs-cont" v-if="fileSrcList.length">
    <div class="img-item"
      v-for="(item, index) in fileSrcList"
      v-if="multiple || index === fileSrcList.length - 1"
      :style="{height: measure}"
      :key="index">
      <img
        class="uploader-img"
        :style="{width: measure}"
        :src="item"
        @load="imgLoad($event)"
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
  <!--  -->
  <el-upload
    class="resource-uploader"
    action="https://upload-z2.qiniup.com"
    accept="image/png, image/jpeg"
    :style="{width: measure, height: measure}"
    :limit="limit"
    :multiple="multiple"
    :data="uploadData"
    :show-file-list="false"
    :on-success="handleSuccess"
    :before-upload="checkValidImage"
    :on-exceed="beyondLimit"
    :on-error="handleError">
      <i
        :class="[fileSrcList.length && !multiple ? 'hide' : '', 'el-icon-plus uploader-icon']"
        :style="{lineHeight: measure}"></i>
    </el-upload>
</div>
</template>

<script>
import imageView from 'vue-imageview'
import { qiniuDirname } from '@/config.js'
import { generateGuid, getQiniuToken, getQiniuTokenRequest } from '@/utils.js'

export default {
  data () {
    return {
      uploadData: {
        key: '',
        token: ''
      },
      imgUrl: '',
      fileList: [],
      // fileSrcList: ['http://img.wsweat.cn/logo.png'],
      uploadKeyList: [],
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
    limit: {
      type: Number,
      default: 6
    },
    measure: {
      type: String,
      default: '100px'
    },
    onSuccess: {
      type: Function
    },
    onError: {
      type: Function
    }
  },
  created () {
    this.getUploadToken()
  },
  computed: {
    fileSrcList () {
      let resArr = []
      for (let item of this.fileList) {
        // resArr.push(window.URL.createObjectURL(item))
        resArr.push(window.URL.createObjectURL(item.raw))
      }
      return resArr
    }
  },
  components: {
    imageView
  },
  methods: {
    getUploadToken () {
      let token = getQiniuToken()
      if (token) {
        this.uploadData.token = token
      } else {
        getQiniuTokenRequest({ // 参数有默认值，可以不传
          scope: 'wusuowei',
          expires: 3600
        })
          .then(token => {
            this.uploadData.token = token
          })
          .catch(err => {
            console.log(err)
            this.$message.error('请求出错，获取token失败')
          })
      }
    },
    checkValidImage (file) {
      let isValidImg = file.type === 'image/jpeg' || file.type === 'image/png'
      let isLt2M = file.size / 1024 / 1024 < 2
      if (isValidImg && isLt2M) {
        let extension = file.type === 'image/jpeg' ? '.jpg' : '.png'
        let filename = generateGuid() + extension
        this.uploadData.key = qiniuDirname + '/' + this.dirname + '/' + filename
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
      this.fileList.push(file)
      this.uploadKeyList.push(res.key)
      this.onSuccess && this.onSuccess({
        key: res.key,
        keyList: this.uploadKeyList
      })
    },
    handleError (err, file) {
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
    imgLoad (e) { // 释放内存中的blob url
      window.URL.revokeObjectURL(e.currentTarget.src)
    },
    beyondLimit () {
      this.$message.error('文件超出' + this.limit + '个')
    }
  }
}
</script>

<style lang="scss">
.upload-resource-cont {
  &.single {
    position: relative;
    .resource-uploader {
      position: absolute;
      left: 0;
    }
  }
  .imgs-cont {
    float: left;
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
    // width: 60px;
    height: 100%;
  }
}
.resource-uploader {
  float: left;
  .el-upload {
    width: 100%;
    height: 100%;
  }
  .uploader-icon {
    border-radius: 6px;
    cursor: pointer;
    border: 1px dashed #d9d9d9;
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100%;
    line-height: 60px;
    text-align: center;
    box-sizing: border-box;
    &.hide:before {
      display: none;
    }
    &:hover {
      border-color: #409EFF;
    }
  }
}
</style>
