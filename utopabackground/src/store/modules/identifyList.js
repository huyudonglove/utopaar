import { identifyList, identifyDel, identifyUpper, identifyLower, identifyInfo, identifyUpload} from '../../http/request'
import { Message } from 'element-ui';

const state={
  tableData: [],
  total: 0,
  currentRow:{}
};
const mutations={
  syncInit(state, payload) {
    state.tableData = payload.items
    state.total = payload.total
  },
  //当前行
  currentRow(state, payload) {
    state.currentRow = payload.data
  }

};
const actions={
  init({ commit }, params) {
    let pageNum = params.page ? parseInt(params.page) : 1;
    let pageSize = params.limit ? params.limit : 20;
    let name = params.wd ? params.wd : '';
    let checkState = params.checkState ? params.checkState : '';
    let type = params.type ? params.type : '';
    let source = params.source ? params.source :'Middleground'
    let saasCode = params.saasCode ? params.saasCode : ''
    return new Promise((resovle, reject) => {
      identifyList({ pageNum, pageSize, name, checkState, type, source, saasCode}).then(res => {
        if (res.code) {
          Message.error(res.msg);
        } else {
          resovle(res)
          commit('syncInit', res.data)
        }
      })
    }).catch(err => {
    })
  },
  // 删除
  del({ dispatch }, params) {
    // console.log(params)
    return new Promise((resolve, reject) => {
      let ids='';
      params.forEach(v=>{
        ids += v+','
      })
      identifyDel({ ids: ids }).then(res => {
        if (res.code) {
          Message.error(res.msg);
        } else {
          resolve(res);
        }

      }).catch(err => {
        reject(err)
      })
    })
  },
  // 审核通过
  upper({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      identifyUpper({ id: params }).then(res => {
        if (res.code) {
          Message.error(res.msg);
        } else {
          resolve(res);
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 审核不通过
  lower({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      identifyLower({ id: params }).then(res => {
        resolve();
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 保存上传
  save({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      identifyUpload(params).then(res => {
        resolve();
      }).catch(err => {
        reject(err)
      })
    })
  },
   //详情
   info({ commit }, params) {
    return new Promise((resovle, reject) => {
     identifyInfo(params).then(res => {
        if (res.code !== 0) {
          Message.error(res.msg);
        } else {
          resovle(res)
          commit('currentRow', res)
        }
      }).catch(err => {
        reject(err)
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
