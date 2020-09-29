<template>
  <div>
    <el-dialog title="节目" :visible.sync="dialogVisible" @close="close" width="80%">
      <el-row class="tac" style="padding-bottom:15px">
        <el-input v-model="programName" style="width: 20%" border suffix-icon="el-icon-search" maxlength="50" placeholder="请输入关键字"></el-input>
      </el-row>
      <el-table ref="multipleTable" :data="programList" border style="width: 100%" class="mt15 mb15">
        <el-table-column prop="id" label="ID" width="150" align="center"></el-table-column>
        <el-table-column prop="programName" label="节目名称" align="center"></el-table-column>
        <el-table-column prop="materialName" label="动画名称" align="center"></el-table-column>
        <el-table-column prop="duration" label="节目时长" align="center"></el-table-column>
        <el-table-column prop="startTime" label="开始时间" align="center">
          <template slot-scope="scope">
            {{scope.row.startTime?scope.row.startTime.slice(11):''}}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" align="center">
          <template slot-scope="scope">
            {{scope.row.endTime?scope.row.endTime.slice(11):''}}
          </template>
        </el-table-column>
        <el-table-column label="上下架状态" prop="state" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.state==1">上架</span>
            <span v-if="scope.row.state==2" style="color:red;">下架</span>
          </template>
        </el-table-column>
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
import {getStageProgramList} from '../../../http/request'
export default {
  name:'programDialog',
  props:['sceneId'],
  data(){
    return{
      dialogVisible:true,
      programName:'',
      programList:[],
      total:'',//总行数
      page:1,//页码
      limit:20,//一页行数
    }
  },
  computed:{
    allParams(){
      return{
        "parentCarrierId":this.sceneId,
        "name":this.programName,
        "page":this.page,
        "limit":this.limit,
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
    programName(){
      if(this.page!=1){
        this.page=1;
      }
      this.getList();
    },
  },
  methods:{
    handleSizeChange(val){
      this.limit = val;
    },
    handleCurrentChange(val){
      this.page = val;
    },
    close(){
      this.$emit("programDialogClose");
    },
    getList(){
      getStageProgramList(this.allParams).then(res=>{
        if(res.data&&res.data.length){
          this.programList=res.data.filter((item,index)=>index>=(this.page-1)*this.limit && index<this.page*this.limit);
          this.total = res.data.length;
        }
      })
    },
  },
  created(){
    this.getList();
  }
}
</script>

<style scoped>

</style>