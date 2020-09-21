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
/** 页面配置-模块列表 Author:minggui*/
export function getModuleList(params){
  let category = params.category||'';
  let containTitle = params.containTitle||'';
  let status = params.status||'';
  let effectDate = params.putTime||'';
  let ReleaseStatus = params.ReleaseStatus||'';
  let fromCreateTime = params.fromCreateTime||'';
  let toCreateTime = params.toCreateTime||'';
  let pageIndex = params.pageIndex||1;
  let pageSize = params.pageSize||20;
  let pageReturnType = 3;
  let sortColumn = !params.sortColumn||params.order===null?'rank':params.sortColumn;
  let order = params.order||params.order===null||params.order===''||params.order===undefined?true:false;
  return new Promise((resolve,reject)=>{
    http.post('/api/utopa/ar/admin/pageListModule',{category,containTitle,status,effectDate,ReleaseStatus,fromCreateTime,toCreateTime,pageIndex,pageSize,pageReturnType,sortColumn,order}).then(res=>{
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
/** 页面配置-模块删除 Author:minggui*/
export function delModule(params){
  return loadRequest('/api/utopa/ar/admin/deleteModuleDetail',params,'删除',http,'post')
}
/** 页面配置-修改序号 Author:minggui*/
export function editOrder(params){
  return new Promise((resolve,reject)=>{
    http.post('/api/utopa/ar/admin/modifyModuleRank',params).then(res=>{
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
/** 页面配置-获取模块详情 Author:minggui*/
export function getModuleDetail(params){
  return new Promise((resolve,reject)=>{
    http.post('/api/utopa/ar/admin/getModuleDetail',params).then(res=>{
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
/** 页面配置-创建模块 Author:minggui*/
export function createModule(params){
  return loadRequest('/api/utopa/ar/admin/saveModuleDetail',params,'新增',http,'post')
}
/** 页面配置-编辑模块 Author:minggui*/
export function editModule(params){
  return loadRequest('/api/utopa/ar/admin/saveModuleDetail',params,'编辑',http,'post')
}
/** 页面配置-获取应用类型下拉框 Author:minggui*/
export function getAppDropDown(){
  return http.post(`/api/utopa/ar/background/app/listMiddlegroundApp`)
}
/** 页面配置-获取下拉框 Author:minggui*/
export function getDropdown(params){
  return new Promise((resolve,reject)=>{
    http.post('/api/utopa/ar/admin/getDropdownSource',params).then(res=>{
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
/** 页面配置-上传图片 Author:minggui*/
export function uploadImg(params){
  return http.post('/api/file/upload',params)
}
/*获取应用列表h*/
const getAppList=(msg)=>{
  return new Promise((resolve,reject)=>{
    http.post('/api/utopa/ar/admin/pageListApplication',msg).then(res=>{
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
/*获取玩法,素材，类型h*/
const getPlay=(id)=>{
  return new Promise((resolve,reject)=>{
    http.post('/api/utopa/ar/admin/getDropdownSource',{category:id}).then(res=>{
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
/*保存投放h*/
const addPut=(msg)=>{
  //return loadRequest('/api/utopa/ar/admin/saveApplications',msg,'创建',http,'post')
  return http.post('/api/utopa/ar/admin/saveApplications',msg)
}
/*获取应用详情h*/
const getDetail=(id)=>{
  return http.post('/api/utopa/ar/admin/getApplication',{applicationId:id})
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
/** 位置管理-根据父级查询子级列表 Author:minggui*/
export function getPositionList(params){
  let page = params.page||1;
  let limit = params.limit||20;
  let parentId = params.id;
  return new Promise((resolve,reject)=>{
    http.post('/api/utopa/ar/assets/location/pageByParentId',{page,limit,parentId,source:'Middleground'}).then(res=>{
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
/** AR内容管理-内容列表 Author:minggui*/
export function getArContentList(params){
  let page = params.page||1;
  let limit = params.limit||20;
  let name = params.name;
  let moduleCode = params.type||'';
  let appId = params.appId;
  return new Promise((resolve,reject)=>{
    http.post('/api/utopa/ar/content/listARPhotoPage',{page,limit,name,moduleCode,appId,carrierCategory:105}).then(res=>{
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
/** AR内容管理-上架 Author:minggui*/
export function upAR(params){
  return new Promise((resolve,reject)=>{
    http.get('/api/utopa/ar/content/carrierUp',params).then(res=>{
      if(res.code){
        Message.error(res.msg)
      }else{

      }
      resolve(res);
    }).catch(err=>{
      reject(err)
    })
  })
}
/** AR内容管理-下架 Author:minggui*/
export function downAR(params){
  return new Promise((resolve,reject)=>{
    http.get('/api/utopa/ar/content/carrierLower',params,params).then(res=>{
      if(res.code){
        Message.error(res.msg)
      }else{

      }
      resolve(res);
    }).catch(err=>{
      reject(err)
    })
  })
}
/** AR内容管理-批量删除 Author:minggui*/
export function deleteArContent(params){
  return loadRequest('/api/utopa/ar/content/bachDeleteARPhoto',params,'删除',http,'post')
}
/** AR内容管理-类别下拉框 Author:minggui*/
export function getArTypeDropDown(params){
  return http.post('/api/utopa/ar/play/moduleDetail',params)
}
/** AR内容管理-创建内容 Author:minggui*/
export function createArContent(params){
  return loadRequest('/api/utopa/ar/content/addContent',params,'新增',http,'post')
}
/** AR内容管理-编辑内容 Author:minggui*/
export function editArContent(params){
  return loadRequest('/api/utopa/ar/content/updateContent',params,'编辑',http,'post')
}
/** AR内容管理-获取当前AR内容信息 Author:minggui*/
export function getArContentInfo(params){
  return http.get('/api/utopa/ar/content/getARPhotoInfo',params)
}
/** AR内容管理-素材列表 Author:minggui*/
export function getArMaterialList(params){
  let page = params.page||1;
  let limit = params.limit||20;
  let module = params.type||'';
  let appId = params.appId;
  let name = params.name;
  let materialCategoryId = params.materialCategoryId;
  let sortField = params.sortField;
  let sortType = params.sortType;
  return new Promise((resolve,reject)=>{
    http.post('/api/utopa/ar/background/app/listModuleMaterial',{page,limit,module,name,appId,materialCategoryId,sortField,sortType}).then(res=>{
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
/** NoverStage内容管理-内容场次列表 Author:minggui*/
export function getStageContentList(params){
  let page = params.page||1;
  let limit = params.limit||20;
  let name = params.name;
  let appId = params.appId;
  return new Promise((resolve,reject)=>{
    http.post('/api/utopa/ar/content/listScreeningPage',{page,limit,name,carrierCategory:100,appId}).then(res=>{
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
/** NoverStage内容管理-上架场次 Author:minggui*/
export function upStage(params){
  return new Promise((resolve,reject)=>{
    http.get('/api/utopa/ar/content/carrierUp',params).then(res=>{
      if(res.code){
        Message.error(res.msg)
      }else{

      }
      resolve(res);
    }).catch(err=>{
      reject(err)
    })
  })
}
/** NoverStage内容管理-下架场次 Author:minggui*/
export function downStage(params){
  return new Promise((resolve,reject)=>{
    http.get('/api/utopa/ar/content/carrierLower',params).then(res=>{
      if(res.code){
        Message.error(res.msg)
      }else{

      }
      resolve(res);
    }).catch(err=>{
      reject(err)
    })
  })
}
/** NoverStage内容管理-批量删除场次 Author:minggui*/
export function deleteStageContent(params){
  return loadRequest('/api/utopa/ar/content/bachDeleteScreening',params,'删除',http,'post')
}
/** NoverStage内容管理-创建场次 Author:minggui*/
export function createStageContent(params){
  return http.post('/api/utopa/ar/content/addScreening',params)
}
/** NoverStage内容管理-编辑场次 Author:minggui*/
export function eidtStageContent(params){
  return loadRequest('/api/utopa/ar/content/updateScreening',params,'编辑',http,'post')
}
/** NoverStage内容管理-获取当前场次信息 Author:minggui*/
export function getStageContentInfo(params){
  return new Promise((resolve,reject)=>{
    http.get('/api/utopa/ar/content/getScreeningInfo',params).then(res=>{
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
/** NoverStage内容管理-场景列表 Author:minggui*/
export function getStageSceneList(params){
  let page = params.page||1;
  let limit = params.limit||20;
  let parentCarrierId = params.parentCarrierId;
  let state = params.state||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/utopa/ar/content/listScenePage',{page,limit,parentCarrierId,state,carrierCategory:101}).then(res=>{
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
/** NoverStage内容管理-修改场景时间 Author:minggui*/
export function eidtStageSceneTime(params){
  return http.post('/api/utopa/ar/content/updateSceneTime',params)
}
/** NoverStage内容管理-批量删除场景 Author:minggui*/
export function deleteStageScene(params){
  return loadRequest('/api/utopa/ar/content/bachDeleteScene',params,'删除',http,'post')
}
/** NoverStage内容管理-上架场景 Author:minggui*/
export function upScene(params){
  return new Promise((resolve,reject)=>{
    http.get('/api/utopa/ar/content/sceneCarrierUp',params).then(res=>{
      if(res.code){
        Message.error(res.msg)
      }else{

      }
      resolve(res);
    }).catch(err=>{
      reject(err)
    })
  })
}
/** NoverStage内容管理-下架场景 Author:minggui*/
export function downScene(params){
  return new Promise((resolve,reject)=>{
    http.get('/api/utopa/ar/content/carrierLower',params).then(res=>{
      if(res.code){
        Message.error(res.msg)
      }else{

      }
      resolve(res);
    }).catch(err=>{
      reject(err)
    })
  })
}
/** NoverStage内容管理-查询关联背景音乐 Author:minggui*/
export function getStageMusicList(params){
  let page = params.page||'';
  let limit = params.limit||'';
  let parentCarrierId = params.parentCarrierId;
  let name = params.name||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/utopa/ar/content/listBgm',{page,limit,parentCarrierId,name}).then(res=>{
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
/** NoverStage内容管理-查询关联节目 Author:minggui*/
export function getStageProgramList(params){
  let page = params.page||null;
  let limit = params.limit||null;
  let parentCarrierId = params.parentCarrierId;
  let name = params.name||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/utopa/ar/content/listProgram',{page,limit,parentCarrierId,name}).then(res=>{
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
/** NoverStage内容管理-素材分类下拉框 Author:minggui*/
export function getMaterialDropDown(params){
  return http.get('/api/utopa/ar/material/category/toTree',params)
}
/** NoverStage内容管理-素材列表 Author:minggui*/
export function getMaterialList(params){
  return http.post('/api/utopa/ar/background/app/listModuleMaterial',params)
}
/** NoverStage内容管理-创建场景 Author:minggui*/
export function createStageScene(params){
  return loadRequest('/api/utopa/ar/content/addScene',params,'新增',http,'post')
}
/** NoverStage内容管理-编辑场景 Author:minggui*/
export function eidtStageScene(params){
  return loadRequest('/api/utopa/ar/content/updateScene',params,'编辑',http,'post')
}
/** NoverStage内容管理-获取当前场景信息 Author:minggui*/
export function getStageSceneInfo(params){
  return http.get('/api/utopa/ar/content/getSceneInfo',params)
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
/** AR眼镜APP-列表 Author:minggui*/
export function getGlassesList(params){
  let page = params.page||1;
  let limit = params.limit||20;
  // let backgroundApplicationName = params.name||'';
  // let backgroundApplicationId = params.appValue||'';
  let state = params.status||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/utopa/ar/glass/admin/list',{page,limit,state}).then(res=>{
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
/** AR眼镜APP-新增 Author:minggui*/
export function addGlasses(params){
  return loadRequest('/api/utopa/ar/glass/admin/add',params,'新增',http,'post')
}
/** AR眼镜APP-编辑 Author:minggui*/
export function editGlasses(params){
  return loadRequest('/api/utopa/ar/glass/admin/update',params,'编辑',http,'post')
}
/** AR眼镜APP-批量删除 Author:minggui*/
export function delGlasses(params){
  return loadRequest('/api/utopa/ar/glass/admin/batchDelete',params,'删除',http,'post')
}
/*发送验证码*/
const sendCode=(msg)=>{
  return http.get('/api/base/sendCodeToEmail',msg)
}
/*重设密码*/
const resetPass=(msg)=>{
  return http.post('/api/utopa/ar/access/resetPassword',msg)
}
/*获取空间识别图h*/
const getImage=(msg)=>{
  return http.post(`/api/utopa/ar/identify/image/pageList`,msg)
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
/*获取文件地址*/
export function getFile(id){
  return http.get(`/api/utopa/ar/material/preview`, { id: id })
}
/*中台(中台用户配置)资产树 w*/
export function putInTree(params) {
  return http.post(`/api/utopa/ar/assets/location/putInLocationTree`,params)
}
/*创建识别图h*/
const createImage=(msg)=>{
  return http.post('/api/utopa/ar/identify/image/add',msg)
}
/*编辑识别图名称h*/
const editImgName=(msg)=>{
  return http.post('/api/utopa/ar/identify/image/edit',msg)
}
/*删除识别图*/
const deleteImg=(ids)=>{
  return  loadRequest('/api/utopa/ar/identify/image/batchDeleteById',{ids:ids},'删除',http,'post')
}
/*获取应用h*/
const getAppId=(loadingLine)=>{
  return http.post(`/api/utopa/ar/background/app/listMiddlegroundApp`,{loadingLine:loadingLine})
}
/*获取投放地址h*/
const  getPosition=(msg)=>{
    return http.post(`/api/utopa/ar/putIn/listAssetsByBackgroundAppId`,msg)
}
/*删除应用h*/
const deleteApp=(ids)=>{
  return  loadRequest('/api/utopa/ar/admin/deleteApplications',{id:ids},'删除',http,'post')
}
/** 投放管理-投放列表 w*/
export function putInList(params) {
  let page = params.page || 1;
  let limit = params.limit || 20;
  let name = params.wd||'';
  let id = params.q || '';
  let assetId = params.assetId||'';
  let effectiveTime = params.time || '';
  let timeState = params.timeState || '';
  let state = params.state || '';
  let createTimeStart = params.startTime || '';
  let createTimeEnd = params.endTime || '';
  return new Promise((resolve, reject) => {
    http.post('/api/utopa/ar/putIn/listPutIn', { page, limit, name, id, assetId, effectiveTime, timeState, state, createTimeStart, createTimeEnd}).then(res => {
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
/**投放管理-内容场次列表 w*/
export function inputContentList(params){
  let page = params.page||1;
  let limit = params.limit||20;
  let appId = params.appId;
  let name = params.name ? params.name:''
  return new Promise((resolve,reject)=>{
    http.post('/api/utopa/ar/content/listContentByAppId', { page, limit, appId, name}).then(res=>{
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
/**投放管理-应用管理列表 w*/
export function inputAppList(params) {
  return new Promise((resolve, reject) => {
    http.post('/api/utopa/ar/background/app/listMiddlegroundApp', params).then(res => {
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
/** 投放管理-保存投放 w*/
export function inputAdd(params) {
  return loadRequest('/api/utopa/ar/putIn/addPutIn', params, '保存', http, 'post')
}
/** 投放管理-编辑 w*/
export function inputUpdate(params) {
  return loadRequest('/api/utopa/ar/putIn/updatePutIn', params, '保存', http, 'post')
}
/** 投放管理-删除 w*/
export function inputDel(params) {
  return loadRequest('/api/utopa/ar/putIn/delPutIn', params, '删除', http, 'get')
}
/** 投放管理-投放详情 w*/
export function inputInfo(params) {
  return http.get(`/api/utopa/ar/putIn/detail`, params)
}
/** 问题反馈- 反馈列表w*/
export function feedBackList(params){
  let pageIndex = parseInt(params.page)||1;
  let pageSize = parseInt(params.limit)||20;
  let createTimeFrom = params.createTimeStart||'';
  let createTimeTo = params.createTimeEnd||'';
  let status = params.status||'';
  let category = params.type||'';
  let keyword = params.wd||'';
  let sortColumn = params.sortColumn||'';
  let order = params.order||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/utopa/ar/admin/listFeedBack',{pageIndex,pageSize,createTimeFrom,createTimeTo,status,category,keyword,sortColumn,order}).then(res=>{
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
/** 问题反馈- 反馈列表 详情 w*/
export function feedBackInfos(params) {
  return http.post(`/api/utopa/ar/admin/getFeedBackDetail`, params)
}
/** 问题反馈- 反馈列表 保存 w*/
export function feedBackSave(params) {
  return loadRequest('/api/utopa/ar/admin/updateFeedBack', params, '保存', http, 'post')
}
/*获取渲染管道*/
const getLoad=()=> {
  return http.get('/api/utopa/ar/material/config/list', {type: 1})
}
/** 应用管理- 获取unity版本，渲染管线，动画类型下拉框 w*/
export function applicationConfigList(params) {
  return http.get('/api/utopa/ar/material/config/list', params)
}

/** 玩法详情 w*/
export function playInfo(params) {
  return http.get('/api/utopa/ar/play/info', params)
}
export {
  login,
  out,
  getAppList,
  getPlay,
  addPut,
  getDetail,
  sendCode,
  resetPass,
  getImage,
  createImage,
  editImgName,
  deleteImg,
  getAppId,
  getPosition,
  deleteApp,
  getLoad
}
