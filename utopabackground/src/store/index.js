import Vue from 'vue';
import Vuex from 'vuex';
import login from './modules/login'
import pagination from './modules/pagination'
import navMenu from './modules/navMenu'
import timeSwitch from './modules/timeSwitch'
import identifyList from './modules/identifyList'
import applicationList from './modules/applicationList'
import currentUserPower from './modules/currentUserPower'
Vue.use(Vuex);
const store=new Vuex.Store({
  modules:{
    login,
    pagination,
    navMenu,
    timeSwitch,
    identifyList,
    applicationList,
    currentUserPower,
  }
})
export default store;
