<template>
<div class="manage-item goods-manage-cont">
  <title-cont :title="'分类列表'" :buttons="[{label: '添加分类', func: goAdd}]" :back="true"></title-cont>
  <el-table :data="goodsCategories">
    <el-table-column label="_id" width="50px">
      <template slot-scope="props">
        <copy :content="props.row._id">复制</copy>
      </template>
    </el-table-column>
    <el-table-column label="分类">
      <template slot-scope="props">{{props.row.level}}&nbsp;级分类</template>
    </el-table-column>
    <el-table-column prop="name" label="名称"></el-table-column>
    <el-table-column prop="desc" label="描述"></el-table-column>
    <el-table-column label="上级_id" width="100px">
      <template slot-scope="props">
        <copy v-if="props.row.parent_id" :content="props.row.parent_id">复制</copy>
      </template>
    </el-table-column>
    <el-table-column label="图标" width="100px">
      <template slot-scope="props">
        <copy v-if="props.row.icon" :content="props.row.icon">
          <img :src="props.row.icon ? props.row.icon + '?imageView2/2/w/50/h/50' : ''">
        </copy>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="props">
        <el-button size="mini" @click="editCategory(props.row._id)">编辑</el-button>
        <el-button size="mini" disabled @click="deleteCategory(props.$index, props.row._id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import axios from 'axios'
import { origin } from '@/config.js'
import TitleCont from './TitleCont.vue'
import Copy from './Copy.vue'

export default {
  data () {
    return {
      goodsCategories: []
    }
  },
  components: {
    TitleCont,
    Copy
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
    },
    editCategory (_id) {
      this.$router.push('/home/category_add?_id=' + _id)
    },
    deleteCategory (index, _id) {
      console.log(index, _id)
    }
  }
}
</script>
