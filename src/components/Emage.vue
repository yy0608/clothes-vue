<template>
<div class="emage-cont">
  <img :src="src" :alt="alt" :width="width" :height="height" @error="imgError($event)">
</div>
</template>

<script>
import { imgOrigin, errorImgKey } from '@/config.js'

export default {
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 60
    },
    height: {
      type: Number,
      default: 60
    }
  },
  methods: {
    imgError (e) {
      this.$message.error('图片加载失败')
      let qiniuImgParam = e.currentTarget.src.split('?')[1]
      e.currentTarget.src = imgOrigin + errorImgKey + '?' + qiniuImgParam
    }
  }
}
</script>
