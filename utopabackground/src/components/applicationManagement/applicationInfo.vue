<template>
  <div>
    <div v-if="$route.name=='applicationInfo'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">应用配置</span>
      </div>
      <div style="padding-top:15px;">
        <el-button type="primary" plain size="mini" @click="goTo()">返回</el-button> 
        <span style="font-weight:600;color:#614a4d">素材库列表查询:</span>
      </div>
      <el-divider></el-divider>
      <div style="margin-top:15px;">
        
        <el-form  ref="formSize" label-width="100px" class="demo-formSize">
        <div v-if="!isBs">
        <el-form-item label="选择素材库">
          <div class="tag-group">
            <el-tag v-for="item in moduleDetail" :key="item.id" @click="tag(item.module,item.moduleName)" :type="item.module == tagKey?'success':''">{{item.moduleName}}-({{(item.materialCount)}})</el-tag>
          </div>
        </el-form-item>
       
          <span style="display:block;width:110px;text-align:right;padding-right:12px;font-weight:600;color:#614a4d">{{tagValue}}素材:</span>
          <el-divider></el-divider>
          <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
            <span>
              <el-input
                placeholder="输入素材关键字"
                class="input-with-select pl15"
                style="width: 12%"
                v-model="wd"
              ></el-input>
            </span>
            <span>
              类别筛选：
              <el-cascader
              ref="tree"
              v-model="moduleTreeSelect"
              :options="moduleTree"
              :props="props"
              :show-all-levels="false"
              @change="handleChange"
              filterable
              clearable
              popper-class="selectFlag"
              >
              </el-cascader>
            </span>
            <span v-if="tagKey==101||tagKey==102||tagKey==103">
              Unity版本：
              <el-select v-model="unitySelect" placeholder="请选择" style="width:150px;">
                <el-option
                v-for="item in unityOptions"
                :key="item"
                :label="item"
                :value="item">
                </el-option>
              </el-select>
            </span>
            <span v-if="tagKey==101||tagKey==102||tagKey==103">
              渲染管线：
              <el-select v-model="lineSelect" placeholder="请选择" style="width:150px;">
                <el-option
                v-for="item in lineOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
              </el-select>
            </span>
            <span v-if="tagKey==101||tagKey==102">
              动画类型：
              <el-select v-model="viewTypeSelect" placeholder="请选择" style="width:150px;">
                <el-option
                v-for="item in viewTypeOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
              </el-select>
            </span>
             <span v-if="tagKey==100">
              格式筛选：
              <el-select v-model="musicTypeSelect" placeholder="请选择" style="width:150px;">
                <el-option
                v-for="item in musicTypeOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
              </el-select>
            </span>
          </el-row>
            <!-- 数据展示 -->
          <el-table :data="tableData" ref="multipleTable" tooltip-effect="dark" style="width: 100%"  :max-height="tableHeight" border @sort-change="changeUpadte" :min-height="250">
            
          <el-table-column prop="id" :label="'id'" width="80" align="center"
          :key="9"
          >
          </el-table-column>
          <el-table-column prop="name" :label="`${tagValue}名称`" width="" align="center" :key="10" sortable="custom">
          </el-table-column>
           <el-table-column prop="materialFormat" :label="`格式`" width="" align="center" :key="65" v-if="tagKey==100">
          </el-table-column>
          <el-table-column prop="materialCategoryName" :label="'所属类别'" width="" align="center" :key="11">
          </el-table-column>
          <el-table-column prop="parentIdUrl" :label="`${tagValue}预览`" width="200" align="center" v-if="tagKey==100" :key="12">
            <template slot-scope="scope">
                <div>
                <span style="cursor: pointer;" >
                <img src="@/assets/play.png" alt="" v-if="!scope.row.play" @click="tableData.forEach(v=>{v.play=false;});scope.row.play=true;playMusic(scope.row.androidMaterial)">
                <img src="@/assets/stop.png" alt="" v-if="scope.row.play" @click="scope.row.play=!scope.row.play;playMusic()">
              </span>
                </div>
              </template>
          </el-table-column>
          
          <el-table-column  :label="`${tagValue}展示`" width="150" align="center" v-if="tagKey==101||tagKey==103||tagKey==102" :key="13">
              <template slot-scope="scope">
                <span style="cursor: pointer;" >
                  <img :src="scope.row.webUrl?`/static/${scope.row.webUrl}`:null" alt=""  style="width:50px;height:50px" v-focus>
                </span>
              </template>
          </el-table-column>
          
          <el-table-column  :label="`${tagValue}预览`" width="150" align="center" v-if="tagKey==105||tagKey==107" :key="14">
            <template slot-scope="scope">
                <span style="cursor: pointer;" >
                  <img :src="scope.row.webUrl?`/static/${scope.row.webUrl}`:null" alt=""  style="width:50px;height:50px" v-focus>
                </span>
              </template>
            </el-table-column>
            <el-table-column  :label="`${tagValue}预览`" width="150" align="center" v-if="tagKey==104" :key="15">
            <template slot-scope="scope">
                <a :href="`http://${scope.row.videoUrl}`" target="_blank">{{scope.row.videoUrl}} </a>
              </template>
            </el-table-column>
          <el-table-column  :label="`占位图展示`" width="180" align="center" v-if="tagKey==102" :key="16">
            <template slot-scope="scope">
                <span style="cursor: pointer;" >
                  <img :src="scope.row.pictureUrl?`/static/${scope.row.pictureUrl}`:null" alt=""  style="width:50px;height:50px" v-focus>
                </span>
              </template>
          </el-table-column>
          <el-table-column prop="isLyric" label="是否包含歌词" width="80" align="center" v-if="tagKey==101" :key="17">
            <template slot-scope="scope">
              <span v-if="scope.row.isLyric==1">是</span>
              <span v-if="!scope.row.isLyric" style="color:#FF644E">否</span>
            </template>
            </el-table-column>
            <el-table-column  label="资源包大小" width="150" align="center" v-if="tagKey ==100||tagKey ==107" :key="18" sortable="custom" prop="androidResourcePackageSize">
              <template slot-scope="scope">
                {{((scope.row.androidResourcePackageSize/(1024*1024))+'').slice(0,4)}}M
                
              </template>
            </el-table-column>
            <el-table-column  label="Android资源包大小" width="150" align="center" v-if="tagKey ==101||tagKey ==102||tagKey ==103" :key="19" sortable="custom" prop="androidResourcePackageSize">
              <template slot-scope="scope">
                {{((scope.row.androidResourcePackageSize/(1024*1024))+'').slice(0,4)}}M
              </template>
            </el-table-column>
            <el-table-column prop="iosResourcePackageSize" label="IOS资源包大小" width="140" align="center" v-if="tagKey ==101&&!equipmentEyeglass||tagKey ==102&&!equipmentEyeglass||tagKey ==103&&!equipmentEyeglass||tagKey ==105&&!equipmentEyeglass||tagKey ==106&&!equipmentEyeglass" :key="20" sortable="custom">
              <template slot-scope="scope">
                {{((scope.row.iosResourcePackageSize/(1024*1024))+'').slice(0,4)}}M
              </template>
            </el-table-column>
            <el-table-column prop="windowsResourcePackageSize" label="Windows资源包" width="140" align="center" v-if="tagKey==101&&equipmentEyeglass||tagKey==102&&equipmentEyeglass||tagKey==103&&equipmentEyeglass" :key="40" sortable="custom">
              <template slot-scope="scope">
                {{((scope.row.windowsResourcePackageSize/(1024*1024))+'').slice(0,4)}}M
              </template>
            </el-table-column>
            <el-table-column prop="unityVersion" :label="'unity版本'" width="120" align="center" v-if="tagKey==101||tagKey==102||tagKey==103" :key="Math.random()+13">
            </el-table-column>
            <el-table-column prop="loadingLine" :label="'渲染管线'" width="120" align="center" v-if="tagKey==101||tagKey==102||tagKey==103" :key="Math.random()+14" >
            </el-table-column>
            <el-table-column prop="viewType" :label="'动画类型'" width="120" align="center" v-if="tagKey==101||tagKey==102" :key="Math.random()+14" >
            </el-table-column>
            <el-table-column prop="durationTimeStr" label="总时长" width align="center" v-if="tagKey==100||tagKey==101||tagKey ==105||tagKey ==106||tagKey ==107" :key="21" sortable="custom"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="110" align="center"  :key="15" sortable="custom" ></el-table-column>
            <el-table-column prop="updateTime" label="修改时间" width="110" align="center" :key="116" sortable="custom" ></el-table-column>
            <el-table-column prop="state" label="状态"  align="center" width="80" >
              <template slot-scope="scope">
              <span v-if="scope.row.state==1">上架</span>
              <span v-if="scope.row.state==2" style="color:#FF644E">下架</span>
            </template>
            </el-table-column>
          </el-table>
          <div>
          <audio :src="url" autoplay="autoplay" ref="audio"></audio>
          </div>
        </div>
        <div v-if="isBs">
      <span style="display:block;width:150px;text-align:right;padding-right:12px;font-weight:600;color:#614a4d">BS内容关联管理:</span>
            <el-divider></el-divider>
            <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
              <span>
                <el-input
                  placeholder="输入素材关键字"
                  class="input-with-select pl15"
                  style="width: 15%"
                  v-model="wd"
                ></el-input>
              </span>
            </el-row> 
      <el-table :data="tableData" ref="multipleTable2" tooltip-effect="dark" style="width: 100%"  :max-height="tableHeight"   border @sort-change="changeUpadte" >
      <el-table-column prop="id" label="id" width="" align="center">
      </el-table-column>
      <el-table-column prop="identifyPhotoCode" label="识别图编号" width="" align="center"  sortable="custom">
      </el-table-column>
      <el-table-column prop="photoUrl" label="识别图图片" width="" align="center" >
         <template slot-scope="scope">
            <span style="cursor: pointer;" >
              <img :src="scope.row.photoUrl?`${scope.row.photoUrl}`:null" alt=""  style="width:50px;height:50px" v-focus>
            </span>
          </template>
      </el-table-column>
      <el-table-column prop="identifyPhotoName" label="识别图名称" width="" align="center"  sortable="custom">
      </el-table-column>
      <el-table-column prop="relatedShelveCode" label="关联货架" width="" align="center" >
      </el-table-column>
      <el-table-column prop="identifyPhotoDesc" label="识别图描述" width="" align="center">
      </el-table-column> 
      <el-table-column prop="createTime" label="新增时间" width="" align="center"  sortable="custom">
      </el-table-column>

      </el-table>
    </div>
		<div style="margin-top:15px;margin-bottom:15px"> <pagination v-if="showPagination"></pagination></div>
      </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import {applicationM,applicationToTree,getFile,applicationConfigList} from "../../http/request";
