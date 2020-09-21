<template>
  <div v-if="putInPower.length">
    <div v-if="$route.name=='putList'">
      <headNav></headNav>
      <div class="pa_body">
          <div class="body-menu"  >
          
          <el-row class="tac">
            <el-col :span="24" style="border-top:1px solid #eee">
            <div style="position:relative;background:#0074E4FF;top:2px;height:2px;width:55px;left:-55px;"></div>
            <div style="padding:15px 5px 10px 5px;">
                <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
              </el-input>
                <el-tree
                :data="treeData"
                :props="props"
                accordion
                :filter-node-method="filterNode"
                @node-click="handleNodeClick"
                ref="tree"
                node-key="id"
                :default-expanded-keys="expandedKeys"
                :highlight-current="true"
                >
                <span class="span-ellipsis" slot-scope="{ node, data }">
                <span :title="node.label">{{ node.label }}</span>
              </span>
              </el-tree>
            </div>
            </el-col>
          </el-row>
      </div>
          <div class="body-content">
        <el-main>
          <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px">
          <span style="font-size:24px;font-weight:bold;color:#614a4d;">投放列表</span>
           <el-button type="primary" style="float:right"  @click="$router.push({path:'/putManage/putList/putCreate',query:{assetId:assetId,msg:JSON.stringify($route.query)}})" :disabled="ableShow||!putInPower[0].isCheck">添加投放</el-button>
        </div>
        <el-row class="tac" >
          <span>应用名称：<el-input v-model="wd" style="width: 15%" suffix-icon="el-icon-search" maxlength="50" placeholder="输入关键字"></el-input></span>
          <span> 投放ID：<el-input v-model="q" placeholder="请输入投放ID"  suffix-icon="el-icon-search" maxlength="50" style="width: 15%" @input="q=q.replace(/[^\d]/g,'')"></el-input></span>
          
          <span> 投放状态：
            <el-select v-model="timeState" placeholder="请选择">
                <el-option label="全部" value></el-option>
                <el-option label="未投放" value="1"></el-option>
                <el-option label="投放中" value="2"></el-option>
                <el-option label="结束" value="2"></el-option>
              </el-select>
            </span>
          <span>投放时间：<singleTime></singleTime></span>
        </el-row>
        <el-row style="border-bottom:1px solid #eeeeee; padding:15px 0"  class="tac">
          <span>创建时间：
            <el-date-picker
              v-model="timeScope"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss" 
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </span>
          
          <span>使用状态：
              <el-select v-model="state" placeholder="请选择">
                <el-option label="全部" value></el-option>
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="2"></el-option>
              </el-select>
          </span>
          <span>
            <el-button type="primary">搜索</el-button>
            <el-button type="info" @click="reset()">重置</el-button>
          </span>
        </el-row>
       
        <el-table  :data="tableData" ref="multipleTable" tooltip-effect="dark" style="width: 100%" :max-height="tableHeight" :key="1" border>
           <el-table-column prop="id" label="投放ID" width="120" align="center">
          </el-table-column>
          <el-table-column prop="name" label="应用名称"  align="center">
          </el-table-column>
          <el-table-column  label="投放时间"  align="center">
             <template slot-scope="scope">
              <span>{{scope.row.startTime}}---{{scope.row.endTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="投放位置" width="150" align="center">
             <template slot-scope="scope">
              <span>x={{scope.row.positionX}},y={{scope.row.positionY}},z={{scope.row.positionZ}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="投放状态" width="120" align="center">
             <template slot-scope="scope">
              <span v-if="scope.row.timeState==1">未投放</span>
              <span v-if="scope.row.timeState==2">投放中</span>
              <span v-if="scope.row.timeState==3" style="color:#FF644E">结 束</span>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="使用状态" width="120" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.state==1">启用</span>
              <span v-if="scope.row.state==2" style="color:#FF644E">禁用</span>
            </template>
          </el-table-column>
          <el-table-column prop="backgroundAppState" label="应用状态" width="120" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.backgroundAppState==1">上架</span>
              <span v-if="scope.row.backgroundAppState==2" style="color:#FF644E">下架</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间"  width="160" align="center">
          </el-table-column>
          <el-table-column prop="id" label="操作" width="240" align="center">
            <template slot-scope="scope">
               <el-button
                type="success"
                size="mini"
                @click="$router.push({path:'/putManage/putList/putInfo',query:{id:scope.row.id,msg:JSON.stringify($route.query)}})"
              >查看</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="$router.push({path:'/putManage/putList/putCreate',query:{id:scope.row.id,ableLength:ableLength,msg:JSON.stringify($route.query)}})"
              :disabled="!putInPower[1].isCheck">编辑</el-button>
              <el-button
                type="danger"
                size="mini"
               :disabled="scope.row.status==2||!putInPower[3].isCheck"
               @click="del(scope.row.id)"
              >删除</el-button>
            </template>
          </el-table-column>

        </el-table>
        <div style="margin-top:15px"> <pagination v-if="showPagination" style="position:fixed;left:370px;bottom:10px;"></pagination></div>
        </el-main>
        </div>
      </div>

    </div>
    <router-view/>
  </div>

</template>

<script>
import navMenu from "@/share/navMenu.vue";
import headNav from "@/share/headNav.vue";
import {mapActions,mapState} from 'vuex';
import timeSwitch from '../../share/timeSwitch'
import singleTime from '../../share/singleTime'
import pagination from '../../share/pagination'
import {putInTree,inputDel,putInList} from "../../http/request";
export default {
  name: "putList",
  inject:['replace','reload'],
  data() {
    return {
      treeData:[],
      filterText:'',
      timeState:'',//投放状态
      state:'',//使用状态
      q:'',
      wd:'',
      assetId:'',
      props: {
        label: "name",
        children: 'children',
        value:'id',
    },
    tableData:[],
    ableLength:0,
    ableShow:true,
    showPagination:false,
    tableHeight:0,
    timeScope:[],
    expandedKeys:[37]
    };
  },
  async created(){
  // console.log(111,'created')
  let query=this.$route.query
  let pageRecord = query.page;//记录上一次页码操作
  let limitRecord = query.limit;//记录上一次limit操作
  this.wd=query.wd?query.wd:'';
  this.timeState=query.timeState||'',//投放状态
  this.state=query.state||'',//使用状态
  this.q=query.q||'',
  this.wd=query.wd||'',
  this.assetId=query.assetId||''
  this.filterText=query.filterText||''
  this.expandedKeys=[parseInt(query.assetId)]
  this.getUserPower();
  await this.treeDataTable();
    if(this.assetId){
      this.listData()
    }
    if(this.$route.query.startTime){
      this.timeScope=[this.$route.query.startTime,this.$route.query.endTime||'']
    }else{
      this.timeScope=[]
    }
    if(query.assetId&&this.ableLength==0){
      this.ableShow=false
    }
    this.$nextTick(()=>{
      this.$store.commit('pagination/setClickPage',pageRecord);
      this.$store.commit('pagination/setLimitPage',limitRecord);
      this.showPagination = true;//加载分页组件
      this.$refs.tree?this.$refs.tree.filter(this.filterText):null;
      // this.$refs.tree.filter(this.filterText);
     
    })
     if(this.$refs.tree){this.$refs.tree.setCurrentKey(parseInt(this.$route.query.assetId));} // tree 元素的ref   value 绑定的node-key 
  },
  mounted(){
   
  },
  computed:{
    ...mapState('singleTime',{time:'endTime'}),
    ...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
    ...mapState('currentUserPower',{putInPower:'putInPower'}),
   	 menus(){
	 	 return this.$store.state.navMenu.menus2
   },

  },
  methods: {
    ...mapActions('currentUserPower',['getUserPower']),
    handleNodeClick(data) {
      if(data.type==6){
        this.assetId=data.id
        this.expandedKeys=[this.assetId]
        this.ableShow=false
        // this.listData()
      }
      },
    filterNode(value, data) {
    if (!value) return true;
    return data.name.indexOf(value) !== -1;
  },
  //请求列表数据
    listData(){
      putInList({assetId:this.assetId,...this.$route.query}).then(res=>{
        this.tableData = res.data.items;
        this.ableLength=this.tableData.filter(v=>v.state==1).length
        this.$store.commit('pagination/setTotal', res.data.total);
      });
    },
  //重置筛选条件
    reset(){
    //修改路由参数
    let apple=JSON.stringify(this.$route.query);
    let banner=JSON.parse(apple);
    for(let i in banner){
          banner[i]=''
        }
    banner.assetId=this.assetId
    this.$router.push(
          {
            path:this.$route.path,
            query:banner
          }
        ).catch(err=>{
          console.log(err)
        })
      this.timeState='';
      this.state='';
      this.q='';
      this.wd='';
      this.$store.commit('timeSwitch/setValue', []);
    },
    del(id){
      inputDel({relationId:id}).then(res=>{
        this.reload()
      })
    },
    treeDataTable(){
      return new Promise((resolve,reject)=>{
        putInTree({}).then(res=>{
          if(res.code){
            this.$message.error(res.msg);
          }else{
            this.treeData=res.data;
          } 
          resolve();
        }).catch(err=>{
          reject(err);
        })
      })
    },
  },
   watch: {
      filterText(val) {
        this.replace('filterText',this.filterText);
        this.$refs.tree?this.$refs.tree.filter(val):null;
      },
      time(){
        this.$store.commit('pagination/setClickPage',1);
        this.replace('time',this.time);
      },
      page(){
      this.replace("page",this.page);
      },
      limit(){
        this.replace('limit',this.limit);
      },
      timeScope(){
        // console.log(111,'timeScope')
        this.$store.commit('pagination/setClickPage',1);
        if(this.timeScope !==null){
          this.replace('startTime',this.timeScope[0]);
          this.replace('endTime',this.timeScope[1]);
        }else{
          this.replace('startTime','');
          this.replace('endTime','');
        }
      },
      timeState(){
        this.$store.commit('pagination/setClickPage',1);
        this.replace('timeState',this.timeState);
      },
      assetId(){
        // console.log('assetId',this.assetId)
        this.$store.commit('pagination/setClickPage',1);
        this.replace('assetId',this.assetId);
      },
      state(){
        this.$store.commit('pagination/setClickPage',1);
        this.replace('state',this.state);
      },
      q(){
        this.$store.commit('pagination/setClickPage',1);
        this.replace('q',this.q);
      },
      wd(){
        this.$store.commit('pagination/setClickPage',1);
        this.replace('wd',this.wd);
      },
      $route(){//判断路由query变化执行请求
      if(this.$route.name=='putList'&&this.assetId){
        this.listData();
      }
    }
    },
    updated(){
    if(this.$route.name=='putList'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 110;
      })
    }
  },
   components: {
    navMenu,
    headNav,
    timeSwitch,
    singleTime,
    pagination
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-main{
    padding-top: 10px;
  }
  .pa_body .body-menu{
  position:absolute;
  top:60px;
  left:0;
  bottom:0;
  width:300px;
  padding-left:55px;
  /*background-color:#545c64;*/
  background: url("../../assets/menu-bg.jpg") repeat-y ;
      }
  .pa_body .body-content{
  position:absolute;
  top:66px;
  left:355px;
  right:0;
  background-color:#fff;
  bottom:0;
  overflow:auto;
  border-left: 1px solid #eeeeee;
  }
.cur{ cursor: pointer;}
.tac span {
  font-size:14px;
  color:#606266;
  padding-left: 5px;
  padding-right: 10px;
}
.span-ellipsis {
  width:100%;
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
}
</style>
