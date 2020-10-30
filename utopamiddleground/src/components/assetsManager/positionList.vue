<template>
  <div v-if="positionPower.length">
    <el-card class="box-card"  style="margin-bottom:10px;">
      <div slot="header" class="clearfix">
        <span style="font-size:20px;">查询条件</span>
      </div>
      <el-row class="tac">
        <span class="myWords">省
          <el-select v-model="provinceValue" placeholder="请选择" style="padding-bottom:15px;">
            <el-option v-for="(item,idx) in provinceList" :key="idx" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </span>
        <span class="myWords">市
          <el-select v-model="cityValue" placeholder="请选择">
            <el-option v-for="(item,idx) in cityList" :key="idx" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </span>
        <span class="myWords">区
          <el-select v-model="areaValue" placeholder="请选择">
            <el-option v-for="(item,idx) in areaList" :key="idx" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </span>
        <el-input v-model="inputAssetsName" style="width:150px;" maxlength="50" placeholder="输入资产名称"></el-input>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="info" @click="resetSearch">重置</el-button>
      </el-row>
    </el-card>
    <el-container>
      <div class="asideTree">
        <div :style="{'overflow':'auto','height':treeHeight+'px'}">
          <el-tree ref="bigTree" highlight-current class="filter-tree" :data="treedata" @node-click="showTable" :props="defaulProps" :filter-node-method="filterNode" :render-content="renderContent">
            <span class="span-ellipsis" slot-scope="{ node }">
              <span :title="node.label">{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </div>
      <el-main>
        <div>
          <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding-bottom:15px;">
            <el-button v-if="isCreate" type="primary" @click="createDialog" :disabled="!positionPower[0].isCheck||!isValid">新增</el-button>
            <el-button v-if="isCreate" type="success" @click="open" :disabled="!positionPower[1].isCheck||!isValid">启用</el-button>
            <el-button v-if="isCreate" type="danger" @click="close" :disabled="!positionPower[1].isCheck||!isValid">禁用</el-button>
          </el-row>
        </div>
        <div>
          <el-table ref="positionRef" :data="positionTable" border tooltip-effect="dark" @selection-change="positionSelectionChange" :max-height="tableHeight">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column label="状态" prop="state" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.state==1">启用</span>
                <span v-if="scope.row.state==2">禁用</span>
              </template>
            </el-table-column>
            <el-table-column label="上级机构" prop="parentName" align="center"></el-table-column>
            <el-table-column label="资产名称" prop="name" align="center"></el-table-column>
            <el-table-column label="资产种类" align="center">
              <template slot-scope="scope">
                <span>{{form.assetsTypeList.length?form.assetsTypeList.filter(v=>v.code==scope.row.type)[0].name:''}}</span>
              </template>
            </el-table-column>
            <el-table-column label="资产位置" prop="provinceCityArea" align="center"></el-table-column>
            <el-table-column label="地图" prop="type" align="center">
              <template slot-scope="scope">
                <div style="margin:0 auto 10px;color:#fff;text-align:center;border-radius:4px;width:80px;height:35px;line-height:35px;"
                :style="{'background-color':scope.row.easyarMapId&&scope.row.easyarName?'#0074e4':scope.row.easyarMapId||scope.row.easyarName?'#ffdf25':'#ccc'}">EasyAR</div>
                <div style="margin:0 auto;color:#fff;text-align:center;border-radius:4px;width:80px;height:35px;line-height:35px;"
                :style="{'background-color':scope.row.locusMapId&&scope.row.locusName?'#0074e4':scope.row.locusMapId||scope.row.locusName?'#ffdf25':'#ccc'}">LocusAR</div>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
            <el-table-column label="创建人" prop="createUser" align="center"></el-table-column>
            <el-table-column label="最后修改时间" prop="updateTime" align="center"></el-table-column>
            <el-table-column label="最后修改人" prop="updateUser" align="center"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="positionInfo(scope.row.id)" :disabled="!positionPower[1].isCheck||!isValid">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <pagination></pagination>
        </div>
        <el-dialog title="资产添加" :visible.sync="showAssetsDialog" @close="closeDialog" width="35%" center>
          <el-form ref="form" :model="form" label-width="100px" :rules="rules">
            <el-form-item label="资产种类">
              <!-- <el-select v-if="!isEdit" v-model="form.assetsType" placeholder="请选择">
                <el-option v-for="(item,idx) in form.assetsTypeList" :key="idx" :label="item.name" :value="item.code"></el-option>
              </el-select> -->
              <span>{{(form.assetsTypeList.length&&form.assetsType)?form.assetsTypeList.find(v=>v.code==form.assetsType).name:''}}</span>
            </el-form-item>
            <el-form-item v-if="form.assetsType!=1" label="上级机构">
              <!-- <el-input class="input-with-select" v-model="form.parentName"  disabled style="width:300px;" placeholder="请选择上级机构" maxlength="50">
                <el-button :disabled="isEdit" slot="append" icon="el-icon-search" @click="selectDialog=true;">搜索</el-button>
              </el-input> -->
              <span>{{form.parentName}}</span>
            </el-form-item>
            <el-form-item label="资产名称" prop="assetsName">
              <el-input v-model="form.assetsName" style="width:200px;" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="识别方式">
              <div style="display:inline-block;color:#fff;text-align:center;border-radius:4px;width:80px;height:35px;line-height:35px;"
              :style="{'background-color':easyarMapId&&easyarName?'#0074e4':easyarMapId||easyarName?'#ffdf25':'#ccc'}">EasyAR</div>
              <div style="display:inline-block;color:#fff;text-align:center;border-radius:4px;width:80px;height:35px;line-height:35px;"
              :style="{'background-color':locusMapId&&locusName?'#0074e4':locusMapId||locusName?'#ffdf25':'#ccc'}">LocusAR</div>
            </el-form-item>
            <!-- <el-form-item label="位置所属" v-if="form.assetsType==1" prop="areaC">
              <span>省
                <el-select v-model="form.provinceC" placeholder="请选择" style="width:100px;">
                  <el-option v-for="(item,idx) in provinceListC" :key="idx" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </span>
              <span>市
                <el-select v-model="form.cityC" placeholder="请选择" style="width:100px;">
                  <el-option v-for="(item,idx) in cityListC" :key="idx" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </span>
              <span>区
                <el-select v-model="form.areaC" placeholder="请选择" style="width:100px;">
                  <el-option v-for="(item,idx) in areaListC" :key="idx" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </span>
            </el-form-item> -->
            <!-- <el-form-item label="位置所属" v-if="form.assetsType!=1" prop="positionBelong">
              <span>{{form.positionBelong}}</span>
            </el-form-item> -->
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="2">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button :disabled="isConfirm" type="primary" @click="createAssets">{{isConfirm?isEdit?'修改中...':'创建中...':'确 定'}}</el-button>
            <el-button type="info" @click="resetForm('form')">重置</el-button>
          </span>
        </el-dialog>
        <!-- <el-dialog title="选择上级" :visible.sync="selectDialog" width="25%" center>
          <el-tree :data="treedataC" @node-click="showTableC" :props="defaulProps" ></el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirmParent">确 定</el-button>
            <el-button @click="selectDialog=false;">取消</el-button>
          </span>
        </el-dialog> -->
      </el-main>
    </el-container>
  </div>
</template>

<script>
import pagination from '../../share/pagination'
import {getDistrictList,getAssetsDropDown,getPositionTree,getPositionList,openAssets,closeAssets,createPosition,editPosition,getPositionInfo} from '../../http/request'
import { mapState } from 'vuex';
export default {
  name:'positionList',
  inject:['reload'],
  components:{
    pagination
  },
  data(){
    return{
      isConfirm:false,
      isCreate:false,
      isEdit:false,
      provinceValue:'',
      provinceList:[],//省列表
      cityValue:'',
      cityList:[],//城市列表
      areaValue:'',
      areaList:[],//地区列表
      inputAssetsName:'',//搜索条件，资产名称
      treedata:[],//树形列表
      defaulProps:{label:'name'},
      positionTable:[],//资产位置列表
      showAssetsDialog:false,//显示创建资产弹窗
      form:{
        assetsName:'',//资产名称
        assetsType:'',//资产种类
        assetsTypeList:[],//资产种类列表
        parentName:'',//上级机构
        parentId:'',//上级机构id
        status:1,//状态
        provinceC:'',//省创建
        cityC:'',//市创建
        areaC:'',//区创建
        positionBelong:'',//选择的位置所属
      },
      rules:{
        assetsType:[{required: true, message: '请选择资产种类', trigger: 'blur'}],
        parentName:[{required: true, message: '请选择上级机构', trigger: 'blur'}],
        assetsName:[{required: true, message: '请输入资产名称', trigger: 'blur'}],
      },
      selectId:[],
      provinceListC:[],//省列表创建
      cityListC:[],//城市列表创建
      areaListC:[],//地区列表创建
      treedataC:[],//树形结构创建
      clickId:'',//当前点击的树状id
      selectDialog:false,
      selectParent:'',//选择的上级名
      selectParentId:'',//选择的上级id
      positionBelong:'',//选择的位置所属
      selectBelongIdList:{//选择的位置省市区id
        "provinceId":"",
        "cityId":"",
        "areaId":""
      },
      typeId:'',//保存选择的种类id
      clickTypeId:'',//专用列表判断种类id
      editId:'',
      tableHeight:0,
      treeHeight:0,
      isValid:false,
      easyarMapId:'',
      easyarName:'',
      locusMapId:'',
      locusName:'',
    }
  },
  watch:{
    page(newValue){
      this.getTable(this.clickId);
    },
    limit(newValue){
      if(this.page!=1){
        this.$store.commit('setClickPage',1);
      }
      this.getTable(this.clickId);
    },
    provinceValue(newValue){
      if(newValue!=''){
        this.getCity(newValue);
        this.cityValue = '';
        this.areaValue = '';
      }
    },
    cityValue(newValue){
      if(newValue!=''){
        this.getArea(newValue);
        this.areaValue = '';
      }
    }
  },
  computed:{
    ...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
    ...mapState('currentUserPower',{positionPower:'positionPower'}),
    allParams(){
      return{
        "name":this.form.assetsName,
        "parentId":this.form.parentId,
        "source":'Middleground',
        "state":this.form.status,
        "type":this.form.assetsType,
        "locusName":this.locusName,
        "locusMapId":this.locusMapId,
        "easyarName":this.easyarName,
        "easyarMapId":this.easyarMapId,
      }
    },
    searchParams(){
      return{
        "provinceId":this.provinceValue,
        "cityId":this.cityValue,
        "areaId":this.areaValue,
        "source":"Middleground",
        "name":this.inputAssetsName
      }
    }
  },
  methods:{
    filterNode(value, data) {//大树形结构方法
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    showTable(arr){
      if(arr.type==5){
        this.isValid = arr.isValid==1;
        this.getTable(arr.id);
        this.isCreate=true;
        this.typeId = 6//保存需要创建的种类id
        this.selectParentId=arr.id;//保存选择的上级id
        this.selectParent = arr.name;//选择的上级名
        this.clickId = arr.id;//保存当前点击的id
        this.easyarMapId=arr.easyarMapId;
        this.easyarName=arr.easyarName;
        this.locusMapId=arr.locusMapId;
        this.locusName=arr.locusName;
      }else{
        this.typeId='';
        this.isCreate=false;
      } 
    },
    positionSelectionChange(arr){
      this.selectId=arr.map(v=>v.id);
    },
    getProvince(){//获取省
      getDistrictList({"parentId":0}).then(res=>{
        this.provinceListC=this.provinceList = res.data;
      })
    },
    getCity(id){//获取市
      getDistrictList({"parentId":id}).then(res=>{
        this.cityList = res.data;
      })
    },
    getArea(id){//获取地区
      getDistrictList({"parentId":id}).then(res=>{
        this.areaList = res.data;
      })
    },
    assetsDropDwon(){
      getAssetsDropDown().then(res=>{
        this.form.assetsTypeList=res.data;
        // this.form.assetsTypeList.push({"code":'',"name":''});
      })
    },
    search(){//查询位置树状结构
      getPositionTree(this.searchParams).then(res=>{
        this.treedata = res.data;
        if(this.inputAssetsName!==''){
          this.$nextTick(()=>{
            this.$refs.bigTree.filter(this.inputAssetsName);//输入框筛选树形结构
          })         
        };
        this.positionTable=[];
      })
    },
    renderContent(h, { node, data, store }) {
      if (data.isValid == 2) {
        return <span class="span-ellipsis">
                <span title={node.label} style="background:#ccc">{node.label}</span>
               </span>
      } else {
        return <span class="span-ellipsis">
                <span title={node.label}>{ node.label }</span>
               </span>
      }
    },
    resetSearch(){
      this.provinceValue='',
      this.cityValue='',
      this.areaValue='',
      this.inputAssetsName='';
      this.isCreate=false;
      this.search();
      this.positionTable=[];
      this.$store.commit('pagination/setTotal', 0);
    },
    getTable(id){
        getPositionList({id,"page":this.page,"limit":this.limit}).then(res=>{
          this.positionTable = res.data.items;
          this.$store.commit('pagination/setTotal', res.data.total);
        });    
    },
    createAssets(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isConfirm=true;
          if(this.isEdit){
            editPosition({"id":this.editId,...this.allParams}).then(res=>{
              this.isConfirm = false;
              if(res.code){
                this.$message.error(res.msg);
              }else{
                this.$message({
                  message: res.msg,
                  center: true,
                  type: 'success'
                })
                this.closeDialog();
                this.getTable(this.clickId);
                this.isEdit=false;
              }
            }).catch(err=>{
              this.isConfirm = false;
            })
          }else{
            createPosition(this.allParams).then(res=>{
              this.isConfirm = false;
              if(res.code){
                this.$message.error(res.msg);
              }else{
                this.$message({
                  message: res.msg,
                  center: true,
                  type: 'success'
                })
                this.closeDialog();
                this.getTable(this.clickId);
              }
            }).catch(err=>{
              this.isConfirm = false;
            });
          }           
        } else {
          console.log('error submit!!');
          return false;
        }
      });   
    },
    positionInfo(id){
      this.isEdit=true;
      this.editId = id;
      this.showAssetsDialog=true;
      getPositionInfo({id}).then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{
          this.form.assetsName = res.data.name;
          this.form.assetsType = res.data.type;
          this.form.parentName = res.data.parentName;
          this.form.parentId = res.data.parentId;
          this.form.provinceC =res.data.provinceId;
          this.form.cityC =res.data.cityId;
          this.form.areaC =res.data.areaId;
          this.form.positionBelong=res.data.provinceCityArea;
          this.form.status=res.data.state;
        }
      })
    },
    resetForm(formName){//重置创建资产位置表单
      // this.selectParent='';
      this.$refs[formName].resetFields();
      // this.form.provinceC='';
      // this.form.cityC='';
      // this.form.areaC='';
    },
    createDialog(){//创建窗口
      this.showAssetsDialog=true;
      this.form.assetsType = this.typeId;
      this.form.parentName = this.selectParent;
      this.form.parentId = this.selectParentId;
    },
    closeDialog(){
      this.isEdit=false;
      this.showAssetsDialog=false;
      this.resetForm('form');
      // this.selectParent='',
      // this.selectParentId='',
      // this.positionBelong='',
      // this.selectBelongIdList.provinceId="",
      // this.selectBelongIdList.cityId="",
      // this.selectBelongIdList.areaId="";
      // this.typeId='';
    },
    open(){//启用
      if(this.selectId.length==0){
        this.$message.error('请勾选需要启用的行');
        return;
      }
      openAssets({"ids":this.selectId,"source":"Middleground"}).then(res=>{
        this.getTable(this.clickId);
      })
    },
    close(){//禁用
      if(this.selectId.length==0){
        this.$message.error('请勾选需要禁用的行');
        return;
      }
      closeAssets({"ids":this.selectId,"source":"Middleground"}).then(res=>{
        this.getTable(this.clickId);
      })
    }
  },
  created(){
    this.getProvince();
    this.search();//获取外边的树
    this.assetsDropDwon();//获取资产种类下拉框
    this.$store.commit('pagination/setTotal', 0);
  },
  updated(){
    this.$nextTick(()=>{
      this.tableHeight = window.innerHeight - this.$refs.positionRef.$el.offsetTop - 110;
      this.treeHeight = window.innerHeight - this.$refs.bigTree.$el.offsetTop - 110;
    })
  }
}
</script>

<style scoped>
.asideTree {
  width: 25%;
  height: 100%;
}
.span-ellipsis {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>