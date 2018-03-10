import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'
import Home from '@/components/Home'
import Login from '@/components/Login'

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
          name: 'Home',
          path: 'home',
          component: Home
        }
      ]
    }
  ]
})

function goDiffPath (to, next) {
  if (to.path === '/login') {
    return next({ name: 'Home' })
  } else {
    return next({ path: to.path })
  }
}

router.beforeEach((to, from, next) => {
  let store = router.app.$options.components.App.store
  let state = store.state
  let userInfo = state.userInfo
  let loginAuth = state.loginAuth
  if (ifCheckedLogin) {
    // return next({ to: to.path })
    if (loginAuth) {
      return next({ to: to.path })
    } else {
      if (to.name === 'Login') {
        next()
      }
      return next({ name: 'Login' })
    }
  }
  if (userInfo) {
    goDiffPath(to, next)
  } else {
    store.dispatch('goLogin')
      .then(res => {
        ifCheckedLogin = true
        if (res.data.success) {
          store.commit('changeLoginAuth', true)
          store.commit('changeUserInfo', res.data.user_info)
          goDiffPath(to, next)
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
