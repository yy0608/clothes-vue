<template>
<div class="login-cont" :style="loginContStyle">
  <div class="bf login-form-cont">
    <div class="tc bf title">内部后台系统</div>
    <el-form class="login-form" :model="form" ref="form" label-width="80px" label-position="top" :rules="rules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="验证码">
        <div id="code"></div>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" type="primary" @click="submit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      captcha: null,
      verified: false,
      dxToken: '',
      loginContStyle: {
        width: 0,
        height: 0
      },
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [{
          required: true,
          message: '输入用户名'
        }],
        password: [{
          required: true,
          message: '输入密码'
        }]
      }
    }
  },
  created () {
    this.changeStyle()
  },
  mounted () {
    this.generateDXVerify()
  },
  methods: {
    generateDXVerify () {
      this.captcha = window._dx.Captcha(document.querySelector('#code'), {
        appId: 'b971bdbee8e1d2780783782d066d0cf8',
        style: 'inline',
        success: token => {
          this.verified = true
          this.dxToken = token
        },
        fail: res => {
          this.verified = false
          this.dxToken = ''
        }
      })
    },
    changeStyle () {
      this.loginContStyle = {
        width: document.documentElement.clientWidth + 'px',
        height: document.documentElement.clientHeight + 'px'
      }
      window.onresize = () => {
        this.$set(this.loginContStyle, 'width', document.documentElement.clientWidth + 'px')
        this.$set(this.loginContStyle, 'height', document.documentElement.clientHeight + 'px')
      }
    },
    submit () {
      this.$refs.form.validate(valid => {
        if (!valid) {
          this.$message({
            message: '输入错误',
            type: 'info'
          })
          return
        }
        if (!this.verified) {
          this.$message({
            message: '滑动验证码，进行验证',
            type: 'error'
          })
          return
        }
        let data = Object.assign({}, this.form, { dxToken: this.dxToken })
        this.$store.dispatch('goLogin', data)
          .then(res => {
            if (res.data.success) {
              this.$store.commit('changeLoginAuth', true)
              this.$store.commit('changeUserInfo', res.data.user_info)
              this.$router.push('/home')
            } else {
              if (res.data.code === 10001) {
                this.captcha.reload()
              }
              this.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          })
          .catch(err => {
            console.log(err)
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-cont {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  .title {
    width: 100%;
    font-size: 18px;
    padding-top: 20px;
  }
  .login-form-cont {
    border-radius: 10px;
  }
  .login-form {
    padding: 20px 60px 20px 60px;
    width: 298px;
  }
  .login-btn {
    width: 100%;
    margin-top: 20px;
  }
}
</style>
