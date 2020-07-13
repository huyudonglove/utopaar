<template>
  <div v-if="pageSettingPower.length">
    <div v-if="$route.name=='moduleList'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">模块列表</span>
        <el-button :disabled="!pageSettingPower[0].isCheck" style="float:right;" type="primary" @click="$router.push({path:'/app/modulelist/createmodule',query:{oldQuery:JSON.stringify($route.query)}})">新增</el-button>
      </div>
      <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
        <span class="myWords">
          模块类型
          <el-select v-model="moduleTypeX" style="width:150px;">
            <el-option v-for="(item,idx) in moduleTypeList" :key="idx" :label="item.description" :value="item.code"></el-option>
          </el-select>
        </span>
        <span class="myWords">标题 
          <el-input style="width:150px;" v-model="inputX" placeholder="请输入内容" maxlength="50"></el-input></span>
        <span class="myWords">投放时段
          <el-date-picker
            v-model="putTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </span>
        <span class="myWords">
          投放状态
          <el-select v-model="putTypeX" style="width:150px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="投放中" value="1"></el-option>
            <el-option label="未投放" value="2"></el-option>
            <el-option label="投放结束" value="3"></el-option>
          </el-select>
        </span>
        <span class="myWords">
          使用状态
          <el-select v-model="stateX" style="width:150px;height:30px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="2"></el-option>
          </el-select>
        </span>
        <el-button type="primary" @click="listData">查询</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-row>
      <el-table ref="moduleRef"
        :data="moduleList"
        tooltip-effect="dark"
        :max-height="tableHeight"
        @sort-change="changeTableSort"
        border>
        <el-table-column prop="id" label="ID" width="100" :formatter="formatter" align="center"></el-table-column>
        <el-table-column prop="category" label="组件模块类型" align="center">
          <template slot-scope="scope">
            {{moduleTypeList.length?moduleTypeList.filter(v=>v.code==scope.row.category)[0].description:''}}
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" align="center"></el-table-column>
        <el-table-column prop="effectFrom" label="投放时段" sortable align="center">
          <template slot-scope="scope">
            {{(scope.row.effectFrom?scope.row.effectFrom:'')+'-'+(scope.row.effectTo?scope.row.effectTo:'')}}
          </template>
        </el-table-column>
        <el-table-column prop="rank" label="排序" width="120" sortable align="center">
          <template slot-scope="scope">
            <el-input style="width:70px;" v-model="scope.row.rank" @blur="editRank(scope.row.id,scope.row.rank)" @keydown.native="enter(scope.row.id,scope.row.rank)" maxlength="50"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="putState" label="投放状态" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.releaseStatus===1">投放中</span>
            <span v-if="scope.row.releaseStatus===2">未投放</span>
            <span v-if="scope.row.releaseStatus===3">投放结束</span>
          </template>
        </el-table-column>
        <el-table-column label="使用状态" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1">启用</span>
            <span v-if="scope.row.status==2" style="color:red;">禁用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="300" align="center">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="$router.push({path:'/app/modulelist/createmodule',query:{isSee:1,id:scope.row.id,oldQuery:JSON.stringify($route.query)}})">查看</el-button>
            <el-button :disabled="!pageSettingPower[1].isCheck" type="primary" size="mini" @click="$router.push({path:'/app/modulelist/createmodule',query:{isEdit:1,id:scope.row.id,oldQuery:JSON.stringify($route.query)}})">编辑</el-button>
            <el-button :disabled="!pageSettingPower[3].isCheck" type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-if="showPagination"></pagination>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import pagination from '../../share/pagination'
import {getModuleList,delModule,editOrder,getDropdown} from '../../http/request'
export default {
  name:'moduleList',
  inject:['replace','reload'],
  components:{
    pagination
  },
  data(){
    return{
      inputX:'',//标题
      moduleTypeX:'',//类型
      moduleTypeList:[],//下拉框列表
      putTypeX:'',//投放状态
      stateX:'',//启用状态
      moduleList:[],
      showPagination:false,
      tableHeight:0,
      putTime:'',
      sort:{},
    }
  },
  computed:{
    ...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
    ...mapState('currentUserPower',{pageSettingPower:'pageSettingPower'}),
  },
  watch:{
    page(){
      this.replace('pageIndex',this.page);
    },
    limit(){
      this.replace('pageSize',this.limit);
    },
    inputX(){
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('containTitle',this.inputX);
    },
    moduleTypeX(){
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('category',this.moduleTypeX);
    },
    putTypeX(){
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('ReleaseStatus',this.putTypeX);
    },
    stateX(){
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('status',this.stateX);
    },
    putTime(){
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('putTime',this.putTime);
    },
    sort(){
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('sortColumn',this.sort.sortColumn);
      this.replace('order',this.sort.order);
    },
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='moduleList'){
        this.listData();
      }
    }
  },
  methods:{
    listData(){//列表
      getModuleList(this.$route.query).then(res=>{
        this.moduleList = res.data.items;
        this.$store.commit('pagination/setTotal', res.data.total);
      })
    },
    del(id){//删除
      delModule({moduleId:id}).then(v=>{
        this.reload();
      })
    },
    getModuleType(){//获取下拉框
      getDropdown({category:'moduleType'}).then(res=>{
        this.moduleTypeList = res.data;
        this.moduleTypeList.unshift({"code": "","description": "全部"})
      })
    },
    editRank(id,rank){
      editOrder({moduleId:id,rank}).then(v=>{
        this.reload();
      })
    },
    enter(id,rank){
      var event = window.event || arguments.callee.caller.arguments[0];
      if (event.keyCode == 13) {
          this.editRank(id,rank)
      }
    },
    formatter(row, column) {
      return row.id;
    },
    reset(){
      this.replace('reset');
      this.inputX='';
      this.moduleTypeX='';
      this.putTypeX='';
      this.stateX='';      
      this.putTime='';
      this.$refs.moduleRef.clearSort();
    },
    changeTableSort(col){
      console.log(col)
      // console.log(col.prop.replace(/[A-Z]/g,(a,b)=>{
      //   return '_'+a.toLowerCase();
      // }));
      this.sort = {
        "sortColumn":col.prop.replace(/[A-Z]/g,(a,b)=>{
          return '_'+a.toLowerCase();
        }),
        "order":col.order=='ascending'?true:col.order===null?null:false
      };
    }
  },
  created(){
    this.listData();
    this.getModuleType();
    let pageRecord = this.$route.query.pageIndex||1;//记录上一次页码操作
    let limitRecord = this.$route.query.pageSize||20;//记录上一次limit操作
    this.inputX=this.$route.query.containTitle||'';
    this.moduleTypeX=this.$route.query.category||'';
    this.putTypeX=this.$route.query.ReleaseStatus||'';
    this.stateX=this.$route.query.status||'';
    this.putTime = this.$route.query.putTime||'';
    this.$route.query.sortColumn?this.sort ={"sortColumn":this.$route.query.sortColumn,"order":this.$route.query.order}:null;
    this.$nextTick(()=>{
      this.$store.commit('pagination/setClickPage',pageRecord);
      this.$store.commit('pagination/setLimitPage',limitRecord);
      this.showPagination = true;//加载分页组件
    })
  },
  updated(){
    if(this.$route.name=='moduleList'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.moduleRef.$el.offsetTop - 110;
      })
    }
  }
}
</script>

<style scoped>

</style>