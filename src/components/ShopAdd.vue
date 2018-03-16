<template>
<div class="manage-item merchant-add-cont">
  <title-cont :title="'商家列表 > 店铺列表 > 添加店铺'" :back="true"></title-cont>
  <el-form class="merchant-add-form" :model="form" ref="form" label-width="100px" label-position="left" :rules="rules">
    <el-form-item label="名称" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="desc">
      <el-input type="textarea" resize="none" v-model="form.desc"></el-input>
    </el-form-item>
    <el-form-item label="logo" prop="logo">
      <el-input v-model="form.logo"></el-input>
    </el-form-item>
    <el-form-item label="地址" prop="address">
      <el-input v-model="form.address"></el-input>
    </el-form-item>
    <el-form-item label="经纬度坐标" prop="location">
      <el-input v-model="form.location" placeholder="类似114.001432,22.681253"></el-input>
    </el-form-item>
    <el-form-item label="负责人" prop="manager">
      <el-input v-model="form.manager"></el-input>
    </el-form-item>
    <el-form-item label="电话" prop="phone">
      <el-input v-model="form.phone"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input type="textarea" resize="none" v-model="form.remark" placeholder="填写微信qq或其他信息"></el-input>
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
import TitleCont from './TitleCont.vue'

export default {
  data () {
    return {
      form: {
        name: '',
        desc: '',
        logo: '',
        address: '',
        location: '',
        manager: '',
        phone: '',
        remark: ''
      },
      rules: {
        name: [{
          required: true,
          message: '输入名称'
        }],
        desc: [{
          required: true,
          message: '输入描述'
        }],
        logo: [{
          required: true,
          message: '上传logo'
        }],
        address: [{
          required: true,
          message: '输入地址'
        }],
        location: [{
          required: true,
          message: '输入经纬度坐标'
        }],
        manager: [{
          required: true,
          message: '输入负责人名字'
        }],
        phone: [{
          required: true,
          message: '输入手机号'
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
          this.$message('填写出错')
          return
        }
        let _id = this.$route.params._id
        var data = Object.assign({}, this.form, {
          merchant_id: _id
        })
        axios({
          url: origin + '/employ/shop_add',
          method: 'post',
          data,
          withCredentials: true
        })
          .then(res => {
            if (res.data.success) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              setTimeout(() => {
                this.$router.go(-1)
              }, 1000)
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          })
          .catch(err => {
            console.log(err)
            this.$message({
              message: '请求出错',
              type: 'error'
            })
          })
      })
    }
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
