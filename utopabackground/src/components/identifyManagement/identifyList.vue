<template>
  <div v-if="mapListPower.length||enablePower.length||unapprovedPower.length||unablePower.length">
    <div v-if="$route.name=='identifyList'||$route.name=='checkState1'||$route.name=='checkState2'||$route.name=='checkState3'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">{{title}}</span>
      </div>
      <div>
        <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
          <span>
            <el-input
              placeholder="识别图名称"
              class="input-with-select pl15"
              style="width: 10%"
              v-model="wd"
            ></el-input>
          </span>
		      <span>
            识别方式：
            <el-select v-model="type" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option label="图像云识别" value="1"></el-option>
              <el-option label="图像本地识别" value="0"></el-option>
            </el-select>
          </span>
          <span>
            识别平台：
            <el-select v-model="platformType" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option label="vuforia" value="0"></el-option>
              <el-option label="EasyAR" value="1"></el-option>
              <el-option label="LocusAR" value="2"></el-option>
            </el-select>
          </span>
           <span>
            中台用户:
            <el-select v-model="saasCode" placeholder="请选择">
            <el-option
              v-for="item in listSaasAccount"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
          </span>
          <span>
            <el-button v-if="!showMoudle" type="danger"  @click="delAll()" :disabled="!mapListPower[3].isCheck">批量删除</el-button>
            <el-button v-if="showMoudle=='3'" type="danger" @click="delAll()" :disabled="!unablePower[2].isCheck">批量删除</el-button>
            <el-button v-if="showMoudle=='2'" type="danger" @click="delAll()" :disabled="!enablePower[2].isCheck">批量删除</el-button>
            <el-button v-if="showMoudle=='1'" type="danger" @click="delAll()" :disabled="!unapprovedPower[3].isCheck">批量删除</el-button>
          </span>
        </el-row>
        <!-- 数据展示 -->
        <el-table :data="tableData" ref="multipleTable" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" :max-height="tableHeight" :key="1" border>
		  <el-table-column
		  type="selection"
		  width="55"
      align="center"
      >
		  </el-table-column>
          <el-table-column prop="id" label="id" width="60" align="center">
            <template slot-scope="scope">{{ scope.row.id}}</template>
          </el-table-column>
          <el-table-column prop="webUrl" label="图片" width="100" align="center">
            <template slot-scope="scope">
               <img
              :src="scope.row.webUrl?`/static/${scope.row.webUrl}`:null"
              alt
              style="width: 50px;height: 50px"
              >
            </template>
          </el-table-column>
          <el-table-column prop="name" :label="'识别图名称'" width="" align="center">
            <template slot-scope="scope">{{ scope.row.name}}</template>
          </el-table-column>
          <el-table-column prop="targetId" :label="'识别图ID'" width align="center"></el-table-column>
          <el-table-column prop="state" label="类别" width="120" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.recognizeType==1">图像云识别</span>
              <span v-if="scope.row.recognizeType==0">图像本地识别</span>
            </template>
          </el-table-column>
		      <el-table-column prop="type" label="审核" width="120" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.checkState==1">未审核</span>
              <span v-if="scope.row.checkState==2">通过</span>
              <span v-if="scope.row.checkState==3" style="color:#FF644E">不通过</span>
            </template>
          </el-table-column>
           <el-table-column prop="saasCodeName" label="中台用户" width="" align="center">
          </el-table-column>
          <el-table-column prop="createTime" label="上传时间" width="" align="center" ></el-table-column>

          <el-table-column prop="pic" label="识别图下载" width="120" align="center">
            <template slot-scope="scope">
               <a :href="`/api/file/download?uuid=${scope.row.pic}`" download="" style="text-decoration:none" class=""  v-if="scope.row.type==2"><img src="../../assets/downImg.png"/></a>
                <a href="javascript:void(0)" download="" style="text-decoration:none" class=""  v-if="scope.row.type==1"><img src="../../assets/downImg.png"/></a>
            </template>
          </el-table-column>
          <el-table-column prop="pic" label="识别图地址" width align="center">
            <template slot-scope="scope">
                  <upload @uploadAction="uploadAction" :id="scope.row.id" :disabled="scope.row.type==1||!mapListPower[0].isCheck||scope.row.checkState==3" :hasResource="`${scope.row.androidResourcePackage?scope.row.androidResourcePackage:''},${scope.row.easyarFileId?scope.row.easyarFileId:''},${scope.row.locusFileId?scope.row.locusFileId:''}`" :hasAuthority="scope.row.platformType" ref="identifyList" v-if="!showMoudle" :showMoudle="showMoudle"></upload>
                 <!-- <el-button type="primary" size="small" :disabled="scope.row.type==1||!mapListPower[0].isCheck" @click="uploadAction(scope.row)">上传</el-button> -->
                   <upload @uploadAction="uploadAction" :id="scope.row.id" :disabled="scope.row.type==1||!unablePower[0].isCheck||scope.row.checkState==3" :hasResource="`${scope.row.androidResourcePackage?scope.row.androidResourcePackage:''},${scope.row.easyarFileId?scope.row.easyarFileId:''},${scope.row.locusFileId?scope.row.locusFileId:''}`" :hasAuthority="scope.row.platformType" ref="state1" v-if="showMoudle=='3'" :showMoudle="showMoudle"></upload>
                  <!-- <el-button type="primary"  size="small" :disabled="scope.row.type==1||!unablePower[0].isCheck" @click="uploadAction(scope.row)">上传</el-button> -->
                  <upload @uploadAction="uploadAction" :id="scope.row.id" :disabled="scope.row.type==1||!enablePower[0].isCheck||scope.row.checkState==3" :hasResource="`${scope.row.androidResourcePackage?scope.row.androidResourcePackage:''},${scope.row.easyarFileId?scope.row.easyarFileId:''},${scope.row.locusFileId?scope.row.locusFileId:''}`" :hasAuthority="scope.row.platformType" ref="state2" v-if="showMoudle=='2'" :showMoudle="showMoudle"></upload>
                  <!-- <el-button  type="primary" size="small" :disabled="scope.row.type==1||!enablePower[0].isCheck" @click="uploadAction(scope.row)">上传</el-button> -->
                  <upload @uploadAction="uploadAction" :id="scope.row.id" :disabled="scope.row.type==1||!unapprovedPower[0].isCheck||scope.row.checkState==3" :hasResource="`${scope.row.androidResourcePackage?scope.row.androidResourcePackage:''},${scope.row.easyarFileId?scope.row.easyarFileId:''},${scope.row.locusFileId?scope.row.locusFileId:''}`" :hasAuthority="scope.row.platformType" ref="state3" v-if="showMoudle=='1'" :showMoudle="showMoudle"></upload>
                   <!-- <el-button type="primary" size="small" :disabled="scope.row.type==1||!unapprovedPower[0].isCheck" @click="uploadAction(scope.row)">上传</el-button> -->


            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="250" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="warning"
                size="mini"
                @click="handleEdit(scope.row);dialogFormVisible = true"
              >查看</el-button>
              <el-button
                v-if="!showMoudle"
                type="success"
                size="mini"
                :disabled="scope.row.checkState ==2||scope.row.checkState !==1 ||!mapListPower[1].isCheck||!isResourcePackage(scope.row)"
                @click="upper(scope.row.id).then(v=>{
              reload()})"
              >通过</el-button>
               <el-button
                v-if="showMoudle=='3'"
                type="success"
                size="mini"
                :disabled="scope.row.checkState ==3"
                @click="upper(scope.row.id).then(v=>{
              reload()})"
              >通过</el-button>
               <el-button
                v-if="showMoudle=='2'"
                type="success"
                size="mini"
                :disabled="scope.row.checkState ==2"
                @click="upper(scope.row.id).then(v=>{
              reload()})"
              >通过</el-button>
               <el-button
                v-if="showMoudle=='1'"
                type="success"
                size="mini"
                :disabled="scope.row.checkState !==1 ||!unapprovedPower[1].isCheck"
                @click="upper(scope.row.id).then(v=>{
              reload()})"
              >通过</el-button>
              <el-button
                v-if="!showMoudle"
                type="danger"
                size="mini"
                :disabled="scope.row.checkState !==1 || !mapListPower[1].isCheck"
               @click="lower(scope.row.id).then(v=>{
              reload()})"
              >拒绝</el-button>
              <el-button
                v-if="showMoudle=='3'"
                type="danger"
                size="mini"
                :disabled="scope.row.checkState !==1"
               @click="lower(scope.row.id).then(v=>{
              reload()})"
              >拒绝</el-button>
              <el-button
                v-if="showMoudle=='2'"
                type="danger"
                size="mini"
                :disabled="scope.row.checkState !==1"
               @click="lower(scope.row.id).then(v=>{
              reload()})"
              >拒绝</el-button>
              <el-button
                v-if="showMoudle=='1'"
                type="danger"
                size="mini"
                :disabled="scope.row.checkState !==1 || !unapprovedPower[1].isCheck"
               @click="lower(scope.row.id).then(v=>{
              reload()})"
              >拒绝</el-button>
            </template>
          </el-table-column>
        </el-table>
		<div style="margin-top:15px"> <pagination v-if="showPagination"></pagination></div>
      </div>
  <!-- 识别图详情 start-->
	<el-dialog title="识别图信息" :visible.sync="dialogVisible" width="25%">
			<el-form :model="formSize">
			<el-form-item label="识别图名称：" :label-width="formLabelWidth">
			<span>{{formSize.name}}</span>
			</el-form-item>
			<el-form-item label="图片宽度：" :label-width="formLabelWidth">
			<span>{{formSize.width?formSize.width:'无'}}</span>
			</el-form-item>
			<el-form-item label="图片类型：" :label-width="formLabelWidth">
			<span>{{formSize.recognizeType==1?'图像云识别':'图像本地识别'}}</span>
   
			</el-form-item>
			<el-form-item label="识别图：" :label-width="formLabelWidth">
			 <img
          :src="formSize.pic?`/static/${formSize.webUrl}`:null"
          alt
          style="width: 150px;height: 150px"
          >
			</el-form-item>
			<!-- <div style="margin-top:30px;" v-if="formSize.type==1" >
            <h3>
              <span><label>推荐使用：</label></span>
            </h3>
            <div style="clear:both;">
              <span ><label style="color:#999">可识别度：</label>
              <img v-if="formSize.rating<3"  src="../../assets/startOrange.png" v-for="(item,index) in parseInt(formSize.rating)" :key="index"/>
              <img v-if="formSize.rating>=3"  src="../../assets/startGreen.png" v-for="(item,index) in parseInt(formSize.rating)" :key="index+10"/>
              <img  src="../../assets/startNull.png" v-for="(item,index) in ratingOther" :key="index+20" />
              </span>
            </div>
          </div> -->
			<!-- </el-form-item> -->
		</el-form>
	</el-dialog>
  <!-- 识别图详情 end -->
  <!-- 识别图上传 start-->
        <el-dialog title="添加识别图" :visible.sync="imgVisible" width="25%" @closed="closeDialog()" >
        <el-upload
        class="upload-demo"
        action="/api/utopa/ar/identify/image/upload/data/package"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :file-list="fileList"
        multiple
        :limit="1"
        :data="{'targetId':formSize.targetId}"
        :headers="myHeader"
        :on-exceed="handleExceed"
        name="zipMultipartFile"
        >
           <!-- {{resourcePackage}} -->
        资源包上传:
        <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
         <div style="position:absoult;bottom:20px;left:0px;" v-if="resourcePackage.androidFileName&&platformTypeUrl==0">资源包名称：{{resourcePackage.androidFileName}}</div>
         <div style="position:absoult;bottom:20px;left:0px;" v-if="resourcePackage.easyarFileId&&platformTypeUrl==1">资源包名称：{{resourcePackage.easyarFileName}}</div>
         <div style="position:absoult;bottom:20px;left:0px;" v-if="resourcePackage.locusFileId&&platformTypeUrl==2">资源包名称：{{resourcePackage.locusFileName}}</div>

        <div style="position:absoult;bottom:20px;left:0px;" v-if="resourcePackage.androidResourcePackageSize&&platformTypeUrl==0">资源包大小：{{((resourcePackage.androidResourcePackageSize/(1024*1024))+'').slice(0,4)}}M</div>

          <div style="position:absoult;bottom:20px;left:0px;" v-if="resourcePackage.easyarFileId&&platformTypeUrl==1">资源包大小：{{((resourcePackage.easyarFileSize/(1024*1024))+'').slice(0,4)}}M</div>
          
          <div style="position:absoult;bottom:20px;left:0px;" v-if="resourcePackage.locusFileId&&platformTypeUrl==2">资源包大小：{{((resourcePackage.locusFileSize/(1024*1024))+'').slice(0,4)}}M</div>

        <div style="margin-top:15px;">
          <!-- <el-upload
        class="upload-demo"
        action="/api/file/upload"
        :on-preview="handlePreview"
        :on-remove="handleRemove2"
        :before-remove="beforeRemove"
        :on-success="handleAvatarSuccess2"
        :before-upload="beforeAvatarUpload"
        :file-list="fileList"
        multiple
        :limit="1"
        :data="myData"
        :headers="myHeader"
        :on-exceed="handleExceed"
        >
         IOS包上传:
        <el-button size="small" type="primary">点击上传</el-button>
        </el-upload> -->

        <!-- <div style="position:absoult;bottom:20px;left:0px;" v-if="resourcePackage.iosFileName||formSize.iosFileName">资源包名称：{{resourcePackage.iosFileName||formSize.iosFileName}}</div> -->
        <!-- <div style="position:absoult;bottom:20px;left:0px;" v-if="resourcePackage.iosResourcePackageSize||formSize.iosResourcePackageSize">资源包大小：{{((resourcePackage.iosResourcePackageSize/(1024*1024))+'').slice(0,4)||((formSize.iosResourcePackageSize/(1024*1024))+'').slice(0,4)}}M</div> -->
        </div>
        <el-button size="small" type="success" @click="save({'identifiedImageId':formSize.id,'resourcePackage':resourcePackage}).then(res=>{imgVisible=false;reload()})" v-if="resourcePackage.androidResourcePackageSize&&platformTypeUrl==0||resourcePackage.easyarFileId&&platformTypeUrl==1||resourcePackage.locusFileId&&platformTypeUrl==2">确定</el-button>
        <!-- <el-button style="margin-left: 10px;" size="small" v-if="upSuccess"  @click="quit()">取消</el-button> -->
        </el-dialog>
  <!-- 识别图上传 end -->
    </div>
  </div>
