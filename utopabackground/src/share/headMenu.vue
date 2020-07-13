<template>
  <div class="navMenu">
    <template v-for="item in headMenus">
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
</template>

<script>
import { mapState, mapActions } from "vuex";
import headMenu from "@/share/headMenu.vue";
  export default {
    name: 'headMenu',
    props: ['headMenus'],
    data() {
      return {

      }
    },
    mounted(){
    },

    methods: {},

    created(){
      //console.log(this.headMenus,111)

    },
    components: {
    headMenu
  }
  }
</script>

<style>
/* 水平样式 */
 .el-menu--horizontal>div>.el-submenu {
    float: left;
}
/* 一级菜单的样式 */
.el-menu--horizontal>div>.el-menu-item {
    float: left;
    height: 60px;
    line-height: 60px;
    margin: 0;
    border-bottom: 2px solid transparent;
    color: #909399;
}
/* 解决下图1 下拉三角图标 */
.el-menu--horizontal>div>.el-submenu .el-submenu__icon-arrow {
    position: static;
    vertical-align: middle;
    margin-left: 8px;
    margin-top: -3px;
}
/* 解决下图2 无下拉菜单时 不对齐问题 */
.el-menu--horizontal>div>.el-submenu .el-submenu__title {
    height: 60px;
    line-height: 60px;
    border-bottom: 2px solid transparent;
    color: #909399;
}
*{
  outline:none;
}
</style>
