import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// 创建基本状态
const state = {
  user:JSON.parse(localStorage.getItem('user')) || '',
  newrouter:  []
}
// 创建改变状态的方法
const mutations = {
  // 登录
  LOGIN (state) {
    state.user = JSON.parse(localStorage.getItem('user'))
  },
  // 登出
  LOGOUT (state) {
    state.user = ''
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    newrouter:  [] 
  },
  NewRouter(state,newrouter){
    state.newrouter = newrouter
  },
  CleanRouter(state){
     state.newrouter = []
  }
}
// 创建驱动actions可以使得mutations得以启动
const actions = {
  // 这里先来一个驱动LOGIN的东西就叫login吧
  login ({commit}) {
    commit('LOGIN')
  },
  // 同样来个logout
  logout ({commit}) {
    commit('LOGOUT')
  },
   NewRouter({commit},newrouter){
    commit('NewRouter',newrouter)  
  },
   CleanRouter({commit}){
    commit('CleanRouter')
  }
 }

export default new Vuex.Store({
  state,
  mutations,
  actions
})

