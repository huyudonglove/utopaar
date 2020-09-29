<template>
  <div>
    <div v-if="$route.name=='assetsMoudel'">
       <div  style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:15px;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">{{tagValue}}</span>
      </div>
      <div style="margin-top:15px;">
        <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
          <span>
            <el-input
              placeholder="输入素材关键字"
              class="input-with-select pl15"
              style="width: 15%"
              v-model="wd"
              suffix-icon="el-icon-search"
              maxlength="50"
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
            :key="Math.random()"
				   clearable
            >
            </el-cascader>
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
          <!-- <span v-if="tagKey==101||tagKey==102||tagKey==103">
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
          </span> -->
        </el-row>
          <!-- 数据展示 -->
        <el-table :data="tableData" ref="multipleTable" tooltip-effect="dark" style="width: 100%"   :max-height="tableHeight"  border @sort-change="changeUpadte">
        <el-table-column prop="id" :label="'id'" width="80" align="center" :key="1" >
        </el-table-column>
        <el-table-column prop="name" :label="`${tagValue}名称`" width="" align="center" :key="2" sortable="custom">
        </el-table-column>
         <el-table-column prop="materialFormat" :label="`格式`" width="" align="center" :key="65" v-if="tagKey==100">
          </el-table-column>
        <el-table-column prop="materialCategoryName" :label="'所属类别'" width="200" align="center" :key="3">
        </el-table-column>
        <el-table-column prop="parentIdUrl" :label="`${tagValue}预览`" width="200" align="center" v-if="tagKey==100" :key="4">
           <template slot-scope="scope">
             <div>
              <span style="cursor: pointer;" >
              <img src="@/assets/play.png" alt="" v-if="!scope.row.play" @click="tableData.forEach(v=>{v.play=false;});scope.row.play=true;;playMusic(scope.row.androidMaterial,scope.row)">
               <img src="@/assets/stop.png" alt="" v-if="scope.row.play" @click="scope.row.play=!scope.row.play;playMusic()">
            </span>
             </div>
             </template>
        </el-table-column>

        <el-table-column  :label="`${tagValue}展示`" width="200" align="center" v-if="tagKey==101||tagKey==103||tagKey==102" :key="5">
            <template slot-scope="scope">
              <span style="cursor: pointer;" >
                <img :src="scope.row.webUrl?`/static/${scope.row.webUrl}`:null" alt=""  style="width:50px;height:50px" v-focus>
              </span>
            </template>
        </el-table-column>

        <el-table-column  :label="`${tagValue}预览`" width="200" align="center" v-if="tagKey==105||tagKey==107" :key="6">
           <template slot-scope="scope">
              <span style="cursor: pointer;" >

                <img :src="scope.row.webUrl?`/static/${scope.row.webUrl}`:null" alt=""  style="width:50px;height:50px" v-focus>
              </span>
            </template>
          </el-table-column>
           <el-table-column  :label="`${tagValue}预览`" width="200" align="center" v-if="tagKey==104" :key="7">
           <template slot-scope="scope">
              <a :href="`${scope.row.videoUrl}`" target="_blank">{{scope.row.videoUrl}} </a>
            </template>
          </el-table-column>
        <el-table-column  :label="`占位图展示`" width="150" align="center" v-if="tagKey==102" :key="8">
           <template slot-scope="scope">
              <span style="cursor: pointer;" >

                <img :src="scope.row.pictureUrl?`/static/${scope.row.pictureUrl}`:null" alt="" style="width:50px;height:50px" v-focus>
              </span>
            </template>
        </el-table-column>
        <el-table-column prop="isLyric" label="是否包含歌词" width="120" align="center" v-if="tagKey==101" :key="9">
          <template slot-scope="scope">
            <span v-if="scope.row.isLyric==1">是</span>
            <span v-if="!scope.row.isLyric" style="color:#FF644E">否</span>

          </template>
          </el-table-column>
          <el-table-column  label="资源包大小" width="150" align="center" v-if="tagKey ==100||tagKey ==107" :key="10" sortable="custom" prop="androidResourcePackageSize">
             <template slot-scope="scope">
              {{((scope.row.androidResourcePackageSize/(1024*1024))+'').slice(0,4)}}M

            </template>
          </el-table-column>
          <el-table-column  label="安卓资源包大小" width="150" align="center" v-if="tagKey ==101||tagKey ==102||tagKey ==103" :key="11" sortable="custom" prop="androidResourcePackageSize">
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
        <!-- <el-table-column prop="unityVersion" :label="'unity版本'" width="120" align="center" v-if="tagKey==101||tagKey==102||tagKey==103" :key="Math.random()+13">
        </el-table-column>
         <el-table-column prop="loadingLine" :label="'渲染管线'" width="120" align="center" v-if="tagKey==101||tagKey==102||tagKey==103" :key="Math.random()+14" >
        </el-table-column>
         <el-table-column prop="viewType" :label="'动画类型'" width="120" align="center" v-if="tagKey==101||tagKey==102" :key="Math.random()+14" >
        </el-table-column> -->
          <el-table-column prop="durationTimeStr" label="总时长" width="100" align="center" v-if="tagKey==100||tagKey==101||tagKey ==105||tagKey ==106||tagKey ==107" :key="13" sortable="custom"></el-table-column>
          <el-table-column prop="state" label="状态" width="120" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.state==1">上架</span>
                <span v-if="scope.row.state==2" style="color:#FF644E">下架</span>
              </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="110" align="center" :key="14" sortable="custom"></el-table-column>
          <el-table-column prop="updateTime" label="修改时间" width="110" align="center" :key="16" sortable="custom"></el-table-column>
        </el-table>
        <div>
         <audio :src="url" autoplay="autoplay" ref="audio"></audio>
        </div>
		<div style="margin-top:15px;margin-bottom:15px">
       <pagination v-if="showPagination"></pagination>
       </div>
    <!-- <el-table :data="tableData2" ref="multipleTable2" tooltip-effect="dark" style="width: 100%"   :max-height="0" >
    </el-table> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import {applicationToTree,getFile,applicationConfigList,playInfo} from "../../http/request";
