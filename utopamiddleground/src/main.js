// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueCookies from 'vue-cookies'
import huDirective from 'imgbig'
import {big} from './directive/directive'
import '../theme/index.css'
Vue.config.productionTip = false
Vue.use(element);
Vue.use(VueCookies)
Vue.use(huDirective);
Vue.use(big)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
