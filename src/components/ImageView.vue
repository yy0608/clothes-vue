<template>
<div class="image-view-cont">
  <image-view
    :imgArr="imgArr"
    :showImageView="true"
    :imageIndex="curIndex"
    @hideImage="hideImageView"></image-view>
</div>
</template>

<script>
import imageView from 'vue-imageView'

export default {
  props: {
    imgArr: {
      type: Array,
      required: true
    },
    curIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      show: false
    }
  },
  components: {
    'image-view': imageView
  },
  methods: {
    showImgView () {
      this.show = true
    },
    hideImageView () {
      this.$emit('hideImageView')
    }
  }
}
</script>
