import http from '../http'
import {loadRequest} from '../util' //loading遮罩层
import { Message,Loading } from 'element-ui';
const login=(msg)=>{
   return  http.post('/api/utopa/ar/access/login',msg)
}
const out=()=>{
  return new Promise((resolve,reject)=>{
    http.get('www.hao123.com').then(res=>{
      resolve(res)
    }).catch(err=>{
      reject(err)
    })
  })
}
const sendCode=(msg)=>{
  return http.get('/api/base/sendCodeToEmail',msg)
}
/*重设密码*/
const resetPass=(msg)=>{
  return http.post('/api/utopa/ar/access/resetPassword',msg)
}
/** 系统管理-用户列表 Author:minggui*/
export function getUserList(params){
  let page = params.page||1;
  let limit = params.limit||20;
  let userName = params.userName||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/utopa/ar/user/page',{page,limit,userName}).then(res=>{
      if(res.code){
        Message.error(res.msg);
      }else{
        resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
/** 系统管理-创建用户 Author:minggui*/
export function addUser(params){
  return loadRequest('/api/utopa/ar/user/add',params,'新增',http,'post')
}
/** 系统管理-编辑用户 Author:minggui*/
export function editUser(params){
  return loadRequest('/api/utopa/ar/user/update',params,'编辑',http,'post')
}
/** 系统管理-批量删除用户 Author:minggui*/
export function deleteUser(params){
  return loadRequest('/api/utopa/ar/user/batchDelete',params,'删除',http,'post')
}
/** 系统管理-用户信息 Author:minggui*/
export function getUserInfo(params){
  return http.get('/api/utopa/ar/user/info',params)
}
/** 系统管理-角色下拉框 Author:minggui*/
export function getRoleDropDown(){
  return http.post('/api/utopa/ar/role/page')
}
/** 系统管理-角色列表 Author:minggui*/
export function getRoleList(params){
  let page = params.page||1;
  let limit = params.limit||20;
  let roleName = params.roleName||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/utopa/ar/role/page',{page,limit,roleName}).then(res=>{
      if(res.code){
        Message.error(res.msg);
      }else{
        resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
/** version1.0.6-获取unity版本，渲染管线下拉框 Author:minggui*/
export function getUnityLineDropDown(params){
  return new Promise((resolve,reject)=>{
    http.get('/api/utopa/ar/material/config/list',params).then(res=>{
      if(res.code){
        Message.error(res.msg);
      }else{
        resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
/** 识别图管理-删除 w*/
export function identifyDel(params) {
  return loadRequest('/api/utopa/ar/identify/image/batchDeleteById', params, '删除', http, 'post')
}
/** 识别图管理-审核通过 w*/
export function identifyUpper(params){
  // return loadRequest('/api/utopa/ar/identify/image/reviewSuccess', params, '通过', http, 'get')
  return http.get('/api/utopa/ar/identify/image/reviewSuccess', params)
}
/** 识别图管理-审核不通过识别图 w*/
export function identifyLower(params) {
  // return loadRequest('/api/utopa/ar/identify/image/reviewFail', params, '拒绝', http, 'get')
  return http.get('/api/utopa/ar/identify/image/reviewFail', params)
}
/** 识别图管理-详情 w*/
export function identifyInfo(params) {
  return http.get('/api/utopa/ar/identify/image/queryIdentifyImageById', params)
}
/** 识别图管理-上传 w*/
export function identifyUpload(params) {
  return new Promise((resolve, reject) => {
    http.post('/api/utopa/ar/identify/image/add/data/package', params).then(res=>{
      if (res.code) {
        Message.error(res.msg);
      } else {
        resolve(res);
      }
    }).catch(err => {
      reject(err);
    })
  })
}
/** 系统管理-创建角色 Author:minggui*/
export function addRole(params){
  return loadRequest('/api/utopa/ar/role/add',params,'新增',http,'post')
}
/** 系统管理-编辑角色 Author:minggui*/
export function editRole(params){
  return loadRequest('/api/utopa/ar/role/update',params,'编辑',http,'post')
}
/** 系统管理-角色信息 Author:minggui*/
export function getRoleInfo(params){
  return http.get('/api/utopa/ar/role/info',params)
}
/** 系统管理-批量删除角色 Author:minggui*/
export function deleteRole(params){
  return loadRequest('/api/utopa/ar/role/batchDelete',params,'删除',http,'post')
}
/** 系统管理-获取权限树 Author:minggui*/
export function getRoleTree(){
  return http.post('/api/utopa/ar/role/treeMenuPermission')
}
/** 中台用户配置-中台用户列表 Author:minggui*/
export function getMiddleUserList(params){
  let page = params.page||1;
  let limit = params.limit||20;
  let userName = params.userName||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/utopa/ar/saas/account/page',{page,limit,userName}).then(res=>{
      if(res.code){
        Message.error(res.msg);
      }else{
        resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
/** 中台用户配置-创建中台用户 Author:minggui*/
export function addMiddleUser(params){
  return loadRequest('/api/utopa/ar/saas/account/add',params,'新增',http,'post')
}
/** 中台用户配置-编辑中台用户 Author:minggui*/
export function editMiddleUser(params){
  return loadRequest('/api/utopa/ar/saas/account/update',params,'编辑',http,'post')
}
/** 中台用户配置-中台用户信息 Author:minggui*/
export function getMiddleUserInfo(params){
  return http.get('/api/utopa/ar/saas/account/info',params)
}
/** 中台用户配置-批量删除中台用户 Author:minggui*/
export function deleteMiddleUser(params){
  return loadRequest('/api/utopa/ar/saas/account/batchDelete',params,'删除',http,'post')
}
/** 中台用户配置-用户选择应用列表 Author:minggui*/
export function selectAppList(params){
  return http.post('/api/utopa/ar/saas/account/listApp',params)
}
/** 中台用户配置-玩法下拉框 Author:minggui*/
export function getPlayDropDown(){
  return new Promise((resolve,reject)=>{
    http.post('/api/utopa/ar/play/page').then(res=>{
      if(res.code){
        Message.error(res.msg);
      }else{
        resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
/** 中台用户配置-用户选择位置列表 Author:minggui*/
export function selectpositionList(params){
  return http.post('/api/utopa/ar/saas/account/listPosition',params)
}
/** 中台用户配置-位置树 Author:minggui*/
export function getMiddleTree(params){
  return new Promise((resolve,reject)=>{
    http.post('/api/utopa/ar/assets/location/middlegroundTree',params).then(res=>{
      if(res.code){
        Message.error(res.msg);
      }else{
        resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
/** 位置管理-获取省市区列表 Author:minggui*/
export function getDistrictList(params){
  return new Promise((resolve,reject)=>{
    http.get('/api/utopa/ar/district/list',params).then(res=>{
      if(res.code){
        Message.error(res.msg);
      }else{
        resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
/** 位置管理-资产种类下拉列表 Author:minggui*/
export function getAssetsDropDown(){
  return new Promise((resolve,reject)=>{
    http.get('/api/utopa/ar/assets/location/category/list').then(res=>{
      if(res.code){
        Message.error(res.msg);
      }else{
        resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
/** 位置管理-位置树 Author:minggui*/
export function getPositionTree(params){
  return new Promise((resolve,reject)=>{
    http.post('/api/utopa/ar/assets/location/selectAssetsLocationBySelective2Tree',params).then(res=>{
      if(res.code){
        Message.error(res.msg);
      }else{
        resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
/** 位置管理-根据父级查询子级列表 Author:minggui*/
export function getPositionList(params){
  let pageNum = params.page||1;
  let pageSize = params.limit||20;
  let id = params.id;
  let areaId= params.areaId;
  return new Promise((resolve,reject)=>{
    http.post('/api/utopa/ar/assets/location/queryBackgroundChildAssetsLocationById',{pageNum,pageSize,id,areaId}).then(res=>{
      if(res.code){
        Message.error(res.msg);
      }else{
        resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
/** 识别图管理-列表 w*/
export function identifyList(params) {
  return http.post('/api/utopa/ar/identify/image/pageList', params)
}

/** 位置管理-启用 Author:minggui*/
export function openAssets(params){
  return loadRequest('/api/utopa/ar/assets/location/enable',params,'启用',http,'post')
}
/** 位置管理-禁用 Author:minggui*/
export function closeAssets(params){
  return loadRequest('/api/utopa/ar/assets/location/unable',params,'禁用',http,'post')
}
/** 位置管理-创建位置 Author:minggui*/
export function createPosition(params){
  return http.post('/api/utopa/ar/assets/location/add',params)
}
/** 位置管理-位置信息 Author:minggui*/
export function getPositionInfo(params){
  return http.get('/api/utopa/ar/assets/location/selectAssetsLocationByPrimaryKey',params)
}
/** 位置管理-编辑位置 Author:minggui*/
export function editPosition(params){
  return http.post('/api/utopa/ar/assets/location/edit',params)
}
/** 识别图管理-渠道列表 w*/
export function identifyListSaasAccount(params) {
  return new Promise((resolve,reject)=>{
    http.get('/api/utopa/ar/saas/account/listSaasAccount', params).then(res=>{
      resolve(res)
    })
  })

}
/** 应用管理-列表 w*/
export function applicationList(params) {
  return http.post('/api/utopa/ar/background/app/page', params)
}

/** 应用管理- 获取unity版本，渲染管线，动画类型下拉框 w*/
export function applicationConfigList(params) {
  return http.get('/api/utopa/ar/material/config/list', params)
}

/** 应用管理-添加应用 w*/
export function applicationAdd(params) {
  return loadRequest('/api/utopa/ar/background/app/add', params, '新增保存', http, 'post')
}
/** 应用管理-编辑应用 w*/
export function applicationUpdate(params) {
  return loadRequest('/api/utopa/ar/background/app/update', params, '编辑保存', http, 'post')
}
/** 应用管理-查看应用 w*/
export function applicationInfo(params) {
  return http.get('/api/utopa/ar/background/app/info', params)
}
/** 应用管理-批量删除 w*/
export function applicationDel(params) {
  return loadRequest('/api/utopa/ar/background/app/batchDelete', params, '删除', http, 'post')
}
/** 应用管理-上架 w*/
export function applicationUpper(params) {
  return http.get('/api/utopa/ar/background/app/upper', params)
}
/** 应用管理-下架 w*/
export function applicationLower(params) {
  return http.get('/api/utopa/ar/background/app/lower', params)
}
/** 应用管理-玩法 w*/
export function applicationPlay(params) {
  return http.post('/api/utopa/ar/play/page', params)
}

/** 应用管理-素材种类详情 w*/
export function applicationM(params) {
  return http.post('/api/utopa/ar/play/moduleDetail', params)
}
/** 应用管理-素材分类 w*/
export function applicationModule(params) {
  return http.post('/api/utopa/ar/material/pageList', params)
}

/** 应用管理-获取应用素材 w*/
export function applicationlistModule(params) {
  return http.post('/api/utopa/ar/background/app/listModuleMaterial', params)
}

/** 应用管理-模型分类筛选 w*/
export function applicationToTree(params) {
  return http.get('/api/utopa/ar/material/category/toTree', params)
}

/** 游戏列表 w*/
export function syncList(params) {
  return http.post('/api/utopa/ar/syncInfo/list', params)
}

/** 启动游戏 w*/
export function startGame(params) {
  return loadRequest(`/api/utopa/ar/syncInfo/startGame?gameId=${params.gameId}`, params, '启动游戏', http, 'post')
}
/** 重启游戏 w*/
export function restartGame(params) {
  return loadRequest(`/api/utopa/ar/syncInfo/restartGame?gameId=${params.gameId}`, params, '重启游戏', http, 'post')
}

/** 停止游戏 w*/
export function stopGame(params) {
  return loadRequest(`/api/utopa/ar/syncInfo/stopGame?gameId=${params.gameId}`, params, '停止游戏', http, 'post')
}
/** 删除记录 w*/
export function syncDelete(params) {
  return loadRequest(`/api/utopa/ar/syncInfo/delete?gameId=${params.gameId}`, params, '删除记录', http, 'post')
}

/*获取素材*/
const getTotal=(msg)=>{
  return http.post(`/api/utopa/ar/material/pageList`,msg)
}
/*获取文件地址*/
const getFile=(id)=>{
  return  http.get(`/api/utopa/ar/material/preview`,{id:id})
}
/*获取树形结构*/
const getTree=(id)=>{
  return http.get(`/api/utopa/ar/material/category/toTree`,{moduleId:id})
}
/*上传*/
const uploadSdk=(msg)=>{
  return http.post('/api/utopa/ar/material/upload/video',msg)
}
/*新增*/
const addTotal=(msg)=>{
  return http.post('/api/utopa/ar/material/add',msg)
}
/*删除*/
const deletAll=(ids)=>{
   return loadRequest('/api/utopa/ar/material/batchDeleteByIds',{ids:ids},'删除',http,'post')
}
/*编辑*/
const editTotal=(msg)=>{
  return http.post('/api/utopa/ar/material/edit',msg)
}
/*上传素材*/
const  uploadMaterial=(msg)=>{
  return http.post('/api/file/upload',msg)
}
/*上传歌词*/
const uploadlyric=(msg)=>{
   return http.post('/api/utopa/ar/material/upload/lrc',msg)
}
/*获取素材*/
const getmaterial=(msg)=>{
  return http.post('/api/utopa/ar/material/category/pageList',msg)
}
/*素材下拉框*/
const getSelect=()=>{
  return http.get('/api/utopa/ar/material/module/list')
}
/*新建素材分类*/
const addTitle=(msg)=>{
  return http.post('/api/utopa/ar/material/category/add',msg)
}
/*编辑素材分类*/
const  editTitle=(msg)=>{
  return http.post('/api/utopa/ar/material/category/edit',msg)
}
/*删除素材分类*/
const  deleteTitle=(ids)=>{
  return loadRequest('/api/utopa/ar/material/category/batchDeleteByIds',ids,'删除',http,'post')
}
/*获取玩法列表*/
const  getPlayList=(msg)=>{
  return http.post('/api/utopa/ar/play/page',msg)
}
/*获取素材详情*/
const getPlayDetail=(msg)=>{
  return http.post('/api/utopa/ar/play/playListModuleDetail',msg)
}
/** 获取当前用户的权限 Author:minggui*/
export function currentUserPower(){
  return new Promise((resolve,reject)=>{
    http.post('/api/utopa/ar/user/userPermission').then(res=>{
      if(res.code){
        Message.error(res.msg);
      }else{
        resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
/*素材上架*/
const upState=(id)=>{
  return http.get('/api/utopa/ar/material/onShelf',{id:id})
}
/*素材下架*/
const  offState=(id)=>{
  return http.get('/api/utopa/ar/material/offShelf',{id:id})
}
/*获取u3d信息*/
const  getU3d=(id)=>{
  return http.get('/api/utopa/ar/material/config/list',{type:id})
}
/*获取音乐素材种类*/
const getMusic=()=>{
  return http.get('/api/utopa/ar/material/config/list',{type:4})
}
export {
  login,
  out,
  sendCode,
  resetPass,
  getTotal,
  getFile,
  getTree,
  uploadSdk,
  addTotal,
  deletAll,
  editTotal,
  uploadMaterial,
  uploadlyric,
  getmaterial,
  getSelect,
  addTitle,
  editTitle,
  deleteTitle,
  getPlayList,
  getPlayDetail,
  upState,
  offState,
  getU3d,
  getMusic
}
