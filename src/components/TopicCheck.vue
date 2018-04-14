<template>
<div class="manage-item topic-check-manage-cont">
  <title-cont :title="'帖子审核 ( ' + totalCheckTopicCount + ' )'" :back="false"></title-cont>
  <div class="check-cont">
    <div class="title">{{checkTopicData.title}}</div>
    <div class="content">
      <div class="content-item" v-for="(item, index) in checkTopicData.content" :key="index">
        <template v-if="item.type === 1">111{{item.value}}</template>
        <template v-if="item.type === 2">
          <div class="img-cont" v-for="(item2, index2) in item.value" :key="index2">
            222{{item2}}
          </div>
        </template>
      </div>
    </div>
  </div>
  <image-view :imgArr="topicContentImgsArr" @showImageView="showImageView" @hideImageView="hideImageView">aaaaaa</image-view>
</div>
</template>

<script>
import axios from 'axios'
import { origin, imgOrigin } from '@/config.js'
import TitleCont from './TitleCont.vue'
import ImageView from './ImageView.vue'

export default {
  data () {
    return {
      checkTopicData: {},
      totalCheckTopicCount: 0,
      showImageViewFlag: false
    }
  },
  created () {
    this.getCheckTopicList()
  },
  computed: {
    topicContentImgsArr () {
      let resArr = []
      if (Object.keys(this.checkTopicData).length) {
        for (let item of this.checkTopicData.content) {
          if (item.type === 2) {
            resArr = resArr.concat(item.value)
          }
        }
        resArr = resArr.map(item => {
          return imgOrigin + item
        })
      }
      return resArr
    }
  },
  components: {
    TitleCont,
    ImageView
  },
  methods: {
    getCheckTopicList () {
      axios({
        url: origin + '/employ/topic_check_list',
        method: 'get',
        withCredentials: true
      })
        .then(res => {
          if (!res.data.success) {
            return this.$message.error(res.data.msg)
          }
          this.checkTopicData = res.data.data
          this.totalCheckTopicCount = res.data.count
          console.log(res.data)
        })
        .catch(err => {
          console.log(err)
          this.$message.error('请求出错')
        })
    },
    showImageView () {
      this.showImageViewFlag = true
    },
    hideImageView () {
      this.showImageViewFlag = false
    }
  }
}
</script>

<style lang="scss" scoped>
.check-cont {
  padding: 30px;
  width: 500px;
  text-align: justify;
}
</style>
