<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span v-if="!$route.query.sceneId" style="font-size:24px;font-weight:bold;color:#614a4d;">编辑场次/新增场景/新增场景模型</span>
      <span v-if="$route.query.sceneId" style="font-size:24px;font-weight:bold;color:#614a4d;">编辑场次/编辑场景/新增场景模型</span>
    </div>
    <el-row class="tac" style="padding-bottom:15px">
      <el-input v-model="modelName" style="width: 20%" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入关键字"></el-input>
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
    <el-table ref="ModelTable" :data="modelList" border style="width: 100%" class="mt15 mb15"  @selection-change="handleSelectionChange" @sort-change="changeTableSort">
      <el-table-column type="selection" width="50" :selectable="(row)=>row.state==1"></el-table-column>
      <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
      <el-table-column prop="name" label="模型名称" align="center" sortable></el-table-column>
      <el-table-column prop="webUrl" label="预览图" width="200" align="center">
        <template slot-scope="scope">
          <img :src="`/static/${scope.row.webUrl}`" alt="" width="150px">
        </template>
      </el-table-column>
      <el-table-column prop="androidResourcePackageSize" label="Android资源包大小(M)" align="center" sortable>
        <template slot-scope="scope">
          {{scope.row.androidResourcePackageSize?((scope.row.androidResourcePackageSize/(1024*1024))+'').slice(0,4):''}}
        </template>
      </el-table-column>
      <el-table-column prop="iosResourcePackageSize" label="IOS资源包大小(M)" align="center" sortable>
        <template slot-scope="scope">
          {{scope.row.iosResourcePackageSize?((scope.row.iosResourcePackageSize/(1024*1024))+'').slice(0,4):''}}
        </template>
      </el-table-column>
      <el-table-column prop="windowsResourcePackageSize" label="Windows(UWP)资源包大小(M)" align="center" sortable>
        <template slot-scope="scope">
          {{scope.row.windowsResourcePackageSize?((scope.row.windowsResourcePackageSize/(1024*1024))+'').slice(0,4):''}}
        </template>
      </el-table-column>
      <el-table-column label="上下架状态" prop="state" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state==1">上架</span>
          <span v-if="scope.row.state==2" style="color:red;">下架</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="durationTimeStr" label="更新时间" align="center"></el-table-column> -->
    </el-table>
    <div>
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
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确 定</el-button>
      <el-button @click="$router.push({path:`${$route.path.slice(0,-17)}`,query:{id:$route.query.id,contentTime:$route.query.contentTime,activeIdx:$route.query.activeIdx,sceneId:$route.query.sceneId,sceneName:$route.query.sceneName,sceneTime:$route.query.sceneTime,selectModel:$route.query.selectModel,selectProgramList:$route.query.selectProgramList,selectMusic:$route.query.selectMusic,oldQuery:$route.query.oldQuery}})">取 消</el-button>
    </span>
  </div>
</template>

<script>
import {getMaterialList,getMaterialDropDown} from '../../../http/request'
import { Base64 } from 'js-base64';
export default {
  name:'createSceneModel',
  inject:['reload'],
  data(){
    return{
      modelName:'',
      modelList:[],
      total:0,//总行数
      page:1,//页码
      limit:20,//一页行数
      selectModel:null,
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
      sortName:'',
      sortType:''
    }
  },
  computed:{
    allParams(){
      return{
        "name":this.modelName,
        "page":this.page,
        "limit":this.limit,
        "appId":this.$route.params.appId,
        "module":'102',
        "materialCategoryId":this.statusType,
        "sortField":this.sortName,
        "sortType":this.sortType,
        "isDel":0,
        "isValid":0
      }
    }
  },
  watch:{
    page(){
      this.getList();
    },
    limit(){
      if(this.page!=1){
        this.page=1;
      }
      this.getList();
    },
    modelName(){
      if(this.page!=1){
        this.page=1;
      }
      this.listData();
    },
    statusType(){
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
      if(arr.length>1){
        this.$refs.ModelTable.toggleRowSelection(arr[0],false);
        arr.splice(0,1);
      }else if(arr.length==0){
        this.selectModel=null;
        return;
      }
      this.selectModel=arr[0];
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
    changeTableSort(col){
      this.sortName = col.prop.replace(/[A-Z]/g,(a,b)=>{
          return '_'+a.toLowerCase();
        });
      this.sortType = col.order=='ascending'?'asc':'desc';
      this.listData();
    },
    dropDown(){
      getMaterialDropDown({"moduleId":102}).then(res=>{
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
      getMaterialList(this.allParams).then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{
          this.modelList =res.data.items===null?[]:res.data.items;
          if(this.modelList.length){
            this.modelList.map(v=>v.webUrl=Base64.decode(v.pic));
          }       
          this.total= res.data.total;
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    confirm(){
      if(!this.selectModel){
        this.$message.error('请选择一个模型');
        return;
      }
      this.$router.push({path:`${this.$route.path.slice(0,-17)}`,query:{id:this.$route.query.id,contentTime:this.$route.query.contentTime,activeIdx:this.$route.query.activeIdx,sceneId:this.$route.query.sceneId,sceneName:this.$route.query.sceneName,sceneTime:this.$route.query.sceneTime,selectModel:JSON.stringify(this.selectModel),selectProgramList:this.$route.query.selectProgramList,selectMusic:this.$route.query.selectMusic,oldQuery:this.$route.query.oldQuery}});
      this.reload();
    }
  },
  created(){
    this.dropDown();
    this.listData();
  }
}
</script>

<style scoped>

</style>