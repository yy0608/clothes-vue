import Vue from 'vue'
import Router from 'vue-router'
import { Message, Loading } from 'element-ui'
import App from '@/App'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Merchants from '@/components/Merchants'
import MerchantAdd from '@/components/MerchantAdd'
import MerchantShops from '@/components/MerchantShops'
import ShopAdd from '@/components/ShopAdd'
import ShopGoods from '@/components/ShopGoods'
import GoodsAdd from '@/components/GoodsAdd'
import Categories from '@/components/Categories'
import CategoryAdd from '@/components/CategoryAdd'
import Goods from '@/components/Goods'
import Users from '@/components/Users'
import Images from '@/components/Images'

let ifCheckedLogin = false

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: App,
      redirect: '/home',
      children: [
        {
          name: 'Login',
          path: 'login',
          component: Login
        },
        {
          path: 'home',
          component: Home,
          children: [
            {
              path: '',
              redirect: {
                name: 'Merchants'
              }
            },
            {
              name: 'Merchants',
              path: 'merchants',
              component: Merchants,
              meta: {
                hasPage: true
              }
            },
            {
              name: 'MerchantAdd',
              path: 'merchant_add',
              component: MerchantAdd
            },
            {
              name: 'MerchantShops',
              path: 'merchant_shops/:_id',
              component: MerchantShops
            },
            {
              name: 'ShopAdd',
              path: 'shop_add/:_id',
              component: ShopAdd
            },
            {
              name: 'ShopGoods',
              path: 'shop_goods/:_id',
              component: ShopGoods
            },
            {
              name: 'GoodsAdd',
              path: 'goods_add/:_id?',
              component: GoodsAdd
            },
            {
              name: 'Categories',
              path: 'categories',
              component: Categories
            },
            {
              name: 'CategoryAdd',
              path: 'category_add',
              component: CategoryAdd
            },
            {
              name: 'Goods',
              path: 'goods',
              component: Goods
            },
            {
              name: 'Users',
              path: 'users',
              component: Users
            },
            {
              name: 'Images',
              path: 'images',
              component: Images
            }
          ]
        }
      ]
    }
  ]
})

// document.documentElement.style.backgroundColor = 'red'

function goDiffPath (to, next, store) {
  if (to.path === '/login') {
    return next('/home')
  } else {
    if (!Object.keys(to.query).length && to.meta.hasPage) {
      return next({
        path: to.path,
        query: {
          page: store.state.page,
          limit: store.state.limit
        }
      })
    } else {
      return next({
        path: to.path,
        query: to.query
      })
    }
  }
}

router.beforeEach((to, from, next) => {
  let store = router.app.$options.components.App.store
  let state = store.state
  let userInfo = state.userInfo
  let loginAuth = state.loginAuth
  if (to.path !== from.path) { // 如果路由变化，还原到默认页码数设置
    store.commit('resetPage')
  }
  if (ifCheckedLogin) {
    if (loginAuth) {
      if (!Object.keys(to.query).length && to.meta.hasPage) {
        return next({
          path: to.path,
          query: {
            page: store.state.page,
            limit: store.state.limit
          }
        })
      } else {
        return next({ to: to.path })
      }
    } else {
      if (to.name === 'Login') {
        return next()
      }
      return next({ name: 'Login' })
    }
  }

  if (userInfo) {
    goDiffPath(to, next, store)
  } else {
    let loadingInstance = Loading.service()
    store.dispatch('goLogin')
      .then(res => {
        ifCheckedLogin = true
        loadingInstance.close()
        if (res.data.success) {
          store.commit('changeLoginAuth', true)
          store.commit('changeUserInfo', res.data.user_info)
          goDiffPath(to, next, store)
        } else {
          store.commit('changeLoginAuth', false)
          return next({ name: 'Login' })
        }
      })
      .catch(err => {
        ifCheckedLogin = true
        Message({
          message: '服务器故障',
          type: 'error'
        })
        loadingInstance.close()
        console.log(err)
        return next({ name: 'Login' })
      })
  }
})

export default router
