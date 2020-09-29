<template>
  <div>
    <headNav></headNav>
  
    <div class="pa_body">
      
        <div class="body-menu">
        <el-row class="tac">
          <el-col :span="24" >
            <el-menu 
            class="el-menu-demo"
            text-color="#333"
            active-text-color="#0074E4"
            router
            :default-active="$route.path"
            >
            <navMenu :menus="menus"></navMenu>
            </el-menu>
          </el-col>
        </el-row>
    </div>
        <div class="body-content">
      <el-main>
        <router-view/>
      </el-main>
      </div>
    </div>
  </div>

</template>

<script>
import navMenu from "@/share/navMenu.vue";
import headNav from "@/share/headNav.vue";
import {mapActions} from 'vuex';

export default {
  name: "Home",
  data() {
    return {
    };
  },
  created(){
    this.getUserPower();
	},

  computed:{
	//  menus(){
	//  	 return this.$store.state.navMenu.menus.filter(v=>v.url==this.$route.path)
  //  }
   	 menus(){
	 	 return this.$store.state.navMenu.menus2
	 }
  },
  methods: {
    ...mapActions('currentUserPower',['getUserPower']),
	},
   components: {
    navMenu,
    headNav
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-main{
    padding-top: 10px;
  }
  .pa_body .body-menu{
  position:absolute;
  top:60px;
  left:0;
  bottom:0;
  width:232px;
  /* background-color:#545c64; */
background: url("../assets/menu-bg.jpg") repeat-y ;
      }
  .pa_body .body-content{
  position:absolute;
  top:66px;
  left:230px;
  right:0;
  background-color:#fff;
  bottom:0;
  overflow:auto;
  border-left: 1px solid #eeeeee;
  }
.cur{ cursor: pointer;}
.el-menu{
  /* padding-left:50px; */
  background: url("../assets/menu-bg.jpg") repeat-y ;
}
</style>