import pagination from '../../share/pagination'
export default {
  name: "assetsMoudel",
  inject:['replace','reload'],
  data(){
	  return{
      moduleDetail:[],//素材种类
      moduleTree:[],//模块分类
      wd:'',
      showPagination:false,
      tagValue:'',
      tagKey:'',
      url:'',
      appId:'',
      moduleTreeVal:'',
      moduleTreeSelect:[],
      musicTypeSelect:'',
      musicTypeOptions:[],
      props: {
      label: "name",
      children: 'children',
      value:'id',
      checkStrictly: true,
      expandTrigger:'click'
    },
    tableHeight:0,
    tableData:[],
    lineSelect:'',
    unitySelect:'',
    viewTypeSelect:'',
    lineOptions:[],
    unityOptions:[],
    viewTypeOptions:[],
    sortField:'',
    sortType:'',
    equipmentEyeglass:'',//眼镜端
	  }
  },
 async created(){
  let query=this.$route.query
  let pageRecord = query.page;//记录上一次页码操作
  let limitRecord = query.limit;//记录上一次limit操作
  this.wd=query.wd?query.wd:'';
  this.moduleTreeVal=query.moduleTreeVal?parseInt(query.moduleTreeVal):'';
  this.appId=parseInt(this.$route.params.appId)
  this.tagKey=parseInt(this.$route.params.moudle)
  applicationConfigList({type:2}).then(res=>{
    this.unityOptions=res.data
    this.unityOptionsFilter=JSON.parse(JSON.stringify(res.data))
    this.unityOptions.push("全部")
  })
  applicationConfigList({type:1}).then(res=>{
    this.lineOptions=res.data
    this.lineOptionsFilter=JSON.parse(JSON.stringify(res.data))
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
  switch (this.tagKey) {
    case 100:
      this.tagValue='音乐'
      break;
    case 101:
      this.tagValue='动画'
      break;
    case 102:
      this.tagValue='场景模型'
      break;
    case 104:
      this.tagValue='在线视频'
      break;
    case 105:
      this.tagValue='抠像视频'
      break;
    case 106:
      this.tagValue='游戏交互'
      break;
    case 107:
      this.tagValue='MP4'
      break;
    default:
      break;
  }
    // 玩法 playId
   await playInfo({id:this.$route.params.playId}).then(res=>{
        res.data.equipmentType==1?this.equipmentEyeglass=false:res.data.equipmentType==2?this.equipmentEyeglass=true:this.equipmentEyeglass=''
    })
    this.initListModule({...this.$route.query,module:this.tagKey,appId:this.appId}).then(res=>{

    if(res.data.items !=null){
      let app=res.data.items.map(v => {
      v.play=false;
      if(v.pic){
        v.webUrl = Base64.decode(v.pic)
      }
      if(v.placeholderPictureUrl){
        v.pictureUrl = Base64.decode(v.placeholderPictureUrl)
      }
      return v
    })
    this.tableData=JSON.parse(JSON.stringify(app))
    }

		this.$store.commit('pagination/setTotal',this.total);
		})
  this.$nextTick(()=>{
  this.moduleTreeSelect=query.moduleTreeSelect?JSON.parse(query.moduleTreeSelect):[]
  this.$store.commit('pagination/setClickPage',pageRecord);
  this.$store.commit('pagination/setLimitPage',limitRecord);
  this.showPagination = true;//加载分页组件
  })
  },
  computed:{
	...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
  ...mapState('assetsMoudel',{total:'total3'}),
  },
  methods:{
	  ...mapActions('assetsMoudel',['initListModule']),
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
      handleChange(value){
        this.moduleTreeVal=value[value.length-1]
        this.$refs.tree.dropDownVisible = false; //监听值发生变化就关闭它
        this.$nextTick(()=>{
        let arr = document.getElementsByClassName('el-cascader__dropdown');
        for(let i=0;i<arr.length;i++){
          arr[i].parentElement.removeChild(arr[i]);
          arr[i]?arr[i].style.display='none':null;
        }
      })
      },
  changeUpadte(data){
  //  const loading = this.$loading({
  //     lock: true,
  //     text: 'Loading',
  //     spinner: 'el-icon-loading',
  //     background: 'rgba(0, 0, 0, 0.7)'
  //   });
  //   setTimeout(() => {
  //     loading.close();
  //   }, 500);
   if(data.order=='ascending'){
    //  console.log(data,'data')
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
  moduleTreeSelect(){
    let apple =JSON.stringify(this.moduleTreeSelect);
    this.replace('moduleTreeSelect',apple);
  },
  tagKey(){
    //  this.moduleTreeVal=''
    //  this.moduleTreeSelect=[]
     applicationToTree({moduleId:this.tagKey}).then(res=>{
      this.moduleTree=res.data?res.data:[]
      this.moduleTree.push({id: "",name:"全部"})
    })
    this.$refs.audio.pause();
    this.$nextTick(() => {
      this.$refs.multipleTable.doLayout();
    });
    this.lineSelect='';
    this.unitySelect='';
    this.viewTypeSelect='';
    this.sortField='';
    this.sortType='';
    this.musicTypeSelect='';
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
  async $route(){//判断路由query变化执行请求

    if(this.$route.name=='assetsMoudel'){
    this.appId=parseInt(this.$route.params.appId)
    this.tagKey=parseInt(this.$route.params.moudle)
    switch (this.tagKey) {
    case 100:
      this.tagValue='音乐'
      break;
    case 101:
      this.tagValue='动画'
      break;
    case 102:
      this.tagValue='场景模型'
      break;
    case 104:
      this.tagValue='在线视频'
      break;
    case 105:
      this.tagValue='抠像视频'
      break;
    case 106:
      this.tagValue='游戏交互'
      break;
    case 107:
      this.tagValue='MP4'
      break;
    default:
      break;
  }
    await playInfo({id:this.$route.params.playId}).then(res=>{
        res.data.equipmentType==1?this.equipmentEyeglass=false:res.data.equipmentType==2?this.equipmentEyeglass=true:this.equipmentEyeglass=''
    })
    this.moduleTreeSelect=this.$route.query.moduleTreeSelect?JSON.parse(this.$route.query.moduleTreeSelect):[]
		this.initListModule({...this.$route.query,module:this.tagKey,appId:this.appId}).then(res=>{

    if(res.data.items !=null){
      let app=res.data.items.map(v => {
      if(v.pic){
       v.webUrl = Base64.decode(v.pic)
      }
      v.play=false;
      if(v.placeholderPictureUrl){
        v.pictureUrl = Base64.decode(v.placeholderPictureUrl)
      }
      return v;
    })
    this.tableData=JSON.parse(JSON.stringify(app))
    }
    this.$store.commit('pagination/setTotal',this.total);
		})
      }
    }
  },
   updated(){
    this.$nextTick(()=>{
      this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 110;
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
