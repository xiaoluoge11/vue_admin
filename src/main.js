import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import routes from './routes'
import 'font-awesome/css/font-awesome.min.css'
import axios from 'axios'
import qs from 'qs'
import jwt_decode from "jwt-decode"

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)


const router = new VueRouter({
  routes
})
 

axios.interceptors.request.use(
  config => {    
    if (localStorage.token) {
      config.headers.common['token'] = localStorage.token;
    }
    return config;
  },
  error => { 
    Message({
      showClose: true,
      message: error && error.data.error.message,
      type: 'error'
    });
    return Promise.reject(error.data.error.message);
  }
);

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        if (store.state.token) {  // 通过vuex state获取当前的token是否存在
            next();
        }
        else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    }
    else {
        next();
    }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