import pagination from '../../share/pagination'

export default {
  name: "applicationInfo",
  inject:['replace','reload'],
  data(){
	  return{
      moduleTreeSelect:[],
      options:[],//玩法
      lineOptions:[],
      unityOptions:[],
      viewTypeOptions:[],
      moduleDetail:[],//素材种类
      moduleTree:[],//模块分类
      musicTypeSelect:'',
      musicTypeOptions:[],
      wd:'',
      showPagination:false,
      tagValue:'',
      tagKey:'',
      moduleTreeVal:'',
      lineSelect:'',
      unitySelect:'',
      viewTypeSelect:'',
      sortField:'',
      sortType:'',
      equipmentEyeglass:'',
      isBs:false,
      formSize:{
        "name": '',
        "playId":'',
        "moduleList":[]      
      },
       props: {
        label: "name",
        children: 'children',
        value:'id',
        checkStrictly: true,
        expandTrigger:'click'
    },
    url:'',
    tableHeight:0,
    tableHeight2:0 
	  }
  },
  created(){
	let query=this.$route.query
  let pageRecord = query.page;//记录上一次页码操作
  let limitRecord = query.limit;//记录上一次limit操作
  this.wd=query.wd?query.wd:'';
  this.replace('sortField','');
  this.replace('sortType','');
  this.moduleTreeVal=query.moduleTreeVal?parseInt(query.moduleTreeVal):'';
  if(query.id){
    this.isCreate=false;
    this.info({appId:query.id})

  }
  applicationConfigList({type:2}).then(res=>{
    this.unityOptions=res.data
    this.unityOptions.push("全部")
  })
  applicationConfigList({type:1}).then(res=>{
    this.lineOptions=res.data
    this.lineOptions.push("全部")
  })
  applicationConfigList({type:3}).then(res=>{
    this.viewTypeOptions=res.data
    this.viewTypeOptions.push("全部")
  })
  applicationConfigList({type:4}).then(res=>{
    this.musicTypeOptions=res.data
    this.musicTypeOptions.push("全部")
  })
	this.$nextTick(()=>{
		this.$store.commit('pagination/setClickPage',pageRecord);
		this.$store.commit('pagination/setLimitPage',limitRecord);
		this.showPagination = true;//加载分页组件
})
  },
  computed:{
	...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
  ...mapState('applicationList',{tableData:'tableData3',total:'total3',currentRow:'currentRow'}),
  playId(){
    return this.formSize.playId
  },
  equipmentType(){
    return this.formSize.equipmentType
  }
  },
  methods:{
	  ...mapActions('applicationList',['initListModule','info']),
    tag(code,value){
      this.tagKey=code;
      this.tagValue=value
    },
      //返回
    goTo(){
      // console.log(this.$route.query.msg,'this.$route.msg')
      this.$router.push({path:'/applicationManagement/applicationList',query:JSON.parse(this.$route.query.msg)})
      this.reload()
    },
   handleChange(value){
        this.moduleTreeVal=value[value.length-1]
        // document.getElementsByClassName('selectFlag')[0].style.display='none'
        this.$refs.tree.dropDownVisible = false; //监听值发生变化就关闭它
//         this.$nextTick(()=>{
//         let arr = document.getElementsByClassName('el-cascader__dropdown');
//         for(let i=0;i<arr.length;i++){
//           arr[i].parentElement.removeChild(arr[i]);
//           arr[i]?arr[i].style.display='none':null;
//         }
//       })
      },
  playMusic(id,row){
          id?(()=>{
              this.url=`/static/${Base64.decode(id)}`;
              this.$refs.audio.load();
              this.$refs.audio.play();
              this.$refs.audio.onended=function () {
                row.play=!row.play;
              }
              })():(()=>{
                this.$refs.audio.pause();
              })();
        },
  changeUpadte(data){
   if(data.order=='ascending'){
       this.sortType='asc'
     }else if(data.order=='descending'){
       this.sortType='desc'
     }else{
       this.sortType=''
     }
   switch (data.prop) {
      case 'name':
        this.sortField='name'
        break;
      case 'androidResourcePackageSize':
        this.sortField='android_resource_package_size'
        break;
      case 'iosResourcePackageSize':
        this.sortField='ios_resource_package_size'
        break;
      case 'createTime':
        this.sortField='create_time'
        break;
      case 'updateTime':
        this.sortField='update_time'
        break;
      case 'windowsResourcePackageSize':
      this.sortField='windows_resource_package_size'
      break;
      case 'identifyPhotoCode':
      this.sortField='identify_photo_code'
      break;
      case 'identifyPhotoName':
      this.sortField='identify_photo_name'
      break;
      case 'createTime':
      this.sortField='create_time'
      break;
      case 'durationTimeStr':
      this.sortField='duration_time'
      break;      
      default:
        this.sortField=''
      break;
    }
  }
  },
  watch:{
   playId(){
// equipmentEyeglass  
   this.formSize.equipmentType==1?this.equipmentEyeglass=false:this.formSize.equipmentType==2?this.equipmentEyeglass=true:this.equipmentEyeglass=''
   this.playId==7?this.isBs=true:this.isBs=false
  },
	page(){
		this.replace("page",this.page);
    },
  limit(){
      this.replace('limit',this.limit);
  },
  wd(){
    this.$store.commit('pagination/setClickPage',1);
    this.replace('wd',this.wd);
  },
  moduleTreeVal(){
    this.$store.commit('pagination/setClickPage',1);
    this.replace('moduleTreeVal',this.moduleTreeVal);
  },
  lineSelect(){
    this.$store.commit('pagination/setClickPage',1);
    this.lineSelect !=='全部'?this.replace('lineSelect',this.lineSelect):this.replace('lineSelect','');
  },
  unitySelect(){
    this.$store.commit('pagination/setClickPage',1);
    this.unitySelect !=='全部'?this.replace('unitySelect',this.unitySelect):this.replace('unitySelect','');
  },
  viewTypeSelect(){
    this.$store.commit('pagination/setClickPage',1);
    this.viewTypeSelect !=='全部'?this.replace('viewTypeSelect',this.viewTypeSelect):this.replace('viewTypeSelect','');
  },
  musicTypeSelect(){
    this.$store.commit('pagination/setClickPage',1);
    this.musicTypeSelect !=='全部'?this.replace('musicTypeSelect',this.musicTypeSelect):this.replace('musicTypeSelect','');
  },
  sortField(){
    this.$store.commit('pagination/setClickPage',1);
    this.replace('sortField',this.sortField);
  },
  sortType(){
    this.$store.commit('pagination/setClickPage',1);
    this.replace('sortType',this.sortType);
  },
  tagKey(){
    // console.log(this.tagKey,'tagKey')
     if(this.playId !== 7){
     this.initListModule({...this.$route.query,module:this.tagKey,appId:this.$route.query.id,isDel:'0'}).then(res=>{
     this.$store.commit('pagination/setTotal',this.total);
     applicationToTree({moduleId:this.tagKey}).then(res=>{
      this.moduleTree=res.data?res.data:[]
      this.moduleTree.push({id: "",name:"全部"})
    })
    })
    this.lineSelect=''
    this.unitySelect=''
    this.viewTypeSelect=''
    this.musicTypeSelect=''
    this.sortField=''
    this.sortType=''
    this.moduleTreeVal=''
    this.wd=''
    this.$refs.audio.pause();
     }
   
  },
	currentRow(){
    this.formSize = Object.assign(this.formSize, this.currentRow);
    
   if(this.playId !==7){
    this.moduleDetail=this.formSize.moduleList
    this.tagValue=this.moduleDetail[0].moduleName
    this.tagKey=this.moduleDetail[0].module
   }
  },
	$route(){//判断路由query变化执行请求
    if(this.$route.name=='applicationInfo'){
      //  console.log(this.$route.query,'this.$route.msg')
    this.initListModule({...this.$route.query,module:this.tagKey,appId:this.$route.query.id,isDel:'0'}).then(res=>{
		this.$store.commit('pagination/setTotal',this.total);
		})
      }
    }
  },
  updated(){
      this.$nextTick(()=>{
        if(!this.isBs){this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 110;}
        if(this.isBs){this.tableHeight2 = window.innerHeight - this.$refs.multipleTable2.$el.offsetTop - 110;}
      })
  },
  components: {
    pagination
  }
};
</script>

<style scoped>
.tac span {
  font-size:14px;
  color:#606266;
  padding-left: 5px;
  padding-right: 10px;
}
.el-tag{
  margin-right: 10px;cursor: pointer;
}
</style>