<template>
  <div> 
    <div v-if="$route.name=='feedBackList'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">问题反馈</span>
      </div>
      <div>
        <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
          <span>
            <el-input v-model="wd" style="width: 15%"  suffix-icon="el-icon-search"  maxlength="50"  placeholder="输入关键字"></el-input>
          </span>
		      <span>
            问题类型：
            <el-select v-model="type" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option label="功能异常" value="1"></el-option>
              <el-option label="体验问题" value="2"></el-option>
              <el-option label="新功能建议" value="3"></el-option>
              <el-option label="其他问题" value="4"></el-option>
            </el-select>
          </span>
           <span>
            反馈进度:
            <el-select v-model="status" placeholder="请选择">
             <el-option label="全部" value></el-option>
             <el-option label="待处理" value="0"></el-option>
             <el-option label="处理中" value="1"></el-option>
             <el-option label="已处理" value="2"></el-option>
             <el-option label="不作处理" value="-1"></el-option>
          </el-select>
          </span>
          <span>
           反馈时间: <timeSwitch Time="[]"></timeSwitch>
          </span>
        </el-row>
        <!-- 数据展示 -->
        <el-table :data="tableData" ref="multipleTable" tooltip-effect="dark" style="width: 100%" :max-height="tableHeight"  border @sort-change="changeUpadte">
          <el-table-column
            type="index"
            width="80" 
            align="center"
            >
          </el-table-column>
          <el-table-column prop="view" label="已读/未读" width="100" align="center">
            <template slot-scope="scope">
               <img src="@/assets/not-read.png" v-if="!scope.row.view"/>
               <img src="@/assets/yidu.png" v-if="scope.row.view"/>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="用户名称" width="" align="center">
            <template slot-scope="scope">{{ scope.row.userName?scope.row.userName:'无'}}</template>
          </el-table-column>
          <el-table-column prop="category" label="问题类型" width="150" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.category==1">功能异常</span>
              <span v-if="scope.row.category==2">体验问题</span>
              <span v-if="scope.row.category==3">新功能的建议</span>
              <span v-if="scope.row.category==4">其它问题</span>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="内容详情" width="" align="center">
            <template slot-scope="scope">
              <el-button type="text" class="underline"  @click="$router.push({path:'/app/feedBackList/feedBackInfo',query:{id:scope.row.id,msg:JSON.stringify($route.query)}})">{{ scope.row.description.length>30?scope.row.description.substring(0,30)+'......':scope.row.description}}</el-button>
            </template>
          </el-table-column>
		      <el-table-column prop="createTime" label="反馈时间" width="200" align="center" sortable="custom">
          </el-table-column>
          <el-table-column prop="updateTime" label="修改时间" width="200" align="center" sortable="custom">
          </el-table-column>
           <el-table-column prop="operatorName" label="最后修改人" width="" align="center">
             <template slot-scope="scope"> {{scope.row.operatorName?scope.row.operatorName:'无'}}</template>
          </el-table-column>
          <el-table-column prop="status" label="反馈进度" width="150" align="center">
             <template slot-scope="scope">
              <span v-if="scope.row.status==0">待处理</span>
              <span v-if="scope.row.status==1">处理中</span>
              <span v-if="scope.row.status==2" style="color:#67c23a">已处理</span>
              <span v-if="scope.row.status==-1" style="text-decoration:line-through">不作处理</span>
            </template>
          </el-table-column>
        </el-table>
		<div style="margin-top:15px"> <pagination v-if="showPagination"></pagination></div>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import {feedBackList} from "../../http/request";
import { mapState, mapActions } from "vuex";
import pagination from '../../share/pagination'
import timeSwitch from '../../share/timeSwitch'
export default {
  name: "feedBackList",
  inject:['replace','reload'],
  data(){
	  return{
		status:"",
		type:"",
    wd:"",
    total:0,
    showPagination:false,
    tableData:[],
    tableHeight:0,
    sortColumn:'',
    order:''

	  }
  },
  async created(){
	let query=this.$route.query
  let pageRecord = query.page;//记录上一次页码操作
  let limitRecord = query.limit;//记录上一次limit操作
  this.wd=query.wd?query.wd:'';
	this.status=query.status?query.status:'';
  this.type=query.type?query.type:'';
  this.Time.length? this.$store.commit('timeSwitch/setValue',[query.createTimeStart,query.createTimeEnd]): this.$store.commit('timeSwitch/setValue',[]);
  await this.dataTable({})
	this.$nextTick(()=>{
		this.$store.commit('pagination/setClickPage',pageRecord);
		this.$store.commit('pagination/setLimitPage',limitRecord);
		this.showPagination = true;//加载分页组件
})
  },
  computed:{
  ...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
  ...mapState('timeSwitch',{Time:'value'}),
  },
  methods:{
	  dataTable(params){
      return new Promise((resolve,reject)=>{
        feedBackList(params).then(res=>{
          if(res.code){
            this.$message.error(res.msg);
          }else{
            this.tableData=res.data
            this.total=res.rowCount
		        this.$store.commit('pagination/setTotal',this.total);
          } 
          resolve();
        }).catch(err=>{
          reject(err);
        })
      })
    },
     changeUpadte(data){
   if(data.order=='ascending'){
       this.order='true'
     }else if(data.order=='descending'){
       this.order='false'
     }else{
       this.order=''
     }
   switch (data.prop) {
      case 'createTime':
        this.sortColumn='create_Time'
        break;
      case 'updateTime':
        this.sortColumn='update_Time'
        break;
      default:
        this.sortColumn='create_Time'
        break;
    }
  }
  },
  watch:{
	page(){
		this.replace("page",this.page);
    },
    limit(){
       this.replace('limit',this.limit);
    },
    wd(){
      this.$store.commit('pagination/setClickPage',1);
      this.replace('wd',this.wd);

    },
    status(){
      this.$store.commit('pagination/setClickPage',1);
      this.replace('status',this.status);
	},
	type(){
      this.$store.commit('pagination/setClickPage',1);
      this.replace('type',this.type);
  },
  Time(){
     if(this.Time.length){
      this.replace('createTimeStart',this.Time[0]);
      this.replace('createTimeEnd',this.Time[1]);
     }else{
      this.replace('createTimeStart','');
      this.replace('createTimeEnd','');
     }
      
  },
  sortColumn(){
      this.$store.commit('pagination/setClickPage',1);
      this.replace('sortColumn',this.sortColumn);
    },
  order(){
    this.$store.commit('pagination/setClickPage',1);
    this.replace('order',this.order);
  },
  $route(){//判断路由query变化执行请求
      //  console.log(11,'111')
      if(this.$route.name=='feedBackList'){
      this.dataTable({...this.$route.query})
      }  
    },

  },
  updated(){
    if(this.$route.name=='feedBackList'){
      this.$nextTick(()=>{
      this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 110;
    })
    }
  },
  components: {
    pagination,
    timeSwitch
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
