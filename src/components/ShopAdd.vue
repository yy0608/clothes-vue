<template>
<div class="manage-item merchant-add-cont">
  <title-cont :title="'商家列表 > 店铺列表 > 添加店铺'" :back="true"></title-cont>
  <el-form class="merchant-add-form" :model="form" ref="form" label-width="80px" label-position="left" :rules="rules">
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
    <el-form-item label="经度" prop="longitude ">
      <el-input type="number" v-model.number="form.longitude"></el-input>
    </el-form-item>
    <el-form-item label="纬度" prop="latitude">
      <el-input type="number" v-model.number="form.latitude"></el-input>
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
        longitude: '',
        latitude: '',
        manager: '',
        phone: '',
        remark: ''
      },
      rules: {
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
      var data = {
        longitude: this.form.longitude,
        latitude: this.form.latitude
      }
      console.log(data)
      axios({
        url: origin + '/employ/test',
        method: 'post',
        data,
        withCredentials: true
      })
        .then(res => {
          console.log(res.data)
        })
        .catch(err => {
          console.log(err)
        })
      // this.$refs.form.validate(bool => {
      //   if (bool) {
      //     axios({
      //       url: origin + '/employ/merchant_add',
      //       method: 'post',
      //       data: this.form,
      //       withCredentials: true
      //     })
      //   }
      // })
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
