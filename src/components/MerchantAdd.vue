<template>
<div class="manage-item merchant-add-cont">
  <title-cont :title="'商家列表 > 添加商家'" :back="true"></title-cont>
  <el-form class="merchant-add-form" :model="form" ref="form" label-width="80px" label-position="left" :rules="rules">
    <el-form-item label="手机号" prop="phone">
      <el-input :disabled="!!merchant_id" type="number" v-model="form.phone" @input="phoneChange"></el-input>
    </el-form-item>
    <el-form-item label="负责人" prop="manager">
      <el-input v-model="form.manager"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email"></el-input>
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="地址" prop="address">
      <el-input v-model="form.address"></el-input>
    </el-form-item>
    <el-form-item label="短信码" prop="code" class="sms-cont">
      <el-input type="number" v-model="form.code"></el-input>
      <el-button class="send-code" :disabled="!phoneWrote || smsSent" @click="smsSend">{{smsSent ? countDown + 's' : '发送验证码'}}</el-button>
    </el-form-item>
    <el-form-item label="描述" prop="desc">
      <el-input type="textarea" resize="none" v-model="form.desc" placeholder="填写描述或备注或微信qq等其他信息"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">{{merchant_id ? '确定修改' : '确定添加'}}</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import axios from 'axios'
import { origin } from '@/config.js'
import TitleCont from './TitleCont.vue'

export default {
  data () {
    return {
      phoneWrote: false,
      smsSent: false,
      countDown: 60,
      merchant_id: this.$route.query._id,
      form: {
        phone: '',
        manager: '',
        email: '',
        name: '',
        address: '',
        desc: '',
        code: ''
      },
      rules: {
        phone: [{
          required: true,
          message: '输入手机号'
        }],
        manager: [{
          required: true,
          message: '输入负责人'
        }],
        email: [{
          required: true,
          message: '输入邮箱'
        }],
        name: [{
          required: true,
          message: '输入商家名称'
        }],
        address: [{
          required: true,
          message: '输入商家地址'
        }],
        code: [{
          required: true,
          message: '输入短信验证码'
        }]
      }
    }
  },
  components: {
    TitleCont
  },
  created () {
    if (this.merchant_id) { // 获取商家信息
      axios({
        url: origin + '/employ/merchant_detail',
        method: 'get',
        withCredentials: true,
        params: { _id: this.merchant_id }
      })
        .then(res => {
          if (!res.data.success) {
            return this.$message.error(res.data.msg)
          }
          let serverData = { ...res.data.data }
          let formKeys = Object.keys(this.form)
          for (let key in serverData) {
            if (formKeys.indexOf(key) === -1) {
              delete serverData[key]
            }
          }
          this.form = { ...serverData }
          serverData = null
          this.phoneChange()
        })
        .catch(err => {
          console.log(err)
          this.$message.error('请求出错')
        })
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate(bool => {
        if (!bool) {
          return this.$message.info('表单填写出错')
        }
        let url = this.merchant_id ? origin + '/employ/merchant_edit' : origin + '/employ/merchant_add'
        let data = this.merchant_id ? { _id: this.merchant_id, ...this.form } : this.form
        axios({
          url,
          method: 'post',
          data,
          withCredentials: true
        })
          .then(res => {
            if (!res.data.success) {
              return this.$message.error(res.data.msg)
            }
            if (this.merchant_id) {
              this.$message.success(res.data.msg)
              setTimeout(() => {
                this.$router.go(-1)
              }, 1000)
            } else {
              this.$alert(`账号：${res.data.data.phone}<br>密码：${res.data.data.password}`, '请妥善保存', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '我知道了',
                callback: () => {
                  this.$message({
                    message: res.data.msg,
                    type: 'success'
                  })
                  setTimeout(() => {
                    this.$router.go(-1)
                  }, 1000)
                }
              })
            }
          })
          .catch(err => {
            console.log(err)
            this.$message({
              message: '添加失败',
              type: 'error'
            })
          })
      })
    },
    phoneChange () {
      this.$refs.form.validateField('phone', () => {
        // if (!err && this.form.phone.length === 11) {
        if (this.form.phone.length === 11) {
          this.phoneWrote = true
        } else {
          this.phoneWrote = false
        }
      })
    },
    smsSend () {
      this.smsSent = true
      this.startCountDown()
      axios({
        // url: origin + '/employ/add_merchant_sms',
        // method: 'post',
        url: origin + '/employ/send_sms',
        method: 'get',
        params: {
          phone: this.form.phone
        },
        withCredentials: true
      })
        .then(res => {
          this.$message({
            message: res.data.msg,
            type: res.data.success ? 'success' : 'error'
          })
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: '添加失败',
            type: 'error'
          })
        })
    },
    startCountDown () {
      this.timer = setInterval(() => {
        this.countDown--
        if (!this.countDown) {
          this.smsSent = false
          this.countDown = 60
          clearInterval(this.timer)
        }
      }, 1000)
    }
    // reset () {
    //   this.$refs.form.resetFields()
    //   console.log(this.form)
    // }
  }
}
</script>

<style lang="scss">
.merchant-add-form {
  padding: 20px;
  width: 500px;
  .sms-cont .el-form-item__content {
    display: flex;
    align-items: center;
  }
  .send-code {
    width: 112px;
    margin-left: 10px;
  }
}
</style>
