import Vue from 'vue';
import Vuex from 'vuex';
import login from './modules/login'
import pagination from './modules/pagination'
import navMenu from './modules/navMenu'
import timeSwitch from './modules/timeSwitch'
import assetsMoudel from './modules/assetsMoudel'
import singleTime from './modules/singleTime'
import currentUserPower from './modules/currentUserPower'
Vue.use(Vuex);
const store=new Vuex.Store({
  modules:{
    login,
    pagination,
    navMenu,
    timeSwitch,
    assetsMoudel,
    singleTime,
    currentUserPower
  }
})
export default store;
