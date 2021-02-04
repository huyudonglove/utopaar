<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span v-if="!$route.query.sceneId" style="font-size:24px;font-weight:bold;color:#614a4d;">编辑场次/新增场景/新增节目</span>
      <span v-if="$route.query.sceneId" style="font-size:24px;font-weight:bold;color:#614a4d;">编辑场次/编辑场景/新增节目</span>
    </div>
    <el-form label-position="right" label-width="150px" style="width: 100%">
      <el-form-item label="节目名称" :required="true">
        <el-input type="text" v-model="programName" style="width:200px;" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="场景时间">
        <el-time-picker
          is-range
          disabled
          v-model="sceneTime"
          format="HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
          :default-value="[new Date().setHours(0, 0, 0, 0), new Date().setHours(23, 59, 59, 999)]"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="节目时间" :required="true">
        <el-time-picker
          format="HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
          v-model="startTime"
          :picker-options="{
            selectableRange: '00:00:00 - 23:59:59'
          }"
          @change="startTimeChange"
          placeholder="开始时间">
        </el-time-picker>
        <el-time-picker
          arrow-control
          format="HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
          v-model="endTime"
          :picker-options="{
            selectableRange: '00:00:00 - 23:59:59'
          }"
          disabled
          placeholder="结束时间">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="选择节目">
        <span v-for="(item,idx) in tabList" :key="idx">
          <el-button size="mini" type="primary" :plain="!item.isCheck" round @click="tabType(idx)">{{item.name}}</el-button>
        </span>
      </el-form-item>
      <el-form-item label="选择素材" :required="true">
        <div>
          <el-row class="tac" style="padding-bottom:15px">
            <el-input v-model="animationName" style="width: 20%" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入关键字"></el-input>
            <span class="myWords">
            类别筛选：
              <el-cascader
            ref="typeTree"
            v-model="typeList"
            :options="typeListTree"
            :props="props"
            :show-all-levels="false"
            @change="typeChange"
            filterable
            :key="Math.random()"
            clearable
            >
            </el-cascader>
          </span>
          </el-row>
          <el-table ref="programTable" :data="ainimationList" border style="width: 100%" class="mt15 mb15"  @selection-change="handleSelectionChange" @sort-change="changeTableSort" row-key="id">
            <el-table-column type="selection" width="50" :selectable="(row)=>row.state==1" :reserve-selection="true"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="name" :label="`${moduleName}名称`" align="center" sortable></el-table-column>
            <el-table-column prop="materialCategoryName" label="所属类别" align="center"></el-table-column>
            <el-table-column prop="isLyric" label="是否配置歌词" width="110" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.isLyric==1">是</span>
                <span v-if="scope.row.isLyric==0">否</span>
              </template>
            </el-table-column>
            <el-table-column prop="androidResourcePackageSize" v-if="materialCategory==110" label="资源包大小(M)" align="center" sortable>
              <template slot-scope="scope">
                {{scope.row.androidResourcePackageSize?((scope.row.androidResourcePackageSize/(1024*1024))+'').slice(0,4):''}}
              </template>
            </el-table-column>
            <el-table-column prop="androidResourcePackageSize" v-if="materialCategory!=110" label="Android资源包大小(M)" align="center" sortable>
              <template slot-scope="scope">
                {{scope.row.androidResourcePackageSize?((scope.row.androidResourcePackageSize/(1024*1024))+'').slice(0,4):''}}
              </template>
            </el-table-column>
            <el-table-column prop="iosResourcePackageSize" v-if="materialCategory!=110" label="IOS资源包大小(M)" align="center" sortable>
              <template slot-scope="scope">
                {{scope.row.iosResourcePackageSize?((scope.row.iosResourcePackageSize/(1024*1024))+'').slice(0,4):''}}
              </template>
            </el-table-column>
            <el-table-column prop="windowsResourcePackageSize" v-if="materialCategory!=110" label="Windows资源包大小(M)" align="center" sortable>
              <template slot-scope="scope">
                {{scope.row.windowsResourcePackageSize?((scope.row.windowsResourcePackageSize/(1024*1024))+'').slice(0,4):''}}
              </template>
            </el-table-column>
            <el-table-column prop="durationTime" label="总时长" width="100" align="center" sortable>
              <template slot-scope="scope">
                <span>{{scope.row.durationTimeStr}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center" sortable></el-table-column>
            <el-table-column prop="updateTime" label="修改时间" align="center" sortable></el-table-column>
            <el-table-column label="上下架状态" width="100" prop="state" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.state==1">上架</span>
                <span v-if="scope.row.state==2" style="color:red;">下架</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确 定</el-button>
      <el-button @click="$router.push({path:`${$route.path.slice(0,-14)}`,query:{id:$route.query.id,contentTime:$route.query.contentTime,activeIdx:$route.query.activeIdx,sceneId:$route.query.sceneId,sceneName:$route.query.sceneName,sceneTime:$route.query.sceneTime,selectModel:$route.query.selectModel,selectMusic:$route.query.selectMusic,selectProgramList:selectProgramList.length?JSON.stringify(selectProgramList):null,oldQuery:$route.query.oldQuery}})">取 消</el-button>
    </span>
  </div>
</template>

<script>
import {getMaterialList,getMaterialDropDown} from '../../../http/request'
export default {
  name:'createProgram',
  inject:['reload'],
  data(){
    return{
      isCreate:false,
      isEdit:false,
      programName:'',
      animationName:'',
      ainimationList:[],
      total:0,//总行数
      page:1,//页码
      limit:20,//一页行数
      selectProgram:null,
      selectProgramList:[],
      currentProgram:null,
      startTime:'',
      endTime:'',
      sceneTime:null,
      sortName:'',
      sortType:'',
      typeListTree:[],
      typeList:[],
      statusType:'',
      props:{
        label: "name",
        children: 'children',
        value:'id',
        checkStrictly: true,
        expandTrigger:'click'
      },
      tabList:[
        {
          id:101,
          name:'动画',
          isCheck:true
        },
        {
          id:110,
          name:'MP4模型',
          isCheck:false
        }
      ],
      currentIndex:0,
      materialCategory:101,
      moduleName:'动画'
    }
  },
  computed:{
    allParams(){
      return{
        "name":this.animationName,
        // "page":this.page,
        // "limit":this.limit,
        "appId":this.$route.params.appId,
        "module":this.materialCategory,
        "sortField":this.sortName,
        "sortType":this.sortType,
        "materialCategoryId":this.statusType,
        "isDel":0,
        "isValid":0
      }
    }
  },
  watch:{
    async animationName(){
      if(this.page!=1){
        this.page=1;
      }
      await this.listData();
    },
    async statusType(){
      if(this.page!=1){
        this.page=1;
      }
      await this.listData();
    }
  },
  methods:{
    tabType(idx){
      if(this.currentIndex===idx){
        return;
      }
      this.materialCategory=this.tabList[idx].id
      this.sortName='';
      this.sortType='';
      this.currentIndex = idx;                 
      this.tabList.forEach(v=>{v.isCheck=false});
      this.tabList[idx].isCheck=true;
      this.moduleName = this.tabList[idx].name;
      this.dropDown();
      this.listData();
      this.$refs.programTable.clearSelection();
    },
    handleSizeChange(val){
      this.limit = val;
    },
    handleCurrentChange(val){
      this.page = val;
    },
    handleSelectionChange(arr){
      this.startTime='';
      this.endTime='';
      if(arr.length>1){
        this.$refs.programTable.toggleRowSelection(arr[0],false);
        arr.splice(0,1);
        
      }else if(arr.length==0){
        this.selectProgram=null;
        return;
      }
      this.selectProgram=arr[0];
    },
    changeTableSort(col){
      this.sortName = col.prop.replace(/[A-Z]/g,(a,b)=>{
          return '_'+a.toLowerCase();
        });
      this.sortType = col.order=='ascending'?'asc':'desc';
      this.listData();
    },
    typeChange(value){
      this.statusType=value[value.length-1];
      this.$nextTick(()=>{
        let arr = document.getElementsByClassName('el-cascader__dropdown');
        for(let i=0;i<arr.length;i++){
          arr[i].parentElement.removeChild(arr[i]);
          arr[i]?arr[i].style.display='none':null;
        }
      })
    },
    dropDown(){
      getMaterialDropDown({"moduleId":this.materialCategory}).then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{
          this.typeListTree=res.data?res.data:[]
          this.typeListTree.unshift({id: "",name:"全部"});
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    listData(){
      return new Promise((resolve,reject)=>{
        getMaterialList(this.allParams).then(res=>{
          if(res.code){
            this.$message.error(res.msg);
          }else{
            if(res.data){
              this.ainimationList =res.data;
              // this.total= res.data.total;
            }
            resolve();
          }
        }).catch(err=>{
          reject(err);
        })
      })
    },
    startTimeChange(time){
      if(!time){
        this.endTime='';
        return;
      }
      if(!this.selectProgram){
        this.$message.error('请勾选素材');
        this.startTime='';
        this.endTime='';
        return;
      }
      let duration = this.selectProgram.durationTimeStr;
      let hour = duration.split(':')[0];
      let minute = duration.split(':')[1];
      let second = duration.split(':')[2];
      let totalSecond = Number(hour*3600) + Number(minute*60) + Number(second);
      let timeObj = new Date(new Date(time).getTime()+totalSecond*1000);
      let ye = timeObj.getFullYear();
      let mo = (timeObj.getMonth()+1).toString().padStart(2,'0');
      let da = timeObj.getDate().toString().padStart(2,'0');
      let endTime = ye+'-'+mo+'-'+da+' '+timeObj.toLocaleString('chinese',{hour12:false}).split(' ')[1];
      if(Number(time.slice(11).split(':')[0])-Number(endTime.slice(11).split(':')[0])>0&&!(Number(endTime.slice(11).split(':')[0])==0&&Number(endTime.slice(11).split(':')[1])==0&&Number(endTime.slice(11).split(':')[2])==0)){
        this.$message.error('播放时间已跨天，请重新选择');
        this.startTime='';
        this.endTime='';
        return;
      }
      this.endTime = endTime;
    },
    confirm(){
      if(this.programName===''){
        this.$message.error('请输入节目名称');
        return;
      }
      if(!this.startTime){
        this.$message.error('请选择时间');
        return;
      }
      if(!this.selectProgram){
        this.$message.error('请勾选动画');
        return;
      }
      this.selectProgram.programName=this.programName;
      this.selectProgram.startTime=this.startTime;
      this.selectProgram.endTime=this.endTime;
      let time1 = new Date(`2019/01/01 ${this.startTime.slice(11)}`);
      let time2 = new Date(`2019/01/01 ${this.endTime.slice(11)}`);
      let sceneStartTime = new Date(`2019/01/01 ${JSON.parse(this.$route.query.sceneTime)[0].slice(11)}`);
      let sceneEndTime = new Date(`2019/01/01 ${JSON.parse(this.$route.query.sceneTime)[1].slice(11)}`);
      console.log(sceneStartTime,sceneEndTime)
      if(time1-sceneStartTime<0||time2-sceneEndTime>0){
        this.$message.error('节目时间必须在场景时间内');
        return;
      }
      if(this.selectProgramList.length){
        let programClashList = [];
        let tableData=JSON.parse(JSON.stringify(this.selectProgramList));
        if(this.isEdit){
          console.log(this.currentProgram.currentIndex,151)
          tableData.splice(this.currentProgram.currentIndex,1);
          console.log(tableData)
        }
        programClashList = tableData.filter(v=>{
          let programStartTime = new Date(`2019/01/01 ${v.startTime.slice(11)}`);
          let programEndTime = new Date(`2019/01/01 ${v.endTime.slice(11)}`);
          return (time1-programStartTime<0&&time2-programStartTime>0)||(time1-programEndTime<0&&time2-programEndTime>0)||(time1-programStartTime>=0&&time2-programEndTime<=0&&time2-time1>0)||(time1-programStartTime<=0&&time2-programEndTime>=0);
        });
        if(programClashList.length){
          this.$message.error(`节目时间与‘${programClashList.slice(0,3).map(v=>v.programName).join('、')}’等节目有重叠`);
          return;
        }
      }
      // //计算时间差
      // let timeScope = (time2-time1)/1000;
      // let hour = Math.floor(timeScope / 3600);
      // hour = hour/10>1?hour:'0'+hour;
      // let minute = Math.floor( (timeScope - hour*3600) /60 );
      // minute = minute/10>1?minute:'0'+minute;
      // let second = (timeScope - hour*3600 - minute*60);
      // second = second/10>1?second:'0'+second;
      // let duration = hour+':'+minute+':'+second;
      this.selectProgram.duration = this.selectProgram.durationTimeStr;
      this.selectProgram.materialName = this.selectProgram.name;
      this.selectProgram.materialId = this.selectProgram.id;
      this.selectProgram.materialCategory = this.materialCategory;
      this.selectProgram.musicId = (new Date()).valueOf();
      if(this.isEdit){
        this.selectProgramList.splice(this.currentProgram.currentIndex,1,this.selectProgram);
      }else{
        this.selectProgramList.push(this.selectProgram);
      }
      
      this.$router.push({path:`${this.$route.path.slice(0,-14)}`,query:{id:this.$route.query.id,contentTime:this.$route.query.contentTime,activeIdx:this.$route.query.activeIdx,sceneId:this.$route.query.sceneId,sceneName:this.$route.query.sceneName,sceneTime:this.$route.query.sceneTime,selectModel:this.$route.query.selectModel,selectProgramList:JSON.stringify(this.selectProgramList),selectMusic:this.$route.query.selectMusic,oldQuery:this.$route.query.oldQuery}});
      this.reload();
    }
  },
  async created(){
    this.sceneTime = JSON.parse(this.$route.query.sceneTime);
    if(this.$route.query.selectProgramList){
      this.selectProgramList= JSON.parse(this.$route.query.selectProgramList);
    }
    if(this.$route.query.currentProgram){
      this.currentProgram = JSON.parse(this.$route.query.currentProgram);
      this.programName = this.currentProgram.programName;
      this.startTime = this.currentProgram.startTime;
      this.endTime = this.currentProgram.endTime;
      this.materialCategory = this.currentProgram.materialCategory;
      if(this.currentProgram.materialCategory==110){
        this.currentIndex=1;
        this.tabList.forEach(v=>{v.isCheck=false});
        this.tabList[1].isCheck=true;
        this.moduleName = 'MP4模型'
      }
      this.dropDown();
      await this.listData();
      let row = this.ainimationList.length?this.ainimationList.find(v=>v.id==this.currentProgram.materialId):false;
      if(row){
        this.$nextTick(()=>{
          this.$refs.programTable.toggleRowSelection(row,true);
          setTimeout(()=>{
            this.startTime = this.currentProgram.startTime;
            this.endTime = this.currentProgram.endTime;
          },100)
        })
      }
      this.isEdit=true;
    }else{
      this.dropDown();
      this.listData();
      this.isCreate=true;
    }
  }
}
</script>

<style scoped>

</style>