<template>
  <div v-if="appPower.length">
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">编辑场次</span>
    </div>
    <el-form label-position="right" :model="form" label-width="150px" style="width: 100%">
      <el-form-item label="场次名称">
        <el-input type="text" v-model="form.sceneName" style="width:200px;" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="场次时间">
        <el-time-picker
          is-range
          v-model="form.time"
          format="HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
          :default-value="[new Date().setHours(0, 0, 0, 0), new Date().setHours(23, 59, 59, 999)]"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="场景列表">
        <el-row class="tac" style="padding-bottom:10px;">
          <el-button type="primary" :disabled="!appPower[1].isCheck" @click="$router.push({path:`${$route.path.slice(0,-19)}/createscene`,query:{id:$route.query.id,contentTime:JSON.stringify(form.time),oldQuery:$route.query.oldQuery}});">新增场景</el-button>
          <el-button type="danger" :disabled="!appPower[1].isCheck" @click="del">批量删除</el-button>
        </el-row>
        <el-table ref="stageRef" :data="form.sceneTable" border style="width: 100%" class="mt15 mb15" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
          <el-table-column prop="name" label="场景名称" align="center"></el-table-column>
          <el-table-column prop="sceneModelName" label="关联场景模型" align="center">
            <template slot-scope="scope">
              {{scope.row.sceneModelName?scope.row.sceneModelName:'无'}}
            </template>
          </el-table-column>
          <el-table-column prop="bgmNum" label="背景音乐" align="center">
            <template slot-scope="scope">
              {{scope.row.bgmNum?scope.row.bgmNum:0}}<br/>
              <a href="javascript:void(0);" @click="showBgm(scope.row.id)">查看详情</a>
            </template>
          </el-table-column>
          <el-table-column prop="programNum" label="节目数" align="center">
            <template slot-scope="scope">
              {{scope.row.programNum?scope.row.programNum:0}}<br/>
              <a href="javascript:void(0);" @click="showProgram(scope.row.id)">查看详情</a>
          </template>
          </el-table-column>
          <el-table-column prop="startTime" label="开始时间" align="center">
            <template slot-scope="scope">
              {{scope.row.startTime?scope.row.startTime.slice(11):''}}
            </template>
          </el-table-column>
          <el-table-column prop="endTime" label="结束时间" align="center">
            <template slot-scope="scope">
              {{scope.row.startTime?scope.row.endTime.slice(11):''}}
            </template>
          </el-table-column>
          <el-table-column  label="上下架" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.state"
                :active-value="1"
                :inactive-value="2"
                @change="up(scope.row.state,scope.row.id)"
                :disabled="!appPower[1].isCheck"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="180" align="center">
            <template slot-scope="scope">
              <el-button type="primary" :disabled="!appPower[1].isCheck" size="mini" @click="$router.push({path:`${$route.path.slice(0,-19)}/createscene`,query:{id:$route.query.id,contentTime:JSON.stringify(form.time),sceneId:scope.row.id,oldQuery:$route.query.oldQuery}})">编辑</el-button>
              <el-button type="warning" :disabled="!appPower[1].isCheck" size="mini" @click="showDialog(scope.row)">修改时间</el-button>
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
      </el-form-item>
      <el-form-item v-if="appPower[1].isCheck">
        <el-button type="primary" @click="saveContent">确定</el-button>
        <el-button @click="$router.push({path:`${$route.path.slice(0,-19)}`,query:JSON.parse($route.query.oldQuery)});">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="修改时间" :visible.sync="showEditTime" width="35%" center>
      <el-form ref="form" label-width="100px">
        <el-form-item label="场景时间" prop="time">
          <el-time-picker
            is-range
            v-model="sceneTime"
            format="HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
          </el-time-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="isConfirm" type="primary" @click="editTime">{{isConfirm?'修改中...':'确 定'}}</el-button>
        <el-button @click="showEditTime = false">取 消</el-button>
      </span>
    </el-dialog>
    <div v-if="isShowBgm">
      <bgmDialog :sceneId="dialogSceneId" @bgmDialogClose="bgmDialogClose"></bgmDialog>
    </div>
    <div v-if="isShowProgram">
      <programDialog :sceneId="dialogSceneId" @programDialogClose="programDialogClose"></programDialog>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import bgmDialog from './bgmDialog'
