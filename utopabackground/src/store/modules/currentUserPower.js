import {currentUserPower} from '../../http/request'

const state={
  playPower:[],
  appPower:[],
  positionPower:[],
  middleUserPower:[],
  userPower:[],
  rolePower:[],
  mainPower:[],
  musicPower:[],
  carrierPower:[],
  modelPower:[],
  scenePower:[],
  videoPower:[],
  onlineVideoPower:[],
  typePower:[],
  unapprovedPower:[],
  enablePower:[],
  unablePower:[],
  mapListPower:[],
};
const mutations={

};
const actions={
  getUserPower({commit}){
    currentUserPower().then(res=>{
      state.playPower = res.data.filter(v=>v.name=='玩法管理')[0].permissionList;
      state.appPower = res.data.filter(v=>v.name=='应用管理')[0].permissionList;
      state.positionPower = res.data.filter(v=>v.name=='资产管理')[0].permissionList;
      state.middleUserPower = res.data.filter(v=>v.name=='中台用户配置')[0].permissionList;
      state.userPower = res.data.filter(v=>v.name=='用户管理')[0].permissionList;
      state.rolePower = res.data.filter(v=>v.name=='权限管理')[0].permissionList;
      state.mainPower = res.data.filter(v=>v.name=='首页')[0].permissionList;
      state.musicPower = res.data.filter(v=>v.name=='音乐管理')[0].permissionList;
      state.carrierPower = res.data.filter(v=>v.name=='载体模型管理')[0].permissionList;
      state.modelPower = res.data.filter(v=>v.name=='普通模型管理')[0].permissionList;
      state.scenePower = res.data.filter(v=>v.name=='动画管理')[0].permissionList;
      state.videoPower = res.data.filter(v=>v.name=='MP4视频管理')[0].permissionList;
      state.onlineVideoPower = res.data.filter(v=>v.name=='在线视频管理')[0].permissionList;
      state.typePower = res.data.filter(v=>v.name=='类别管理')[0].permissionList;
      state.unapprovedPower = res.data.filter(v=>v.name=='未审核')[0].permissionList;
      state.enablePower = res.data.filter(v=>v.name=='通过')[0].permissionList;
      state.unablePower = res.data.filter(v=>v.name=='不通过')[0].permissionList;
      state.mapListPower = res.data.filter(v=>v.name=='识别图列表')[0].permissionList;
    })
    console.log(state,99999999)
  }
};
export default {
  namespaced:true,
  state,
  actions,
  mutations
}
