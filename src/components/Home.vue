<template>
<div class="admin-container" :style="{height: winHeight + 'px'}">
  <div class="admin-header">
    <div class="router-cont">
      <router-link v-for="(item, index) in routerData" :key="index" :to="item.path" :class="[item.active ? 'active': '', 'router-link']" active-class="active">{{item.label}}</router-link>
    </div>
    <a href="javascript:void(0);" class="router-link" @click="goIndex">首页</a>
    <a href="javascript:void(0);" class="router-link" @click="logout">退出</a>
  </div>
  <router-view></router-view>
</div>
</template>

<script>
import axios from 'axios'
import { origin } from '@/config.js'

export default {
  data () {
    return {
      winHeight: 0,
      routerData: [
        {
          path: '/home/merchants',
          label: '商家中心'
        },
        {
          path: '/home/categories',
          label: '分类管理'
        },
        {
          path: '/home/goods',
          label: '商品管理'
        },
        {
          path: '/home/users',
          label: '用户管理'
        }
      ]
    }
  },
  created () {
    this.winHeight = window.innerHeight
    this.checkPathHasString(this.$route.path)
    this.$watch('$route', function (newVal, oldVal) {
      this.checkPathHasString(newVal.path)
    })
  },
  methods: {
    logout () {
      axios({
        url: origin + '/employ/logout',
        method: 'post',
        withCredentials: true
      })
        .then(res => {
          if (res.data.success) {
            this.$router.push('/login')
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
            message: '退出失败',
            type: 'error'
          })
        })
    },
    checkPathHasString (path) {
      if (/merchant/i.test(path) || /shop_add/i.test(path)) {
        this.routerData[0].active = true
      } else {
        this.routerData[0].active = false
      }
    },
    goIndex (e) {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-container {
  display: flex;
  flex-direction: column;
}
.admin-header {
  display: flex;
  flex-shrink: 0;
  border-bottom: solid 1px #e6e6e6;
  background-color: #fff;
  background: linear-gradient(to bottom, #fff, #eaeaea);
}
.router-cont {
  display: flex;
  flex-grow: 1;
}
.router-link {
  position: relative;
  line-height: 60px;
  color: #888;
  margin: 0 5px;
  padding: 0 10px;
  transition: all ease .1s;
  &:hover, &.active {
    color: #333;
  }
  &.active:after {
    content: '';
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    height: 2px;
    background-color: #409eff;
  }
}
.admin-item {
  padding: 10px;
  flex-grow: 1;
  background-color: #fff;
}
</style>
