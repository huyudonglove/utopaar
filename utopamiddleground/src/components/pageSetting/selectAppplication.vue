<template>
  <div>
    <el-dialog title="选择应用详情页" :visible.sync="dialogVisible" @close="close" width="80%">
      <el-row class="tac" style="padding-bottom:15px">
        <span class="myWords">应用id
          <el-input style="width:150px;margin-bottom:10px;" v-model="applicationId" placeholder="请输入应用id" maxlength="50"></el-input>
        </span> 
        <span class="myWords">应用名称
          <el-input v-model="inputX" style="width: 150px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入关键字"></el-input>
        </span>
        <span class="myWords">应用类型
          <el-select v-model="type" style="width:150px;">
            <el-option v-for="(item,idx) in typeList" :key="idx" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </span>
      <!-- </el-row> -->
      <!-- <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding-bottom:15px"> -->
        <span class="myWords">创建时间
          <el-date-picker
            v-model="time"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </span> 
        <el-button type="info" @click="reset">重置</el-button>
      </el-row>
      <el-table ref="multipleTable" :data="applicationList" border style="width: 100%" class="mt15 mb15" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="id" label="ID" width="280" align="center"></el-table-column>
        <el-table-column prop="name" label="应用名称" align="center"></el-table-column>
        <el-table-column prop="applicationTypeName" label="类型" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
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
      <div style="padding-top:10px;">
        <el-button type="primary" @click="success">确认</el-button>
        <el-button @click="close">取消</el-button>       
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {getAppList,getAppDropDown} from '../../http/request'
export default {
  name:'selectApplication',
  props:['fSee'],
  data(){
    return{
      inputX:'',
      type:'',//应用类型
      typeList:[],//应用类型下拉框
      applicationId:'',
      dialogVisible:false,
      applicationList:[],
      selectId:'',//选择的应用id
      total:'',//总行数
      page:1,//页码
      limit:20,//一页行数
      time:[],
    }
  },
  computed:{
    allParams(){
      return{
        "id":this.applicationId,
        "containName":this.inputX,
        "relateApplicationId":this.type,
        "greaterCreateTime":this.time[0]?this.time[0]:'',
        "lessCreateTime":this.time[1]?this.time[1]:'',
        "pageIndex":this.page,
        "pageSize":this.limit,
        "pageReturnType":"3"
      }
    }
  },
  watch:{
    fSee() {
      this.dialogVisible = this.fSee;
      this.reset();
    },
    page(){
      this.getList();
    },
    limit(){
      if(this.page!=1){
        this.page=1;
      }
      this.getList();
    },
    applicationId(){
      if(this.page!=1){
        this.page=1;
      }
      this.getList();
    },
    inputX(){
      if(this.page!=1){
        this.page=1;
      }
      this.getList();
    },
    type(){
      if(this.page!=1){
        this.page=1;
      }
      this.getList();
    },
    time(){
      if(this.page!=1){
        this.page=1;
      }
      this.time=this.time==null||(typeof this.time[0]) =='object'?[]:this.time;
      this.getList();
    }
  },
  methods:{
    handleSizeChange(val){
      this.limit = val;
    },
    handleCurrentChange(val){
      this.page = val;
    },
    handleSelectionChange(rows) {
      if(rows.length>1){
        this.$refs.multipleTable.toggleRowSelection(rows[0],false);
        rows.splice(0,1);
      }else if(rows.length==0){
        this.selectId='';
        return;
      }
      this.selectId = rows[0];
    },
    close(){
      this.dialogVisible = false;
      this.$emit("applicationClose");
    },
    getList(){
      getAppList(this.allParams).then(res=>{
        this.applicationList=res.data.items;
        this.total = res.data.total;
      })
    },
    getDropList(){//获取下拉框
      getAppDropDown().then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{
          this.typeList = res.data;
          this.typeList.unshift({"id": "","name": "全部"})
        }
      }).catch(err=>{
        console.log(err);
      });
    },
    success(){
      if(!this.selectId){
        this.$message.error('请选择应用');
        return;
      }
      this.$emit('getApplicationDtailId',this.selectId);//将选择id传给父级
      this.close();
    },
    reset(){
      this.applicationId='';
      this.inputX='';
      this.type='';
      this.time=[];
      this.page=1;
    }
  },
  created(){
    this.getList();
    this.getDropList();
  }
}
</script>

<style scoped>
th label.el-checkbox{
  display: none;
}
</style>