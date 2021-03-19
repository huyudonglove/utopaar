<template>
  <div style="margin:0px 20px">
     <div style="margin:20px 0px">
        <el-input v-model="word" style="width: 250px;" suffix-icon="el-icon-search" maxlength="50" placeholder="输入投放位置关键字"></el-input>
    </div>
    <el-table
    :data="tableData" stripe border ref="multipleTable" :max-height="tableHeight" style="width: 100%">
      <el-table-column prop="id" label="id" width="120" align="center" ></el-table-column>
      <el-table-column prop="configFileName" label="配置表名称" width="" align="center" ></el-table-column>
      <el-table-column prop="materialId" label="素材ID" width="120" align="center" ></el-table-column>
      <el-table-column prop="materialName" label="素材名称" width="" align="center"></el-table-column>
      <el-table-column prop="relationId" label="投放ID" width="180" align="center"></el-table-column>
      <el-table-column prop="locationName" label="投放位置" width="180" align="center">
         <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.parentNameUrl" placement="top">
              <span>{{scope.row.locationName}}</span>
           </el-tooltip>
         </template>
      </el-table-column>
      <el-table-column prop="saasUserName" label="中台主账户名" width="180" align="center"></el-table-column>
      <el-table-column prop="state" label="状态" width="120" align="center">
         <template slot-scope="scope">
          <span v-if="scope.row.state==-1">未启动</span>
          <span v-if="scope.row.state==0">启动中</span>
          <span v-if="scope.row.state==1">运行中</span>
          <span v-if="scope.row.state==2">停止中</span>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="操作" width="250" align="center">
       <template slot-scope="scope">
          <el-button type="primary" size='mini' :disabled='scope.row.state !==1' @click="action(scope.row.relationId,1)">停止</el-button>
          <el-button type="primary" size='mini' :disabled='scope.row.state==-1' v-if="scope.row.state==-1||scope.row.state==2" @click="action(scope.row.relationId,2)">启动</el-button>
          <el-button type="primary" size='mini' :disabled='scope.row.state!==1' v-if="scope.row.state==0||scope.row.state==1" @click="action(scope.row.relationId,3)">重启</el-button>
          <el-button type="danger" size='mini' :disabled='scope.row.state !==-1' @click="action(scope.row.relationId,4)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="msg" label="提示" width="" align="center"></el-table-column>
    </el-table>
   <!-- <div style="padding-top:20px">
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="clickPage"
      :page-sizes="[ 20, 40, 60,80]"
      :page-size="limitPage"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
   </div> -->
  </div>
</template>
<script>
import {syncList,startGame,restartGame,stopGame,syncDelete} from '../http/request'
export default {
  name: "syncConfiguration",
  inject:['replace','reload'],
  data() {
    return {
      word:'',
      tableData:[],
      total:0,
      tableHeight:0,
      clickPage:1,
      limitPage:20,
      time:null,
    }
  },
  computed:{
    params(){
       return{
       "word":this.word||this.$route.query.word,
       "clickPage":this.clickPage,
       "limitPage":this.limitPage
      }
    }
  },
  watch: {
    word(){
      this.replace('word',this.word);
      this.getList();

    },
    clickPage(){
      this.getList();
    },
    limitPage(){
      this.getList();
    },
  },
  created() {
   this.getList();
   this.word=this.$route.query.word||''
   this.time=setInterval(this.getList,10000)
   
  },
  destroyed(){
    clearInterval(this.time);
  },
  methods: {
    getList(){
      syncList(this.params).then(res=>{
        if(res.code){
            Message.error(res.msg)
        }else{
          let pageRes;
          this.tableData=res.data;
          this.total = res.data.length;
          //如果输入了名称
          if(this.word){
              //先筛选包含输入字符的位置
              this.tableData =res.data.filter(item=>item.locationName.indexOf(this.word)!=-1);
              //重新赋值包含输入字符后的总条数
              this.total = this.tableData.length;
              //再对筛选后的数据分页
              // this.tableData = resOne.filter((item,index)=>index>=(clickPage-1)*limitPage && index<clickPage*limitPage)
          }else{
              // //进行分页
              // this.tableData = res.data.filter((item,index)=>index>=(clickPage-1)*limitPage && index<clickPage*limitPage)
          }
         
            }
      })
    },
    action(id,type){
      if(type==1){
        stopGame({relationId:id}).then(res=>{
          if(res.code){
              this.$message.error(res.msg);
            }else{
            this.reload();
            }
        })
      }else if(type==2){
         startGame({relationId:id}).then(res=>{
            if(res.code){
                this.$message.error(res.msg);
            }else{
           this.reload();
          }
        })
      }else if(type==3){
         restartGame({relationId:id}).then(res=>{
            if(res.code){
              this.$message.error(res.msg);
              }else{
              this.reload();
              }
        })
      }else if(type==4){
         syncDelete({relationId:id}).then(res=>{
            if(res.code){
                this.$message.error(res.msg);
              }else{
           this.reload();
              }
        })
      }
    },
    handleSizeChange(val){
      // 显示多少条
    this.limitPage=val
    },
    handleCurrentChange(val){
      // 当前第几页
      this.clickPage=val
    }
  },
  updated() {
  this.$route.name=='syncConfiguration'?(()=>{
    this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop-30;
  })():'';
}
}
</script>
<style scoped>

</style>