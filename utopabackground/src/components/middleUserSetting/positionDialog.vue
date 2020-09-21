<template>
  <div>
    <el-dialog title="位置列表" :visible.sync="dialogVisible" @close="close" width="80%">
      <el-row class="tac" style="padding-bottom:15px">
        <el-input v-model="positionName" style="width: 20%" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入关键字"></el-input>
      </el-row>
      <el-table ref="multipleTable" :data="positionList" border style="width: 100%" class="mt15 mb15">
        <el-table-column prop="id" label="ID" width="150" align="center"></el-table-column>
        <el-table-column prop="provinceCityArea" label="所属地区" align="center"></el-table-column>
        <el-table-column prop="parentNameUrl" label="项目名称" align="center"></el-table-column>
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
import {selectpositionList,getPlayDropDown} from '../../http/request'
export default {
  name:'positionDialog',
  props:['userId'],
  data(){
    return{
      dialogVisible:true,
      positionName:'',
      positionList:[],
      total:'',//总行数
      page:1,//页码
      limit:20,//一页行数
    }
  },
  computed:{
    allParams(){
      return{
        "userId":this.userId,
        "name":this.positionName,
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
    positionName(){
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
      this.$emit("positionDialogClose");
    },
    getList(){
      selectpositionList(this.allParams).then(res=>{
        this.positionList=res.data.items;
        this.total = res.data.total;
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
