<template>
  <div :style="{'overflow':'auto','height':menuHeight+'px'}">
    <div ref="myMenu">
      <!-- 一级菜单 -->
      <!-- <template v-for="item in menus"  >
        <el-submenu v-if="item.childs && item.childs.length" :index="item.url+''":key="item.url"  >
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{item.menuName}}</span>
          </template> -->
          <!-- 二级菜单 -->
          <!-- <template v-for="itemChild in item.childs">
            <el-submenu v-if="itemChild.childs && itemChild.childs.length" :index="itemChild.url+''" :key="itemChild.url">
              <template slot="title">
                <i :class="itemChild.icon"></i>
                <span >{{itemChild.menuName}}</span>
              </template> -->
              <!-- 三级菜单 -->
              <!-- <el-menu-item v-for="itemChild_Child in itemChild.childs" :index="itemChild_Child.url+''" :key="itemChild_Child.url">
                <i :class="itemChild_Child.icon"></i>
                <span slot="title">{{itemChild_Child.menuName}}</span>
              </el-menu-item>
            </el-submenu> -->
<!--
            <el-menu-item v-else :index="itemChild.url+''"  :key="itemChild.url">
              <i :class="itemChild.icon"></i>
              <span slot="title">{{itemChild.menuName}}</span>
            </el-menu-item>
          </template>
        </el-submenu> -->

        <!-- <el-menu-item v-else :index="item.url+''" :key="item.url">
          <i class="el-icon-share"></i>
          <span slot="title">{{item.menuName}}</span>
        </el-menu-item>
      </template> -->
      <div style="float:left;width:55px;overflow:hidden" id="leftIcon">
        <template v-for="item in menus">
        <!-- 最后一级菜单 -->
        <el-menu-item v-if="!item.childs" >
          <i :style="{'background':`url(${icon[item.url]}) no-repeat left center`}"></i>
        </el-menu-item>
        <!-- 此菜单下还有子菜单 -->
        <el-submenu v-if="item.childs && item.childs.length"
                    >
          <template slot="title">
            <i :style="{'background':`url(${icon[item.url]}) no-repeat left center`}"></i>
          </template>
          <!-- 递归 -->
          <headMenu :headMenus="item.childs"></headMenu>
        </el-submenu>
      </template>
       </div>
        <div style="margin-left:55px;border-top: 1px solid #eee" id="leftIcon2">
        <template v-for="item in menus">
          <!-- 最后一级菜单 -->
          <el-menu-item v-if="!item.childs" :index="item.url+''":key="item.url">

            <span slot="title">{{item.menuName}}</span>
          </el-menu-item>
          <!-- 此菜单下还有子菜单 -->
          <el-submenu v-if="item.childs && item.childs.length"
                      :index="item.url+''":key="item.url">
            <template slot="title">

              <span>{{item.menuName}}</span>
            </template>
            <!-- 递归 -->
            <headMenu :headMenus="item.childs"></headMenu>
          </el-submenu>
        </template>
      </div>
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
        '/material/music':require('../assets/icon_mus_AD.png'),
        '/material/container':require('../assets/icon_Carrier_model_AD.png'),
        '/material/nomarl':require("../assets/icon_model_AD.png"),
        '/material/animation':require('../assets/icon_cartoon_AD.png'),
        '/material/mp4':require('../assets/icon_MP4video_AD.png'),
        '/material/online':require('../assets/icon_Online-Video_AD.png'),
        '/material/manger':require('../assets/icon_category_AD.png'),
        '/identidfyManagement/identifyList':require('../assets/icon_identidfy.png'),
        '/identidfyManagement/identifyList/state1':require('../assets/icon_identidfyun.png'),
        '/identidfyManagement/identifyList/state2':require('../assets/icon_identidfyp.png'),
        '/identidfyManagement/identifyList/state3':require('../assets/icon_identidfyn.png')
      }
    };
  },
  methods: {

  },
  updated(){
    this.$nextTick(()=>{
      this.menuHeight = window.innerHeight - this.$refs.myMenu.offsetTop-60;
    })
  }
};
</script>

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
.el-menu-vertical-demo>div>.el-menu-item{
  background-color: #FFF;
  border-bottom:none;
}
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
/* .sbtlb{
  background: url("../assets/icon_pic1.png") no-repeat left
} */
/* .leftIcon .el-menu-item:focus, .el-menu-item:hover .sbtlb{
  background: url("../assets/icon_pic2.png") no-repeat left
} */

*{
  outline:none;
}
</style>
