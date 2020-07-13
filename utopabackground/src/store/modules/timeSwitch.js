import http from '../../http'
const state={
  value:[]
};
const mutations={
    setValue(state,val){
        state.value=val==null||(typeof val[0]) =='object'?[]:val;//设置时间方法，初始时调用
    },

};
const actions={

};
export default {
  namespaced:true,
  state,
  actions,
  mutations
}
