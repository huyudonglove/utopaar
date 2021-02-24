<template>
  <div>
    <div v-if="$route.name=='putCreate'">
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
           <div  v-if="isCreate" style="height:50px;border-bottom:1px solid #DFDCDC;">
            <span style="font-size:24px;font-weight:bold;color:#614a4d;">添加投放规则</span>
          </div>
          <div v-else style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:15px;">
            <span style="font-size:24px;font-weight:bold;color:#614a4d;">编辑投放规则</span>
          </div>
           <!-- 基础信息 -->
          <el-card class="box-card" style="margin-bottom:15px">
          <div slot="header" class="clearfix">
            <span>基础信息</span>
            <el-button style="float: left; padding: 2px 0;margin-top:5px;" type="text" class="downIcon"></el-button>
          </div>
          <div  class="text item">
           <el-form ref="formSize" :model="formSize" label-width="150px" :rules="rules">
            <el-form-item label="选择应用：" prop="backgroundAppId">
              <el-select v-model="formSize.backgroundAppId" placeholder="请选择" filterable @change="changePlayId">
                <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                clearable
                >
              </el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="投放时间：" required prop="startTime">
              <timeSwitch></timeSwitch>
            </el-form-item>
            <el-form-item :label="`投放位置${playId==12?'(手机端)':''}：`" required>
              <el-col :span="3">
                <el-form-item prop="positionX">
                  x：<el-input v-model="formSize.positionX" style="width:75%" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item prop="positionY">
                  y：<el-input v-model="formSize.positionY" style="width:75%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item prop="positionZ">
                  z：<el-input v-model="formSize.positionZ" style="width:75%"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item :label="`投放方向${playId==12?'(手机端)':''}：`" required>
              <el-col :span="3">
                <el-form-item prop="relationX">
                  α：<el-input v-model="formSize.relationX" style="width:75%" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item prop="relationY">
                  β：<el-input v-model="formSize.relationY" style="width:75%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item prop="relationZ">
                  γ：<el-input v-model="formSize.relationZ" style="width:75%" ></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="投放位置(眼镜端)：" v-if="playId==12" required>
              <el-col :span="3">
                <el-form-item prop="positionGlassX">
                  x：<el-input v-model="formSize.positionGlassX" style="width:75%" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item prop="positionGlassY">
                  y：<el-input v-model="formSize.positionGlassY" style="width:75%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item prop="positionGlassZ">
                  z：<el-input v-model="formSize.positionGlassZ" style="width:75%"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="投放方向(眼镜端)：" v-if="playId==12" required>
              <el-col :span="3">
                <el-form-item prop="relationGlassX">
                  α：<el-input v-model="formSize.relationGlassX" style="width:75%" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item prop="relationGlassY">
                  β：<el-input v-model="formSize.relationGlassY" style="width:75%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item prop="relationGlassZ">
                  γ：<el-input v-model="formSize.relationGlassZ" style="width:75%" ></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="使用状态：" prop="state">
               <el-radio v-model="formSize.state" label="1" @change="changeState('1')">启用</el-radio>
               <el-radio v-model="formSize.state" label="2" @change="changeState('2')">禁用</el-radio>
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
           <el-form ref="formSize2" :model="formSize" label-width="120px" :rules="rules">

      
            <el-form-item label="展示规则：" class="labeItem">
              <div>
                <el-radio v-model="formSize.chooseTime" label="2" @change="changeTime('2')">按时间段</el-radio>
                <el-radio v-model="formSize.chooseTime" label="1" @change="changeTime('1')">按天</el-radio>
                <el-button type="primary" v-if="!isCreate" style="float:right" @click="clearTime()">清空列表</el-button>
              </div>
              <div>
                <el-table  :data="tableData" ref="multipleTable" tooltip-effect="dark" style="width: 100%;position:relative;padding-bottom:56px;" v-if="formSize.chooseTime=='2'" :key="1">
                  <el-table-column prop="id" label="内容ID" width="120" align="center">
                  </el-table-column>
                  <el-table-column prop="name" label="内容名称"  align="center" v-if="!isBs" :key="74">
                  </el-table-column>
                  <el-table-column prop="identifyPhotoName" label="内容名称"  align="center" v-if="isBs" :key="76">
                  </el-table-column>
                  <el-table-column label="展示时间" width="" align="center" >
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
                      @change="smallTimeChange(scope.$index,scope.row,2)"
                      :clearable="false"
                      >
                    </el-time-picker>
                    </template>
                  </el-table-column>
                  <el-table-column prop="scope.row.state" label="状态" width="120" align="center"> 
                    <template slot-scope="scope">
                      <el-button type="text" v-if="scope.row.state==1" @click="activeAble(2,scope.$index,2)">启用</el-button>
                      <el-button type="text" v-if="scope.row.state==2" style="color:red" @click="activeAble(1,scope.$index,2)">禁用</el-button>
                    </template>
                  </el-table-column>
                   <el-table-column  label="操作" width="250" align="center">
                    <template slot-scope="scope">
                       <el-button type="primary"  @click="edit(scope.$index,scope.row)">编辑</el-button>
                       <el-button type="danger"  @click="del(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-table  :data="tableData" ref="multipleTable2" tooltip-effect="dark" style="width: 100%;position:relative;padding-bottom:56px;"  v-if="formSize.chooseTime=='1'" :key="2">
                  <el-table-column prop="id" label="内容ID" width="120" align="center">
                  </el-table-column>
                   <el-table-column prop="name" label="内容名称"  align="center" v-if="!isBs" :key="74">
                  </el-table-column>
                  <el-table-column prop="identifyPhotoName" label="内容名称"  align="center" v-if="isBs" :key="76">
                  </el-table-column>
                   <el-table-column  label="展示时间" width="" align="center" >
                    <template slot-scope="scope">
                      <el-date-picker
                        v-model="scope.row.smallTime"
                        type="daterange"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="smallTimeChange(scope.$index,scope.row,1)"
                        :clearable="false"
                        :default-time="['00:00:00', '23:59:59']"
                        >
                      </el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column prop="scope.row.state" label="状态" width="120" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" v-if="scope.row.state==1" @click="activeAble(2,scope.$index,scope.row,1)">启用</el-button>
                      <el-button type="text" v-if="scope.row.state==2" style="color:red" @click="activeAble(1,scope.$index,scope.row,1)">禁用</el-button>
                    </template>
                  </el-table-column>
                   <el-table-column  label="操作" width="250" align="center">
                    <template slot-scope="scope">
                       <el-button type="primary"  @click="edit(scope.$index,scope.row)">编辑</el-button>
                       <el-button type="danger"  @click="del(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div align="center" style="position:absolute;bottom:10px;background:#fff;left:50%;transform:translateX(-50%);width:100%">
                <el-button :disabled="!formSize.backgroundAppId" @click="addContent();" style="width:100%" >+添加</el-button>
              </div>
              </div>
            </el-form-item>
           </el-form>
          </div>
        </el-card>
         <div style="margin-top: 20px">
          <div style="width:165px;margin:0px auto">
            <el-button  type="primary" @click="submitForm('formSize')" v-if="isCreate">确认</el-button >
            <el-button v-else type="primary" @click="updateForm('formSize')" >确认</el-button>
            <el-button @click="goTo()">取消</el-button>
          </div>
        </div>
        <el-dialog  :visible.sync="dialogTableVisible" width="50%" tooltip-effect="dark">
           <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0" >
            <span><el-input v-model="wd" placeholder="请输入关键词" style="width: 30%"></el-input></span>
            <router-link tag="a" target="_blank" :to="playId==8?`/application/assetsList/equipPut/${playId}/${formSize.backgroundAppId}`:`/application/assetsList/content/${playId}/${formSize.backgroundAppId}`" :underline="false" class="a-button a-primary">添加新内容</router-link>
            <el-button type="info" icon="el-icon-refresh" @click="listData();"></el-button>
          </el-row>
          <el-table :data="gridData"  @selection-change="handleSelectionChange" border 
          ref="gridData"
          >
            <el-table-column
              type="selection"
              width="55"
              align="center"
              :selectable="(row)=>row.state !== 2"
              >
            </el-table-column>
            <el-table-column property="id" label="内容ID"  width="120" align="center"></el-table-column>
            <el-table-column prop="identifyPhotoCode" label="识别图编号" width="" align="center"    v-if="isBs">
            </el-table-column>
            <el-table-column prop="photoUrl" label="识别图图片" width="120" align="center"  v-if="isBs">
              <template slot-scope="scope">
                  <span style="cursor: pointer;" >
                    <img :src="scope.row.photoUrl?`${scope.row.photoUrl}`:null" alt=""  style="width:50px;height:50px" v-focus>
                  </span>
                </template>
            </el-table-column>
            <el-table-column prop="identifyPhotoName" label="识别图名称" width="" align="center" v-if="isBs"  :key="123">
            </el-table-column>
             <el-table-column prop="relatedShelveCode" label="关联货架" width="" align="center" v-if="isBs">
            </el-table-column>
            <el-table-column prop="identifyPhotoDesc" label="识别图描述" width="" align="center" v-if="isBs">
            </el-table-column> 
            <el-table-column prop="createTime" label="新增时间" width="" align="center" v-if="isBs">
            </el-table-column>
            <el-table-column property="state" label="状态"  width="120" align="center" v-if="!isBs">
              <template slot-scope="scope">
              <span v-if="scope.row.state==1">上架</span>
              <span v-if="scope.row.state==2" style="color:#FF644E">下架</span>
            </template>
            </el-table-column>
            <el-table-column property="name" label="内容名称" align="center" v-if="!isBs" :key="86">
            </el-table-column>
          </el-table>
          <div style="margin-top:15px;margin-bottom:15px">
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
          <div style="margin-top: 20px">
          <el-button  type="primary" @click="saveGrid()" >完成</el-button >
          <el-button @click="cancelGrid()">取消</el-button>
        </div>
        </el-dialog>
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
import {inputContentList,inputAppList,inputAdd,inputInfo,inputUpdate,putInTree} from "../../http/request";
export default {
  name: "putCreate",
  inject:['replace','reload'],
  data() {
    var checkPositonX = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('位置X不能为空'));
      }else if(!/^(\-|\+)?\d+(\.\d+)?$/.test(value)){
           callback(new Error('只能是正负数字和小数点'));
        }else {
          callback();
        }
    };
    var checkPositonY = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('位置Y不能为空'));
      }else if(!/^(\-|\+)?\d+(\.\d+)?$/.test(value)){
           callback(new Error('只能是正负数字和小数点'));
        }else {
          callback();
        }
    }
    var checkPositonZ = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('位置Z不能为空'));
      }else if(!/^(\-|\+)?\d+(\.\d+)?$/.test(value)){
           callback(new Error('只能是正负数字和小数点'));
        }else {
          callback();
        }
    }
    var checkRelationX = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('方向X不能为空'));
      }else if(!/^(\-|\+)?\d+(\.\d+)?$/.test(value)){
           callback(new Error('只能是正负数字和小数点'));
        }else {
          callback();
        }
    }
    var checkRelationY = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('方向Y不能为空'));
      }else if(!/^(\-|\+)?\d+(\.\d+)?$/.test(value)){
           callback(new Error('只能是正负数字和小数点'));
        }else {
          callback();
        }
    }
    var checkRelationZ = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('方向Z不能为空'));
      }else if(!/^(\-|\+)?\d+(\.\d+)?$/.test(value)){
           callback(new Error('只能是正负数字和小数点'));
        }else {
          callback();
        }
    }
    // 
    return {
    replaceObj:{},
    replaceObjCopy:{},
    isEdit:false,
    isEditIndex:0,
    treeData:[],
    props: {
        label: "name",
        children: 'children',
        value:'id',
    },
    isCreate:true,
    tableData:[],//
    gridData:[],//弹出框列表
    multipleSelection:[],//已选择数组
    dialogTableVisible:false,
    options: [],
    wd:'',
    carrierListState:1,
    formSize:{
      name:'',
      backgroundAppId:'',
      state:'2',
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
      assetId:'21',
      chooseTime:'2',
    },
    playId:1,
    show:'1',
    limit:20,
    page:1,
    total:0,
    startTimeArr:[],//开始时间数组
    endTimeArr:[],//结束时间数组
    allStartTime:[],//排序后的开始时间数组
    allEndTime:[],//排序后的结束时间数组
    idx:0,
    idxs:0,
    changeTimeFlag:true,
    expandedKeys:[],
    isBs:false,
    rules: {
          backgroundAppId: [
            { required: true, message: '请选择应用', trigger: 'change' }
          ],
          state: [
            { required: true, message: '请选择使用状态', trigger: 'blur' }
          ],
          positionX: [
            { required: true,validator: checkPositonX,trigger: 'blur'},
          ],
          positionY: [
            { required: true,validator: checkPositonY,trigger: 'blur' }
          ],
          positionZ: [
            { required: true,validator: checkPositonZ,trigger: 'blur' }
          ],
          relationX: [
            { required: true,validator: checkRelationX,trigger: 'blur' }
          ],
          relationY: [
            { required: true,validator: checkRelationY,trigger: 'blur' }
          ],
          relationZ: [
            { required: true,validator: checkRelationZ,trigger: 'blur' }
          ],
          positionGlassX: [
            { required: true,validator: checkPositonX,trigger: 'blur'},
          ],
          positionGlassY: [
            { required: true,validator: checkPositonY,trigger: 'blur' }
          ],
          positionGlassZ: [
            { required: true,validator: checkPositonZ,trigger: 'blur' }
          ],
          relationGlassX: [
            { required: true,validator: checkRelationX,trigger: 'blur' }
          ],
          relationGlassY: [
            { required: true,validator: checkRelationY,trigger: 'blur' }
          ],
          relationGlassZ: [
            { required: true,validator: checkRelationZ,trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: '请投放选择时间', trigger: 'change' }
          ],
          // endTime: [
          //   { required: true, message: '请投放选择时间', trigger: 'change' }
          // ],
        }, 
      rowIndex:0
    };
  },
  async created(){
    // console.log(this.$route.query.msg)
     inputAppList({}).then(res=>{
      this.options=res.data
       if(this.$route.query.id){
      this.isCreate=false
      this.formSize.relationId=this.$route.query.id
      inputInfo({id:this.$route.query.id}).then(res=>{
      let currentRow={...res.data,relationCarrierList:res.data.relationCarrierList.map(v=>{v.smallTime=[];v.st=v.startTime;
        v.et=v.endTime; return v})}
      this.formSize = Object.assign(this.formSize, currentRow);
      this.formSize.state=JSON.stringify(this.formSize.state)
      this.tableData=this.formSize.relationCarrierList;
      if(this.options){
        this.playId = this.options.find(v=>v.id==this.formSize.backgroundAppId)?this.options.find(v=>v.id==this.formSize.backgroundAppId).playId:1
      }
      if(this.options.length){
         this.isBs=this.options.filter(v=>v.id==this.formSize.backgroundAppId)[0].playId==7?true:false

      }
      
      this.tableData=this.tableData.map((v,index)=>{
        if(!v.state){
          v.state=1
        }
        if(this.isBs){
          v.identifyPhotoName=v.name
        }
        v.smallTime=[v.startTime,v.endTime]
        v.id=v.carrierId
        return v
      })
      this.tableData.length?this.formSize.chooseTime=JSON.stringify(this.tableData[0].timeType):this.formSize.chooseTime='2'
      
      this.$store.commit('timeSwitch/setValue',[this.formSize.startTime,this.formSize.endTime])
      this.isHasRepeatTime(this.tableData,null,this.tableData[0].timeType)
    })
    
    }else{
      this.$store.commit('timeSwitch/setValue',[])
    }
    })
    await this.treeDataTable();
    if(this.$route.query.id){
      this.expandedKeys=[JSON.parse(this.$route.query.msg).assetId]
      this.$nextTick(() => {
        this.$refs.tree2.setCurrentKey(JSON.parse(this.$route.query.msg).assetId); // tree 元素的ref   value 绑定的node-key
});
    }else{
      this.expandedKeys=[parseInt(this.$route.query.assetId)]
      this.$nextTick(() => {
        this.$refs.tree2.setCurrentKey(parseInt(this.$route.query.assetId)); // tree 元素的ref   value 绑定的node-key
});
    }
    this.formSize.assetId=this.$route.query.assetId
    this.getUserPower();

	},

  computed:{
    ...mapState('singleTime',{time:'endTime'}),
    ...mapState('timeSwitch',{timeScope:'value'}),
   	 menus(){
	 	 return this.$route.name=='putCreate'?[]:this.$store.state.navMenu.menus2
   },
   chooseTime(){
     return this.formSize.chooseTime
   },
   appName(){
     return this.formSize.name
   },
   allParams(){
     return{
       page:this.page,
       limit:this.limit,
       appId:this.formSize.backgroundAppId,
       name:this.wd
     }
   },
   backgroundAppId(){
     return this.formSize.backgroundAppId
   },
  },
  methods: {
    ...mapActions('currentUserPower',['getUserPower']),
    handleSelectionChange(val) {
        if(!this.isEdit){
          this.multipleSelection = val;
        }else{
          if(val.length>1){
              this.$refs.gridData.toggleRowSelection(val[0],false);
              this.replaceObjCopy=val.splice(0,1)[0]
            }else{
              this.replaceObjCopy=val[0]
            }
        }
       
      },
    //请求列表数据
    listData(){
      inputContentList(this.allParams).then(res=>{
        if(res.data.items.length){
          this.gridData=res.data.items.map(v=>{
             if(!v.state){
              v.state=1
            }
           return v
          })
        }else{
          this.gridData=[]
        }
        this.total= res.data.total;
      });
    },
    handleSizeChange(value){
      this.limit = value;
    },
    handleCurrentChange(value){
      this.page = value;
    },
    cancelGrid(){
      this.dialogTableVisible=false
    },
    saveGrid(){
      this.dialogTableVisible=false;
      if(this.isEdit){
       if(this.isBs){
        this.replaceObj.identifyPhotoName=this.replaceObjCopy.identifyPhotoName;
        this.replaceObj.id=this.replaceObjCopy.id;
        this.replaceObj.carrierId=this.replaceObjCopy.id;
        this.replaceObj.startTime=this.replaceObj.effectFrom
        this.replaceObj.endTime=this.replaceObj.effectTo
        this.replaceObj.timeType=parseInt(this.formSize.chooseTime)
        this.tableData.splice(this.isEditIndex,1,this.replaceObj)
        this.formSize.relationCarrierList.splice(this.isEditIndex,1,this.replaceObj)
        console.log(this.tableData)
       }else{
        this.replaceObj.name=this.replaceObjCopy.name;
        this.replaceObj.id=this.replaceObjCopy.id;
        this.replaceObj.carrierId=this.replaceObjCopy.id;
        this.replaceObj.startTime=this.replaceObj.effectFrom
        this.replaceObj.endTime=this.replaceObj.effectTo
        this.replaceObj.timeType=parseInt(this.formSize.chooseTime)
        this.tableData.splice(this.isEditIndex,1,this.replaceObj)
        this.formSize.relationCarrierList.splice(this.isEditIndex,1,this.replaceObj)
        console.log(this.tableData)
       }
      }else{
      this.tableData=this.tableData.concat(this.multipleSelection)
      this.multipleSelection.forEach(v=>{v.effectFrom ='';v.effectTo='';this.formSize.relationCarrierList.push({carrierId:'',startTime:'',endTime:'',state:1,timeType:parseInt(this.formSize.chooseTime)})})
      }
      
    },
    smallTimeChange(index,row,type){
      console.log(row,'row')
      this.tableData[index].effectFrom =this.tableData[index].smallTime[0];
      this.tableData[index].effectTo =this.tableData[index].smallTime[1];
      this.formSize.relationCarrierList.splice(index,1,{carrierId:row.id,startTime:row.effectFrom,endTime:row.effectTo,timeType:parseInt(this.formSize.chooseTime),state:row.state})
      if(!this.isHasRepeatTime(this.tableData,index,type)){
      let idx=this.allEndTime.indexOf(this.endTimeArr[this.rowIndex])
      let indx=this.allStartTime.indexOf(this.startTimeArr[this.rowIndex])
      this.allStartTime.splice(indx,1)
      this.allEndTime.splice(idx,1)
      this.startTimeArr.splice(this.startTimeArr.length-1,1)
      this.endTimeArr.splice(this.endTimeArr.length-1,1)
      this.tableData[index].effectFrom ="";
      this.tableData[index].effectTo ="";
      this.tableData[index].smallTime=null;
      this.formSize.relationCarrierList.splice(index,1,{carrierId:'',startTime:'',endTime:'',timeType:parseInt(this.formSize.chooseTime),state:row.state})
      
      }
      
    },
    //选择应用
    changePlayId(){
      this.formSize.name=''
      this.formSize.state='2'
      this.formSize.startTime=''
      this.formSize.endTime='';
      this.formSize.positionX='';
      this.formSize.positionY='';
      this.formSize.positionZ='';
      this.formSize.relationX='';
      this.formSize.relationY='';
      this.formSize.relationZ='';
      this.formSize.positionGlassX='';
      this.formSize.positionGlassY='';
      this.formSize.positionGlassZ='';
      this.formSize.relationGlassX='';
      this.formSize.relationGlassY='';
      this.formSize.relationGlassZ='';
      this.formSize.relationCarrierList=[];
      this.formSize.chooseTime='2';
      this.tableData=[];
      this.$store.commit('timeSwitch/setValue',[])
      this.isBs=this.options.filter(v=>v.id==this.formSize.backgroundAppId)[0].playId==7?true:false
      let arr=this.options.filter(v=>v.id==this.formSize.backgroundAppId)
      
      if(arr.length){
      this.formSize.name=arr[0].name
      this.playId=arr[0].playId
      }
      this.startTimeArr=[];//开始时间数组
      this.endTimeArr=[];//结束时间数组
      this.allStartTime=[];//排序后的开始时间数组
      this.allEndTime=[];//排序后的结束时间数组
    },
    del(index){
      let idxS=0;
      let idxE=0;
      let indexS=0;
      let indexE=0;
      // if(!this.tableData[index].effectFrom){idxS=this.startTimeArr.indexOf(new Date(this.tableData[index].et).getTime())};
      // if(!this.tableData[index].effectTo){idxE=this.endTimeArr.indexOf(new Date(this.tableData[index].st).getTime())};
      if(this.tableData[index].effectFrom){
        idxS=this.startTimeArr.indexOf(new Date(this.tableData[index].effectFrom).getTime()); 
        indexS=this.allStartTime.indexOf(new Date(this.tableData[index].effectFrom).getTime())
        this.startTimeArr.splice(idxS,1)
        this.allStartTime.splice(indexS,1)
      };
      if(this.tableData[index].effectTo){
        idxE=this.endTimeArr.indexOf(new Date(this.tableData[index].effectTo).getTime())
        indexE=this.allEndTime.indexOf(new Date(this.tableData[index].effectTo).getTime())
        this.endTimeArr.splice(idxE,1)
        this.allEndTime.splice(indexE,1)
        };
      this.tableData.splice(index,1)
      this.formSize.relationCarrierList.splice(index,1)

      
    },
    //返回
    goTo(){
      this.$router.push({path:'/putManage/putList',query:JSON.parse(this.$route.query.msg)})
      this.reload();
    },
    //判断是否有空时间控件
    isTimeEmpty(){
      let isTime=this.formSize.relationCarrierList.filter(v=>v.carrierId ==''||v.effectFrom =='')
        return isTime.length>0
    },
    //保存
     submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid&&this.formSize.relationCarrierList.length&&!this.isTimeEmpty()) {
            inputAdd(this.formSize).then(res=>{
              res.code?this.$message.error(res.msg):this.goTo()
              this.reload()
            })
          }else if(!this.formSize.relationCarrierList.length){
            this.$message.error('请至少选择一个内容计划');
          }else if(this.isTimeEmpty()){
            this.$message.error('有计划时间未填写');
          }
        });
      },
    // updateForm
    updateForm(formName) {
        // console.log(this.isTimeEmpty(),'jiance')
        this.$refs[formName].validate((valid) => {
          if (valid&&this.formSize.relationCarrierList.length&&!this.isTimeEmpty()) {
            inputUpdate(this.formSize).then(res=>{
            res.code?this.$message.error(res.msg):this.goTo()
            this.reload()
            })
          }else if(!this.formSize.relationCarrierList.length){
            this.$message.error('请至少选择一个内容计划');
          }else if(this.isTimeEmpty()){
            this.$message.error('有计划时间未填写');
          }
        });
      },
    //   // 启动状态 判断是否时间是否在已全部启动时间内
    // dealDisabledDate (time) {
    //   // time.getTime是把选中的时间转化成自1970年1月1日 00:00:00 UTC到当前时间的毫秒数
    //   // return的值,true是不可以操作选择,false可以操作选择
    //   return time.getTime() < this.allStartTime[0]||time.getTime()> this.allEndTime[0]
    // },
      activeAble(num,index,row,type){
        // console.log(this.tableData[index])
        if(!this.tableData[index].effectFrom){
            this.$message.error('请先选择时间,再操作');
           }
        else if(num==1){
          if(!this.checkTime(index,type)){
            let indx=this.allStartTime.indexOf(this.startTimeArr[this.rowIndex])
            this.allStartTime.splice(indx,1)
            // this.allStartTime.splice(this.idxs,1)
            let idx=this.allEndTime.indexOf(this.endTimeArr[this.rowIndex])
            this.allEndTime.splice(idx,1)
            this.startTimeArr.splice(this.startTimeArr.length-1,1)
            this.endTimeArr.splice(this.endTimeArr.length-1,1)
            return false;
          }
         this.tableData[index].state =1;
         this.formSize.relationCarrierList[index].state=1
        }else if(num==2){
          let idxS=0;
          let idxE=0;
          let indexS=0;
          let indexE=0;
          if(this.tableData[index].effectFrom){idxS=this.startTimeArr.indexOf(new Date(this.tableData[index].effectFrom).getTime())};
          if(this.tableData[index].effectTo){idxE=this.endTimeArr.indexOf(new Date(this.tableData[index].effectTo).getTime())};
          if(this.tableData[index].effectFrom){indexS=this.allStartTime.indexOf(new Date(this.tableData[index].effectFrom).getTime())};
          if(this.tableData[index].effectTo){indexE=this.allEndTime.indexOf(new Date(this.tableData[index].effectTo).getTime())};
        // console.log(idxS,'idxS',idxE,'idxE',indexS,'indexS',indexE,'indexE')
          this.startTimeArr.splice(idxS,1)
          this.endTimeArr.splice(idxE,1)
          this.allStartTime.splice(indexS,1)
          this.allEndTime.splice(indexE,1)
          this.tableData[index].state =2;
          this.formSize.relationCarrierList[index].state=2
        }
      },

      checkTime(index,type){
        index?this.rowIndex=index:this.rowIndex=0
        var activeStart=[];
        var activeEnd=[];
        activeStart=this.startTimeArr;
        activeEnd=this.endTimeArr;
        if(type==1){
        if(!this.tableData[index].effectFrom){activeStart.push(new Date(this.tableData[index].st).getTime())};
        if(!this.tableData[index].effectTo){activeEnd.push(new Date(this.tableData[index].et).getTime())};
        if(this.tableData[index].effectFrom){activeStart.push(new Date(this.tableData[index].effectFrom).getTime())};
        if(this.tableData[index].effectTo){activeEnd.push(new Date(this.tableData[index].effectTo).getTime())};
        }else if(type ==2 ){
        if(!item.effectFrom){item.effectFrom=item.st;};
        if(!item.effectTo){item.effectTo=item.et;}
        // console.log(data,'data')
        if(item.effectFrom){
        let time=/\d{2}:\d{2}:\d{2}/g.exec(item.effectFrom)[0]
        let hour = time.split(':')[0]
        let min = time.split(':')[1]
        let sec = time.split(':')[2]
        var s = Number(hour * 3600) + Number(min * 60) + Number(sec)
        }
        if(item.effectTo){
        // console.log(item.effectTo,'item.effectTo')
        let time2=/\d{2}:\d{2}:\d{2}/g.exec(item.effectTo)[0]
        let hour2 = time2.split(':')[0]
        let min2 = time2.split(':')[1]
        let sec2 = time2.split(':')[2]
        var s2 = Number(hour2 * 3600) + Number(min2 * 60) + Number(sec2)
        }
        if(item.effectFrom&&item.state==1){startTimeArr.push(s)};
        if(item.effectTo&&item.state==1){endTimeArr.push(s2)};
          }
        
          this.allStartTime = JSON.parse(JSON.stringify(this.startTimeArr)).sort();
          this.allEndTime = JSON.parse(JSON.stringify(this.endTimeArr)).sort();
          // console.log(this.allStartTime)
            for(let i=1;i<this.allStartTime.length;i++){
              if (this.allStartTime[i] <= this.allEndTime[i-1]){
                  this.$message.error('时间有重叠,请重新选择时间,再启动');
                  // this.idxs=i;
                  return false;  
              }
            }
            return true;
        },
        //判断一些时间范围是否有重复时间段 返回false则这段时间范围有重叠部分，返回true则没有重叠。
      
      isHasRepeatTime(data,index,type) {
        // console.log(data,'111',type)
        index?this.rowIndex=index:this.rowIndex=0
        var startTimeArr=[];
        var endTimeArr=[];
        (data || []).map((item,index)=>{
      if(type==1){
        if(!item.effectFrom){item.effectFrom=item.st;};
        if(!item.effectTo){item.effectTo=item.et;} 
        if(item.effectFrom&&item.state==1){startTimeArr.push(new Date(item.effectFrom).getTime())};
        if(item.effectTo&&item.state==1){endTimeArr.push(new Date(item.effectTo).getTime())};
      }else if(type==2){
        if(!item.effectFrom){item.effectFrom=item.st;};
        if(!item.effectTo){item.effectTo=item.et;}
        // console.log(data,'data')
        if(item.effectFrom){
        let time=/\d{2}:\d{2}:\d{2}/g.exec(item.effectFrom)[0]
        let hour = time.split(':')[0]
        let min = time.split(':')[1]
        let sec = time.split(':')[2]
        var s = Number(hour * 3600) + Number(min * 60) + Number(sec)
        }
        if(item.effectTo){
        // console.log(item.effectTo,'item.effectTo')
        let time2=/\d{2}:\d{2}:\d{2}/g.exec(item.effectTo)[0]
        let hour2 = time2.split(':')[0]
        let min2 = time2.split(':')[1]
        let sec2 = time2.split(':')[2]
        var s2 = Number(hour2 * 3600) + Number(min2 * 60) + Number(sec2)
        }
        if(item.effectFrom&&item.state==1){startTimeArr.push(s)};
        if(item.effectTo&&item.state==1){endTimeArr.push(s2)};
      }
    });
    this.startTimeArr=startTimeArr
    this.endTimeArr=endTimeArr
    
    if(type==1){
      this.allStartTime = JSON.parse(JSON.stringify(this.startTimeArr)).sort();
      this.allEndTime = JSON.parse(JSON.stringify(this.endTimeArr)).sort();
    }
    
    if(type==2){
      this.allStartTime = this.startTimeArr.sort(function(a, b){return a - b});
      this.allEndTime =this.endTimeArr.sort(function(a, b){return a - b});
    }
    // console.log(this.allStartTime,this.allEndTime,'this.allEndTime')
    for(let i=1;i<this.allStartTime.length;i++){
                if (this.allStartTime[i] <= this.allEndTime[i-1]){
                    this.$message.error('时间有重叠,请重新选择');
                    // this.idx=i;
                    return false;
                }
            }
            // console.log("时间没有重复！");
            return true;
},

