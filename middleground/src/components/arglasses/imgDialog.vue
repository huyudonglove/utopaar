<template>
  <div>
    <el-dialog title="识别图" :visible.sync="dialogVisible" @close="close" width="80%">
      <el-table ref="imgApp" border :data="imgTable" tooltip-effect="dark">
        <el-table-column prop="id" label="投放ID" align="center"></el-table-column>
        <el-table-column label="识别图名称" prop="name" align="center"></el-table-column>
        <el-table-column label="识别图" prop="imgUrl" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.imgUrl?`/static/${scope.row.imgUrl}`:''" alt="" style="width:70px;height:70px;" v-focus>
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
import {getImage} from '../../http/request'
import { Base64 } from 'js-base64';
export default {
  name:'imgDialog',
  props:['putId'],
  data(){
    return{
      dialogVisible:true,
      imgTable:[],
    }
  },
  methods:{
    close(){
      this.$emit("imgDialogClose");
    },
    listData(){
      getImage({"source":"Middleground","middleGroundAssertId":this.putId,"checkState":2}).then(res=>{
        this.imgTable =res.data.items.map(v=>{
            v.pic?v.imgUrl=Base64.decode(v.pic):null;
            return v;
          });;
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