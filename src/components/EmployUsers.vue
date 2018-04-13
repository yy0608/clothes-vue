<template>
<div class="manage-item users-manage-cont">
  <title-cont :title="'用户列表'" :buttons="[{label: '添加用户', func: goAdd}]" :back="false"></title-cont>
  <el-table :data="userList">
    <el-table-column prop="_id" label="_id">
      <template slot-scope="props">
        <copy :content="props.row._id">复制</copy>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="name"></el-table-column>
    <el-table-column prop="username" label="username"></el-table-column>
  </el-table>
</div>
</template>

<script>
import axios from 'axios'
import { origin } from '@/config.js'
import Copy from './Copy.vue'
import TitleCont from './TitleCont.vue'

export default {
  data () {
    return {
      userList: []
    }
  },
  created () {
    this.getEmployUsers()
  },
  components: {
    Copy,
    TitleCont
  },
  methods: {
    getEmployUsers () {
      axios({
        url: origin + '/employ/user_list',
        method: 'get',
        withCredentials: true
      })
        .then(res => {
          if (!res.data.success) {
            return this.$message.error(res.data.msg)
          }
          this.userList = res.data.data
        })
        .catch(err => {
          console.log(err)
          this.$message.error('请求出错')
        })
    },
    goAdd () {
      // this.$router.go()
    }
  }
}
</script>