import programDialog from './programDialog'
import {getStageSceneList,deleteStageScene,upScene,downScene,eidtStageContent,getStageContentInfo,eidtStageSceneTime} from '../../../http/request'
export default {
  name:'createStageContent',
  inject:['reload'],
  components:{
    bgmDialog,
    programDialog
  },
  data(){
    return{
      isConfirm:false,
      form:{
        sceneName:'',
        time:null,
        sceneTable:[],
      },
      showEditTime:false,
      sceneTime:null,
      delArr:[],//删除id数组
      isShowBgm:false,
      isShowProgram:false,
      dialogSceneId:'',//查看的场景id
      sceneTimeId:'',
      page:1,
      limit:20,
      total:0,
    }
  },
  computed:{
    ...mapState('currentUserPower',{appPower:'appPower'}),
    listParams(){
      return{
        "page":this.page,
        "limit":this.limit,
        "parentCarrierId":this.$route.query.id,
      }
    },
    allParams(){
      return{
        "id":this.$route.query.id,
        "name":this.form.sceneName,
        "startTime":this.form.time?this.form.time[0]:'',
        "endTime":this.form.time?this.form.time[1]:'',
        "appId":this.$route.params.appId
      }
    },
    timeParams(){
      return{
        "contentCarrierId":this.$route.query.id,
        "sceneCarrierId":this.sceneTimeId,
        "startTime":this.sceneTime?this.sceneTime[0]:'',
        "endTime":this.sceneTime?this.sceneTime[1]:'',
      }
    }
  },
  watch:{
    page(){
      this.listData();
    },
    limit(){
      if(this.page!=1){
        this.page=1;
      }
      this.listData();
    }
  },
  methods:{
    handleSizeChange(val){
      this.limit = val;
    },
    handleCurrentChange(val){
      this.page = val;
    },
    handleSelectionChange(arr){
      this.delArr = arr.length?arr.map(v=>v.id):[];
    },
    listData(){
      getStageSceneList(this.listParams).then(res=>{
        this.form.sceneTable = res.data.items;
        this.total = res.data.total;
      })
    },
    contentInfo(){
      getStageContentInfo({"carrierId":this.$route.query.id}).then(res=>{
        this.form.sceneName=res.data.name;
        this.form.time = [res.data.startTime,res.data.endTime];
      })
    },
    saveContent(){
      if(!this.allParams.name){
        this.$message.error('请输入场次名称');
        return;
      }
      if(!this.allParams.startTime){
        this.$message.error('请选择时间段');
        return;
      }
      eidtStageContent(this.allParams).then(res=>{
        this.$router.push({path:`${this.$route.path.slice(0,-19)}`,query:JSON.parse(this.$route.query.oldQuery)});
        this.reload();
      })
    },
    del(){
      deleteStageScene(this.delArr).then(res=>{
        this.reload();
      })
    },
    up(state,carrierId){
      if(state==1){
        upScene({carrierId}).then(res=>{
          if(res.code){
            this.form.sceneTable.forEach(v=>{if(v.id==carrierId){v.state=2;}});
          }
        }).catch(err=>{
          this.form.sceneTable.forEach(v=>{if(v.id==carrierId){v.state=2;}});
        })
      }else if(state==2){
        downScene({carrierId}).then(res=>{
          if(res.code){
            this.form.sceneTable.forEach(v=>{if(v.id==carrierId){v.state=1;}});
          }
        }).catch(err=>{
          this.form.sceneTable.forEach(v=>{if(v.id==carrierId){v.state=1;}});
        })
      }
    },
    showDialog(row){
      this.sceneTimeId = row.id;
      this.sceneTime = [row.startTime,row.endTime]
      this.showEditTime=true;
    },
    editTime(){
      if(!this.timeParams.startTime){
        this.$message.error('时间不能为空');
        return;
      }
      this.isConfirm=true;
      eidtStageSceneTime(this.timeParams).then(res=>{
        this.isConfirm = false;
        if(res.code){
          this.$message.error(res.msg)
        }else{
          this.$message({
            message: res.msg,
            center: true,
            type: 'success'
          })
          this.showEditTime=false;
          this.reload();
        }
      }).catch(err=>{
        this.isConfirm = false;
      })     
    },
    showBgm(id){
      this.dialogSceneId= id;
      this.isShowBgm = true;
    },
    bgmDialogClose(){
      this.isShowBgm=false;
    },
    showProgram(id){
      this.dialogSceneId= id;
      this.isShowProgram = true;
    },
    programDialogClose(){
      this.isShowProgram=false;
    }
  },
  created(){
    this.contentInfo();
    this.listData();
  }
}
</script>

<style scoped>

</style>