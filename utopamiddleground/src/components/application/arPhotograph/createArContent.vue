<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span v-if="isCreate" style="font-size:24px;font-weight:bold;color:#614a4d;">创建内容</span>
      <span v-if="isEdit" style="font-size:24px;font-weight:bold;color:#614a4d;">编辑内容</span>
    </div>
    <el-form label-position="right" label-width="150px" style="width: 100%">
      <el-form-item label="内容名称" :required="true">
        <el-input type="text" v-model="contentName" maxlength="50"></el-input>
      </el-form-item>
      <!-- <el-form-item label="有效时间" :required="true">
        <timeSwitch></timeSwitch>
      </el-form-item> -->
      <el-form-item label="类别选择">
        <span v-for="(item,idx) in bigTypeList" :key="idx">
          <el-button size="mini" type="primary" :plain="!item.isCheck" round @click="tabType(idx)">{{item.moduleName}}</el-button>
        </span>
      </el-form-item>
      <el-form-item label="关联素材">
        <div class="myARTable">
          <el-row class="tac" style="padding-bottom:15px;">
            {{titleName}}素材
          </el-row>
          <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding-bottom:15px;">
            <el-input v-model="inputX" style="width: 205px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入关键字"></el-input>
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
          <el-table ref="multipleTable" :data="table" border tooltip-effect="dark" :cell-style="cellStyle" @selection-change="selectionChange" @sort-change="changeTableSort">
            <el-table-column type="selection" width="50" :selectable="(row)=>row.state==1"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column :label="`${tableTitle.name}名称`" prop="name" align="center" sortable></el-table-column>
            <el-table-column label="所属类别" prop="materialCategoryName" align="center"></el-table-column>
            <el-table-column :label="tableTitle.display" prop="name" align="center" width="100">
              <template slot-scope="scope">
                <span style="cursor: pointer;" v-if="tableTitle.name=='歌曲'">
                  <img src="@/assets/play.png" alt="" v-if="!scope.row.play" @click="table.forEach(v=>{v.play=false;});scope.row.play=true;playMusic(scope.row.androidMaterial,scope.row)">
                  <img src="@/assets/stop.png" alt="" v-if="scope.row.play" @click="scope.row.play=!scope.row.play;playMusic()">
                </span>
                <span style="cursor: pointer;" v-if="tableTitle.name!='歌曲'&&tableTitle.name!='视频'">
                  <img :src="scope.row.imgUrl?`/static/${scope.row.imgUrl}`:''" alt=""  style="width:50px;" v-focus>
                </span>
                <span style="cursor: pointer;" v-if="tableTitle.name=='视频'">
                  <a v-if="tableTitle.module!=107" :href="`http://${scope.row.videoUrl}`" target="_blank">{{scope.row.videoUrl}} </a>
                  <img v-if="tableTitle.module==107" :src="scope.row.imgUrl?`/static/${scope.row.imgUrl}`:''" alt=""  style="width:50px;" v-focus>
                </span>
              </template>
            </el-table-column>
            <el-table-column v-if="tableTitle.lyric" :label="tableTitle.lyric" prop="isLyric" align="center" width="110">
              <template slot-scope="scope">
                <span v-if="scope.row.isLyric==1">是</span>
                <span v-if="scope.row.isLyric==0">否</span>
              </template>
            </el-table-column>
            <el-table-column v-if="tableTitle.package" :label="(tableTitle.module!='107'&&tableTitle.module!='100'?'安卓':'')+tableTitle.package+'(M)'" prop="androidResourcePackageSize" width="170" align="center" sortable>
              <template slot-scope="scope">
                {{scope.row.androidResourcePackageSize?((scope.row.androidResourcePackageSize/(1024*1024))+'').slice(0,4):''}}
              </template>
            </el-table-column>
            <el-table-column v-if="tableTitle.package&&tableTitle.module!='107'&&tableTitle.module!='100'" :label="'IOS'+tableTitle.package+'(M)'" prop="iosResourcePackageSize" width="165" align="center" sortable>
              <template slot-scope="scope">
                {{scope.row.iosResourcePackageSize?((scope.row.iosResourcePackageSize/(1024*1024))+'').slice(0,4):''}}
              </template>
            </el-table-column>
            <el-table-column v-if="tableTitle.package&&tableTitle.module!='107'&&tableTitle.module!='100'" :label="'Windows'+tableTitle.package+'(M)'" prop="windowsResourcePackageSize" width="210" align="center" sortable>
              <template slot-scope="scope">
                {{scope.row.windowsResourcePackageSize?((scope.row.windowsResourcePackageSize/(1024*1024))+'').slice(0,4):''}}
              </template>
            </el-table-column>
            <el-table-column v-if="tableTitle.time" :label="tableTitle.time" prop="durationTime" width="90" align="center" sortable>
              <template slot-scope="scope">
                <span>{{scope.row.durationTimeStr}}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" align="center" sortable></el-table-column>
            <el-table-column label="修改时间" prop="updateTime" align="center" sortable></el-table-column>
            <el-table-column label="上下架状态" prop="state" align="center" width="95">
              <template slot-scope="scope">
                <span v-if="scope.row.state==1">上架</span>
                <span v-if="scope.row.state==2" style="color:red;">下架</span>
              </template>
            </el-table-column>
          </el-table>
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
        </div>
        <div>
          <audio :src="url" autoplay="autoplay" ref="audio"></audio>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrEdit">确定</el-button>
        <el-button @click="$router.push({path:`${$route.path.slice(0,-16)}`,query:JSON.parse($route.query.oldQuery)});">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import timeSwitch from '../../../share/timeSwitch'
