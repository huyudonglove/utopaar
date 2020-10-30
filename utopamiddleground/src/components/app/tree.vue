<template>
  <div>
    <el-dialog  :visible.sync="showTree" width="80%" @close="close">
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
            <el-table-column label="位置名称" prop="name" align="center"></el-table-column>
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
      
    </div>
    </el-dialog>
  </div>
</template>

<script>
import {getMiddleTree,selectpositionList,getDistrictList} from '../../http/request'
export default {
  props: [""],
  inject:['reload'],
  data() {
    return {
      inputPosition:'',
      treedata:[],
      isExpand:false,
      defaulProps:{"label":"name"},
      positionTable:[],//位置列表
      positionTableTotal:[],
      provinceValue:'',
      provinceList:[],//省列表
      cityValue:'',
      cityList:[],//城市列表
      areaValue:'',
      areaList:[],//地区列表
      clickTreeId:'',//当前点击的树节点id
      positionPage:1,
      positionLimit:20,
      positionTotal:0,
      positionIdList:[],
      isShowTree:false,
      showTree:true
    };
  },
  created() {
   this.tree();
   this.getProvince();
  },
  methods: {
    close(){
      this.$emit("closeBox",false)
    },
    positionCurrentChange(value){
      this.positionPage = value;
    },
    positionSizeChange(value){
        this.positionLimit = value;
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
  positionCellStyle({row, column, rowIndex, columnIndex}){//将选择的位置行高亮
      if(this.positionIdList.indexOf(row.id)!=-1){
        return {
          background: '#ccc',
          color: '#FFF'
        }
      }
    },
  showTable(data) {
      this.clickTreeId =data.id;//保存当前点击的树节点id
      this.getPositionList(data.id);
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
    resetSearchPosition(){
      this.provinceValue='',
      this.cityValue='',
      this.areaValue='',
      this.inputPosition='';
      this.clickTreeId= '';
      this.tree();
    },
    
  },
  computed: {
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
  // let id = params.id;
  // let areaId= params.areaId;
      return{
        "name":this.inputPosition,
        "pageNum":this.positionPage,
        "pageSize":this.positionLimit,
        "id":"",
        "areaId":""
      }
    }
  },
  watch: {
    showTree(){
      console.log(111,2222,333)
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
  }
};
</script>

<style scoped>
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
