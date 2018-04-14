<template>
<div class="manage-item topics-manage-cont">
  <title-cont :title="'帖子列表'" :buttons="[{label: '发布帖子', func: goAdd}]" :back="false"></title-cont>
  <el-table :data="topicList">
    <el-table-column label="_id" width="60px">
      <template slot-scope="props">
        <copy :content="props.row._id">复制</copy>
      </template>
    </el-table-column>
    <el-table-column prop="title" label="标题"></el-table-column>
    <el-table-column prop="author_id.username" label="作者" width="80px"></el-table-column>
    <el-table-column label="内容" class="topic-popover-column">
      <template slot-scope="props">
        <el-popover ref="popover" :title="props.row.title">
          <div class="topic-item-detail">
            <div class="topic-content-item" v-for="(item, index) in props.row.content" :key="index">
              <div class="topic-text" v-if="item.type === 1" v-html="changeEnter(item.value)"></div>
              <div class="img-cont" v-if="item.type === 2">
                <div class="img-cont-item" v-for="(item2, index2) in item.value" :key="index2">
                  <img :src="imgOrigin + item2 + '?imageView2/3/w/280/h/280'">
                </div>
              </div>
            </div>
          </div>
        </el-popover>
        <div class="topic-content" trigger="hover" v-popover:popover>
          <span class="topic-content-item" v-for="(item, index) in props.row.content" :key="index">
            <template v-if="item.type === 1">{{item.value.length > 20 && index !== props.row.content.length - 1 ? item.value.substring(0, 20) + '...' : item.value}}</template>
            <template v-if="item.type === 2">
              <span v-for="(item2, index2) in item.value" :key="index2">[图片]</span>
            </template>
          </span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="view_count" label="浏览数" width="100px"></el-table-column>
    <el-table-column prop="createdAt" label="发布时间">
      <template slot-scope="props">{{parseDate(new Date(props.row.createdAt))}}</template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import axios from 'axios'
import { origin, imgOrigin } from '@/config.js'
import TitleCont from './TitleCont.vue'
import Copy from './Copy.vue'
import { parseDate, changeEnter } from '@/utils.js'

export default {
  data () {
    return {
      topicList: [],
      parseDate,
      changeEnter,
      imgOrigin
    }
  },
  created () {
    this.getTopicList()
  },
  components: {
    TitleCont,
    Copy
  },
  methods: {
    getTopicList () {
      axios({
        url: origin + '/employ/topic_list',
        method: 'get',
        withCredentials: true
      })
        .then(res => {
          console.log(res.data.data[0])
          this.topicList = res.data.data
        })
        .catch(err => {
          console.log(err)
          this.$message.error('请求出错')
        })
    },
    goAdd () {
      this.$router.push('/home/topic_add')
    }
  }
}
</script>

<style lang="scss">
.topic-content {
  cursor: pointer;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.el-popover {
  width: 300px;
  height: 400px;
  overflow-y: scroll;
  .el-popover__title {
    text-align: justify;
  }
  .topic-text {
    text-align: justify;
    margin: 5px 0;
    width: 100%;
    word-break: break-all;
  }
  .img-cont {
    width: 100%;
  }
  .img-cont-item {
    margin: 5px 0;
    img {
      display: block;
      width: 100%;
      margin: 0 auto;
    }
  }
}
</style>
