<template>
<div class="manage-item merchant-add-cont">
  <title-cont :title="'添加商家'"></title-cont>
  <el-form class="merchant-add-form" :model="form" ref="form" label-width="80px" label-position="left" :rules="rules">
    <el-form-item label="手机号" prop="phone">
      <el-input type="number" v-model="form.phone" @input="phoneChange"></el-input>
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
      <el-input v-model="form.desc" placeholder="填写描述或备注"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button class="login-btn" type="primary" @click="submit">添加</el-button>
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
  methods: {
    submit () {
      this.$refs.form.validate(bool => {
        if (bool) {
          axios({
            url: origin + '/employ/merchant_add',
            method: 'post',
            data: this.form,
            withCredentials: true
          })
            .then(res => {
              if (!res.data.success) {
                this.$message({
                  message: res.data.msg,
                  type: 'error'
                })
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
        }
      })
    },
    phoneChange () {
      this.$refs.form.validateField('phone', err => {
        if (!err && this.form.phone.length === 11) {
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
        url: origin + '/employ/add_merchant_sms',
        method: 'post',
        data: {
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
