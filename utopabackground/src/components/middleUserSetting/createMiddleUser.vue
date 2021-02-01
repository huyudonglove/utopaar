<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span v-if="isCreate" style="font-size:24px;font-weight:bold;color:#614a4d;">新建中台用户</span>
      <span v-if="isEdit" style="font-size:24px;font-weight:bold;color:#614a4d;">编辑中台用户</span>
    </div>
    <el-form label-position="right" label-width="260px" style="width: 70%">
      <el-form-item label="用户名称" :required="true">
        <el-input type="text" v-model="userName" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="用户账号" :required="true">
        <el-input type="text" v-model="loginUser" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="用户密码" :required="true">
        <input  type="text"  class="is-hidden" />
        <el-input type="password" v-model="password" autocomplete="new-password"></el-input>
      </el-form-item>
      <el-form-item label="中台显示《UtopaAR APP》管理菜单" :required="true">
        <el-switch v-model="isActive" :active-value="1" :inactive-value="2" inactive-color="#ccc"></el-switch>
      </el-form-item>
      <el-form-item label="中台显示《AR眼镜 APP》管理菜单" :required="true">
        <el-switch v-model="status" :active-value="1" :inactive-value="2" inactive-color="#ccc"></el-switch>
      </el-form-item>
    </el-form>
    <div>
      <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding-bottom:15px;">
        <el-input v-model="inputApp" style="width: 20%;" suffix-icon="el-icon-search" maxlength="50" placeholder="输入关键字"></el-input>
        <span class="myWords">
          玩法筛选
          <el-select v-model="playType" style="width:150px;">
            <el-option v-for="(item,idx) in playTypeList" :key="idx" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </span>
        <span class="myWords">
          状态筛选
          <el-select v-model="statusType" style="width:150px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="已选择" :value="1"></el-option>
            <el-option label="未选择" :value="0"></el-option>
          </el-select>
        </span>
        <span class="myWords">
          Unity版本
          <el-select v-model="Unity" style="width:150px;" clearable>
            <el-option v-for="(item,idx) in UnityList" :key="idx" :label="item" :value="item"></el-option>
          </el-select>
        </span>
        <span class="myWords">
          渲染管线
          <el-select v-model="line" style="width:150px;" clearable>
            <el-option v-for="(item,idx) in lineList" :key="idx" :label="item" :value="item"></el-option>
          </el-select>
        </span>
        <!-- <el-button type="primary" @click="selectAppLot">批量选择</el-button>
        <el-button type="info" @click="clearApp">批量取消</el-button> -->
      </el-row>
      <el-table ref="multipleApp" border :cell-style="appCellStyle" :data="appTableTotal.slice((playPage - 1) * playLimit, playPage * playLimit)" tooltip-effect="dark" @selection-change="handleSelectionChange" row-key="id">
        <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>
        <el-table-column prop="id" label="ID" width="200" align="center"></el-table-column>
        <el-table-column label="应用名称" prop="name" align="center"></el-table-column>
        <el-table-column label="玩法" prop="playName" align="center"></el-table-column>
        <el-table-column label="Unity版本" prop="unityVersion" align="center"></el-table-column>
        <el-table-column label="渲染管线" prop="loadingLine" align="center"></el-table-column>
        <el-table-column label="上下架状态" prop="state" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.state==1">上架</span>
            <span v-if="scope.row.state==2" style="color:red;">下架</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="状态" width="200" align="center">
          <template slot-scope="scope">
            <span v-if="appIdList.indexOf(scope.row.id)!=-1">已选择</span>
            <span v-if="appIdList.indexOf(scope.row.id)==-1">未选择</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="appSizeChange"
        @current-change="appCurrentChange"
        :current-page="playPage"
        :page-sizes="[ 20, 40, 60,80]"
        :page-size="playLimit"
        layout="total,sizes, prev, pager, next,jumper"
        :total="playTotal?playTotal:0">
      </el-pagination>
    </div>
    <el-container>
      <div class="asideTree">
        <div :style="{'overflow':'auto','height':'500px'}" v-if="isShowTree">
          <el-tree :data="treedata" highlight-current @node-click="showTable" :default-expand-all="isExpand" :props="defaulProps" >
            <span class="span-ellipsis" slot-scope="{ node }">
              <span :title="node.label">{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </div>
      <el-main>
        <div>
          <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding-bottom:15px;">
            <span class="myWords">省
              <el-select v-model="provinceValue" placeholder="请选择" style="width:100px;">
                <el-option v-for="(item,idx) in provinceList" :key="idx" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </span>
            <span class="myWords">市
              <el-select v-model="cityValue" placeholder="请选择" style="width:100px;">
                <el-option v-for="(item,idx) in cityList" :key="idx" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </span>
            <span class="myWords">区
              <el-select v-model="areaValue" placeholder="请选择" style="width:100px;">
                <el-option v-for="(item,idx) in areaList" :key="idx" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </span>
            <el-input v-model="inputPosition" style="width:200px;" maxlength="50" placeholder="请输入内容"></el-input>
            <el-button type="primary" @click="tree">搜索</el-button>
            <!-- <el-input
              placeholder="请输入内容"
              class="input-with-select"
              v-model="inputPosition"
              style="width: 20%;"
            >
              <el-button slot="append" icon="el-icon-search" @click="tree">搜索</el-button>
            </el-input> -->
            <el-button type="info" @click="resetSearchPosition">重置</el-button>
            <!-- <el-button type="primary" @click="selectPositionLot">批量选择</el-button>
            <el-button type="info" @click="clearPosition">批量取消</el-button> -->
          </el-row>
        </div>
        <div>
          <el-table ref="multiplePosition" border :cell-style="positionCellStyle" :data="positionTable" tooltip-effect="dark" @select="positionSelect" @select-all="positionSelectAll">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="id" label="ID" width="200" align="center"></el-table-column>
            <el-table-column label="单元名称" prop="name" align="center"></el-table-column>
            <el-table-column label="地图" align="center">
              <template slot-scope="scope">
                <div style="display:inline-block;color:#fff;text-align:center;border-radius:4px;width:80px;height:35px;line-height:35px;"
                :style="{'background-color':scope.row.easyArList&&scope.row.easyArList.length?'#0074e4':false?'#ffdf25':'grey'}">EasyAR</div>
                <div style="display:inline-block;color:#fff;text-align:center;border-radius:4px;width:80px;height:35px;line-height:35px;"
                :style="{'background-color':scope.row.locusArList&&scope.row.locusArList.length?'#0074e4':false?'#ffdf25':'grey'}">LocusAR</div>
                <div><el-button type="text" @click="showMap(scope.row)">查看</el-button></div>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="状态" width="200" align="center">
              <template slot-scope="scope">
                <span v-if="positionIdList.indexOf(scope.row.id)!=-1">已选择</span>
                <span v-if="positionIdList.indexOf(scope.row.id)==-1">未选择</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <el-pagination
            background
            @size-change="positionSizeChange"
            @current-change="positionCurrentChange"
            :current-page="positionPage"
            :page-sizes="[ 20, 40, 60,80]"
            :page-size="positionLimit"
            layout="total,sizes, prev, pager, next,jumper"
            :total="positionTotal?positionTotal:0">
          </el-pagination>
        </div>
      </el-main>
    </el-container>
    <div>
      <el-button type="primary" @click="addOrEdit">确定</el-button>
      <el-button @click="$router.push({path:'/middleusersetting/middleuserlist',query:JSON.parse($route.query.oldQuery)});">取消</el-button>
    </div>
    <el-dialog title="地图详情" :visible.sync="mapVisible" @close="mapInput='';mapType=1" width="500px">
      <el-radio-group v-model="mapType" style="padding-bottom: 10px" @change="mapInput=''">
        <el-radio-button :label="1">EasyAR</el-radio-button>
        <el-radio-button :label="2">LocusAR</el-radio-button>
      </el-radio-group>
      <div style="margin-bottom: 10px;position:relative;overflow:hidden;">
        <el-input style="width:150px;float:right;margin-right:10px;" v-model="mapInput" suffix-icon="el-icon-search" maxlength="50" placeholder="关键字搜索"></el-input>
      </div>
      <div v-if="mapType==1">
        <el-table ref="mapTable" :data="easyMapList.filter(v=>v.mapName.toLowerCase().indexOf(mapInput.toLowerCase())!=-1)" tooltip-effect="dark" max-height="300px" border>
          <el-table-column label="id" prop="id" width="50" align="center"></el-table-column>
          <el-table-column label="地图名称" prop="mapName" align="center"></el-table-column>
          <el-table-column label="地图ID" prop="mapId" align="center"></el-table-column>
        </el-table>
      </div>
      <div v-if="mapType==2">
        <el-table ref="mapTable" :data="locusMapList.filter(v=>v.mapName.toLowerCase().indexOf(mapInput.toLowerCase())!=-1)" tooltip-effect="dark" max-height="300px" border>
          <el-table-column label="id" prop="id" width="50" align="center"></el-table-column>
          <el-table-column label="地图名称" prop="mapName" align="center"></el-table-column>
          <el-table-column label="地图ID" prop="mapId" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addMiddleUser,editMiddleUser,getMiddleUserInfo,selectAppList,getPlayDropDown,getDistrictList,getMiddleTree,selectpositionList,getUnityLineDropDown} from '../../http/request'
