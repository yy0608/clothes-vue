<template>
<div class="manage-item merchants-manage-cont">
  <title-cont :title="'商家列表'" :buttons="[{label: '添加商家', func: goAdd}]"></title-cont>
  <el-table :data="merchantList">
    <el-table-column label="_id" width="50px">
      <template slot-scope="props">
        <copy :content="props.row._id">复制</copy>
      </template>
    </el-table-column>
    <el-table-column prop="phone" label="手机"></el-table-column>
    <el-table-column prop="name" label="名称"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
    <el-table-column prop="manager" label="联系人"></el-table-column>
    <el-table-column prop="email_verified" label="邮箱验证">
      <template slot-scope="props">
        <div v-if="props.row.email_verified">已验证</div>
        <el-button v-else size="mini">去验证</el-button>
      </template>
    </el-table-column>
    <el-table-column label="操作" min-width="150px">
      <template slot-scope="props">
        <el-button size="mini" @click="goShop(props.row._id)">店铺</el-button>
        <el-button size="mini" @click="editMerchant(props.row._id)">编辑</el-button>
        <el-button size="mini" disabled @click="deleteMerchant(props.$index, props.row._id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <pagination :change="pageChange" :count="merchantsCount"></pagination>
</div>
</template>

<script>
import TitleCont from './TitleCont.vue'
import Pagination from './Pagination.vue'
import Copy from './Copy.vue'
import { mapState } from 'vuex'

export default {
  components: {
    TitleCont,
    Pagination,
    Copy
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
    editMerchant (_id) {
      this.$router.push('/home/merchant_add?_id=' + _id)
    },
    deleteMerchant (index, _id) {
      console.log(index, _id)
    }
  }
}
</script>

<style lang="scss">
</style>
