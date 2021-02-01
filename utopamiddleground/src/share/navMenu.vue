<template>
  <div :style="{'overflow':'auto','height':menuHeight+'px'}">
    <div style="position:relative;background:#0074E4FF;top:2px;height:2px;width:55px;"></div>
    <div ref="myMenu" id="leftIcon2" style="border-top:1px solid #eee">
      <!-- 一级菜单 -->
      <template v-for="item in menus"  >
        <el-submenu v-if="item.childs && item.childs.length" :index="item.url+''":key="item.url"  >
          <template slot="title">
            <i :style="{'background':`url(${icon[item.url.substring(0,item.url.lastIndexOf('\/'))]}) no-repeat left`}"></i>
            <span>{{item.menuName}}</span>
          </template>
          <!-- 二级菜单 -->
          <template v-for="itemChild in item.childs">
            <el-submenu v-if="itemChild.childs && itemChild.childs.length" :index="itemChild.url+''" :key="itemChild.url">
              <template slot="title">
                <i :style="{'background':`url(${icon[itemChild.url.substring(0,itemChild.url.lastIndexOf('\/',itemChild.url.lastIndexOf('\/')-1))]}) no-repeat left`}" style="left:-20px;position:relative"></i>
                <span >{{itemChild.menuName}}</span>
              </template>
              <!-- 三级菜单 -->
              <el-menu-item v-for="itemChild_Child in itemChild.childs" :index="itemChild_Child.url+''" :key="itemChild_Child.url">
                <i :style="{'background':`url(${icon[itemChild_Child.url.substring(0,itemChild_Child.url.lastIndexOf('\/',itemChild_Child.url.lastIndexOf('\/')-1))]}) no-repeat left`}"  style="left:-40px;position:relative"></i>
                <span slot="title">{{itemChild_Child.menuName}}</span>
              </el-menu-item>
            </el-submenu>

            <el-menu-item v-else :index="itemChild.url+''"  :key="itemChild.url" >
              <i :style="{'background':`url(${icon[itemChild.url.substring(0,itemChild.url.lastIndexOf('\/',itemChild.url.lastIndexOf('\/')-1))]}) no-repeat left`}" style="left:-20px;position:relative"></i>
              <span slot="title">{{itemChild.menuName}}</span>
            </el-menu-item>
          </template>
        </el-submenu>

        <el-menu-item v-else :index="item.url+''" :key="item.url">
          <i :style="{'background':`url(${item.url.indexOf('/application/assetsList/assetsMoudelVirtual/7')!=-1?icon[item.url.substring(0,item.url.lastIndexOf('\/'))]:icon[item.url]}) no-repeat left`}"></i>
          <span slot="title">{{item.menuName}}</span>
        </el-menu-item>
      </template>

    </div>
  </div>
</template>

<script>
export default {
  name: "navMenu",
  props: ["menus"],
  data() {
    return {
      menuHeight:0,
      icon:{
        '/system/userlist':require('../assets/icon_user_AD.png'),
        '/system/rolelist':require('../assets/icon_Range_AD.png'),
        '/assetsmanager/positionlist':require('../assets/icon_location_AD.png'),
        '/app/modulelist':require('../assets/icon_Page-configuration.png'),
        '/application/assetsList/assetsMoudelVirtual/7':require('../assets/icon_ARpic.png'),
        '/application/assetsList/2':require('../assets/icon_ARpic.png'),
        '/application/assetsList/4':require('../assets/icon_ARpic.png'),
        '/application/assetsList/1':require('../assets/icon_theater.png'),
        '/application/assetsList/3':require('../assets/icon_theater.png'),
        '/application/assetsList/5':require('../assets/icon_theater.png'),
        '/application/assetsList/6':require('../assets/icon_theater.png'),
        '/application/assetsList/9':require('../assets/icon_theater.png'),
        '/application/assetsList/10':require('../assets/icon_theater.png'),
        '/application/assetsList/content':require('../assets/icon_content_AD.png'),
        '/application/assetsList/assets':require('../assets/icon_material_AD.png'),
        '/app/applicationList':require('../assets/icon_app_AD.png'),
        '/application/assetsList/assets/101':require('../assets/icon_cartoon_AD.png'),
        '/application/assetsList/assets/100':require('../assets/icon_mus_AD.png'),
        '/application/assetsList/assets/103':require('../assets/icon_model_AD.png'),
        '/application/assetsList/assets/102':require('../assets/icon_Carrier_model_AD.png'),
        '/application/assetsList/assets/107':require('../assets/icon_MP4video_AD.png'),
        '/application/assetsList/assets/104':require('../assets/icon_Online-Video_AD.png'),
        '/app/feedBackList':require('../assets/icon_feedback.png'),
        '/app/versionList':require('../assets/icon_feedback.png'),
      }
    };
  },
  methods: {

  },
   components:{
  },
  updated(){
    this.$nextTick(()=>{
      this.menuHeight = window.innerHeight - this.$refs.myMenu.offsetTop-60;
    })
  }
};
</script>
<style >
#leftIcon2 .el-menu-item ,#leftIcon2 .el-submenu__title{
  padding-left:55px;
  background: url("../assets/menu-bg.jpg") repeat-y ;
}

</style>
<style scoped>
/*.el-menu .el-menu-item:first-child{*/
/*  background-color: #F0F0F0;*/
/*  border-radius: 10px 10px 0px 0px;*/
/*  border-bottom: 1px solid rgba(223,220,220,1);*/
/*}*/
.el-menu .el-menu-item{
  width: 100%;
  /* background-color: #F0F0F0; */
  /* border-bottom: 1px solid rgba(223,220,220,1); */
}
/* .el-menu-vertical-demo>div>.el-menu-item{
  background-color: #FFF;
  border-bottom:none;
} */
.el-menu .el-menu-item:last-child{
  /* background-color: #F0F0F0; */
  /* border-radius: 0px 0px 10px 10px; */
}
.el-menu i{
    padding-right:30px;
    width: 18px;
    display: inline-block;
    height: 18px;
    text-align: left;
    font-size: 18px;
    vertical-align: middle;
    }
#leftIcon .el-menu-item:focus, #leftIcon .el-menu-item:hover {
  background:#0074E4FF;
}
.sbtlb{
  background: url("../assets/icon_pic1.png") no-repeat left
}
/* .leftIcon .el-menu-item:focus, .el-menu-item:hover .sbtlb{
  background: url("../assets/icon_pic2.png") no-repeat left
} */

*{
  outline:none;
}
</style>
