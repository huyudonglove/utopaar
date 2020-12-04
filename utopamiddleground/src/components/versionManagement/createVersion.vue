<template>
  <div>
    <el-dialog title="版本升级" :visible.sync="dialogFormVisible"  width="40%" @close='close' >
      <el-form :model="formSize" label-width="120px" ref="formSize" :rules="rules">
        <el-form-item label="当前版本号："  >
          {{nowVersion}}
        </el-form-item>
        <el-form-item label="更新版本号：" prop="latestVersion">
          <el-input v-model="formSize.latestVersion" ></el-input>
        </el-form-item>
          <el-form-item label="发布时间：" prop="publishTime">
           <el-date-picker
            v-model="formSize.publishTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
            :popper-class="'currentDatePickerClass'"
            :picker-options="pickerOptions"
            style="width:100%"
            @change="handle"
            :disabled="new Date(formSize.publishTime) * 1000 /1000<Date.now()"
            >
          </el-date-picker>
        </el-form-item>
          <el-form-item label="所属平台：" prop="appType" class="appType">
           <el-select v-model="formSize.appType" placeholder="请选择平台" :disabled="id !==''"> 
            <el-option label="Ios" value="1"></el-option>
            <el-option label="Android" value="0"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="安装包URL："  prop="apkUrl">
          <el-input v-model="formSize.apkUrl" ></el-input>
        </el-form-item>
         <el-form-item label="更新内容：" prop="content">
          <el-input v-model="formSize.content"  type="textarea"   :rows="5"></el-input>
        </el-form-item>
         <el-form-item label="更新提示：" prop="remark">
          <el-input v-model="formSize.remark"  type="textarea"   maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="强制更新：" prop="updateType" required>
         <el-switch
          v-model="formSize.updateType"
          active-value="1"
          inactive-value="0"
          >
        </el-switch>
        </el-form-item>
        <el-form-item label="是否生效：" prop="isValid" required>
          <el-switch
            v-model="formSize.isValid"
            active-value="1"
            inactive-value="0"
            >
        </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('formSize')">取 消</el-button>
        <el-button type="primary" @click="submitForm('formSize')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {getVersionInfo,addVersion,updateVersion,getLatestVersion} from "../../http/request";
import {mapActions,mapState,mapMutations} from 'vuex'
import { Message } from 'element-ui';
export default {
  name: "createVersion",
  inject:['replace','reload'],
  props:['id','showVersion'],
  data(){
    return {
      dialogFormVisible:false,
       formSize:{
         appType:'',//所属平台
         publishTime:'',//发布时间
         apkUrl:'',//  安装包 URL
         content:'',//更新内容
         isValid:'0',//是否生效：0不生效1生效
         updateType:'0' , //更新类型0-提示更新1-强制更新
         remark:'检测到有新版本',//更新提示
         androidLatestVersion:'',
         iosLatestVersion:'',
         latestVersion:'',
         androidRemark:'',
         iosRemark:''
         },
        
         nowVersion:'',//当前版本号
          pickerOptions: {
        // 不让选择今天以前的
          disabledDate:(time)=> {
	        return time.getTime() < Date.now()-1 * 24 * 3600 * 1000
	        }
        },
         rules: {
           appType:[
             {
               required: true, message: '请选择平台', trigger: ['blur','change']
             }
           ],
           publishTime:[
             {
               required: true, message: '请选择发布时间', trigger: ['blur','change']
             }
           ],
           apkUrl:[
             {
               required: true, message: '请输入安装包URL', trigger: ['blur','change']
             }
           ],
           content:[
             {
               required: true, message: '请输入更新内容', trigger: ['blur','change']
             }
           ],
            remark:[
             {
               required: true, message: '请输入更新提示', trigger: ['blur','change']
             }
           ],
            latestVersion:[
             {
               required: true, message: '请选输入更新版本号', trigger: ['blur','change']
             }
           ],
         }
    }
  },
 created(){
    // if(this.id){
    // await  getVersionInfo({id:this.id}).then(res=>{
    //   if(res.code){
    //     Message.error(res.msg);
    //   }else{
    //    this.formSize = res.data
    //    this.nowVersion=res.data.androidVersionCode
    //   }
    // })
    // }
    this.getLatestVersion(this.params)
  },
  computed: {
    remark(){
      return this.formSize.remark
    },
    appType(){
      return this.formSize.appType
    },
    params(){
      return{
        appType:this.formSize.appType||'1'
      }
    }
 },
 methods:{
  handle: function() {
       var startAt = new Date(this.formSize.publishTime) * 1000 /1000;
        if(startAt < Date.now()) {
          Message.error('发布时间不能小于当前时间');
          this.formSize.publishTime=''
        }
    },
  changeType(){
     
  },
  getLatestVersion(params){
    if(this.appType){
      getLatestVersion(params).then(res=>{
      if(res.data){
        this.appType=='0'?this.nowVersion=res.data.androidLatestVersion:this.nowVersion=res.data.iosLatestVersion
      }else{
        this.nowVersion='无'
      }
    })
    }
  },
  //保存
  submitForm(formName){
    this.$refs[formName].validate((valid) => {
          if (valid) {
              this.appType=='0'?this.formSize.androidLatestVersion=this.formSize.latestVersion:this.formSize.iosLatestVersion=this.formSize.latestVersion
              if(this.id){
                updateVersion({...this.formSize}).then(res=>{
              if(res.code){
                  Message.error(res.msg);
                }else{
                this.reload()
                }
              })
              }else{
                addVersion({...this.formSize}).then(res=>{
              if(res.code){
                  Message.error(res.msg);
                }else{
                this.reload()
                }
              })
              }
          }
      });
  },
  close(){
    // this.$emit('close',true)
    // this.$refs.formSize.resetFields()
    this.reload()
  },
   resetForm(formName) {
    // this.$refs[formName].resetFields();
    this.reload()
  }
 },
 watch:{
   remark(){
     this.appType=='0'?this.formSize.androidRemark=this.formSize.remark:this.appType=='1'?this.formSize.iosRemark=this.formSize.remark:null
   },
   showVersion(){
     this.showVersion==true?this.dialogFormVisible=true:this.dialogFormVisible=false
     if(this.id){
       getVersionInfo({id:this.id}).then(res=>{
        if(res.code){
          Message.error(res.msg);
        }else{
        let currentRow=res.data
        this.formSize = Object.assign(this.formSize, currentRow);
        this.formSize.appType=this.formSize.appType.toString()
        this.formSize.isValid=this.formSize.isValid.toString()
        this.formSize.updateType=this.formSize.updateType.toString()
        this.formSize.appType=='0'?this.formSize.latestVersion=res.data.androidLatestVersion:this.formSize.latestVersion=res.data.iosLatestVersion
        this.formSize.appType=='0'?this.formSize.remark=this.formSize.androidRemark:this.formSize.remark=this.formSize.iosRemark
      
        }
      })
     }
   },
   appType(){
      this.appType?this.getLatestVersion({appType:this.appType}):null
      this.appType=='0'?this.formSize.androidLatestVersion=this.nowVersion:this.formSize.androidLatestVersion=this.nowVersion
      this.appType=='0'?this.formSize.androidRemark=this.formSize.remark:this.formSize.iosRemark=this.formSize.remark

   }
 }
}
</script>
<style>
.currentDatePickerClass > .el-picker-panel__footer > .el-button--text:first-child{
  display: none;
}
/* .appType .el-select {
    display: inline-block;
    position: relative;
    width: 100%;
} */
</style>
<style scoped>
</style>
