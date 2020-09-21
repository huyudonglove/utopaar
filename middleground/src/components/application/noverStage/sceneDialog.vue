<template>
  <div>
    <el-dialog title="场景列表" :visible.sync="dialogVisible" @close="close" width="80%">
      <el-row class="tac" style="padding-bottom:15px">
        <el-input v-model="sceneName" style="width: 20%" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入关键字"></el-input>
        <!-- <el-time-picker
          is-range
          v-model="time"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围">
        </el-time-picker> -->
        <!-- <el-button type="info" @click="reset">重置</el-button> -->
      </el-row>
      <el-table ref="multipleTable" :data="sceneList" border style="width: 100%" class="mt15 mb15">
        <el-table-column prop="id" label="ID" width="150" align="center"></el-table-column>
        <el-table-column prop="name" label="场景名称" align="center"></el-table-column>
        <el-table-column prop="sceneModelName" label="关联场景模型" align="center"></el-table-column>
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
import {getStageSceneList} from '../../../http/request'
export default {
  name:'sceneDialog',
  props:['parentId'],
  data(){
    return{
      dialogVisible:true,
      sceneName:'',
      sceneList:[],
      total:'',//总行数
      page:1,//页码
      limit:20,//一页行数
      time:[],
    }
  },
  computed:{
    allParams(){
      return{
        "parentCarrierId":this.parentId,
        "name":this.sceneName,
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
    reset(){

    },
    close(){
      this.$emit("sceneDialogClose");
    },
    getList(){
      getStageSceneList(this.allParams).then(res=>{
        this.sceneList = res.data.items;
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