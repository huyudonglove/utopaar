<template>
  <div>
    <div v-if="$route.name=='assetsMoudelVirtual'">
       <div  style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:15px;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">{{menus?menus.find(v=>v.url==$route.path)?menus.find(v=>v.url==$route.path).menuName:'':''}}</span>
      </div>
      <div style="margin-top:15px;">
        <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
          <span>
            <el-input
              placeholder="输入识别图关键字"
              class="input-with-select pl15"
              style="width: 15%"
              v-model="wd"
              suffix-icon="el-icon-search"
              maxlength="50"
            ></el-input>
          </span>
        </el-row>
          <!-- 数据展示 -->
        <el-table :data="tableData" ref="multipleTable2" tooltip-effect="dark" style="width: 100%"  :max-height="tableHeight"   border @sort-change="changeUpadte" >
        <el-table-column prop="id" label="id" width="" align="center">
        </el-table-column>
        <el-table-column prop="identifyPhotoCode" label="识别图编号" width="" align="center"  sortable="custom">
        </el-table-column>
        <el-table-column prop="photoUrl" label="产品开发部识别图" width="" align="center" >
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
		<div style="margin-top:15px;margin-bottom:15px">
       <pagination v-if="showPagination"></pagination>
       </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import {applicationToTree,getFile,applicationConfigList} from "../../http/request";
import pagination from '../../share/pagination'
export default {
  name: "assetsMoudelVirtual",
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
	  }
  },
  created(){
  let query=this.$route.query
  let pageRecord = query.page;//记录上一次页码操作
  let limitRecord = query.limit;//记录上一次limit操作
  this.wd=query.wd?query.wd:'';
  this.appId=parseInt(this.$route.params.appId)
  this.initListModule({...this.$route.query,appId:this.appId}).then(res=>{

    if(res.data.items !=null){
       this.tableData=res.data.items
    }
		this.$store.commit('pagination/setTotal',this.total);
		})
  this.$nextTick(()=>{
  this.$store.commit('pagination/setClickPage',pageRecord);
  this.$store.commit('pagination/setLimitPage',limitRecord);
  this.showPagination = true;//加载分页组件
  })
  },
  computed:{
	...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
  ...mapState('assetsMoudel',{total:'total3'}),
  ...mapState('navMenu',{menus:'menus2'}),
  },
  methods:{
	  ...mapActions('assetsMoudel',['initListModule']),
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
      case 'identifyPhotoCode':
      this.sortField='identify_photo_code'
      break;
      case 'identifyPhotoName':
      this.sortField='identify_photo_name'
      break;
      case 'createTime':
      this.sortField='create_time'
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
    sortField(){
      this.$store.commit('pagination/setClickPage',1);
      this.replace('sortField',this.sortField);
    },
    sortType(){
      this.$store.commit('pagination/setClickPage',1);
      this.replace('sortType',this.sortType);
    },
  $route(){//判断路由query变化执行请求
    if(this.$route.name=='assetsMoudelVirtual'){
    this.appId=parseInt(this.$route.params.appId)
		this.initListModule({...this.$route.query,appId:this.appId}).then(res=>{
    if(res.data.items !=null){
      this.tableData=res.data.items
    }
    this.$store.commit('pagination/setTotal',this.total);
		})
      }
    }
  },
   updated(){
    this.$nextTick(()=>{
      this.tableHeight = window.innerHeight - this.$refs.multipleTable2.$el.offsetTop - 110;
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
