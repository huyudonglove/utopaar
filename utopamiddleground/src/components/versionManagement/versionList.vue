<template>
  <div> 
    <div v-if="$route.name=='versionList'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">版本管理</span>
        <el-button style="float:right;" type="primary" @click="showVersion=true">版本升级</el-button>
      </div>
      <div>
        <div style="margin:20px 0px">
           <span>
            当前版本号：{{latestVersion}}
          </span>
        </div>
        <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
          <span>
             <el-radio-group v-model="appType" style="" @change="changeType">
              <el-radio-button label="1">Ios</el-radio-button>
              <el-radio-button label="0">Android</el-radio-button>
            </el-radio-group>
          </span>
		      <span class="myWords">
            强制更新：
            <el-select v-model="updateType" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </span>
           <span class="myWords">
            是否生效:
            <el-select v-model="isValid" placeholder="请选择">
            <el-option label="全部" value></el-option>  
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
          </span>
        </el-row>
        <!-- 数据展示 -->
        <el-table :data="tableData" ref="multipleTable" tooltip-effect="dark" style="width: 100%" :max-height="tableHeight"  border @sort-change="changeUpadte">
          <el-table-column prop="id" label="ID" width="100" align="center">
          </el-table-column>
          <el-table-column prop="androidVersionCode" label="排序" width="100" align="center" sortable="custom">
          </el-table-column>
          <el-table-column prop="androidLatestVersion" label="版本号" width="130" align="center">
             <template slot-scope="scope">
               {{scope.row.appType==0?scope.row.androidLatestVersion:scope.row.iosLatestVersion}}
             </template>
          </el-table-column>
          <el-table-column prop="publishTime" label="发布时间" width="180" align="center" sortable="custom">
          </el-table-column>
          <el-table-column prop="content" label="更新内容" width="" align="center">
          </el-table-column>
		      <el-table-column prop="createTime" label="更新提示" width="200" align="center" >
             <template slot-scope="scope">
              {{scope.row.appType==0?scope.row.androidRemark:scope.row.iosRemark}}
            </template>>
          </el-table-column>
          <el-table-column prop="updateType" label="强制更新" width="120" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.updateType==1">是</span>
              <span v-if="scope.row.updateType==0" style="color:red">否</span>
            </template>
          </el-table-column>
           <el-table-column prop="operatorName" label="是否生效" width="120" align="center">
              <template slot-scope="scope">
              <span v-if="scope.row.isValid==1">是</span>
              <span v-if="scope.row.isValid==0" style="color:red">否</span>
            </template>>
          </el-table-column>
          <el-table-column prop="status" label="操作" width="180" align="center">
             <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                :disabled="new Date(scope.row.publishTime) * 1000 /1000<Date.now()"
                @click="edit(scope.row);">编辑</el-button>
              <el-button
                type="danger"
                size="mini"
                :disabled="new Date(scope.row.publishTime) * 1000 /1000<Date.now()"
               @click="edit(scope.row,1)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
		<div style="margin-top:15px"> <pagination v-if="showPagination"></pagination></div>
      </div>
   <createVersion :id='id' :showVersion='showVersion' @close='close'></createVersion>
    </div>
    <router-view/>
  </div>
</template>