import {getArTypeDropDown,createArContent,editArContent,getArContentInfo,getArMaterialList,getMaterialDropDown} from '../../../http/request'
import { Base64 } from 'js-base64';
export default {
  name:'createArContent',
  inject:['reload'],
  components:{
    timeSwitch
  },
  data(){
    return{
      isCreate:false,
      isEdit:false,
      contentName:'',//内容名称
      bigTypeList:[],//类别列表
      titleName:'',//素材标题名字
      inputX:'',
      table:[],//列表
      page:1,
      limit:20,
      total:0,
      tableTitle:{},
      tableTitleList:[
        {name:'歌曲',display:'音乐预览',lyric:'是否包含歌词',time:'总时长',package:'资源包大小',module:'100'},
        {name:'动画',display:'动画展示',lyric:'是否包含歌词',time:'总时长',package:'资源包大小',module:'101'},
        {name:'模型',display:'模型展示',package:'资源包大小',module:'102'},//载体模型
        {name:'模型',display:'模型展示',package:'资源包大小',module:'103'},//普通模型
        {name:'视频',display:'视频预览',module:'104'},//在线视频
        {name:'视频',display:'视频预览',lyric:'是否包含歌词',time:'总时长',module:'105'},//抠像视频
        {name:'游戏',display:'预览图片',time:'总时长',module:'106'},
        {name:'视频',display:'视频预览',time:'总时长',package:'资源包大小',module:'107'},//mp4视频
      ],
      selectId:'',
      moduleType:'',
      currentIndex:'',//存下当前选择的类型id
      loading:'',
      allowClearId:true,//是否允许清空选择的行id
      url:'',
      typeListTree:[],
      typeList:[],
      statusType:'',
      props:{
        label: "name",
        children: 'children',
        value:'id',
        checkStrictly: true,
        expandTrigger:'click',
      },
      sortName:'',
      sortType:''
    }
  },
  computed:{
    ...mapState('timeSwitch',{timeScope:'value'}),
    allParams(){
      return{
        "contentName":this.contentName,
        "moduleType":this.moduleType,
        "materialId":this.bigTypeList.length?this.selectId:'',
        // "startTime":this.timeScope?this.timeScope[0]:'',
        // "endTime":this.timeScope?this.timeScope[1]:'',
        "appId":this.$route.params.appId,
      }
    },
    materialParams(){
      return{
        "page":this.page,
        "limit":this.limit,
        "type":this.bigTypeList.length?this.bigTypeList[this.currentIndex===''?0:this.currentIndex].module:'',
        "name":(this.inputX||this.inputX===0)?this.inputX:'',
        "appId":this.$route.params.appId,
        "materialCategoryId":this.statusType,
        "sortField":this.sortName,
        "sortType":this.sortType,
      }
    }
  },
  watch:{
    async page(){
      await this.materialList();
      let row = this.table.find(v=>v.id==v.selectId);
      if(row){
        this.$nextTick(()=>{
          this.$refs.multipleTable.toggleRowSelection(row,true);
        })
      }
    },
    async limit(){
      if(this.page!=1){
        this.page=1
      }
      await this.materialList();
      let row = this.table.find(v=>v.id==v.selectId);
      if(row){
        this.$nextTick(()=>{
          this.$refs.multipleTable.toggleRowSelection(row,true);
        })
      }
    },
    inputX(){
      if(this.page!=1){
        this.page=1;
      }
      this.materialList();
    },
    statusType(){
      if(this.page!=1){
        this.page=1;
      }
      this.materialList();
    }
  },
  methods:{
    handleSizeChange(val){
      this.limit = val;
    },
    handleCurrentChange(val){
      this.page = val;
    },
    cellStyle({row, column, rowIndex, columnIndex}){//将选择的行高亮
      if(this.selectId===row.id){
        return {
          background: '#ccc',
          color: '#FFF'
        }
      }
    },
    selectionChange(arr){
      if(arr.length>1){
        this.$refs.multipleTable.toggleRowSelection(arr[0],false);
        arr.splice(0,1);
      }else if(arr.length==0){
        if(this.allowClearId){
          this.selectId='';
        }
        this.allowClearId = true;//重置为允许清空
        return;       
      }
      this.allowClearId = true;
      this.selectId=arr[0].id;
      this.moduleType = this.bigTypeList.length?this.bigTypeList[this.currentIndex].module:'';
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
    smallDropDown(){
      getMaterialDropDown({"moduleId":this.bigTypeList.length?this.bigTypeList[this.currentIndex===''?0:this.currentIndex].module:''}).then(res=>{
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
    dropDown(){
      this.loading=this.$loading({
        lock: true,
        text: `数据获取中...`,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      return new Promise((resolve,reject)=>{
        getArTypeDropDown({"playId":parseInt(this.$route.path.slice(32,33))}).then(res=>{
          this.loading.close();
          if(res.code){
            this.$message.error(res.msg);
          }else{
            this.bigTypeList=res.data;
            this.bigTypeList.map(v=>{v.isCheck=false;return v;});
            this.bigTypeList[0].isCheck=true;
            this.moduleType = this.bigTypeList[0].module;
            this.tableTitle = this.tableTitleList.find(v=>v.module==this.moduleType);
            resolve();
          }
        }).catch(err=>{
          this.loading.close();
          reject();
        })
      })
    },
    async tabType(idx){
      if(this.currentIndex===idx){
        return;
      }
      this.sortName='';
      this.sortType='';
      this.allowClearId=false;
      this.currentIndex = idx;                 
      this.bigTypeList.forEach(v=>{v.isCheck=false});
      this.bigTypeList[idx].isCheck=true;
      this.titleName = this.bigTypeList[idx].moduleName;
      this.tableTitle = this.tableTitleList.find(v=>v.module==this.bigTypeList[idx].module);
      this.smallDropDown();
      await this.materialList();
      let row = this.table.filter(v=>v.id==this.selectId);
      if(row.length){
        this.$refs.multipleTable.toggleRowSelection(row[0],true)
      }
    },
    contentInfo(){
      return new Promise((resolve,reject)=>{
        getArContentInfo({"carrierId":this.$route.query.id}).then(res=>{
          this.loading.close();
          if(res.code){
            this.$message.error(res.msg)
          }else{
            this.contentName=res.data.contentName;
            this.selectId = res.data.materialId;
            this.moduleType = res.data.moduleCode+'';
            this.bigTypeList.forEach((v,idx)=>{
              if(v.module==this.moduleType){
                v.isCheck=true;this.currentIndex=idx;
                this.titleName = this.bigTypeList.find(i=>i.module==v.module).moduleName;
                this.tableTitle = this.tableTitleList.find(i=>i.module==v.module);
              }else{
                v.isCheck=false;
              }           
            });
            this.$store.commit('timeSwitch/setValue',[res.data.startTime,res.data.endTime]);
            resolve();
          }
        }).catch(err=>{
          this.loading.close();
          reject();
        })
      })
    },
    changeTableSort(col){
      this.sortName = col.prop.replace(/[A-Z]/g,(a,b)=>{
          return '_'+a.toLowerCase();
        });
      this.sortType = col.order=='ascending'?'asc':'desc';
      this.materialList();
    },
    materialList(){
      return new Promise((resolve,reject)=>{
        getArMaterialList(this.materialParams).then(res=>{
          this.table=res.data===null?[]:res.data.items.map(v=>{
            v.play=false;
            v.pic?v.imgUrl=Base64.decode(v.pic):null;
            return v;
          });
          this.total=res.data===null?0:res.data.total;
          resolve();
        })
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
    addOrEdit(){
      if(this.allParams.contentName===''){
        this.$message.error('请输入内容名称');
        return;
      }
      // if(!this.allParams.startTime){
      //   this.$message.error('请选择时间');
      //   return;
      // }
      if(!this.allParams.materialId){
        this.$message.error('请选择素材');
        return;
      }
      if(this.isCreate){
        createArContent(this.allParams).then(res=>{
          this.$router.push({path:`${this.$route.path.slice(0,-16)}`,query:JSON.parse(this.$route.query.oldQuery)});
          this.reload();
        })
      }else if(this.isEdit){
        editArContent({"carrierId":this.$route.query.id,...this.allParams}).then(res=>{
          this.$router.push({path:`${this.$route.path.slice(0,-16)}`,query:JSON.parse(this.$route.query.oldQuery)});
          this.reload();
        })
      }
    }
  },
  async created(){
    await this.dropDown();
    if(this.$route.query.id){
      this.isEdit=true;
      await this.contentInfo();
    }else{
      this.isCreate=true;
      this.currentIndex=0;//将索引初始化
      this.titleName=this.bigTypeList[0].moduleName;
    }
    this.loading.close();
    this.smallDropDown();
    await this.materialList();
    let row = this.table.filter(v=>v.id==this.selectId);
    if(row.length){
      this.$nextTick(()=>{
        this.$refs.multipleTable.toggleRowSelection(row[0],true)
      })
    }
  },
  destroyed(){
    this.$store.commit('timeSwitch/setValue',[]);
  }
}
</script>

<style>
.myARTable .el-table__header-wrapper  .el-checkbox{
	display:none
}
</style>