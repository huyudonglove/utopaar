<template>
  <div>
    <div v-if="$route.name=='putInfo'">
      <headNav></headNav>
      <div class="pa_body">
          <div class="body-menu">
          <el-row class="tac">
            <el-col :span="24" >
               <div style="position:relative;background:#0074E4FF;top:2px;height:2px;width:55px;left:-55px;"></div>
            <div style="padding:15px 5px 10px 5px;" class="showTreeDiv">
                <el-tree
                :data="treeData"
                :props="props"
                accordion
                ref="tree2"
                node-key="id"
                :expand-on-click-node="false"
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
           <div  class="transparent_class"></div>
      </div>
          <div class="body-content">
        <el-main>
           <div style="height:50px;border-bottom:1px solid #DFDCDC;">
            <span style="font-size:24px;font-weight:bold;color:#614a4d;">详情投放</span>
          </div>
           <!-- 基础信息 -->
          <el-card class="box-card" style="margin-bottom:15px">
          <div slot="header" class="clearfix">
            <span>基础信息</span>
            <el-button style="float: left; padding: 2px 0;margin-top:5px;" type="text" class="downIcon"></el-button>
          </div>
          <div  class="text item">
           <el-form ref="formSize" :model="formSize" label-width="120px" >
            <el-form-item label="选择应用：">
              {{formSize.name}}
            </el-form-item>
            <el-form-item label="投放时间：">
              <el-date-picker
              v-model="timeScope"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :disabled="true"
              >
            </el-date-picker>
            </el-form-item>
            <el-form-item :label="`投放位置${playId==12?'(手机端)':''}：`">
              x：{{formSize.positionX}},
              y：{{formSize.positionY}},
              z：{{formSize.positionZ}}
            </el-form-item>
            <el-form-item :label="`投放方向${playId==12?'(手机端)':''}：`">
              x：{{formSize.relationX}},
              y：{{formSize.relationY}},
              z：{{formSize.relationZ}}
            </el-form-item>
            <el-form-item label="投放位置(眼镜端)：" v-if="playId==12">
              x：{{formSize.positionGlassX}},
              y：{{formSize.positionGlassY}},
              z：{{formSize.positionGlassZ}}
            </el-form-item>
            <el-form-item label="投放方向(眼镜端)：" v-if="playId==12">
              x：{{formSize.relationGlassX}},
              y：{{formSize.relationGlassY}},
              z：{{formSize.relationGlassZ}}
            </el-form-item>
            <el-form-item label="使用状态：">
               <el-radio v-model="formSize.state" label="1" :disabled="formSize.state==2">启用</el-radio>
               <el-radio v-model="formSize.state" label="2" :disabled="formSize.state==1">禁用</el-radio>
            </el-form-item>
           </el-form>
          </div>
        </el-card>
        <!-- 内容计划 -->
          <el-card class="box-card" style="margin-bottom:15px">
          <div slot="header" class="clearfix">
            <span>内容计划</span>
            <el-button style="float: left; padding: 2px 0;margin-top:5px;" type="text" class="downIcon"></el-button>
          </div>
          <div  class="text item">
           <el-form ref="formSize" :model="formSize" label-width="120px">
            <el-form-item label="展示规则：">
              <div>
                <el-radio v-model="chooseTime" label="2" :disabled="chooseTime==1">按时间段</el-radio>
                <el-radio v-model="chooseTime" label="1" :disabled="chooseTime==2">按天</el-radio>
              </div>
              <div>
                <el-table  :data="tableData" ref="multipleTable" tooltip-effect="dark" style="width: 100%;position:relative;padding-bottom:56px;" :key='1'>
                  <el-table-column prop="id" label="内容ID" width="120" align="center">
                  </el-table-column>
                  <el-table-column prop="name" label="内容名称"  align="center">
                  </el-table-column>
                  <el-table-column  label="展示时间" width="" align="center" v-if="chooseTime==2">
                    <template slot-scope="scope">
                      <el-time-picker 
                      is-range
                      v-model="scope.row.smallTime"
                      range-separator="至"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      placeholder="选择时间范围"
                      format="HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :disabled="true"
                      >
                    </el-time-picker>
                    </template>
                  </el-table-column>
                   <el-table-column  label="展示时间" width="" align="center" v-if="chooseTime==1">
                    <template slot-scope="scope">
                      <el-date-picker
                        v-model="scope.row.smallTime"
                        type="daterange"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :disabled="true"
                        >
                      </el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column prop="state" label="状态" width="120" align="center">
                    <template slot-scope="scope">
                      <span v-if="scope.row.state==1">启用</span>
                      <span v-if="scope.row.state==2" style="color:#FF644E">禁用</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
           </el-form>
          </div>
        </el-card>
        <div style="margin-top: 20px">
          <el-button @click="goTo()">返回</el-button>
        </div>
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
import {inputInfo,putInTree} from "../../http/request";
export default {
  name: "putInfo",
  inject:['replace','reload'],
  data() {
    return {
    treeData:[],
    props: {
        label: "name",
        children: 'children',
        value:'id',
    },
    expandedKeys:[],
    isCreate:true,
    tableData:[],//
    gridData:[],//弹出框列表
    multipleSelection:[],//已选择数组
    dialogTableVisible:false,
    options: [],
    wd:'',
    formSize:{
      name:'',
      backgroundAppId:'',
      state:'1',
      startTime:'',
      endTime:'',
      positionX:'',
      positionY:'',
      positionZ:'',
      relationX:'',
      relationY:'',
      relationZ:'',
      positionGlassX:'',
      positionGlassY:'',
      positionGlassZ:'',
      relationGlassX:'',
      relationGlassY:'',
      relationGlassZ:'',
      relationCarrierList:[
      ],
      assetId:'21'
    },
    chooseTime:'2',
    smallTime:[],//时间段
    limit:20,
    page:1,
    total:0,
    timeScope:[],
    playId:1
    };
  },
 async created(){
    inputInfo({id:this.$route.query.id}).then(res=>{
      let currentRow=res.data
      this.formSize = Object.assign(this.formSize, currentRow);
      this.formSize.state=JSON.stringify(this.formSize.state)
      this.tableData=this.formSize.relationCarrierList
      this.tableData.forEach((v,index)=>{
        v.smallTime=[v.startTime,v.endTime]
        v.id=v.carrierId
      })
      this.chooseTime=JSON.stringify(this.tableData[0].timeType)
      this.timeScope=[this.formSize.startTime,this.formSize.endTime]
    })
   this.getUserPower();
  await this.treeDataTable();
    
    this.$nextTick(() => {
        console.log(JSON.parse(this.$route.query.msg),'JSON.parse(this.$route.query.msg)')
        this.expandedKeys=[JSON.parse(this.$route.query.msg).assetId]
        this.$refs.tree2.setCurrentKey(JSON.parse(this.$route.query.msg).assetId); // tree 元素的ref   value 绑定的node-key
})
	},

  computed:{
   	 menus(){
     return this.$route.name=='putInfo'?[]:this.$store.state.navMenu.menus2
   },
   allParams(){
     return{
       page:this.page,
       limit:this.limit,
       name:this.wd
     }
   }
   
  },
  methods: {
    ...mapActions('currentUserPower',['getUserPower']),
    handleSelectionChange(val) {
        this.multipleSelection = val;
      },
    //返回
    goTo(){
      this.$router.push({path:'/putManage/putList',query:JSON.parse(this.$route.query.msg)})
      this.reload()
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
    },
   components: {
    navMenu,
    headNav,
    timeSwitch,
    singleTime
  }
};
</script>
<style >
  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color:rgb(228, 242, 255);
    
}
</style>
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
.downIcon{
	width:0;
	height:0;
	border-right:12px solid transparent;
	border-left:12px solid transparent;
	border-top:12px solid #C0C4CC;
}
.upIcon{
	width:0;
  height:0;
	border-right:12px solid transparent;
	border-left:12px solid transparent;
	border-bottom:12px solid #C0C4CC;
}
a.a-primary {
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
}
.a-button {
    text-decoration: none;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #FFF;
    border: 1px solid #DCDFE6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
}
.transparent_class{   
    filter:alpha(opacity=0);   
    -moz-opacity:0;   
    -khtml-opacity: 0;   
    opacity: 0;   
    position:absolute;z-index:999;width:300px;height: 100%;top: 5px;left:55px
  }
</style>
