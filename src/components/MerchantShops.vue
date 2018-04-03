<template>
<div class="manage-item merchant-shop-cont">
  <title-cont :title="'商家列表 > 店铺列表'" :buttons="[{label: '添加店铺', func: goAdd}]" :back="true"></title-cont>
  <el-table :data="shopList">
    <el-table-column label="_id">
      <template slot-scope="props">
        <copy :content="props.row._id">
          <div>复制</div>
        </copy>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="名称"></el-table-column>
    <el-table-column prop="logo" label="logo">
      <template slot-scope="props">
        <copy :content="props.row.logo">
          <emage :src="/(http:\/\/)|(https:\/\/)/.test(props.row.logo) ? props.row.logo : imgOrigin + props.row.logo + '?imageView2/2/w/60/h/60'" :width="60" :height="60"></emage>
          <!-- <img :src="/(http:\/\/)|(https:\/\/)/.test(props.row.logo) ? props.row.logo : imgOrigin + props.row.logo + '?imageView2/2/w/60/h/60'" width="60" height="60" :alt="props.row.desc"> -->
        </copy>
      </template>
    </el-table-column>
    <el-table-column prop="manager" label="负责人"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
    <el-table-column label="操作" min-width="130px">
      <template slot-scope="props">
        <el-button size="mini" @click="goGoods(props.row._id)">商品</el-button>
        <el-button size="mini" @click="editCategory(props.row._id)">编辑</el-button>
        <el-button size="mini" disabled @click="deleteCategory(props.$index, props.row._id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <pagination :change="pageChange" :count="shopsCount"></pagination>
</div>
</template>

<script>
import TitleCont from './TitleCont.vue'
import Pagination from './Pagination.vue'
import Copy from './Copy.vue'
import { mapState } from 'vuex'
import { imgOrigin } from '@/config.js'

export default {
  computed: mapState([
    'shopList',
    'shopsCount'
  ]),
  data () {
    return {
      imgOrigin: imgOrigin
    }
  },
  components: {
    TitleCont,
    Pagination,
    Copy
  },
  methods: {
    getShopList () {
      this.$store.dispatch('getShopList', { merchant_id: this.$route.params._id })
        .then(res => {
          if (!res.data.success) {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: '获取店铺列表出错',
            type: 'error'
          })
        })
    },
    goAdd () {
      let _id = this.$route.params._id
      this.$router.push({
        path: '/home/shop_add/' + _id
      })
    },
    goGoods (_id) {
      this.$router.push({
        path: '/home/shop_goods/' + _id
      })
    },
    pageChange () {
      this.getShopList()
    },
    editCategory (_id) {
      this.$router.push({
        path: '/home/shop_add/' + _id,
        query: {
          shop_id: _id
        }
      })
    },
    deleteCategory (index, _id) {}
  }
}
</script>