<script>
import {appVersionList,getLatestVersion,updateVersion} from "../../http/request";
import { mapState, mapActions } from "vuex";
import pagination from '../../share/pagination'
import createVersion from './createVersion'
import { Message } from 'element-ui';
export default {
  name: "versionList",
  inject:['replace','reload'],
  data(){
	  return{
    appType:'1',
		updateType:"",
		isValid:"",
    total:0,
    showPagination:false,
    tableData:[],
    tableHeight:1,
    sortColumn:'',
    order:'',
    id:'',
    showVersion:false,
    latestVersion:'',
    sortName:'',
    sortType:'',
    mySetInterval:null,
    pageRecord:1,
    limitRecord:1

	  }
  },
  async created(){
  // var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  // this.tableHeight=h-260+'px'
	let query=this.$route.query
  this.pageRecord = query.page||1;//记录上一次页码操作
  this.limitRecord = query.limit||5;//记录上一次limit操作
	this.updateType=query.updateType?query.updateType:'';
  this.isValid=query.isValid?query.isValid:'';
  this.appType=query.appType?query.appType:'1';
  this.getLatestVersion({appType:this.appType})
  this.mySetInterval = setInterval(this.tableShow,5000);
  await this.dataTable({...this.$route.query,page:this.pageRecord,limit:this.limitRecord})
	this.$nextTick(()=>{
		this.$store.commit('pagination/setClickPage',this.pageRecord);
		this.$store.commit('pagination/setLimitPage',this.limitRecord);
		this.showPagination = true;//加载分页组件
})
  },
  mounted(){
  this.$nextTick(()=>{
      if(this.$refs.multipleTable.$el.style.maxHeight){

      }
  })
  },
  computed:{
  ...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
  },
  methods:{
    changeUpadte(col){
      this.sortColumn = col.prop.replace(/[A-Z]/g,(a,b)=>{
          return '_'+a.toLowerCase();
        });
      this.order = col.order=='ascending'?'asc':'desc';
      this.dataTable({...this.$route.query});
    },
	  dataTable(params){
      return new Promise((resolve,reject)=>{
        appVersionList(params).then(res=>{
          if(res.code){
            this.$message.error(res.msg);
          }else{
            this.tableData=res.data.items
            this.total=res.data.total
		        this.$store.commit('pagination/setTotal',this.total);
          } 
          resolve();
        }).catch(err=>{
          reject(err);
        })
      })
    },
    edit(row,type){
      if(type){
         updateVersion({...row,isDel:1}).then(res=>{
          if(res.code){
              Message.error(res.msg);
            }else{
            this.reload()
            }
          })   
      }else{
        this.id=row.id
        this.showVersion=true
      }
    },
    getLatestVersion(params){
    getLatestVersion(params).then(res=>{
      if(res.data){
        this.appType=='0'?this.latestVersion=res.data.androidLatestVersion:this.latestVersion=res.data.iosLatestVersion
      }else{
        this.latestVersion='无'
      }
    })
  },
  tableShow(){
    this.dataTable({...this.$route.query})
  },
  close(){
    this.showVersion=false
  },
  changeType(){
     this.getLatestVersion({appType:this.appType})
     this.dataTable({...this.$route.query});
  }
  },
  watch:{
	page(){
		this.replace("page",this.page);
    },
    limit(){
       this.replace('limit',this.limit);
    },
    updateType(){
      this.$store.commit('pagination/setClickPage',1);
      this.replace('updateType',this.updateType);
  },
  appType(){
      this.$store.commit('pagination/setClickPage',1);
      this.replace('appType',this.appType);
  },
	isValid(){
      this.$store.commit('pagination/setClickPage',1);
      this.replace('isValid',this.isValid);
  },
  sortColumn(){
      console.log(this.sortColumn,'sortColumn')
      this.$store.commit('pagination/setClickPage',1);
      this.replace('sortColumn',this.sortColumn);
    },
  order(){
    this.$store.commit('pagination/setClickPage',1);
    this.replace('order',this.order);
  },
  $route(){//判断路由query变化执行请求
      let query=this.$route.query
      this.appType=query.appType?query.appType:'1';
      if(this.$route.name=='versionList'){
      this.dataTable({...this.$route.query,appType:this.appType,page:this.pageRecord,limit:this.limitRecord})
      }  
    },

  },
  destroyed(){
    clearInterval(this.mySetInterval);
  },
  updated(){
    if(this.$route.name=='versionList'){
      this.$nextTick(()=>{
      this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 110;
    })
    }
  },
  components: {
    pagination,
    createVersion
  }
};
</script>

<style scoped>
.tac span {
  padding-left: 5px;
  padding-right: 10px;
}
/* #FBBD08 */

.downBtn{
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    color: #FFF;
    background-color: #0074E4;
    border-color: #0074E4;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 4px;
}
.downDisable{
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    color: #FFF;
    background-color: rgb(128, 186, 242);
    border-color: rgb(128, 186, 242);
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    padding: 10px 12px;
    font-size: 12px;
    border-radius: 4px;
}

.underline{
  text-decoration: underline;
  color: #333;
}

</style>
