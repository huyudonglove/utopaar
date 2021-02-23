<template>
  <div v-if="appPower.length">
    <div v-if="$route.name=='arContentList'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">{{menus?menus.find(v=>v.childs?v.childs.find(w=>w.url==$route.path):undefined)?menus.find(v=>v.childs?v.childs.find(w=>w.url==$route.path):undefined).menuName:'':''}}</span>
        <el-button :disabled="!appPower[0].isCheck" style="float:right;" type="primary" @click="$router.push({path:`${$route.path}/createarcontent`,query:{oldQuery:JSON.stringify($route.query)}})">新增</el-button>
      </div>
      <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
        <el-input v-model="inputX" style="width: 150px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入关键字"></el-input>
        <span class="myWords">
          类别筛选
          <el-select v-model="typeValue" style="width:150px;">
            <el-option v-for="(item,idx) in typeList" :key="idx" :label="item.moduleName" :value="item.module"></el-option>
          </el-select>
        </span>
        <el-button type="danger" @click="del" :disabled="!appPower[3].isCheck">批量删除</el-button>
      </el-row>
      <el-table ref="arRef" :data="contentTable" border style="width: 100%" class="mt15 mb15" @selection-change="handleSelectionChange" :max-height="tableHeight">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
        <el-table-column prop="name" label="内容名称" align="center"></el-table-column>
        <el-table-column prop="materialInfo" label="包含内容" align="center"></el-table-column>
        <el-table-column prop="duration" label="总时长" align="center"></el-table-column>
        <!-- <el-table-column prop="startTime" label="开始时间"></el-table-column>
        <el-table-column prop="endTime" label="结束时间"></el-table-column> -->
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="createBy" label="创建人" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间" align="center"></el-table-column>
        <el-table-column prop="updateBy" label="最后修改人" align="center"></el-table-column>
        <el-table-column label="上下架" align="center">
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
        <el-table-column label="操作" fixed="right" width="100" align="center">
          <template slot-scope="scope">
            <el-button :disabled="!appPower[1].isCheck" type="primary" size="mini" @click="$router.push({path:`${$route.path}/createarcontent`,query:{id:scope.row.id,oldQuery:JSON.stringify($route.query)}})">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
          <pagination v-if="showPagination"></pagination>
      </div>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import pagination from '../../../share/pagination'
import {getArContentList,upAR,downAR,deleteArContent,getArTypeDropDown} from '../../../http/request'
export default {
  name:'arContentList',
  inject:['replace','reload'],
  components:{
    pagination
  },
  data(){
    return{
      showPagination:false,
      inputX:'',
      typeValue:'',//类别
      typeList:[],//类别列表
      contentTable:[],
      tableHeight:0,
      delArr:[],
    }
  },
  computed:{
    ...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
    ...mapState('currentUserPower',{appPower:'appPower'}),
    ...mapState('navMenu',{menus:'menus2'}),
  },
  watch:{
    page(){
      this.replace('page',this.page);
    },
    limit(){
      this.replace('limit',this.limit);
    },
    inputX(){
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('name',this.inputX);
    },
    typeValue(){
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('type',this.typeValue);
    },
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='arContentList'){
        this.listData();
      }
    }
  },
  methods:{
    handleSelectionChange(arr){
      this.delArr = arr.length?arr.map(v=>v.id):[];
    },
    dropDown(){
      getArTypeDropDown({"playId":this.$route.path.split('/')[4]}).then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{
          this.typeList=res.data;
          this.typeList.unshift({"module":'',"moduleName":'全部'});
        }
      })
    },
    listData(){
      getArContentList({...this.$route.query,"appId":this.$route.params.appId}).then(res=>{
        this.contentTable=res.data.items;
        this.$store.commit('pagination/setTotal', res.data.total);
      })
    },
    del(){
      if(this.delArr.length>0){
        deleteArContent(this.delArr).then(res=>{
          this.replace('page',1);
          this.reload();
        })
      }else{
        this.$message.error('请勾选需要删除的行');
      }
    },
    up(state,carrierId){
      if(state==1){
        upAR({carrierId}).then(res=>{
          if(res.code){
            this.contentTable.forEach(v=>{if(v.id==carrierId){v.state=2;}});
          }
        }).catch(err=>{
          this.contentTable.forEach(v=>{if(v.id==carrierId){v.state=2;}});
        })
      }else if(state==2){
        downAR({carrierId}).then(res=>{
          if(res.code){
            this.contentTable.forEach(v=>{if(v.id==carrierId){v.state=1;}});
          }
        }).catch(err=>{
          this.contentTable.forEach(v=>{if(v.id==carrierId){v.state=1;}});
        })
      }
    }
  },
  created(){
    this.dropDown();
    this.listData();
    let pageRecord = this.$route.query.page||1;//记录上一次页码操作
    let limitRecord = this.$route.query.limit||20;//记录上一次limit操作
    this.inputX = this.$route.query.name||'';
    this.typeValue = this.$route.query.type?parseInt(this.$route.query.type):'';
    this.$nextTick(()=>{
      this.$store.commit('pagination/setClickPage',pageRecord);
      this.$store.commit('pagination/setLimitPage',limitRecord);
      this.showPagination = true;//加载分页组件
    })
  },
  updated(){
    if(this.$route.name=='arContentList'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.arRef.$el.offsetTop - 110;
      })
    }
  }
}
</script>

<style scoped>

</style>