<template>
<div class="manage-item goods-manage-cont">
  <title-cont :title="shop_id ? '商家列表 > 店铺列表 > 商品列表' : '商品列表'" :buttons="[{label: '添加商品', func: goAdd}]" :back="!!shop_id"></title-cont>
  <el-table :data="shopGoods">
    <el-table-column label="_id">
      <template slot-scope="props">
        <copy :content="props.row._id">复制</copy>
      </template>
    </el-table-column>
    <el-table-column prop="title" label="标题"></el-table-column>
    <el-table-column prop="valuation" label="估价">
      <template slot-scope="props">{{props.row.valuation / 100}}元</template>
    </el-table-column>
    <el-table-column prop="merchant_id.name" label="商家"></el-table-column>
    <el-table-column prop="shop_id.name" label="店铺"></el-table-column>
    <el-table-column prop="category_id.name" label="分类"></el-table-column>
    <!-- <el-table-column label="分类图标">
      <template slot-scope="props">
        <copy :content="props.row.category_id.icon">
          <emage :src="/(http:\/\/)|(https:\/\/)/.test(props.row.category_id.icon) ? props.row.category_id.icon : imgOrigin + props.row.category_id.icon + '?imageView2/2/w/60/h/60'" :width="60" :height="60"></emage>
        </copy>
      </template>
    </el-table-column> -->
    <el-table-column label="封面">
      <template slot-scope="props">
        <copy :content="props.row.cover">
          <emage :src="/(http:\/\/)|(https:\/\/)/.test(props.row.cover) ? props.row.cover : imgOrigin + props.row.cover + '?imageView2/2/w/60/h/60'" :width="60" :height="60"></emage>
        </copy>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="220px">
      <template slot-scope="props">
        <el-button size="mini" @click="editGoods(props.row._id)">编辑</el-button>
        <el-button size="mini" @click="toggleHidden(props.row._id)">下架</el-button>
        <el-button size="mini" disabled @click="deleteGoods(props.$index, props.row._id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import axios from 'axios'
import { origin, imgOrigin } from '@/config.js'
import Copy from './Copy.vue'
import TitleCont from './TitleCont.vue'

export default {
  data () {
    return {
      shop_id: this.$route.params._id ? this.$route.params._id : '',
      imgOrigin,
      shopGoods: []
    }
  },
  components: {
    TitleCont,
    Copy
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    goAdd () {
      this.$router.push({
        path: '/home/goods_add/' + this.shop_id
      })
    },
    getGoodsList () {
      axios({
        url: origin + '/employ/goods_list',
        methods: 'get',
        withCredentials: true
      })
        .then(res => {
          // console.log(res.data.data[0])
          this.shopGoods = res.data.data
        })
        .catch(err => {
          console.log(err)
          this.$message.error('请求出错')
        })
    },
    editGoods (_id) {
      this.$router.push('/home/goods_add/?_id=' + _id)
    },
    toggleHidden (_id) {
      console.log(_id)
    },
    deleteGoods (index, _id) {
      console.log(index, _id)
    }
  }
}
</script>
