<template>
<div class="images-manage-cont">
  <div class="handle-cont">
    <div class="handle-buttons">
      <el-checkbox
        v-model="checkAll"
        :disabled="!imgsList.length"
        @change="handleCheckAllChange">全选</el-checkbox>
      <div class="total-cont">当前{{imgsList.length}}个文件</div>
      <el-button size="mini" @click="deleteImg" :disabled="!imgsList.length">删除</el-button>
      <el-button size="mini" @click="refresh">刷新</el-button>
      <el-button size="mini" @click="move" disabled>移动</el-button>
    </div>
    <div class="handle-select">
      <div class="prefix">图片前缀：</div>
      <el-input class="prefix-input" v-model="prefix" @keyup.enter.native="prefixInput" size="mini"></el-input>
      <div class="limit">搜索条数：</div>
      <el-select class="limit-select" size="mini" v-model="limit" @change="limitChange" placeholder="请选择结果条数">
        <el-option
          v-for="item in limitOptions"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </div>
  </div>
  <el-checkbox-group
    v-if="imgsList.length"
    v-model="checkedList"
    @change="handleCheckedChange">
    <div class="imgs-cont">
      <el-tooltip :open-delay="1000" v-for="(item, index) in imgsList" :key="index" placement="top" :content="item.key" effect="light">
        <div class="img-item">
          <el-checkbox :key="item.key" :label="item.key"></el-checkbox>
          <div class="img-cont">
            <img :src="imgOrigin + item.key + '?imageView2/2/w/150/h/150'">
          </div>
          <div class="size">{{item.key.split('/')[0]}}&nbsp;&nbsp;{{Math.round(item.fsize / 1024)}}k&nbsp;&nbsp;&nbsp;<span class="copy" @click="copy" :data-clipboard-text="imgOrigin + item.key">copy</span></div>
          <div class="time">{{parseDate(item.putTime / 10000, false)}}</div>
        </div>
      </el-tooltip>
    </div>
  </el-checkbox-group>
  <div class="no-data" v-if="!imgsList.length">暂无数据</div>
  <div class="load-more tc" v-if="marker" @click="loadMore">加载更多</div>
</div>
</template>

<script>
import axios from 'axios'
import { origin, imgOrigin } from '@/config.js'
import { parseDate } from '@/utils.js'
import Clipboard from 'clipboard'

export default {
  data () {
    return {
      imgOrigin: imgOrigin,
      imgsList: [],
      refreshFlag: false,
      parseDate: parseDate,
      checkAll: false,
      checkedList: [],
      marker: '',
      limit: window.localStorage.qiniuImgLimit || 10,
      prefix: window.localStorage.qiniuImgPrefix || '',
      limitOptions: [10, 20, 30, 100]
    }
  },
  computed: {
    imgsKeyList () {
      let arr = []
      for (let item of this.imgsList) {
        arr.push(item.key)
      }
      return arr
    }
  },
  created () {
    this.getImgsList()
  },
  methods: {
    move () {
      axios({
        url: origin + '/qiniu/resource_move_batch',
        method: 'post',
        withCredentials: true,
        data: {
          srcKeys: this.checkedList,
          destDirname: 'cache2/'
        }
      })
        .then(res => {
          this.$message.success(res.data.msg)
          this.refresh()
          console.log(res.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getImgsList () {
      axios({
        url: origin + '/qiniu/resource_list',
        method: 'post',
        withCredentials: true,
        data: {
          marker: this.marker,
          limit: this.limit,
          prefix: this.prefix
        }
      })
        .then(res => {
          if (this.refreshFlag) {
            this.imgsList = res.data.data
          } else {
            this.imgsList = this.imgsList.concat(res.data.data)
          }
          this.imgsList.sort((a, b) => {
            return b.putTime - a.putTime
          })
          this.marker = res.data.nextMarker
        })
        .catch(err => {
          console.log(err)
          this.$message.error('请求出错')
        })
    },
    handleCheckAllChange (bool) {
      this.checkedList = bool ? this.imgsKeyList : []
    },
    handleCheckedChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.imgsKeyList.length
    },
    deleteImg () {
      this.$confirm('确认删除？', '提示')
        .then(() => {
          axios({
            url: origin + '/qiniu/resource_delete_batch',
            method: 'post',
            withCredentials: true,
            data: {
              keys: this.checkedList
            }
          })
            .then(res => {
              console.log(res.data)
              if (res.data.success) {
                this.refresh()
                this.$message.success(res.data.msg)
              } else {
                this.$message.error(res.data.msg)
              }
            })
            .catch(err => {
              console.log(err)
              this.$message.error('请求出错')
            })
        })
        .catch(() => {
          console.log('取消')
        })
    },
    refresh () {
      this.checkAll = false
      this.refreshFlag = true
      this.marker = ''
      this.checkedList = []
      this.getImgsList()
    },
    limitChange (val) {
      window.localStorage.qiniuImgLimit = val
      this.limit = val
      this.refresh()
    },
    prefixInput () {
      this.refresh()
      window.localStorage.qiniuImgPrefix = this.prefix
    },
    loadMore () {
      this.getImgsList()
    },
    copy () {
      let clipboard = new Clipboard('.copy')

      clipboard.on('success', e => {
        this.$message.success('复制图片路径成功')
        e.clearSelection()
        clipboard.destroy()
      })

      clipboard.on('error', e => {
        this.$message.error('复制图片路径失败')
        console.error('Action:', e.action)
        clipboard.destroy()
      })
    }
  }
}
</script>

<style lang="scss">
.images-manage-cont {
  .handle-cont {
    display: flex;
    padding: 10px;
    align-items: center;
    display: flex;
    justify-content: space-between;
    .handle-buttons {
      display: flex;
      align-items: center;
    }
    .handle-select {
      display: flex;
      align-items: center;
    }
    .total-cont {
      margin: 0 10px;
    }
    .limit {
      margin-left: 10px;
    }
    .prefix-input {
      width: 100px;
    }
    .limit-select {
      width: 100px;
    }
  }
  .imgs-cont {
    display: flex;
    flex-wrap: wrap;
    .img-item {
      position: relative;
      text-align: center;
      display: flex;
      flex-direction: column;
      padding: 10px;
      margin: 10px;
      font-size: 16px;
      transition: box-shadow .2s ease;
      &:hover {
        box-shadow: 0 0 25px rgba(0, 0, 0, .1);
      }
      .el-checkbox {
        position: absolute;
        right: 0;
        top: 0;
        width: 40px;
        height: 40px;
      }
      .el-checkbox__input {
        position: absolute;
        top: 0;
        right: 0;
      }
      .el-checkbox__label {
        display: none;
      }
      .img-cont {
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f5f5f5;
        width: 150px;
        height: 150px;
      }
      .size, .time {
        font-size: 14px;
        margin: 3px 0;
      }
      .copy {
        cursor: pointer;
        color: #409eff;
      }
    }
  }
  .load-more {
    cursor: pointer;
    line-height: 50px;
    background-color: #f5f5f5;
  }
}
</style>