</template>

<script>
import {identifyListSaasAccount,identifyInfo} from "../../http/request";
import { mapState, mapActions } from "vuex";
import pagination from '../../share/pagination'
import upload from './upload'
import VueCookies from 'vue-cookies'
import { Base64 } from 'js-base64';
// import {jazzbarName} from "../token";

export default {
  name: "identify",
  inject:['replace','reload'],
  data(){
	  return{
		status:"",
		type:"",
    wd:"",
		showPagination:false,
		multipleSelection:[],
		multipleSelectionId:[],
    dialogVisible:false,
    saasCode:"",
    hostApi:'',
		formSize:{
      id:'',
    },
    formLabelWidth: '120px',
    imgVisible:false,
    identifiedForm:{
      imgIdentifiedName:'',
    },
    platformType:0,
    platformTypeUrl:0,
    fileList: [],
    listSaasAccount:[],
    upSuccess:false,
    listF:1,
    resourcePackage:{
      iosResourcePackage:'',
      iosFileName:'',
      iosResourcePackageSize:'',
      androidResourcePackage:'',
      androidFileName:'',
      androidResourcePackageSize:'',
      easyarFileId:'',
      easyarFileName:'',
      easyarFileSize:'',
      locusFileId:'',
      locusFileName:'',
      locusFileSize:''
    },
    checkState:'',
    idxCopy:'',
    checkA:'',
    tableData:[],
    tableHeight:0,
    showMoudle:'',
    uploadData:null,
    title:''
	  }
  },
  created(){
	let query=this.$route.query
  let pageRecord = query.page;//记录上一次页码操作
  let limitRecord = query.limit;//记录上一次limit操作
  this.wd=query.wd?query.wd:'';
  this.platformType=query.platformType?query.platformType:'';
	this.status=query.status?query.status:'';
  this.type=query.type?query.type:'';
  this.saasCode=query.saasCode?query.saasCode:'';
  switch (this.$route.name) {
      case 'checkState1':
        this.replace('checkState',1);
        this.showMoudle='1'
        this.title='图像识别-未审核'
        break;
      case 'checkState2':
        this.replace('checkState',2);
        this.showMoudle='2'
        this.title='图像识别-通过'
        break;
      case 'checkState3':
        this.replace('checkState',3);
        this.showMoudle='3'
        this.title='图像识别-不通过'
        break;
      default:
        this.showMoudle=''
        this.title='图像识别'
        break;
    }
  // if(this.$route.path =='/identidfyManagement/identifyList'){

  // }

  this.init({...query,source:'Background',saasCode:this.saasCode}).then(res=>{
    res.data.items.forEach(v=>v.webUrl=Base64.decode(v.pic))
    this.tableData=res.data.items
    this.tableData.forEach(v=>{
      if(!v.platformType){
        v.platformType=null
      }
      return v
    })
    console.log(this.tableData,'data')
		this.$store.commit('pagination/setTotal',this.total);
  })

  identifyListSaasAccount({}).then(res=>{
    this.listSaasAccount=res.data
    this.listSaasAccount.unshift({code: "",name:"全部"})
  })
	this.$nextTick(()=>{
		this.$store.commit('pagination/setClickPage',pageRecord);
		this.$store.commit('pagination/setLimitPage',limitRecord);
		this.showPagination = true;//加载分页组件
})
// console.log('created')
  },
  computed:{
	...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
  ...mapState('identifyList',{total:'total',currentRow:'currentRow'}),
  ...mapState('currentUserPower',{mapListPower:'mapListPower',enablePower:'enablePower',unapprovedPower:'unapprovedPower',unablePower:'unablePower'}),
  ratingOther(){
    return 5-this.formSize.rating
  },
  // myData(){
  //       return {
  //           "targetId":this.formSize.targetId
  //       }
  //   },
    myHeader(){
    return {
        "Authorization":VueCookies.get('backgroundToken')
    }
},
  },
  methods:{
    ...mapActions('identifyList',['init','upper','lower','info','del','save']),
    //判断是否所有的资源包已上传，显示通过按钮是否可用
    isResourcePackage(row){
      if(row.androidResourcePackage||row.locusFileId||row.easyarFileId){
        return true
      }
      return false
    },
	  handleSelectionChange(val) {
		this.multipleSelection = val;
		this.multipleSelectionId=this.multipleSelection.map(v=>v.id)
	  },
	  handleEdit(row){
		this.info({id:row.id}).then(v=>{
      this.dialogVisible=true
    })
    },
    handleRemove(file, fileList) {
      let arr=file.name.split('.');
      let isDat=arr[arr.length-1]=='zip'
      let isLt45M = file.size / 1024 / 1024 < 45;
      if(isDat&&isLt45M){
      //  if(this.platformTypeUrl==0){
      //  this.resourcePackage.androidFileName=''
      //  this.resourcePackage.androidResourcePackageSize=''
      //  this.resourcePackage.iosFileName=''
      //  this.resourcePackage.iosResourcePackageSize=''
      //  }else if(this.platformTypeUrl==1){
      //   this.resourcePackage.androidResourcePackageSize=''
      //   this.resourcePackage.androidFileName=''
      //   this.resourcePackage.androidResourcePackage=''
      //  }
      }
      },
    handleRemove2(file, fileList) {

      },
    handlePreview(file) {
      // console.log(file);
    },
    handleExceed(files, fileList) {
      {{files.length}}
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      // return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleAvatarSuccess(res, file,fileList){
      console.log(1111,this.platformTypeUrl,res, file,fileList)
      if(this.platformTypeUrl==0){
        res.code==0?this.resourcePackage.androidResourcePackageSize=res.data.size:this.resourcePackage.androidResourcePackageSize=''
        res.code==0?this.resourcePackage.androidFileName=res.data.originFileName:this.resourcePackage.androidFileName=''
        res.code==0?this.resourcePackage.androidResourcePackage=res.data.fileId:this.resourcePackage.androidResourcePackage=''
        res.code==0?this.resourcePackage.iosResourcePackageSize=res.data.size:this.resourcePackage.iosResourcePackageSize=''
        res.code==0?this.resourcePackage.iosFileName=res.data.originFileName:this.resourcePackage.iosFileName=''
        res.code==0?this.resourcePackage.iosResourcePackage=res.data.fileId:this.resourcePackage.iosResourcePackage=''
      }else if(this.platformTypeUrl==1){
        res.code==0?this.resourcePackage.easyarFileId=res.data.fileId:this.resourcePackage.androidResourcePackageSize=''
        res.code==0?this.resourcePackage.easyarFileName=res.data.originFileName:this.resourcePackage.androidFileName=''
        res.code==0?this.resourcePackage.easyarFileSize=res.data.size:this.resourcePackage.androidResourcePackage=''
      }else if(this.platformTypeUrl==2){
        res.code==0?this.resourcePackage.locusFileId=res.data.fileId:this.resourcePackage.androidResourcePackageSize=''
        res.code==0?this.resourcePackage.locusFileName=res.data.originFileName:this.resourcePackage.androidFileName=''
        res.code==0?this.resourcePackage.locusFileSize=res.data.size:this.resourcePackage.androidResourcePackage=''
      }
      
    },
    handleAvatarSuccess2(res, file,fileList){

    },
    beforeAvatarUpload(file) {
      let arr=file.name.split('.');
      let isDat=arr[arr.length-1]=='zip'
      let isLt45M = file.size / 1024 / 1024 < 45;
      if (!isDat) {
          this.$message.error('只能上传后缀为.zip格式资源');
        }
      if (!isLt45M) {
          this.$message.error('上传大小不能超过50MB!');
        }
        return isLt45M&&isDat;
      },
    closeDialog(){
      // this.resourcePackage.iosResourcePackage='',
      // this.resourcePackage.iosFileName='',
      // this.resourcePackage.iosResourcePackageSize='',
      // this.resourcePackage.androidResourcePackage='',
      // this.resourcePackage.androidFileName='',
      // this.resourcePackage.androidResourcePackageSize='',
      // this.iosResourcePackageSize=''
      // this.iosFileName=''
      // this.formSize.iosResourcePackageSize=''
      // this.formSize.androidResourcePackageSize=''
      // this.formSize.targetId=''
      // this.fileList=[]
      // this.imgVisible=false
      this.reload()
     
    },
    uploadAction(params){
      // console.log(params,'params')
      this.formSize.id=params.id
      this.platformTypeUrl=params.platformType
      this.info({id:params.id}).then(v=>{
      this.resourcePackage.androidFileName=v.data.androidFileName;
      this.resourcePackage.androidResourcePackage=v.data.androidResourcePackage;
      this.resourcePackage.androidResourcePackageSize=v.data.androidResourcePackageSize;
      this.resourcePackage.iosFileName=v.data.iosFileName;
      this.resourcePackage.iosResourcePackage=v.data.iosResourcePackage;
      this.resourcePackage.iosResourcePackageSize=v.data.iosResourcePackageSize;
      this.resourcePackage.easyarFileId=v.data.easyarFileId;
      this.resourcePackage.easyarFileName=v.data.easyarFileName;
      this.resourcePackage.easyarFileSize=v.data.easyarFileSize;
      this.resourcePackage.locusFileId=v.data.locusFileId;
      this.resourcePackage.locusFileName=v.data.locusFileName;
      this.resourcePackage.locusFileSize=v.data.locusFileSize;
      this.imgVisible= !params.disabled&&!params.has
    })

    },
    delAll(){
      this.multipleSelection.length?this.del(this.multipleSelectionId).then(res=>{this.reload()}):this.$message.error('最少选择一项删除项')
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
    status(){
      this.$store.commit('pagination/setClickPage',1);
      this.replace('status',this.status);
	},
	type(){
      this.$store.commit('pagination/setClickPage',1);
      this.replace('type',this.type);
  },
  platformType(){
      this.$store.commit('pagination/setClickPage',1);
      this.replace('platformType',this.platformType);
  },
  saasCode(){
      this.$store.commit('pagination/setClickPage',1);
      this.replace('saasCode',this.saasCode);
	},
	currentRow(){
    this.formSize = Object.assign(this.formSize, this.currentRow);
    this.formSize.webUrl=Base64.decode(this.formSize.pic)
	},
  $route(){//判断路由query变化执行请求
      //  console.log(11,'111')
      if(this.$route.name=='identifyList'||this.$route.name=='checkState1'||this.$route.name=='checkState2'||this.$route.name=='checkState3'){
      switch (this.$route.name) {
       case 'checkState1':
        this.replace('checkState',1);
        this.showMoudle='1'
        this.title='图像识别-未审核'
        break;
      case 'checkState2':
        this.replace('checkState',2);
        this.showMoudle='2'
        this.title='图像识别-通过'
        break;
      case 'checkState3':
        this.replace('checkState',3);
        this.showMoudle='3'
        this.title='图像识别-不通过'
        break;
      default:
        this.showMoudle=''
        this.title='图像识别'
        break;
    }
      this.init({...this.$route.query,source:'Background',saasCode:this.saasCode}).then(res=>{
      res.data.items.forEach(v=>v.webUrl=Base64.decode(v.pic))
      this.tableData=res.data.items
      this.$store.commit('pagination/setTotal',this.total);

    })
      }
     if(this.$route.fullPath =='/identidfyManagement/identifyList'||this.$route.fullPath =='/identidfyManagement/identifyList/state1?checkState=1'||this.$route.fullPath =='/identidfyManagement/identifyList/state2?checkState=2'||this.$route.fullPath =='/identidfyManagement/identifyList/state3?checkState=3'){
        this.status=""
        this.type=""
        this.wd=""
        this.platformType=''
        this.saasCode=''
        this.$store.commit('pagination/setClickPage',1);
        this.$store.commit('pagination/setLimitPage',20);
     }
    },

  },
  updated(){
    this.$nextTick(()=>{
      this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 110;
    })
  },
  components: {
    pagination,
    upload
  }
};
</script>

<style scoped>
.tac span {
  padding-left: 5px;
  padding-right: 10px;
}
/* #FBBD08 */

.downBtn{
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    color: #FFF;
    background-color: #0074E4;
    border-color: #0074E4;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 4px;
}
.downDisable{
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    color: #FFF;
    background-color: rgb(128, 186, 242);
    border-color: rgb(128, 186, 242);
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    padding: 10px 12px;
    font-size: 12px;
    border-radius: 4px;
}

</style>
