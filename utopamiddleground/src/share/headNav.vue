<template>
 <div class="nav-common container">
    <div class="nav-common">
      <div class="logo">
        <div>Utopa AR</div>
         <!-- <span class="logoTitle" style="float:right">Utopa AR</span> -->
      </div>
       <div class="user" style="color: rgba(24, 28, 32, 1);">

        <!-- <span>{{userRole}}</span> -->
        <span>{{userName}}</span>
        <span class="btn_logout cur"  @click="logOut()" style="vertical-align: middle;display:inline-block;"><img src="../assets/logout.png" alt=""></span>
      </div>
      <div style="float:right">

         <el-menu style="float:right"
        mode="horizontal"
        class="el-menu-demo"
        text-color="#333"
        active-text-color="#0074E4"
        router
        :default-active="$route.path"
        @select="handleSelect"
      >
        <headMenu :headMenus="menus"></headMenu>
      </el-menu>
      </div>
    </div>
  </div>
</template>

<script>
import { Base64 } from 'js-base64';
import headMenu from "@/share/headMenu.vue";
import { mapState, mapActions } from "vuex";
export default {
  name: "headNav",
  data() {
    return {
        roleCode:'',
        userName:'',
        loginName:'',
        subjectCode:"2",
    };
  },
 created(){
    function getCookie(name)
    {
      var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  　　 return (arr=document.cookie.match(reg))?unescape(arr[2]):null;
    }
    let  token = getCookie('middlegroundToken')
    if(token){
    let arr=token.split('.')
    let tokenMsg=arr[1];
    let tokens = Base64.decode(tokenMsg);
    let Obj=JSON.parse(tokens)
    this.loginName=Obj.loginName
    this.roleCode = Obj.userCode
    this.userName = Obj.userName
     }
    this.$store.dispatch("navMenu/menuInit",{subjectCode:this.subjectCode,roleCode:this.roleCode,routeName:this.$route.path})
  },

   computed:{
  ...mapState('navMenu',{menus:'menus'}),
  },
  methods: {
      logOut(){
        this.$confirm('确认退出AR吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({
            path:'/logout'
          })
        }).catch(() => {
          return
        });
      },
    handleSelect(key, keyPath) {
        // console.log(key, keyPath);
      },
    handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
    handleClose(key, keyPath) {
      // console.log(111111, keyPath);
    }
  },
  watch:{
    $route(){
      	this.$store.dispatch("navMenu/menuInit",{subjectCode:this.subjectCode,roleCode:this.roleCode,routeName:this.$route.path})
    }
  },
  components: {
    headMenu
  }

};
</script>

<style scoped>
.container{ position: relative;}
.nav-common{background:#fff;color:#181C20FF; overflow: hidden; height:60px;border-bottom: 1px solid #eee}
  .logo{ float:left; width: 230px;background: url("../assets/menu-bg.jpg") repeat-y left  center;height:60px;}
  .logo div{ background: url("../assets/logo.png") no-repeat 70px  center;text-indent:-999px;width:100%; height: 100%;}


  .user{padding-left:40px;margin-top:20px;text-align: right; font-size: 14px;height: 39px; line-height: 22px;float:right;right:15px;}
  .logoTitle{
    font-size:14px;font-weight: 300;text-align: left;float: right;margin-left: 5px;color:#181C20FF;line-height: 60px;
  }
  .user span{margin-right:10px;position:relative; }
  .user span.logout{ font-size:16px}
  .cur{ cursor: pointer;
  }




</style>
