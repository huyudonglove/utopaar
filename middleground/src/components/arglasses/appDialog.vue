<template>
  <div>
    <el-dialog title="应用" :visible.sync="dialogVisible" @close="close" width="80%">
      <el-table ref="imgApp" border :data="appTable" tooltip-effect="dark">
        <el-table-column prop="id" label="投放ID" width="50" align="center"></el-table-column>
        <el-table-column label="应用名称" prop="name" align="center"></el-table-column>
        <el-table-column label="投放时间" width="350" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.startTime}}---{{scope.row.endTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="投放位置" align="center">
          <template slot-scope="scope">
            <span>x={{scope.row.positionX}},y={{scope.row.positionY}},z={{scope.row.positionZ}}</span>
          </template>
        </el-table-column>
        <el-table-column label="投放方向" align="center">
          <template slot-scope="scope">
            <span>α={{scope.row.relationX}}°,β={{scope.row.relationY}}°,γ={{scope.row.relationZ}}°</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {putInList} from '../../http/request'
import { Base64 } from 'js-base64';
export default {
  name:'appDialog',
  props:['putId'],
  data(){
    return{
      dialogVisible:true,
      appTable:[],
    }
  },
  methods:{
    close(){
      this.$emit("appDialogClose");
    },
    listData(){
      putInList({"assetId":this.putId,"state":1}).then(res=>{
        this.appTable =res.data.items;
      })
    }
  },
  created(){
    this.listData();
  }
}
</script>

<style scoped>

</style>