changeTime(data){
  console.log(111,222)
  if(data == this.formSize.chooseTime&&this.tableData.filter(v=>v.smallTime&&v.smallTime.length).length){
      this.$confirm('切换展示规则将清空所有时间设置, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.formSize.relationCarrierList=this.formSize.relationCarrierList.map(v=>{v.endTime='';v.startTime='';v.carrierId='';return v})
          this.tableData=this.tableData.map((v,index)=>{
            if(this.formSize.chooseTime=='1'){
             v.smallTime=[]
            }else{
             v.smallTime=null
            }
            v.startTime=''
            v.endTime='';
            v.effectFrom='';
            v.effectTo='';
            v.st='';
            v.et='';
            this. startTimeArr=[];//开始时间数组
            this.endTimeArr=[];//结束时间数组
            this.allStartTime=[];//排序后的开始时间数组
            this.allEndTime=[];//排序后的结束时间数组
            return v;
          })
   
        }).catch(() => {
            if(this.formSize.chooseTime=='1'){
              this.formSize.chooseTime='2'
            }else{
              this.formSize.chooseTime='1'
            }
        });
  }
},
clearTime(){
  this.$confirm('将会清空所有内容计划列表, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.formSize.relationCarrierList=[];
          this.tableData=[]
          this. startTimeArr=[];//开始时间数组
          this.endTimeArr=[];//结束时间数组
          this.allStartTime=[];//排序后的开始时间数组
          this.allEndTime=[];//排序后的结束时间数组
        }).catch(() => {
        });
},
addContent(){
  this.listData()
  this.dialogTableVisible = true;
  this.isEdit=false;
  this.$nextTick(()=>{
    document.getElementsByClassName('el-table__header-wrapper')[1].getElementsByClassName('el-checkbox')[0].style.display='block'
  })
},
changeState(data){
  // console.log(data,'data')
  // let isHasState=this.$route.query.ableLength
  // if(isHasState&&data=='1'){
  //   this.$message.error('不能启动，只能有一条启动数据');
  //   this.formSize.state='2'
  // }else{
  //   this.formSize.state='1'
  // }
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
  edit(index,row){
    this.isEdit=true;
    if(this.isEdit){
    this.listData();
    this.dialogTableVisible = true;
    this.$nextTick(()=>{
      document.getElementsByClassName('el-table__header-wrapper')[1].getElementsByClassName('el-checkbox')[0].style.display='none'
    })
    this.isEditIndex=index
    this.replaceObj=row
    console.log(this.replaceObj,'edit this.replaceObj')
    }else{

    }
  }
  },
   watch: {
    page(){
		  this.listData()
    },
    limit(){
      this.listData()
    },
    wd(){
      console.log(this.wd,'wd')
      this.page=1;
      this.listData()
    },
    chooseTime(){
        
    },
    timeScope(){
      this.formSize.startTime=this.timeScope[0]
      this.formSize.endTime=this.timeScope[1]
      
    },
    backgroundAppId(){
     
    }
    },
   components: {
    navMenu,
    headNav,
    timeSwitch,
    singleTime
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
  .el-table__header-wrapper  .el-checkbox{
    /* display:none */
  }
  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color:rgb(228, 242, 255);
    
}
</style>
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
.transparent_class{   
    filter:alpha(opacity=0);   
    -moz-opacity:0;   
    -khtml-opacity: 0;   
    opacity: 0;   
    position:absolute;z-index:999;width:300px;height: 100%;top: 5px;left:55px
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

.labeItem:before {
    /* content: '*';
    color: #F56C6C;
    margin-right: 4px;
    position: absolute;
    z-index: 99;
    left: 68px;
    top:590px */
}

</style>
