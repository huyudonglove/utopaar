const state={
  clickPage:'',
  limitPage:'',
  total:''
};
const mutations={
      setClickPage(state,num){
          state.clickPage=num;//设置点击页
      },
      setLimitPage(state,num){
          state.limitPage=num;//设置显示条数
      },
      setTotal(state,num){
           state.total=num;
      }
};
const actions={
  getClickPage({commit},val){
      //console.log(val,88888)
      commit('setClickPage',val)
  },
  getLimitPage({commit},val){
       //console.log(val,9999)
       commit('setLimitPage',val);
       commit('setClickPage',1);
  }
};
export default {
  namespaced:true,
  state,
  actions,
  mutations
}
