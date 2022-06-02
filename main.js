
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
// 按需导入 $http 对象
// 导入网络请求的包
import { $http } from '@escook/request-miniprogram'
uni.$http = $http
// 配置请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'
// 展示 loading 
$http.beforeRequest = function( options){
	uni.showLoading({
		title:'数据飞速加载中'
	})
}
// 封装的展示消息提示的方法烦烦烦
uni.$showMsg = function (title = '数据加载失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none',
  })
}
// 关闭loading
$http.afterRequest = function(){
	
	uni.hideLoading()
}

// 封装的展示消息提示的方法
uni.$showMsg = function (title = '数据加载失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none',
  })
}
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif