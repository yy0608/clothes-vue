<template>
  <div class="hello">
    <el-button @click="logout">退出</el-button>
  </div>
</template>

<script>
import axios from 'axios'
import { origin } from '@/config.js'

export default {
  methods: {
    logout () {
      axios({
        url: origin + '/v1/employ/logout',
        method: 'post',
        withCredentials: true
      })
        .then(res => {
          console.log(res.data)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
