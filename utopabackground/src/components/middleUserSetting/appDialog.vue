<template>
  <div>
    <el-dialog title="应用列表" :visible.sync="dialogVisible" @close="close" width="80%">
      <el-row class="tac" style="padding-bottom:15px">
        <el-input v-model="appName" style="width: 20%" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入关键字"></el-input>
        <span class="myWords">
          玩法
          <el-select v-model="playType" style="width:150px;">
            <el-option v-for="(item,idx) in playTypeList" :key="idx" :label="item.name" :value="item.id"></el-option>
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
      </el-row>
      <el-table ref="multipleTable" :data="applicationList" border style="width: 100%" class="mt15 mb15">
        <el-table-column prop="id" label="ID" width="150" align="center"></el-table-column>
        <el-table-column prop="name" label="应用名称" align="center"></el-table-column>
        <el-table-column prop="playName" label="玩法" align="center"></el-table-column>
        <el-table-column prop="unityVersion" label="Unity版本" align="center"></el-table-column>
        <el-table-column prop="loadingLine" label="渲染管线" align="center"></el-table-column>
      </el-table>
      <span>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[ 20, 40, 60,80]"
          :page-size="limit"
          layout="total,sizes, prev, pager, next,jumper"
          :total="total?total:0">
        </el-pagination>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {selectAppList,getPlayDropDown,getUnityLineDropDown} from '../../http/request'
export default {
  name:'appDialog',
  props:['userId'],
  data(){
    return{
      dialogVisible:true,
      appName:'',
      playType:'',//玩法类型
      playTypeList:[],//玩法类型下拉框
      Unity:"",
      UnityList:[],
      line:"",
      lineList:[],
      applicationList:[],
      total:'',//总行数
      page:1,//页码
      limit:20,//一页行数
    }
  },
  computed:{
    allParams(){
      return{
        "userId":this.userId,
        "name":this.appName,
        "playId":this.playType,
        "unityVersion":this.Unity,
        "loadingLine":this.line,
        "page":this.page,
        "limit":this.limit,
        "status":1
      }
    }
  },
  watch:{
    page(){
      this.getList();
    },
    limit(){
      if(this.page!=1){
        this.page=1;
      }
      this.getList();
    },
    appName(){
      if(this.page!=1){
        this.page=1;
      }
      this.getList();
    },
    playType(){
      if(this.page!=1){
        this.page=1;
      }
      this.getList();
    },
    Unity(){
      if(this.page!=1){
        this.page=1;
      }
      this.getList();
    },
    line(){
      if(this.page!=1){
        this.page=1;
      }
      this.getList();
    },
  },
  methods:{
    handleSizeChange(val) {
      this.limit =val;
    },
    handleCurrentChange(val) {
      this.page =val;
    },
    close(){
      this.$emit("appDialogClose");
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
    getList(){
      selectAppList(this.allParams).then(res=>{
        this.applicationList=res.data.items;
        this.total = res.data.total;
      })
    },
    getDropList(){//获取下拉框
      getPlayDropDown().then(res=>{
        this.playTypeList = res.data;
        this.playTypeList.unshift({"id":'',"name":'全部'})
      })
    },
  },
  created(){
    this.getList();
    this.getDropList();
    this.unityDropDown();
    this.lineDropDown();
  }
}
</script>

<style scoped>

</style>
