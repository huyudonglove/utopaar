const state={
    endTime:''
};
const mutations={
    syncTime(state, msg) {
      state.endTime=msg==null?'':msg;
      console.log(state.endTime)
    }
};
const actions={
  changeTime({commit},msg){
      commit('syncTime',msg)
  }
};

export default {
  namespaced:true,//用于在全局引用此文件里的方法时标识这一个的文件名
  state,
  mutations,
  actions
}
