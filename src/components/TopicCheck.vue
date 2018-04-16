<template>
<div class="manage-item topic-check-manage-cont">
  <title-cont :title="'帖子审核 ( ' + totalCheckTopicCount + ' )'" :back="false"></title-cont>
  <div class="check-cont" v-if="checkTopicData._id">
    <div class="title">{{checkTopicData.title}}</div>
    <div class="content">
      <div :class="[item.type === 2 ? 'img-content-item' : '', 'content-item']" v-for="(item, index) in checkTopicData.content" :key="index">
        <div v-if="item.type === 1" v-html="changeEnter(item.value)"></div>
        <template v-if="item.type === 2">
          <div class="img-cont" v-for="(item2, index2) in item.value" :key="index2">
            <img @click="showImageView(item2)" :src="imgOrigin + item2 + '?imageView2/2/w/100/h/100'">
          </div>
        </template>
      </div>
    </div>
  </div>
  <div v-else class="no-data" @click="refreshData">暂无数据，点击获取</div>
  <image-view ref="imageView" :imgArr="topicContentImgsArr" :curIndex="curIndex" />
  <div class="handle-cont" v-if="checkTopicData._id">
    <el-button
      plain
      class="handle-item"
      :type="item.buttonType"
      @click="handleCheck(item.value)"
      v-for="item in checkTypes"
      :key="item.value">{{item.label}}</el-button>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import { origin, imgOrigin } from '@/config.js'
import TitleCont from './TitleCont.vue'
import ImageView from './ImageView.vue'
import { changeEnter } from '@/utils.js'

export default {
  data () {
    return {
      imgOrigin,
      changeEnter,
      checkTopicData: {},
      totalCheckTopicCount: 0,
      curIndex: 0,
      checkTypes: [{ // -2：需要再次审核，-1：未审核，0：审核通过，1：水贴，2：广告，3：涉黄，4：暴力
        value: -2,
        label: '暂时挂起',
        buttonType: 'info'
      }, {
        value: 1,
        label: '水帖',
        buttonType: 'warning'
      }, {
        value: 2,
        label: '广告',
        buttonType: 'warning'
      }, {
        value: 3,
        label: '涉黄',
        buttonType: 'danger'
      }, {
        value: 4,
        label: '暴力',
        buttonType: 'danger'
      }, {
        value: 0,
        label: '审核通过',
        buttonType: 'success'
      }]
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
          if (res.data.data) {
            this.checkTopicData = res.data.data
            this.totalCheckTopicCount = res.data.count
          }
          // console.log(res.data)
        })
        .catch(err => {
          console.log(err)
          this.$message.error('请求出错')
        })
    },
    showImageView (src) {
      for (let i = 0; i < this.topicContentImgsArr.length; i++) {
        if (this.topicContentImgsArr[i].indexOf(src) !== -1) {
          this.curIndex = i
          break
        }
      }
      this.$refs.imageView.showImgView()
    },
    handleCheck (value) {
      axios({
        url: origin + '/employ/topic_check',
        method: 'post',
        withCredentials: true,
        data: {
          _id: this.checkTopicData._id,
          status: value
        }
      })
        .then(res => {
          if (!res.data.success) {
            return this.$message.error(res.data.msg)
          }
          console.log(res.data)
          this.$message.success(res.data.msg)
          if (res.data.data) {
            this.checkTopicData = res.data.data
            this.totalCheckTopicCount = res.data.count
          } else {
            this.checkTopicData = {}
            this.totalCheckTopicCount = 0
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('请求出错')
        })
    },
    refreshData () {
      this.$message.success('刷新成功')
      this.getCheckTopicList()
    }
  }
}
</script>

<style lang="scss" scoped>
.check-cont {
  padding: 20px 160px 20px 0;
  width: 500px;
  text-align: justify;
  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  .content-item {
    margin: 10px 0;
  }
  .img-content-item {
    display: flex;
    .img-cont {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 100px;
      background-color: #f5f5f5;
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
      img {
        cursor: zoom-in;
      }
    }
  }
}
.handle-cont {
  position: fixed;
  left: 580px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  .el-button {
    margin: 10px 0;
  }
}
.no-data {
  cursor: pointer;
}
</style>
