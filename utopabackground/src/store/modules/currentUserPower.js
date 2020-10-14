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
  pianoListPower:[],
  animationMusicPower:[],
  mp4ModelPower:[],
  deviceTypePower:[]
};
const mutations={

};
const actions={
  getUserPower({commit}){
    currentUserPower().then(res=>{
      state.playPower = res.data.filter(v=>v.code=='utopa:background:play')[0]?res.data.filter(v=>v.code=='utopa:background:play')[0].permissionList:[];//玩法管理
      state.appPower = res.data.filter(v=>v.code=='utopa:background:app')[0]?res.data.filter(v=>v.code=='utopa:background:app')[0].permissionList:[];//应用管理
      state.positionPower = res.data.filter(v=>v.code=='utopa:background:address')[0]?res.data.filter(v=>v.code=='utopa:background:address')[0].permissionList:[];//资产管理
      state.middleUserPower = res.data.filter(v=>v.code=='utopa:background:middle:user')[0]?res.data.filter(v=>v.code=='utopa:background:middle:user')[0].permissionList:[];//中台用户配置
      state.userPower = res.data.filter(v=>v.code=='utopa:background:sys:user')[0]?res.data.filter(v=>v.code=='utopa:background:sys:user')[0].permissionList:[];//用户管理
      state.rolePower = res.data.filter(v=>v.code=='utopa:background:sys:permission')[0]?res.data.filter(v=>v.code=='utopa:background:sys:permission')[0].permissionList:[];//权限管理
      state.mainPower = res.data.filter(v=>v.code=='utopa:background:home')[0]?res.data.filter(v=>v.code=='utopa:background:home')[0].permissionList:[];//首页
      state.musicPower = res.data.filter(v=>v.code=='utopa:background:material:music')[0]?res.data.filter(v=>v.code=='utopa:background:material:music')[0].permissionList:[];//音乐管理
      state.carrierPower = res.data.filter(v=>v.code=='utopa:background:material:carrier')[0]?res.data.filter(v=>v.code=='utopa:background:material:carrier')[0].permissionList:[];//载体模型管理
      state.modelPower = res.data.filter(v=>v.code=='utopa:background:material:model')[0]?res.data.filter(v=>v.code=='utopa:background:material:model')[0].permissionList:[];//普通模型管理
      state.scenePower = res.data.filter(v=>v.code=='utopa:background:material:scene')[0]?res.data.filter(v=>v.code=='utopa:background:material:scene')[0].permissionList:[];//动画管理
      state.videoPower = res.data.filter(v=>v.code=='utopa:background:material:video')[0]?res.data.filter(v=>v.code=='utopa:background:material:video')[0].permissionList:[];//MP4视频管理
      state.onlineVideoPower = res.data.filter(v=>v.code=='utopa:background:material:online-video')[0]?res.data.filter(v=>v.code=='utopa:background:material:online-video')[0].permissionList:[];//在线视频管理
      state.typePower = res.data.filter(v=>v.code=='utopa:background:material:type')[0]?res.data.filter(v=>v.code=='utopa:background:material:type')[0].permissionList:[];//素材类别管理
      state.deviceTypePower = res.data.filter(v=>v.code=='utopa:background:device:category')[0]?res.data.filter(v=>v.code=='utopa:background:device:category')[0].permissionList:[];//设备类型管理
      state.unapprovedPower = res.data.filter(v=>v.code=='utopa:background:map:unapproved')[0]?res.data.filter(v=>v.code=='utopa:background:map:unapproved')[0].permissionList:[];//未审核
      state.enablePower = res.data.filter(v=>v.code=='utopa:background:map:enable')[0]?res.data.filter(v=>v.code=='utopa:background:map:enable')[0].permissionList:[];//通过
      state.unablePower = res.data.filter(v=>v.code=='utopa:background:map:unable')[0]?res.data.filter(v=>v.code=='utopa:background:map:unable')[0].permissionList:[];//不通过
      state.mapListPower = res.data.filter(v=>v.code=='utopa:background:map:list')[0]?res.data.filter(v=>v.code=='utopa:background:map:list')[0].permissionList:[];//识别图列表
      state.pianoListPower = res.data.filter(v=>v.code=='utopa:background:device:piano')[0]?res.data.filter(v=>v.code=='utopa:background:device:piano')[0].permissionList:[];//钢琴管理
      state.animationMusicPower = res.data.filter(v=>v.code=='utopa:background:material:cartoonmusic')[0]?res.data.filter(v=>v.code=='utopa:background:material:cartoonmusic')[0].permissionList:[];//动画音乐管理
      state.mp4ModelPower = res.data.filter(v=>v.code=='utopa:background:material:mp4model')[0]?res.data.filter(v=>v.code=='utopa:background:material:mp4model')[0].permissionList:[];//MP4模型管理
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
