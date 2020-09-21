<template>
  <div v-if="middleUserPower.length">
    <div v-if="$route.name=='middleUserList'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">中台用户配置</span>
        <el-button :disabled="!middleUserPower[0].isCheck" style="float:right;" type="primary" @click="$router.push({path:'/middleusersetting/middleuserlist/createmiddleuser',query:{oldQuery:JSON.stringify($route.query)}})">新增</el-button>
      </div>
      <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
        <el-input v-model="inputX" style="width: 150px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入关键字"></el-input>
        <el-button type="info" @click="reset">重置</el-button>
        <el-button type="danger" @click="del" :disabled="!middleUserPower[3].isCheck">批量删除</el-button>
      </el-row>
      <el-table ref="middleUserRef" :data="userTable" border style="width: 100%" class="mt15 mb15" @selection-change="handleSelectionChange" :max-height="tableHeight">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="userId" label="ID" width="100" align="center"></el-table-column>
        <el-table-column prop="userName" label="用户名" align="center"></el-table-column>
        <el-table-column prop="loginName" label="账号" align="center"></el-table-column>
        <el-table-column prop="password" label="密码" align="center"></el-table-column>
        <el-table-column prop="saasCode" label="SaasCode" align="center"></el-table-column>
        <el-table-column prop="appCount" label="应用数" align="center">
          <template slot-scope="scope">
            {{scope.row.appCount}}<br/>
            <a href="javascript:void(0);" @click="showAppDialog(scope.row.userId)">查看</a>
          </template>
        </el-table-column>
        <el-table-column prop="positionCount" label="地址数" align="center">
          <template slot-scope="scope">
            {{scope.row.positionCount}}<br/>
            <a href="javascript:void(0);" @click="showPositionDialog(scope.row.userId)">查看</a>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100" align="center">
          <template slot-scope="scope">
            <el-button  :disabled="!middleUserPower[1].isCheck" type="primary" size="mini" @click="$router.push({path:'/middleusersetting/middleuserlist/createmiddleuser',query:{id:scope.row.userId,oldQuery:JSON.stringify($route.query)}})">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
          <pagination v-if="showPagination"></pagination>
      </div>
      <div v-if="isShowApp">
        <appDialog :userId="selectUserId" @appDialogClose="appDialogClose"></appDialog>
      </div>
      <div v-if="isShowPosition">
        <positionDialog :userId="selectUserId"  @positionDialogClose="positionDialogClose"></positionDialog>
      </div>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import pagination from '../../share/pagination'
import appDialog from './appDialog'
import positionDialog from './positionDialog'
import {getMiddleUserList,deleteMiddleUser} from '../../http/request'
export default {
  name:'middleUserList',
  inject:['replace','reload'],
  components:{
    pagination,
    appDialog,
    positionDialog
  },
  data(){
    return{
      inputX:'',
      userTable:[],
      showPagination:false,
      delArr:[],
      isShowApp:false,//显示应用列表
      isShowPosition:false,//现在位置列表
      selectUserId:'',//选择的行userId
      tableHeight:0,
    }
  },
  computed:{
    ...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
    ...mapState('currentUserPower',{middleUserPower:'middleUserPower'}),
  },
  watch:{
    page(){
      this.replace('page',this.page);
    },
    limit(){
      this.replace('limit',this.limit);
    },
    inputX(){
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('userName',this.inputX);
    },
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='middleUserList'){
        this.listData();
      }
    }
  },
  methods:{
    handleSelectionChange(arr){
      this.delArr = arr.length?arr.map(v=>v.userId):[];
    },
    del(){
      if(this.delArr.length>0){
        deleteMiddleUser({"userIds":this.delArr}).then(res=>{
          this.reload();
        })
      }else{
        this.$message.error('请勾选需要删除的用户');
      }  
    },
    reset(){
      this.replace('reset');
      this.inputX='';
    },
    listData(){
      getMiddleUserList(this.$route.query).then(res=>{
        this.userTable=res.data.items;
        this.$store.commit('pagination/setTotal', res.data.total);
      })
    },
    appDialogClose(){//关闭应用列表
      this.isShowApp=false;
      this.selectUserId='';
    },
    showAppDialog(userId){//显示应用列表
      this.isShowApp=true;
      this.selectUserId=userId;
    },
    positionDialogClose(){//关闭位置列表
      this.isShowPosition=false;
      this.selectUserId='';
    },
    showPositionDialog(userId){//显示位置列表
      this.isShowPosition=true;
      this.selectUserId=userId;
    }
  },
  created(){
    this.listData();
    let pageRecord = this.$route.query.page||1;//记录上一次页码操作
    let limitRecord = this.$route.query.limit||20;//记录上一次limit操作
    this.inputX = this.$route.query.userName||'';
    this.$nextTick(()=>{
      this.$store.commit('pagination/setClickPage',pageRecord);
      this.$store.commit('pagination/setLimitPage',limitRecord);
      this.showPagination = true;//加载分页组件
    })
  },
  updated(){
    if(this.$route.name=='middleUserList'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.middleUserRef.$el.offsetTop - 110;
      })
    }
  }
}
</script>

<style scoped>

</style>