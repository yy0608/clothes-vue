<template>
<div class="manage-item merchants-manage-cont">
  <title-cont :title="'商家列表'" :btnTitle="'添加商家'" :btnEvent="goAdd"></title-cont>
  <el-table :data="merchantList">
    <el-table-column prop="phone" label="手机"></el-table-column>
    <el-table-column prop="name" label="名称"></el-table-column>
    <el-table-column prop="manager" label="联系人"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
    <el-table-column label="操作" min-width="100px">
      <template slot-scope="props">
        <el-button size="mini" @click="goShop(props.row._id)">店铺</el-button>
        <el-button size="mini" @click="editCategory(props.row._id)">编辑</el-button>
        <el-button size="mini" @click="deleteCategory(props.$index, props.row._id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <pagination :change="pageChange" :count="merchantsCount"></pagination>
</div>
</template>

<script>
import TitleCont from './TitleCont.vue'
import Pagination from './Pagination.vue'
import { mapState } from 'vuex'

export default {
  components: {
    TitleCont,
    Pagination
  },
  computed: mapState([
    'merchantList',
    'merchantsCount'
  ]),
  methods: {
    goAdd () {
      this.$router.push('/home/merchant_add')
    },
    getMerchantList () {
      this.$store.dispatch('getMerchantList')
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
            message: '获取商家列表出错',
            type: 'error'
          })
        })
    },
    pageChange () {
      this.getMerchantList()
    },
    goShop (_id) {
      this.$router.push({
        path: '/home/merchant_shops/' + _id
      })
    },
    editCategory (_id) {
      console.log(_id)
    },
    deleteCategory (index, _id) {
      console.log(index, _id)
    }
  }
}
</script>

<style lang="scss">
</style>
