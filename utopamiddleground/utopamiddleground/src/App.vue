<template>
  <div id="app">
    <router-view v-if="isRouterActive"></router-view>
  </div>
</template>

<script>
  import {mapState,mapMutations} from 'vuex'
  export default {
    name: 'App',
    data(){
      return{
        isRouterActive:true
      }
    },
    provide(){
      return{
        reload:this.reload,
        replace:this.replace
      }
    },
    computed:{
      ...mapState('pagination',['clickPage','limitPage'])
    },
    methods:{
      ...mapMutations('pagination',['setClickPage','setLimitPage']),
      reload(){
        //刷新页面
        this.isRouterActive=false;
        this.$nextTick(function () {
          this.isRouterActive=true;
        })
      },
      replace(key,val){
        //修改路由参数
        let apple=JSON.stringify(this.$route.query);
        //console.log(apple,'apple')
        let banner=JSON.parse(apple);
        if(key!='reset'){
          banner[key]=val;
        }else if (key=='reset'){
          // this.setClickPage(1);
          // this.setLimitPage(20);
          for(let i in banner){
            banner[i]=''
          }

        }
        // banner.page=this.clickPage;
        // banner.limit=this.limitPage;

        // console.log(banner)

        this.$router.push(
          {
            path:this.$route.path,
            query:banner
          }
        ).catch(err=>{
          console.log(err)
        })
      }
    },
    mounted() {
      //console.log(888)
    },
    watch:{

    }
  }
</script>

<style>

</style>
