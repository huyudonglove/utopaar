<template>
  <div v-if="arAppPower.length">
    <div style="height:50px;border-bottom:1px solid #DFDCDC;">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">应用列表</span>
      <el-button style="float:right;" type="primary" @click="goTo('create')" :disabled="!arAppPower[0].isCheck">新增</el-button>
    </div>
    <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">

      <span class="myWords">应用名称<el-input style="width:150px;"  placeholder="请输入内容" v-model="appName"></el-input></span>
      <span class="myWords">
          应用类型
          <el-select  v-model="relateApplicationId" style="width:150px;height:30px;">
            <el-option label="全部" value=""></el-option>
            <el-option :label="item.name" :value="item.id" v-for="item in appId" :key="item.id"></el-option>
          </el-select>
        </span>
      <span class="myWords">
          渲染管道
          <el-select  v-model="loadValue" style="width:150px;height:30px;">
            <el-option label="全部" value=""></el-option>
            <el-option :label="item" :value="item" v-for="item in load" :key="item"></el-option>
          </el-select>
        </span>
      <span class="myWords">
          状态
          <el-select  v-model="type" style="width:150px;height:30px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="2"></el-option>
          </el-select>
        </span>
         <span class="myWords">
            识别方式：
            <el-select v-model="recognizeType" placeholder="请选择" style="width:150px;height:30px;">
              <el-option label="全部" value></el-option>
              <el-option label="图像云识别" value="1"></el-option>
              <el-option label="图像本地识别" value="0"></el-option>
              <el-option label="空间识别" value="2"></el-option>
            </el-select>
          </span>
          <span class="myWords">
            平台类型：
            <el-select v-model="platformType" placeholder="请选择" style="width:150px;height:30px;">
              <el-option label="全部" value></el-option>
              <el-option label="Vuforia" value="0"></el-option>
              <el-option label="EasyAR" value="1"></el-option>
              <el-option label="LocusAR" value="2"></el-option>
            </el-select>
          </span>
      <el-button type="primary">查询</el-button>
      <el-button type="info" @click="replace('reset');reload();">重置</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%" :max-height="tableHeight" ref="arRef" border @sort-change="changeUpadte">
      <el-table-column fixed prop="id" label="ID" width="200" align="center">
      </el-table-column>
      <el-table-column prop="name" label="应用名称" width="200" align="center" sortable="custom">
      </el-table-column>
      <el-table-column prop="relateApplicationId" label="应用类型" width="120" align="center">
        <template slot-scope="scope">
          {{appId.length?appId.find(v=>v.id==scope.row.relateApplicationId)?appId.find(v=>v.id==scope.row.relateApplicationId).name:'':''}}
        </template>
      </el-table-column>
      <el-table-column prop="provinceCityArea" label="所属地区" align="center" >
        <template slot-scope="scope">
          <div style="white-space:pre-line;">{{scope.row.provinceCityArea.split(',').slice(0,2).join('\n')}}</div>
          <div style="cursor:pointer;" v-if="scope.row.provinceCityArea.split(',').length>2" @click="showCity(scope)">...</div>
        </template>
      </el-table-column>
      <el-table-column prop="position" label="地理位置" align="center" >
        <template slot-scope="scope">
          <div style="white-space:pre-line;">{{scope.row.position.split(',').slice(0,2).join('\n')}}</div>
          <div style="cursor:pointer;" v-if="scope.row.position.split(',').length>2" @click="showCity(scope)">...</div>
        </template>
      </el-table-column>
      <el-table-column prop="position" label="识别方式" align="center" >
        <template slot-scope="scope">
          <span v-if="scope.row.recognizeType==0">图像本地识别</span>
          <span v-if="scope.row.recognizeType==1">图像云识别</span>
          <span v-if="scope.row.recognizeType==2">空间识别</span>
        </template>
      </el-table-column>
      <el-table-column prop="position" label="平台类型" align="center" >
        <template slot-scope="scope">
          <span v-if="scope.row.platformType ==0">Vuforia</span>
          <span v-if="scope.row.platformType ==1">EasyAR</span>
          <span v-if="scope.row.platformType ==2">LocusAR</span>
        </template>
      </el-table-column>
      <el-table-column prop="loadingLine" label="渲染管道" width="" align="center">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80" align="center">
        <template slot-scope="scope">
          {{scope.row.status==2?'禁用':'启用'}}
        </template>
      </el-table-column>
      <el-table-column prop="modifyTime" label="最新保存时间" width="160" align="center" sortable="custom">
      </el-table-column>
      <el-table-column prop="modifyBy" label="更新人" width="" align="center">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="280" align="center">
        <template slot-scope="scope">
          <el-button  type="warning" size="small" @click="goTo('watch',scope.row.id)">查看</el-button>
          <el-button type="primary" size="small"  @click="goTo('revise',scope.row.id)" :disabled="!arAppPower[1].isCheck">编辑</el-button>
          <el-button type="danger" size="small"  @click="deleteApp(scope.row.id)" :disabled="!arAppPower[3].isCheck">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-if="showPagination"></pagination>
    <el-dialog :visible.sync="cityShow" width="200px" :destroy-on-close="true" center>
      <div style="white-space:pre-line;text-align:center;">{{this.citys}}</div>
    </el-dialog>
  </div>
</template>

