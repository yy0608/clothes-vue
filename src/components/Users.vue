<template>
<div class="merchants-manage-cont">
  <el-form :model="form" ref="form" :rules="rules">
    <el-form-item label="id" prop="id">
      <el-input v-model="form.id"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">添加</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import axios from 'axios'
import { origin } from '@/config.js'

export default {
  data () {
    return {
      form: {
        id: ''
      },
      rules: {
        id: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (!value) {
              return callback(new Error('请再次输入密码'))
            }
            axios({
              url: origin + '/employ/shop_detail',
              method: 'get',
              params: { shop_id: value }
            })
              .then(res => {
                console.log(res.data)
                if (res.data.success) {
                  callback()
                } else {
                  callback(new Error(res.data.msg))
                }
              })
              .catch(err => {
                console.log(err)
                callback(new Error('请求出错'))
              })
          }
        }]
      }
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate(bool => {
        console.log(bool)
        console.log(this.form)
      })
    }
  }
}
</script>
