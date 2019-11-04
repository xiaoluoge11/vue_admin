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
import { powerRouter  } from './routes.js';

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
  if(store.state.user){ //判断role 是否存在
    if(store.state.newrouter.length !== 0){
      next();
    }else{
      let newrouter=[];
      let _role = store.state.user.roles
	_role.forEach((i)=>{            
		//['admin','user']
           powerRouter.forEach((k)=>{
		   //k.role = ['admin','user']
		k.role.forEach((j)=>{
			    if(j==i){
			newrouter.push(k) 
			    }
		   }
		  ) 
	  })	
	})
      console.log(newrouter)
     //404的页面再最后加，不然总数访问到的都是404界面
      newrouter.push({
	  path: '*',
	  redirect: '/404'
      })
      router.addRoutes(newrouter) //添加动态路由
      store.dispatch('NewRouter',newrouter).then(res => {
        next({ ...to })
      }).catch(() => {

      })
    }
  }else{
    if (['/login'].indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
})





new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

