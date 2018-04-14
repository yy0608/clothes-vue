<template>
<div class="manage-item category-add-manage-cont">
  <title-cont :title="'用户列表 > 添加用户'" :back="true"></title-cont>
  <el-form class="merchant-add-form" :model="form" ref="form" label-width="80px" label-position="left" :rules="rules">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="form.password"></el-input>
    </el-form-item>
    <el-form-item label="昵称" prop="nickname">
      <el-input v-model="form.nickname"></el-input>
    </el-form-item>
    <el-form-item label="头像" prop="avatar">
      <el-input v-model="form.avatar"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">确认添加</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import axios from 'axios'
import { origin } from '@/config.js'
import TitleCont from './TitleCont'

export default {
  data () {
    return {
      form: {
        username: '',
        password: '',
        nickname: '',
        avatar: ''
      },
      rules: {
        username: [{
          required: true,
          message: '请输入用户名'
        }],
        password: [{
          required: true,
          message: '请输入密码'
        }]
      }
    }
  },
  components: {
    TitleCont
  },
  methods: {
    submit () {
      this.$refs.form.validate(bool => {
        if (!bool) {
          return this.$message.info('表单填写出错')
        }
        axios({
          url: origin + '/employ/user_add',
          withCredentials: true,
          method: 'post',
          data: this.form
        })
          .then(res => {
            console.log(res.data)
            if (!res.data.success) {
              return this.$message.error(res.data.msg)
            }
            this.$message.success(res.data.msg)
            setTimeout(() => {
              this.$router.go(-1)
            }, 1000)
          })
          .catch(err => {
            console.log(err)
            this.$message.error('请求出错')
          })
      })
    }
  }
}
</script>
