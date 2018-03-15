import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Merchants from '@/components/Merchants'
import MerchantAdd from '@/components/MerchantAdd'
import MerchantShops from '@/components/MerchantShops'
import ShopAdd from '@/components/ShopAdd'
import Categories from '@/components/Categories'
import Goods from '@/components/Goods'
import Users from '@/components/Users'

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
              name: 'Categories',
              path: 'categories',
              component: Categories
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
            }
          ]
        }
      ]
    }
  ]
})

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
      return next({ path: to.path })
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
    store.dispatch('goLogin')
      .then(res => {
        ifCheckedLogin = true
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
        console.log(err)
        return next({ name: 'Login' })
      })
  }
})

export default router
