<template>
  <div v-if="arGlassesAppPower.length">
    <div v-if="$route.name=='glassesList'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">位置投放</span>
        <el-button style="float:right;" :disabled="!arGlassesAppPower[0].isCheck" type="primary" @click="$router.push({path:'/glassesList/createGlasses',query:{oldQuery:JSON.stringify($route.query)}})">新增</el-button>
      </div>
      <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
        <!-- <el-input v-model="inputX" style="width: 250px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入应用名称"></el-input>
        <span>
          应用类型
          <el-select v-model="appValue" style="width:150px;">
            <el-option v-for="(item,idx) in appList" :key="idx" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </span> -->
        <span class="myWords">
          端口
          <el-select v-model="port" style="width:150px;" clearable>
            <el-option label="眼镜" value="0"></el-option>
            <el-option label="PC" value="1"></el-option>
          </el-select>
        </span>
        <span class="myWords">
          状态
          <el-select v-model="status" style="width:150px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="2"></el-option>
          </el-select>
        </span>
        <el-button type="info" @click="reset">重置</el-button>
        <el-button :disabled="!delArr.length||!arGlassesAppPower[3].isCheck" type="danger" @click="logDel">批量删除</el-button>
      </el-row>
      <el-table ref="glassesRef" :data="glassesTable" border style="width: 100%" class="mt15 mb15" @selection-change="handleSelectionChange" row-key="id" :max-height="tableHeight">
        <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>
        <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
        <el-table-column prop="assetName" label="位置" align="center"></el-table-column>
        <el-table-column prop="identifyMapNum" label="识别图数量" align="center">
          <template slot-scope="scope">   
            <a href="javascript:void(0);" @click="showImg(scope.row.assetId)">{{scope.row.identifyMapNum?scope.row.identifyMapNum:0}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="applicationNum" label="应用数量" align="center">
          <template slot-scope="scope">
            <a href="javascript:void(0);" @click="showApp(scope.row.assetId)">{{scope.row.applicationNum?scope.row.applicationNum:0}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="appPort" label="端口" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.appPort=='0'">眼镜</span>
            <span v-if="scope.row.appPort=='1'">PC</span>
            <span v-if="scope.row.appPort=='0,1'">眼镜/PC</span>
            <span v-if="scope.row.appPort=='1,0'">眼镜/PC</span>
          </template>  
        </el-table-column>
        <el-table-column prop="state" label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.state==1">启用</span>
            <span v-if="scope.row.state==2">禁用</span>
          </template>  
        </el-table-column>
        <el-table-column prop="updateTime" label="最新保存时间" align="center"></el-table-column>
        <el-table-column prop="updateBy" label="更新人" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" width="250" align="center">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="$router.push({path:'/glassesList/createGlasses',query:{assetId:scope.row.assetId,port:scope.row.appPort,oldQuery:JSON.stringify($route.query)}})">查看</el-button>
            <el-button type="primary" :disabled="!arGlassesAppPower[1].isCheck" size="mini" @click="$router.push({path:'/glassesList/createGlasses',query:{id:scope.row.id,assetId:scope.row.assetId,port:scope.row.appPort,isEdit:1,oldQuery:JSON.stringify($route.query)}})">编辑</el-button>
            <el-button type="danger" :disabled="!arGlassesAppPower[3].isCheck" size="mini" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
          <pagination v-if="showPagination"></pagination>
      </div>
      <div v-if="isShowImg">
        <imgDialog :putId="putId" @imgDialogClose="imgDialogClose"></imgDialog>
      </div>
      <div v-if="isShowApp">
        <appDialog :putId="putId" @appDialogClose="appDialogClose"></appDialog>
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
import imgDialog from './imgDialog'
import appDialog from './appDialog'
import {getGlassesList,delGlasses,getAppDropDown} from '../../http/request'
export default {
  name:'glassesList',
  inject:['replace','reload'],
  components:{
    pagination,
    appDialog,
    imgDialog
  },
  data(){
    return{
      inputX:'',
      status:'',
      port:'',
      appValue:'',
      appList:[],
      glassesTable:[],
      showPagination:false,
      delArr:[],
      tableHeight:0,
      isShowImg:false,
      isShowApp:false,
      putId:''
    }
  },
  computed:{
    ...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
    ...mapState('currentUserPower',{arGlassesAppPower:'arGlassesAppPower'}),
  },
  watch:{
    page(){
      this.replace('page',this.page);
    },
    limit(){
      this.replace('limit',this.limit);
    },
    // inputX(){
    //   this.$store.commit('pagination/setClickPage',1);//重置第1页
    //   this.replace('name',this.inputX);
    //   this.delArr=[];
    // },
    status(){
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('status',this.status);
      this.delArr=[];
    },
    port(){
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('port',this.port);
      this.delArr=[];
    },
    // appValue(){
    //   this.$store.commit('pagination/setClickPage',1);//重置第1页
    //   this.replace('appValue',this.appValue);
    //   this.delArr=[];
    // },
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='glassesList'){
        this.listData();
      }
    }
  },
  methods:{
    handleSelectionChange(arr){
      this.delArr = arr.length?arr.map(v=>v.id):[];
    },
    del(id){
      delGlasses([id]).then(res=>{
        if(this.glassesTable.length==1){
          this.replace('page',1);
        }
        this.reload();
      })
    },
    logDel(){
      if(this.delArr.length>0){
        delGlasses(this.delArr).then(res=>{
          this.replace('page',1);
          this.reload();
        })
      }else{
        this.$message.error('请勾选需要删除的用户');
      }  
    },
    reset(){
      this.replace('reset');
      // this.inputX='';
      this.status='';
      this.port='';
      // this.appValue='';
    },
    dropdown(){
      getAppDropDown().then(res=>{
        this.appList = res.data?res.data:[];
        this.appList.unshift({id:'',name:'全部'})
      })
    },
    showImg(id){
      this.putId= id;
      this.isShowImg = true;
    },
    imgDialogClose(){
      this.isShowImg=false;
    },
    showApp(id){
      this.putId= id;
      this.isShowApp = true;
    },
    appDialogClose(){
      this.isShowApp=false;
    },
    listData(){
      getGlassesList(this.$route.query).then(res=>{
        this.glassesTable=res.data.items;
        this.$store.commit('pagination/setTotal', res.data.total);
      })
    },
  },
  created(){
    // this.dropdown();
    this.listData();
    let pageRecord = this.$route.query.page||1;//记录上一次页码操作
    let limitRecord = this.$route.query.limit||20;//记录上一次limit操作
    // this.inputX = this.$route.query.name||'';
    this.status = this.$route.query.status||'';
    this.port = this.$route.query.port||'';
    // this.appValue = this.$route.query.appValue||'';
    this.$nextTick(()=>{
      this.$store.commit('pagination/setClickPage',pageRecord);
      this.$store.commit('pagination/setLimitPage',limitRecord);
      this.showPagination = true;//加载分页组件
    })
  },
  updated(){
    if(this.$route.name=='glassesList'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.glassesRef.$el.offsetTop - 110;
      })
    }
  }
}
</script>

<style scoped>

</style>