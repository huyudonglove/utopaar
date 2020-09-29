<template>
  <div v-if="appPower.length">
    <div v-if="$route.name=='createScene'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
        <span v-if="isCreate" style="font-size:24px;font-weight:bold;color:#614a4d;">编辑场次 / 新增场景</span>
        <span v-if="isEdit" style="font-size:24px;font-weight:bold;color:#614a4d;">编辑场次 / 编辑场景</span>
      </div>
      <el-form label-position="right" :model="form" label-width="150px" style="width: 100%">
        <el-form-item label="场景名称">
          <el-input type="text" v-model="form.sceneName" style="width:200px;" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="场次时间">
          <el-time-picker
            is-range
            disabled
            v-model="contentTime"
            format="HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
            :default-value="[new Date().setHours(0, 0, 0, 0), new Date().setHours(23, 59, 59, 999)]"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="场景时间">
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
        <el-form-item label="场景模型">
          <span v-if="!modelId">
            <el-button :disabled="!appPower[1].isCheck" type="primary" @click="$router.push({path:`${$route.path}/createscenemodel`,query:{id:$route.query.id,contentTime:$route.query.contentTime,activeIdx:currentIndex,sceneId:$route.query.sceneId,sceneName:form.sceneName,sceneTime:JSON.stringify(form.time),selectModel:$route.query.selectModel,selectMusic:JSON.stringify(musicTable),selectProgramList:JSON.stringify(programTable),oldQuery:$route.query.oldQuery}})">新增场景模型</el-button>
          </span>
          <div v-if="modelId">
            <div style="display:inline-block;vertical-align:middle;">
              <img :src="`/static/${modelImg}`" alt="" style="width:150px;border:solid 1px #ccc">
              <div style="width:150px;text-align:center;line-height:14px;word-break:break-all;" class="myWords">{{modelName}}</div>
            </div>
            <div style="display:inline-block;vertical-align:middle;">
              <el-button type="primary" :disabled="!appPower[1].isCheck" @click="$router.push({path:`${$route.path}/createscenemodel`,query:{id:$route.query.id,contentTime:$route.query.contentTime,activeIdx:currentIndex,sceneId:$route.query.sceneId,sceneName:form.sceneName,sceneTime:JSON.stringify(form.time),selectModel:$route.query.selectModel,selectMusic:JSON.stringify(musicTable),selectProgramList:JSON.stringify(programTable),oldQuery:$route.query.oldQuery}})">重新选择</el-button>
              <el-button type="danger" :disabled="!appPower[1].isCheck" @click="clearModel">删除</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="选择素材">
          <span v-for="(item,idx) in materialList" :key="idx">
            <el-button size="mini" type="primary" :plain="!item.isCheck" round @click="tabMaterial(idx)">{{item.value}}</el-button>
          </span>
        </el-form-item>
        <el-form-item :label="`${titleName}列表`">
          <div v-if="isMusic">
            <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding-bottom:15px;">
              <el-input v-model="inputMusic" style="width: 205px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入关键字"></el-input>
              <el-button type="primary" :disabled="!appPower[1].isCheck" @click="$router.push({path:`${$route.path}/createbgm`,query:{id:$route.query.id,contentTime:$route.query.contentTime,activeIdx:currentIndex,sceneId:$route.query.sceneId,sceneName:form.sceneName,sceneTime:JSON.stringify(form.time),selectModel:$route.query.selectModel,selectMusic:JSON.stringify(musicTable),selectProgramList:JSON.stringify(programTable),oldQuery:$route.query.oldQuery}})">新增背景音乐</el-button>
              <el-button type="danger" :disabled="!appPower[1].isCheck" @click="delMusic">批量删除</el-button>
            </el-row>
            <el-table ref="musicTable" :data="musicShow" border tooltip-effect="dark" :key="(new Date()).valueOf()" @selection-change="selectionMusic">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column prop="materialId" label="ID" width="50" align="center"></el-table-column>
                <el-table-column label="音乐名称" prop="name" align="center"></el-table-column>
                <el-table-column label="音乐试听" align="center">
                  <template slot-scope="scope">
                    <span style="cursor: pointer;" >
                      <img src="@/assets/play.png" alt="" v-if="!scope.row.play" @click="musicTable.forEach(v=>{v.play=false;});scope.row.play=true;playMusic(scope.row.fileId,scope.row)">
                      <img src="@/assets/stop.png" alt="" v-if="scope.row.play" @click="scope.row.play=!scope.row.play;playMusic()">
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="总时长" prop="duration" align="center"></el-table-column>
                <el-table-column label="上下架状态" prop="state" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.state==1">上架</span>
                    <span v-if="scope.row.state==2" style="color:red;">下架</span>
                  </template>
                </el-table-column>
                <el-table-column label="播放顺序" prop="materialCategoryName" align="center">
                  <template slot-scope="scope">
                    <el-input style="width:80px;" type="number" v-model="scope.row.rank" @blur="judgeRank(scope)" @keydown.native="enter(scope,$event)" maxlength="50"></el-input>
                  </template>
                </el-table-column>
            </el-table>
          </div>
          <div v-if="!isMusic">
            <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding-bottom:15px;">
              <el-input v-model="inputProgram" style="width: 205px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入关键字"></el-input>
              <el-button type="primary" @click="createProgram" :disabled="!appPower[1].isCheck">新增节目</el-button>
              <el-button type="danger" @click="delProgram" :disabled="!appPower[1].isCheck">批量删除</el-button>
            </el-row>
            <el-table ref="musicTable" :data="programShow" border tooltip-effect="dark" :key="(new Date()).valueOf()" @selection-change="selectionProgram">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column prop="materialId" label="ID" width="50" align="center"></el-table-column>
              <el-table-column label="节目名称" prop="programName" align="center"></el-table-column>
              <el-table-column label="动画名称" prop="materialName" align="center"></el-table-column>
              <el-table-column label="节目时长" prop="duration" align="center"></el-table-column>
              <el-table-column label="开始时间" prop="startTime" align="center">
                <template slot-scope="scope">
                  {{scope.row.startTime?scope.row.startTime.slice(11):''}}
                </template>
              </el-table-column>
              <el-table-column label="结束时间" prop="endTime" align="center">
                <template slot-scope="scope">
                  {{scope.row.startTime?scope.row.endTime.slice(11):''}}
                </template>
              </el-table-column>
              <el-table-column label="上下架状态" prop="state" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.state==1">上架</span>
                  <span v-if="scope.row.state==2" style="color:red;">下架</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="320" align="center">
                <template slot-scope="scope">
                  <el-button :disabled="!appPower[1].isCheck" type="primary" size="mini" @click="editProgram(scope)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item label="" v-if="appPower[1].isCheck">
          <el-button type="primary" @click="confirm">确定</el-button>
          <el-button @click="$router.push({path:`${$route.path.slice(0,-12)}/createstagecontent`,query:{id:$route.query.id,contentTime:$route.query.contentTime,oldQuery:$route.query.oldQuery}})">取消</el-button>
        </el-form-item>
      </el-form>
      <div>
        <audio :src="url" autoplay="autoplay" ref="audio"></audio>
      </div>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {createStageScene,eidtStageScene,getStageSceneInfo,getStageMusicList,getStageProgramList,getFile} from '../../../http/request'
