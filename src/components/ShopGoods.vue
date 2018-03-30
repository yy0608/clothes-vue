<template>
<div class="manage-item goods-manage-cont">
  <title-cont :title="'商家列表 > 店铺列表 > 商品列表'" :buttons="[{label: '添加商品', func: goAdd}]" :back="true"></title-cont>
  <el-table :data="shopGoods">
    <el-table-column prop="_id" label="_id"></el-table-column>
    <el-table-column prop="title" label="标题"></el-table-column>
    <el-table-column prop="valuation" label="估价">
      <template slot-scope="props">{{props.row.valuation / 100}}元</template>
    </el-table-column>
    <el-table-column prop="merchant_id.name" label="商家"></el-table-column>
    <el-table-column prop="shop_id.name" label="店铺"></el-table-column>
    <el-table-column prop="category_id.name" label="分类"></el-table-column>
    <el-table-column label="分类图标">
      <template slot-scope="props">
        <img :src="props.row.category_id.icon + '?imageView2/2/w/50/h/50'">
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
      shop_id: this.$route.params._id,
      shopGoods: []
    }
  },
  components: {
    TitleCont
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    goAdd () {
      let _id = this.$route.params._id
      this.$router.push({
        path: '/home/goods_add/' + _id
      })
    },
    getGoodsList () {
      axios({
        url: origin + '/employ/goods_list',
        methods: 'get',
        withCredentials: true,
        params: { shop_id: this.shop_id }
      })
        .then(res => {
          console.log(res.data.data[0])
          this.shopGoods = res.data.data
        })
        .catch(err => {
          console.log(err)
          this.$message.error('请求出错')
        })
    }
  }
}
</script>
