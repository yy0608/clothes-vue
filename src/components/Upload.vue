<template>
<div
  :class="[multiple ? '' : 'single', 'upload-resource-cont']"
  :style="{minHeight: measure, minWidth: measure}">
  <div class="imgs-cont" v-if="keySrcList.length">
    <div class="img-item"
      v-for="(item, index) in keySrcList"
      v-if="multiple || index === keySrcList.length - 1"
      :style="{width: measure, height: measure}"
      :key="index">
      <div class="img-cont">
        <img
          :src="item + '?imageView2/2/w/' + parseInt(measure) + '/h/' + parseInt(measure)"
          @error="imgError($event)"
          @click="showImgView(index)">
      </div>
        <i
          class="el-icon el-icon-circle-close"
          @click="deleteImg(index)"></i>
        <i
          v-if="index"
          class="el-icon el-icon-arrow-left"
          @click="moveImg(index, 'left')"></i>
        <i
          v-if="index !== keySrcList.length - 1"
          class="el-icon el-icon-arrow-right"
          @click="moveImg(index, 'right')"></i>
    </div>
  </div>
  <template v-if="showView">
    <image-view
      :imgArr="keySrcList"
      :showImageView="true"
      :imageIndex="curIndex"
      @hideImage="hideImageView"></image-view>
  </template>
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
        :class="[keySrcList.length && !multiple ? 'hide' : '', 'el-icon-plus uploader-icon']"
        :style="{lineHeight: measure}"></i>
    </el-upload>
</div>
</template>

<script>
import imageView from 'vue-imageview'
import { imgOrigin, qiniuDefaultDirname, errorImgKey } from '@/config.js'
import { generateGuid, getQiniuToken, getQiniuTokenRequest } from '@/utils.js'

export default {
  data () {
    return {
      uploadData: {
        key: '',
        token: ''
      },
      imgUrl: '',
      showView: false,
      curIndex: 0,
      uploadKeyList: []
    }
  },
  props: {
    dirname: {
      type: String,
      default: 'unspecified'
    },
    defaultKeyList: {
      type: Array,
      default: () => {
        return []
        // return ['a.jpg', 'cache/category_icon/6e933fc6-ca09-4992-8658-de248dce36cc.png', 'cache/category_icon/50ae16c1-0fc7-4983-b58c-0c4de8322175.png', 'logo.png', 'w.jpg']
      }
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
    this.uploadKeyList = [ ...this.defaultKeyList ]
    this.getUploadToken()
  },
  computed: {
    keySrcList () {
      let resArr = []
      for (let item of this.uploadKeyList) {
        resArr.push(imgOrigin + item)
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
        this.uploadData.key = qiniuDefaultDirname + '/' + this.dirname + '/' + filename
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
      if (this.multiple) {
        this.uploadKeyList.push(res.key)
      } else {
        this.uploadKeyList = [res.key]
      }
      console.log(this.uploadKeyList)
      this.onSuccess && this.onSuccess(this.uploadKeyList)
    },
    handleError (err, file) {
      this.$message.error('上传文件失败')
      this.onError && this.onError(err, file)
    },
    showImgView (index) {
      this.showView = true
      this.curIndex = index
    },
    hideImageView () {
      this.showView = false
    },
    deleteImg (index) {
      this.uploadKeyList.splice(index, 1)
    },
    imgError (e) {
      this.$message.error('图片加载失败')
      let qiniuImgParam = e.currentTarget.src.split('?')[1]
      e.currentTarget.src = imgOrigin + errorImgKey + '?' + qiniuImgParam
    },
    moveImg (index, direction) {
      let srcIdx = index
      let destIdx
      switch (direction) {
        case 'left':
          destIdx = srcIdx - 1
          break
        case 'right':
          destIdx = srcIdx + 1
          break
      }
      this.uploadKeyList.splice(srcIdx, 1, ...this.uploadKeyList.splice(destIdx, 1, this.uploadKeyList[srcIdx]))
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
      z-index: 2;
      opacity: 0;
      pointer-events: none;
      transition: opacity .2s ease;
      cursor: pointer;
      font-size: 20px;
    }
    .el-icon-circle-close {
      color: red;
      right: -6px;
      top: -6px;
      border-radius: 50%;
      background-color: #fff;
    }
    .el-icon-arrow-left {
      color: #fff;
      left: 0;
      bottom: 0;
      border-top: 1px solid #fff;
      border-right: 1px solid #fff;
      background-color: #409eff;
    }
    .el-icon-arrow-right {
      color: #fff;
      right: 0;
      bottom: 0;
      border-top: 1px solid #fff;
      border-left: 1px solid #fff;
      background-color: #409eff;
    }
  }
  .img-cont {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    overflow: hidden;
    background-color: #f5f5f5;
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
