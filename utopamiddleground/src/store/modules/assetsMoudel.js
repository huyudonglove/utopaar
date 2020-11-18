import {applicationlistModule} from '../../http/request'
import { Message } from 'element-ui';

const state={
  tableData3: [],
  total3: 0,
};
const mutations={
  syncInitListModule(state, payload) {
    state.tableData3 = payload.items ? payload.items:[]
    state.total3 = payload.total
  },
};
const actions={
  
  //获取应用素材
  initListModule({ commit }, params) {
    // console.log(params,'paramsparamsparamsparamsparams')
    let page = params.page ? parseInt(params.page) : 1;
    let limit = params.limit ? params.limit : 20;
    let name = params.wd ? params.wd : '';
    let module = params.module ? params.module : '';
    let materialCategoryId = params.moduleTreeVal ? params.moduleTreeVal : null;
    let appId = params.appId ? params.appId : '';
    let unityVersion = params.unitySelect ? params.unitySelect : '';
    let loadingLine = params.lineSelect ? params.lineSelect : '';
    let viewType = params.viewTypeSelect ? params.viewTypeSelect : '';
    let sortField= params.sortField ? params.sortField : '';
    let sortType= params.sortType ? params.sortType : '';
    let materialFormat= params.musicTypeSelect ? params.musicTypeSelect : '';
    let isDel= params.isDel ? params.isDel : '';
    return new Promise((resolve, reject) => {
    return applicationlistModule({ page, limit, name, module, materialCategoryId, appId,unityVersion,loadingLine,viewType,sortField,sortType,materialFormat,isDel}).then(res => {
      if (res.code) {
        Message.error(res.msg);
      } else {
        resolve(res)
        commit('syncInitListModule', res.data)
      }
    })
    })
  },
  
  
};
export default {
  namespaced:true,
  state,
  actions,
  mutations
}
