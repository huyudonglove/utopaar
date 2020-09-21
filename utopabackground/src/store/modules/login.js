import {login,out} from '../../http/request'
import  {loadRequest} from '../../util'
import {Message} from  'element-ui'
import router from '../../router'
import VueCookies from 'vue-cookies'
const state={
  msg:{
    appName:'locus管理后台',
    nameInput:'请输入用户名',
    passInput:'请输入密码',
    keepPass:'记住密码',
    forgetPass:'忘记密码?',
    login:'登录',
    register:'注册'
  },
  input:{
    userName:'',
    password:'',
    remberPassword:''
  },
  sassMsg:{}
};
const mutations={
  syncMsg(state,msg){
    state.input=msg;
    console.log(111,state.input)
  },

};
const actions={
  login({commit},msg){
    console.log(msg)
    commit('syncMsg',msg)
    //记住密码
    if(msg.remberPassword){
      var storage=window.localStorage;
      storage[`userName`]=msg.userName;
      storage[`password`]=msg.password;
    }else {
      var storage=window.localStorage;
      storage[`userName`]='';
      storage[`password`]='';
    }
    let apple={
      loginName:msg.userName,
      password: msg.password
    }
    login(apple).then(res=>{
      if(Boolean(res.code)){
        Message({
          message: res.msg,
          type: 'error',
          duration:'2000'
        })
      }else {
        router.push({
          path:'/userManager/userList'
        }) ;
        //sessionStorage.setItem("token", res.data.token);
        VueCookies.set('token', res.data.token)
      }

    })

  }
};
export default {
  namespaced:true,
  state,
  actions,
  mutations
}