export default {
  name:'createMiddleList',
  inject:['reload'],
  data(){
    return{
      isCreate:false,
      isEdit:false,
      loading:'',//loading框
      positionTable:[],//位置列表
      positionTableTotal:[],
      treedata:[],
      defaulProps:{"label":"name"},
      inputPosition:'',//位置输入框
      userName:'',//用户名
      loginUser:'',//账号
      password:'',//密码
      isActive:2,
      status:2,
      playType:'',//玩法类型
      playTypeList:[],//玩法列表
      Unity:"",
      UnityList:[],
      line:"",
      lineList:[],
      inputApp:'',//应用名字筛选
      statusType:'',//状态
      appTable:[],//应用列表
      appTableTotal:[],
      appIdList:[],//选择的应用id数组
      positionIdList:[],//选择的位置id数组
      playPage:1,
      playLimit:20,
      playTotal:0,
      positionPage:1,
      positionLimit:20,
      positionTotal:0,
      provinceValue:'',
      provinceList:[],//省列表
      cityValue:'',
      cityList:[],//城市列表
      areaValue:'',
      areaList:[],//地区列表
      clickTreeId:'',//当前点击的树节点id
      isShowTree:true,
      isExpand:false,
      mapVisible:false,
      easyMapList:[],
      locusMapList:[],
      mapType:1,
      mapInput:''
    }
  },
  computed:{
    allParams(){
      return{
        "userName":this.userName,
        "loginName":this.loginUser,
        "password":this.password,
        "appIds":this.appIdList,
        "positionIds":this.positionIdList,
        "isActive":this.isActive,
        "status":this.status
      }
    },
    appParams(){
      return{
        // "page":this.playPage,
        // "limit":this.playLimit,
        "unityVersion":this.Unity,
        "loadingLine":this.line,
        "name":this.inputApp,
        "playId":this.playType,
        "status":this.statusType,
        "userId":parseInt(this.$route.query.id)?parseInt(this.$route.query.id):''
      }
    },
    treeParams(){
      return{
        "provinceId":this.provinceValue?this.provinceValue:null,
        "cityId":this.cityValue?this.cityValue:null,
        "areaId":this.areaValue?this.areaValue:null,
        "source":"Background",
        "name":this.inputPosition
      }
    },
    positionParams(){
      return{
        // "page":this.positionPage,
        // "limit":this.positionLimit,
        "userId":parseInt(this.$route.query.id),
        "status":'',
      }
    }
  },
  watch:{
    playPage(){
      // this.appTable=this.appTableTotal.filter((item,index)=>index>=(this.playPage-1)*this.playLimit && index<this.playPage*this.playLimit);
      // this.clashAPP();
    },
    playLimit(){
      if(this.playPage!=1){
        this.playPage=1;
      }
      // this.appTable=this.appTableTotal.filter((item,index)=>index>=(this.playPage-1)*this.playLimit && index<this.playPage*this.playLimit);
      // this.clashAPP();
    },
    positionPage(){
      this.positionTable = this.positionTableTotal.filter((item,index)=>index>=(this.positionPage-1)*this.positionLimit && index<this.positionPage*this.positionLimit);
      this.clashPosition();
    },
    positionLimit(){
      if(this.positionPage!=1){
        this.positionPage=1;
      }
      this.positionTable = this.positionTableTotal.filter((item,index)=>index>=(this.positionPage-1)*this.positionLimit && index<this.positionPage*this.positionLimit);
      this.clashPosition();
    },
    inputApp(){
      if(this.playPage!=1){
        this.playPage=1;
      }
      this.appList();
    },
    playType(){
      if(this.playPage!=1){
        this.playPage=1;
      }
      this.appList();
    },
    Unity(){
      if(this.playPage!=1){
        this.playPage=1;
      }
      this.appList();
    },
    line(){
      if(this.playPage!=1){
        this.playPage=1;
      }
      this.appList();
    },
    statusType(val){
      if(this.playPage!=1){
        this.playPage=1;
      }
      this.appList();
    },
    provinceValue(newValue){
      if(newValue!=''){
        this.getCity(newValue);
        this.cityValue = '';
        this.areaValue = '';
      }
    },
    cityValue(newValue){
      if(newValue!=''){
        this.getArea(newValue);
        this.areaValue = '';
      }
    },
  },
  methods:{
    showMap(row){
      this.mapVisible=true;
      this.easyMapList=row.easyArList||[];
      this.locusMapList = row.locusArList||[];
    },
    appCellStyle({row, column, rowIndex, columnIndex}){//将选择的应用行高亮
      if(this.appIdList.indexOf(row.id)!=-1){
        return {
          background: '#ccc',
          color: '#FFF'
        }
      }
    },
    positionCellStyle({row, column, rowIndex, columnIndex}){//将选择的位置行高亮
      if(this.positionIdList.indexOf(row.id)!=-1){
        return {
          background: '#ccc',
          color: '#FFF'
        }
      }
    },
    appSizeChange(value){
      this.playLimit = value;
    },
    appCurrentChange(value){
      this.playPage = value;
    },
    handleSelectionChange(val) {
      this.appIdList=val.map(v=>v.id)
    },
    positionSizeChange(value){
      this.positionLimit = value;
    },
    positionCurrentChange(value){
      this.positionPage = value;
    },
    positionSelect(arr,row){
      if(arr.map(v=>v.id).indexOf(row.id)==-1){
        this.positionIdList = this.positionIdList.filter(v=>v!=row.id);
      }else{
        this.positionIdList.push(row.id);
      }
    },
    positionSelectAll(arr){
      if(arr.length){
        this.positionIdList=this.positionIdList.filter(v=>arr.map(v=>v.id).indexOf(v)==-1);
        this.positionIdList=this.positionIdList.concat(arr.map(v=>v.id))
      }else{
        this.positionIdList=this.positionTable.filter(v=>arr.map(v=>v.id).indexOf(v)==-1);
      }
    },
    appList(isFirst){
      selectAppList(this.appParams).then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{
          if(res.data){
            this.appTableTotal =res.data;
            // this.appTable = res.data.filter((item,index)=>index>=(this.playPage-1)*this.playLimit && index<this.playPage*this.playLimit)
            this.playTotal=res.data.length;
            if(isFirst){
              let selectAllRow=this.appTableTotal.filter(v=>this.appIdList.indexOf(v.id)!=-1)
              this.$nextTick(()=>{
                selectAllRow.forEach(v=>{
                  this.$refs.multipleApp.toggleRowSelection(v,true); 
                })
              });        
            }
          }
        }
      })
    },
    resetSearchPosition(){
      this.provinceValue='',
      this.cityValue='',
      this.areaValue='',
      this.inputPosition='';
      this.clickTreeId= '';
      this.tree();
    },
    clashAPP(){//将选择应用的行高亮
      let selectAllRow=[];
      for(let i=0;i<this.appIdList.length;i++){
        var row=this.appTable.find(v=>v.id==this.appIdList[i]);
        if(row){
          selectAllRow.push(row);
        }
      };
      this.$nextTick(()=>{
        selectAllRow.forEach(v=>{
          this.$refs.multipleApp.toggleRowSelection(v,true); 
        })
      });
    },
    clashPosition(){//将选择应用的位置
      let selectAllRow=[];
      for(let i=0;i<this.positionIdList.length;i++){
        var row=this.positionTable.find(v=>v.id==this.positionIdList[i]);
        if(row){
          selectAllRow.push(row);
        }
      };
      this.$nextTick(()=>{
        selectAllRow.forEach(v=>{
          this.$refs.multiplePosition.toggleRowSelection(v,true); 
        })
      })
    },
    playDropDown(){
      getPlayDropDown().then(res=>{
        this.playTypeList=res.data;
        this.playTypeList.unshift({"id":'',"name":'全部'})
      })
    },
    unityDropDown(){
      getUnityLineDropDown({"type":2}).then(res=>{
        this.UnityList=res.data;
      })
    },
    lineDropDown(){
      getUnityLineDropDown({"type":1}).then(res=>{
        this.lineList=res.data;
      })
    },
    getProvince(){//获取省
      getDistrictList({"parentId":0}).then(res=>{
        this.provinceListC=this.provinceList = res.data;
      })
    },
    getCity(id){//获取市
      getDistrictList({"parentId":id}).then(res=>{
        this.cityList = res.data;
      })
    },
    getArea(id){//获取地区
      getDistrictList({"parentId":id}).then(res=>{
        this.areaList = res.data;
      })
    },
    tree(){
      getMiddleTree(this.treeParams).then(res=>{
        this.treedata =res.data;
        this.isExpand = false;
        this.isShowTree =false;
        if(this.inputPosition!==''){ 
          this.isExpand = true
        }
        this.$nextTick(()=>{
          this.isShowTree=true;
        })
        this.positionTableTotal=[];
        this.positionTable=[];
        this.positionTotal=0;
      })
    },
    getPositionList(parentId){
      selectpositionList({parentId,...this.positionParams}).then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{
          if(res.data){
            this.positionTableTotal =res.data;
            this.positionTable = res.data.filter((item,index)=>index>=(this.positionPage-1)*this.positionLimit && index<this.positionPage*this.positionLimit)
            this.positionTotal=res.data.length;
            let selectAllRow=[];
            for(let i=0;i<this.positionIdList.length;i++){
              var row=this.positionTable.find(v=>v.id==this.positionIdList[i]);
              if(row){
                selectAllRow.push(row);
              }
            };
            this.$nextTick(()=>{
              selectAllRow.forEach(v=>{
                this.$refs.multiplePosition.toggleRowSelection(v,true); 
              })
            })
          }
        }
      })
    },
    userInfo(){
      this.loading=this.$loading({
        lock: true,
        text: '数据获取中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      getMiddleUserInfo({"userId":parseInt(this.$route.query.id)}).then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{
          this.userName=res.data.userName;
          this.loginUser=res.data.loginName;
          this.password = res.data.password;
          this.appIdList=res.data.appIds?res.data.appIds:[];
          this.positionIdList=res.data.positionIds?res.data.positionIds:[];
          this.isActive = res.data.isActive;
          this.status = res.data.status;
          this.appList('first');
        }
        this.loading.close();
      }).catch(err=>{
        this.loading.close();
      })
    },
    showTable(data) {
      this.clickTreeId =data.id;//保存当前点击的树节点id
      this.getPositionList(data.id);
    },
    addOrEdit(){
      if(this.allParams.userName===''){
        this.$message.error('请输入用户名称');
        return;
      }
      if(this.allParams.loginName===''){
        this.$message.error('请输入用户账号');
        return;
      }
      if(this.allParams.password===''){
        this.$message.error('密码不能为空');
        return;
      }
      if(this.isCreate){
        addMiddleUser(this.allParams).then(res=>{
          this.$router.push({path:'/middleusersetting/middleuserlist',query:JSON.parse(this.$route.query.oldQuery)});
          this.reload();
        })
      }else if(this.isEdit){
        editMiddleUser({"userId":parseInt(this.$route.query.id),...this.allParams}).then(res=>{
          this.$router.push({path:'/middleusersetting/middleuserlist',query:JSON.parse(this.$route.query.oldQuery)});
          this.reload();
        })
      }
      
    }
  },
  created(){
    this.playDropDown();
    this.unityDropDown();
    this.lineDropDown();
    this.getProvince();
    this.tree();
    if(this.$route.query.id){
      this.isEdit=true;
      this.userInfo();
    }else{
      this.isCreate=true;
      this.appList();
    }
  }
}
</script>

<style scoped>
.is-hidden {
    position: absolute;
    left: -10000px;
    top: -10000px;
}
.asideTree {
  width: 25%;
  height: 100%;
}
.span-ellipsis {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>