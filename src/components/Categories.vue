<template>
<div class="manage-item goods-manage-cont">
  <title-cont :title="'分类列表'" :buttons="[{label: '添加分类', func: goAdd}]" :back="true"></title-cont>
  <el-table :data="goodsCategories">
    <el-table-column prop="_id" label="_id"></el-table-column>
    <el-table-column prop="level" label="分类"></el-table-column>
    <el-table-column prop="name" label="名称"></el-table-column>
    <el-table-column prop="parent_id" label="上级id"></el-table-column>
    <el-table-column label="图标">
      <template slot-scope="props">
        <img :src="props.row.icon ? props.row.icon + '?imageView2/2/w/50/h/50' : ''" alt="">
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import axios from 'axios'
import { origin } from '@/config.js'
import TitleCont from './TitleCont.vue'

export default {
  data () {
    return {
      goodsCategories: []
    }
  },
  components: {
    TitleCont
  },
  created () {
    this.getGoodsCategories()
  },
  methods: {
    goAdd () {
      this.$router.push('/home/category_add')
    },
    getGoodsCategories () {
      axios({
        url: origin + '/employ/goods_categories',
        withCredentials: true,
        method: 'get'
      })
        .then(res => {
          if (!res.data.success) {
            return this.$message.error('获取分类列表失败')
          }
          this.goodsCategories = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