<script>
  import pagination   from '../../share/pagination'
  import {getAppList,deleteApp,getAppId,getLoad} from "../../http/request";
  import {mapState} from 'vuex'
  export default {
    name: "applicationList",
    components:{
      pagination
    },
    inject:['replace','reload'],
    computed:{
      ...mapState('pagination',['clickPage','limitPage']),
      ...mapState('currentUserPower',['arAppPower'])
    },
    data(){
      return{
        tableData: [],
        showPagination:true,
        playType:'',
        type:'',
        appName:'',
        tableHeight:0,
        appId:[],
        relateApplicationId:'',
        load:[],
        loadValue:'',
        wordState:'',
        upS:'',
        cityShow:false,
        citys:'',
        recognizeType:'',
        platformType:''
      }
    },
    methods:{
      getList(){
        let msg={
          pageIndex:this.$route.query.clickPage||1,
          pageSize:this.$route.query.limitPage||20,
          containName:this.$route.query.appName ||'',
          id:'',
          relateApplicationId:this.$route.query.relateApplicationId||'',
          status:this.$route.query.type||'',
          loadingLine:this.$route.query.loadValue||'',
          sortColumn:this.wordState||'modify_time',
          order:this.upS||'false',
          recognizeType:parseInt(this.recognizeType),
          platformType:this.platformType
        }
        //console.log(msg,999)
        getAppList(msg).then(res=>{
          this.$store.commit('pagination/setTotal',res.data.total);
          this.tableData=res.data.items;
        });
      },
      goTo(type,id){
        this.$router.push({
          path:'/app/createApplication',
          query:{
            msg:JSON.stringify(this.$route.query),
            type:type,
            id:id
          }
        })
      },
      deleteApp(id){
        deleteApp(id).then(v=>{
          this.getList();
        })
      },
      getAppId(){
        getAppId().then(res=>{
          res.code?this.$message.error(res.msg):this.appId=res.data;

        })
      },
      getLoad(){
        getLoad().then(v=>{
          //console.log(v,7777);
          this.load=v.data
        })
      },
      changeUpadte(state){
        console.log(state.prop)
        //this.$store.commit('pagination/setClickPage',1);
        //this.wordState=state.prop;
        state.prop=='name'&&(()=>{this.wordState='name'})();
        state.prop=='createTime'&&(()=>{this.wordState='create_time'})();
        state.prop=='updateTime'&&(()=>{this.wordState='update_time'})();
        state.prop=='androidResourcePackageSize'&&(()=>{this.wordState='android_resource_package_size'})();
        state.prop=='iosResourcePackageSize'&&(()=>{})(this.wordState='ios_resource_package_size');
        state.prop=='windowsResourcePackageSize'&&(()=>{})(this.wordState='windows_resource_package_size');
        state.prop=='durationTimeStr'&&(()=>{this.wordState='duration_time'})();
        state.prop=='modifyTime'&&(()=>{this.wordState='modify_time'})();
        console.log(this.wordState,789)
        this.upS=state.order;
        state.order=='ascending'&&(()=>{this.upS='true'})();
        state.order=='descending'&&(()=>{this.upS='false'})();
        this.getList();
      },
      showCity(scope){
        this.cityShow=true;
        this.citys = scope.row.provinceCityArea.split(',').join('\n');
      },
    },
    watch:{
      clickPage(){
        this.replace('clickPage',this.clickPage);
      },
      limitPage(){
        this.replace('limitPage',this.limitPage);
      },
      appName(){
        this.$store.commit('pagination/setClickPage',1);
        this.replace('appName',this.appName);
      },
      playType(){
        this.replace('playType',this.playType);
      },
      type(){
        this.$store.commit('pagination/setClickPage',1);
        this.replace('type',this.type);
      },
      platformType(){
        this.replace('platformType',this.platformType);
      },
      recognizeType(){
        this.$store.commit('pagination/setClickPage',1);
        this.replace('recognizeType',this.recognizeType);
      },
      relateApplicationId(){
        this.$store.commit('pagination/setClickPage',1);
        this.replace('relateApplicationId',this.relateApplicationId)
      },
      loadValue(){
        this.$store.commit('pagination/setClickPage',1);
        this.replace('loadValue',this.loadValue)
      },
      $route(){
        //监听路由变化，请求接口
        if(this.$route.name=='applicationList'){
          this.getList();
        }
        //console.log(111)
      }
    },
    created() {
      //请求接口，初始页面
      let pageRecord = this.$route.query.clickPage||1;//记录上一次页码操作
      let limitRecord = this.$route.query.limitPage||20;//记录上一次limit操作
      // this.title=this.$route.query.title?this.$route.query.title:'';
      // this.select=this.$route.query.select?this.$route.query.select:'';
      let typeRecord=this.$route.query.type||'';
      this.appName=this.$route.query.appName||'';
      this.relateApplicationId=this.$route.query.relateApplicationId*1||'';
      this.recognizeType=this.$route.query.recognizeType||'';
      this.platformType=this.$route.query.platformType||'';
      console.log(typeof this.relateApplicationId)
      this.$nextTick(()=>{
        this.$store.commit('pagination/setLimitPage',limitRecord);
        this.$store.commit('pagination/setClickPage',pageRecord);
        this.type=typeRecord+'';
        this.showPagination = true;//加载分页组件
        this.getList();
        this.getAppId();
        this.getLoad();
      })
      console.log(this.appPower,77)
    },
    updated() {
      if(this.$route.name=='applicationList'){
        this.$nextTick(()=>{
          this.tableHeight = window.innerHeight - this.$refs.arRef.$el.offsetTop - 110;
        })
      }
    }
  }
</script>

<style scoped>

</style>