import { Base64 } from 'js-base64';
import { resolve, reject } from 'q';
export default {
  name:'createScene',
  inject:['reload','replace'],
  data(){
    return{
      isCreate:false,
      isEdit:false,
      contentTime:null,
      form:{
        sceneName:'',
        time:null,
      },
      materialList:[{"code":1,"value":"背景音乐","isCheck":true},{"code":2,"value":"节目","isCheck":false}],
      currentIndex:0,
      titleName:'背景音乐',
      inputMusic:'',
      musicTable:[],
      musicShow:[],
      inputProgram:'',
      programTable:[],
      programShow:[],
      isMusic:true,
      modelId:'',
      modelName:'',
      modelImg:'',
      selectModel:null,
      selectMusicId:[],
      selectProgramId:[],
      loading:'',
      preProgramEndTime:null,
      musicListParams:[],
      programListParams:[],
      url:'',
      sceneState:'',
    }
  },
  watch:{
    inputMusic(val){
      if(val===''){
        this.musicShow = this.musicTable;
      }else{
        this.musicShow = this.musicTable.filter(v=>v.name.indexOf(val)!=-1);
      }
    },
    inputProgram(val){
      if(val===''){
        this.programShow = this.programTable;
      }else{
        this.programShow = this.programTable.filter(v=>v.programName.indexOf(val)!=-1);
      }
    }
  },
  computed:{
    ...mapState('currentUserPower',{appPower:'appPower'}),
    allParams(){
      return{
        "contentCarrierId":this.$route.query.id,//场次id
        "sceneName":this.form.sceneName,
        "startTime":this.form.time?this.form.time[0]:null,
        "endTime":this.form.time?this.form.time[1]:null,
        "appId":this.$route.params.appId,
        "sceneModelMaterialId":this.modelId,//模型id
        "modelName":this.modelName,//模型名称
        "bgmMaterials":this.musicListParams,
        "programMaterials":this.programListParams,
      }
    },
    musicParams(){
      return{
        "parentCarrierId":this.$route.query.sceneId?this.$route.query.sceneId:''
      }
    },
    programParams(){
      return{
        "parentCarrierId":this.$route.query.sceneId?this.$route.query.sceneId:''
      }
    }
  },
  methods:{
    selectionMusic(arr){
      this.selectMusicId=arr.map(v=>{if(v.musicId){
        return v.musicId;
      }else{
        return v.id;
      }});
    },
    delMusic(){
      if(!this.selectMusicId.length){
        this.$message.error('请选择需要删除的行');
      }else{
        this.$confirm('确认删除吗？','提示').then(v=>{
          this.musicShow=this.musicShow.filter(v=>this.selectMusicId.indexOf(v.id)==-1);
          this.musicShow=this.musicShow.filter(v=>this.selectMusicId.indexOf(v.musicId)==-1);
          this.musicTable=this.musicTable.filter(v=>this.selectMusicId.indexOf(v.id)==-1);
          this.musicTable=this.musicTable.filter(v=>this.selectMusicId.indexOf(v.musicId)==-1);
          this.replace('selectMusic',JSON.stringify(this.musicTable));
        })
      }
    },
    selectionProgram(arr){
      this.selectProgramId=arr.map(v=>{if(v.musicId){
        return v.musicId;
      }else{
        return v.id;
      }});
    },
    delProgram(){
      if(!this.selectProgramId.length){
        this.$message.error('请选择需要删除的行');
      }else{
        this.$confirm('确认删除吗？','提示').then(v=>{
          this.programShow=this.programShow.filter(v=>this.selectProgramId.indexOf(v.id)==-1);
          this.programShow=this.programShow.filter(v=>this.selectProgramId.indexOf(v.musicId)==-1);
          this.programTable=this.programTable.filter(v=>this.selectProgramId.indexOf(v.id)==-1);
          this.programTable=this.programTable.filter(v=>this.selectProgramId.indexOf(v.musicId)==-1);
          this.replace('selectProgramList',JSON.stringify(this.programTable));
        })
      }
    },   
    clearModel(){
      this.modelId='';
      this.modelName='';
      this.modelImg='';
    },
    createProgram(){
      if(!this.form.time){
        this.$message.error('请先选择场景时间再操作');
        return;
      }
      this.$router.push({path:`${this.$route.path}/createprogram`,query:{id:this.$route.query.id,contentTime:this.$route.query.contentTime,activeIdx:this.currentIndex,sceneId:this.$route.query.sceneId,sceneName:this.form.sceneName,sceneTime:JSON.stringify(this.form.time),selectModel:this.$route.query.selectModel,selectMusic:JSON.stringify(this.musicTable),selectProgramList:this.programTable.length?JSON.stringify(this.programTable):null,oldQuery:this.$route.query.oldQuery}})
    },
    editProgram(scope){
      if(!this.form.time){
        this.$message.error('请先选择场景时间再操作');
        return;
      }
      let currentProgram  = scope.row;
      currentProgram.currentIndex = scope.$index;
      this.$router.push({path:`${this.$route.path}/createprogram`,query:{id:this.$route.query.id,contentTime:this.$route.query.contentTime,activeIdx:this.currentIndex,sceneId:this.$route.query.sceneId,sceneName:this.form.sceneName,sceneTime:JSON.stringify(this.form.time),currentProgram:JSON.stringify(currentProgram),selectModel:this.$route.query.selectModel,selectMusic:JSON.stringify(this.musicTable),selectProgramList:this.programTable.length?JSON.stringify(this.programTable):null,oldQuery:this.$route.query.oldQuery}})
    },
    tabMaterial(idx){
      this.currentIndex = idx;                 
      this.materialList.forEach(v=>{v.isCheck=false});
      this.materialList[idx].isCheck=true;
      this.titleName= this.materialList[idx].value;
      if(idx==0){this.isMusic=true;}else{this.isMusic=false};
    },
    sceneInfo(){
      this.loading=this.$loading({
        lock: true,
        text: `数据获取中...`,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      return new Promise((resolve,reject)=>{
        getStageSceneInfo({"carrierId":this.$route.query.sceneId}).then(res=>{
          this.loading.close();
          if(res.code){
            this.$message.error(res.msg);
          }else{
            this.form.sceneName=res.data.sceneName;
            this.modelName = res.data.modelName;
            this.modelId = res.data.sceneModelMaterialId;
            this.modelImg = Base64.decode(res.data.pic);
            this.form.time = [res.data.startTime,res.data.endTime];
            this.sceneState = res.data.state;
            resolve();
          }
        }).catch(err=>{
          this.loading.close();
          reject(err);
        })
      })
    },
    musicList(){
      getStageMusicList(this.musicParams).then(res=>{
        this.musicShow=this.musicTable = res.data?res.data.map(v=>{
          v.play=false;
          return v;
        }):[];
      })
    },
    programList(){
      getStageProgramList(this.programParams).then(res=>{
        this.programShow = this.programTable=res.data?res.data:[];
      })
    },
    playMusic(id,row){
      if(id){
        this.url=`/static/${Base64.decode(id)}`;
        this.$refs.audio.load();
        this.$refs.audio.play();
        this.$refs.audio.onended=()=>{
          row.play = !row.play;
        }
      }else{
        this.$refs.audio.pause();
      }     
    },
    judgeRank(scope){
      console.log(scope.row.rank,1515)
      if(scope.row.rank!==''){
        let isRepeat = this.musicTable.filter(v=>v.rank==scope.row.rank);
        if(isRepeat.length>1){
          this.$message.error('播放顺序重复');
          scope.row.rank='';
        }
      }
    },
    enter(scope,e){
      var event = window.event || arguments.callee.caller.arguments[0];
      if (event.keyCode == 13) {
          e.target.blur(scope);
      }
    },
    confirm(){
      if(this.allParams.sceneName===''){
        this.$message.error('请输入场景名称')
        return;
      }
      if(!this.allParams.startTime){
        this.$message.error('请选择时间')
        return;
      }
      if(!this.allParams.sceneModelMaterialId){
        this.$message.error('请选择场景模型')
        return;
      }
      if(!this.musicTable.length){
        this.$message.error('请添加背景音乐素材')
        return;
      }
      if(!this.programTable.length){
        this.$message.error('请添加节目素材')
        return;
      };
      let isNull = this.musicTable.some(v=>v.rank==='');
      if(isNull){
        this.$message.error('背景音乐播放顺序不能为空')
        return;
      }
      let sceneTime1 = new Date(`2019/01/01 ${this.allParams.startTime.slice(11)}`);
      let sceneTime2 = new Date(`2019/01/01 ${this.allParams.endTime.slice(11)}`);
      let programClashList = this.programTable.filter(v=>{
          let programStartTime = new Date(`2019/01/01 ${v.startTime.slice(11)}`);
          let programEndTime = new Date(`2019/01/01 ${v.endTime.slice(11)}`);
          return programStartTime-sceneTime1<0||programEndTime-sceneTime2>0
        });
      if(programClashList.length){
        this.$message.error(`‘${programClashList.slice(0,3).map(v=>v.programName).join('、')}’等节目超出场景时间`);
        return;
      }
      this.musicListParams = this.musicTable.map(v=>{v.id=v.materialId;return v;});
      this.programListParams = this.programTable.map(v=>{v.id=v.materialId;return v;});
      if(this.isCreate){
        createStageScene({...this.allParams,"state":1}).then(res=>{
          this.$router.push({path:`${this.$route.path.slice(0,-12)}/createstagecontent`,query:{id:this.$route.query.id,contentTime:this.$route.query.contentTime,oldQuery:this.$route.query.oldQuery}})
          this.reload();
        })
      }else if(this.isEdit){
        eidtStageScene({"sceneCarrierId":this.$route.query.sceneId,...this.allParams,"state":this.sceneState}).then(res=>{
          this.$router.push({path:`${this.$route.path.slice(0,-12)}/createstagecontent`,query:{id:this.$route.query.id,contentTime:this.$route.query.contentTime,oldQuery:this.$route.query.oldQuery}})
          this.reload();
        })
      }
      
    }
  },
  async created(){
    this.contentTime = JSON.parse(this.$route.query.contentTime);
    if(this.$route.query.activeIdx){
      this.currentIndex = parseInt(this.$route.query.activeIdx);              
      this.materialList.forEach(v=>{v.isCheck=false});
      this.materialList[this.currentIndex].isCheck=true;
      this.titleName= this.materialList[this.currentIndex].value;
      if(this.currentIndex==0){this.isMusic=true;}else{this.isMusic=false};
    }    
    if(this.$route.query.selectMusic){
      this.musicShow = this.musicTable = JSON.parse(this.$route.query.selectMusic);
    }
    if(this.$route.query.selectProgramList){
      this.programShow = this.programTable = JSON.parse(this.$route.query.selectProgramList);
    }
    if(this.$route.query.sceneId){
      this.isEdit=true;
      await this.sceneInfo();
      if(!this.musicTable.length){
        this.musicList();
      }
      if(!this.programTable.length){
        this.programList();
      }
    }else{
      this.isCreate=true;
    }
    if(this.$route.query.sceneName){
      this.form.sceneName = this.$route.query.sceneName;
    }
    if(this.$route.query.sceneTime){
      this.form.time = JSON.parse(this.$route.query.sceneTime);
    }
    if(this.$route.query.selectModel){
      this.selectModel = JSON.parse(this.$route.query.selectModel);
      this.modelId = this.selectModel.id;
      this.modelName = this.selectModel.name;
      this.modelImg = this.selectModel.webUrl;
    }
  }
}
</script>

<style>
/* 谷歌 */ 
input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
} 

/* 火狐 */ 

input[type="number"]{-moz-appearance:textfield;}
</style>