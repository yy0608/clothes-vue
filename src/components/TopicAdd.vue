<template>
<div class="manage-item topic-add-manage-cont">
  <title-cont :title="'帖子列表 > 添加帖子'" :back="true"></title-cont>
  <el-form class="topic-add-form" :model="form" ref="form" label-width="80px" label-position="left" :rules="rules" :validate-on-rule-change="false">
    <el-form-item label="选择用户">
      <el-select v-model="form.author_id">
        <el-option
          v-for="item in userList"
          :value="item._id"
          :key="item.username"
          :label="item.username"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="标题">
      <el-input type="textarea" resize="none" v-model="form.title"></el-input>
    </el-form-item>
    <el-form-item
      v-for="(item, index) in form.content"
      :key="item.key"
      :label="item.type === 1 ? '文本内容' : '图片内容'">
        <el-input
          v-if="item.type === 1"
          v-model="item.value"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }"
          resize="none"></el-input>
        <upload
          v-if="item.type === 2"
          :multiple="true"
          :ref="'upload' + index"
          :meta="index"
          :onSuccess="uploadSuccess"
          :onError="uploadError"
          :dirname="'topic'"></upload>
        <div @click="deleteContent(index)" class="el-icon-close"></div>
      </el-form-item>
    <el-form-item class="around-btns">
      <el-button @click="addContent(1)">添加文字内容</el-button>
      <el-button @click="addContent(2)">添加图片内容</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">确认添加</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import { origin } from '@/config.js'
import TitleCont from './TitleCont.vue'
import Upload from './Upload.vue'

export default {
  data () {
    return {
      form: {
        author_id: '',
        title: '',
        content: [{
          value: '',
          type: 1,
          key: Date.now()
        }]
      },
      rules: {
        name: [{
          required: true,
          message: '输入分类名称'
        }]
      },
      userList: []
    }
  },
  created () {
    this.getUserList()
  },
  components: {
    TitleCont,
    Upload
  },
  computed: mapState([ 'userInfo' ]),
  methods: {
    getUserList () {
      axios({
        url: origin + '/user/user_list',
        method: 'get',
        withCredentials: true,
        params: { find_admin: true }
      })
        .then(res => {
          if (!res.data.success) {
            return this.$message.error(res.data.msg)
          }
          this.userList = res.data.data
        })
    },
    submit () {
      if (!this.form.author_id || !this.form.title || !this.form.content.length) {
        return this.$message.error('请选择用户并填写标题和内容')
      }
      for (let item of this.form.content) {
        if (!item.value) {
          return this.$message.error('请填充内容，或删除输入项')
        }
      }
      let data = {
        // author_id: this.userInfo && this.userInfo._id,
        author_id: this.form.author_id,
        title: this.form.title,
        content: this.form.content.map(item => {
          delete item.key
          return item
        })
      }
      axios({
        url: origin + '/employ/topic_add',
        method: 'post',
        withCredentials: true,
        data
      })
        .then(res => {
          if (!res.data.success) {
            return this.$message.error(res.data.msg)
          }
          this.$message.error(res.data.msg)
          setTimeout(() => {
            this.$router.go(-1)
          }, 1000)
        })
        .catch(err => {
          console.log(err)
          this.$message.error('请求出错')
        })
    },
    addContent (type) {
      for (let item of this.form.content) {
        if (!item.value) {
          return this.$message.error('请填充内容，或删除输入项')
        }
      }
      this.form.content.push({
        type,
        value: '',
        key: Date.now()
      })
    },
    deleteContent (index) {
      this.form.content.splice(index, 1)
    },
    uploadSuccess (keyList, index) {
      // console.log(keyList, index)
      this.form.content[index].value = keyList
    },
    uploadError (err, file, index) {
      console.log(err, file, index)
    }
  }
}
</script>

<style lang="scss">
.topic-add-manage-cont {
  .around-btns .el-form-item__content {
    display: flex;
    justify-content: space-between;
  }
  .topic-add-form {
    width: 550px;
    .el-form-item .el-form-item__content {
      position: relative;
      padding-right: 50px;
      &:hover .el-icon-close {
        opacity: 1;
      }
    }
    .el-select {
      width: 100%;
    }
    .el-icon-close {
      position: absolute;
      right: 20px;
      top: 0;
      font-size: 16px;
      cursor: pointer;
      opacity: .2;
      transition: opacity .3s ease;
    }
  }
}
</style>
