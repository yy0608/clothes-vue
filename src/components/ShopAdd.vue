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
    <el-form-item class="upload-form-item" label="logo" prop="logo">
      <upload
        :multiple="false"
        :onSuccess="uploadSuccess"
        :onError="uploadError"
        :dirname="'logo'"
        :measure="'60px'"
        :defaultKeyList="defaultKeyList"
        ref="upload"></upload>
      <el-input type="textarea" resize="none" v-model="form.logo" @change="inputLogoUrl"></el-input>
    </el-form-item>
    <el-form-item label="地址" prop="address">
      <el-input v-model="form.address"></el-input>
    </el-form-item>
    <el-form-item label="经纬度坐标" prop="location" class="location-form-item">
      <el-input v-model="form.location" placeholder="类似114.001432,22.681253"></el-input>
      <a href="http://api.map.baidu.com/lbsapi/getpoint/index.html" target="blank" class="get-location">坐标获取</a>
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
      <el-button type="primary" @click="submit">{{shop_id ? '确认修改' : '确认添加'}}</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import axios from 'axios'
import { origin, imgOrigin } from '@/config.js'
import { parseDate } from '@/utils.js'
import TitleCont from './TitleCont.vue'
import Upload from './Upload.vue'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      uploadData: {
        key: '',
        token: ''
      },
      imgUrl: '',
      shop_id: this.$route.query.shop_id,
      parseDate: parseDate,
      defaultKeyList: [],
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
  computed: mapState([
    'userInfo'
  ]),
  created () {
    if (this.shop_id) {
      axios({
        url: origin + '/employ/shop_detail',
        method: 'get',
        params: { shop_id: this.shop_id },
        withCredentials: true
      })
        .then(res => {
          if (!res.data.success) {
            return this.$message.error(res.data.msg)
          }
          // console.log(res.data.data)
          this.origin_logo = res.data.data.logo
          let logo = /(http:\/\/)|(https:\/\/)/.test(res.data.data.logo) ? res.data.data.logo : imgOrigin + res.data.data.logo
          this.form = {
            ...res.data.data,
            location: res.data.data.location.join(','),
            logo
          }
          let key = logo.replace(imgOrigin, '')
          this.$refs.upload.uploadKeyList = [ key ]
          // this.defaultKeyList = [ logo ]
          console.log(this.form)
        })
        .catch(err => {
          console.log(err)
          this.$message.error('请求出错')
        })
    }
  },
  components: {
    TitleCont,
    Upload
  },
  methods: {
    submit () {
      this.$refs.form.validate(bool => {
        if (!bool) {
          this.$message('填写出错')
          return
        }
        let _id = this.$route.params._id
        let url = this.shop_id ? origin + '/employ/shop_edit' : origin + '/employ/shop_add'
        let data = null
        let logo = this.form.logo.split(imgOrigin)[this.form.logo.split(imgOrigin).length - 1]
        if (this.shop_id) {
          data = {
            ...this.form,
            logo
          }
          delete data.created_ts
          delete data.createdAt
          delete data.updatedAt
          delete data.merchant_id
          if (logo === this.origin_logo) {
            delete data.logo
          } else {
            data.origin_logo = this.origin_logo
          }
        } else {
          data = Object.assign({}, this.form, {
            merchant_id: _id,
            logo
          })
        }
        axios({
          url,
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
    },
    inputLogoUrl () {
      let key = this.form.logo.replace(imgOrigin, '')
      this.$refs.upload.uploadKeyList = [ key ]
    },
    uploadSuccess (keyList) {
      let src = imgOrigin + keyList[0]
      this.form.logo = src
    },
    uploadError (err, file) {
      console.log(err, file)
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
  .logo-uploader {
    height: 60px;
  }
  .logo-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .logo-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .logo-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
  .logo {
    width: 60px;
    height: 60px;
    display: block;
  }
  .upload-form-item {
    .el-form-item__content {
      display: flex;
      align-items: center;
      .el-textarea {
        margin-left: 20px;
      }
    }
  }
  .location-form-item .el-form-item__content {
    display: flex;
    align-items: center;
    .get-location {
      margin-left: 10px;
      flex-shrink: 0;
    }
  }
}
</style>
