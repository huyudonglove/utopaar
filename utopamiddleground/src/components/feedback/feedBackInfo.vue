<template>
  <div>
    <div v-if="$route.name=='feedBackInfo'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">内容详情</span>
      </div>
      <el-form ref="form" :model="formSize" label-width="150px">
      <el-form-item label="问题类型：">
        <span v-if="formSize.category==1">功能异常</span>
        <span v-if="formSize.category==2">体验问题</span>
        <span v-if="formSize.category==3">新功能的建议</span>
        <span v-if="formSize.category==4">其它问题</span>
      </el-form-item>
      <el-form-item label="时间：">
        {{formSize.createTime}}
      </el-form-item>
      <el-form-item label="用户名称：">
        {{formSize.userName?formSize.userName:'无'}}
      </el-form-item>
      <el-form-item label="联系电话：">
        {{formSize.phone}}
      </el-form-item>
      <el-form-item label="反馈进度：">
        <el-select v-model="formSize.status" placeholder="请选择">
             <el-option label="待处理" value="0"></el-option>
             <el-option label="处理中" value="1"></el-option>
             <el-option label="已处理" value="2"></el-option>
             <el-option label="不作处理" value="-1"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="最后修改人：">
        {{formSize.operatorName?formSize.operatorName:'无'}}
      </el-form-item>
      <el-form-item label="问题描述：">
        {{formSize.description}}
        <div>
          <div v-for="(item,i) in formSize.imagesWebUrl" :key="i" style="float:left;margin-bottom:15px;margin-right:15px">
            <img :src="item.imageUrl?`/static/${item.imageUrl}`:null" alt=""  style="width:150px;height:150px" v-big>
        </div>
        </div>
      </el-form-item>
      </el-form>
      <div>
        <div style="width:170px;margin:0px auto">
          <el-button type="primary" @click="submitForm()">确定</el-button>
          <el-button @click="goTo()">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {feedBackInfos,feedBackSave} from "../../http/request";
import {mapActions,mapState,mapMutations} from 'vuex'
import { Base64 } from 'js-base64';
export default {
  name: "feedBackInfo",
  inject:['replace','reload'],
  data(){
    return {
       formSize:{
         status:'',
         imagesWebUrl:[]
       }
    }
  },
  created(){
    let query=this.$route.query
    feedBackInfos({id:query.id}).then(res=>{
      if(res.code){
        Message.error(res.msg);
      }else{
       let currentRow=res.data.feedbackDO
       this.formSize = Object.assign(this.formSize, currentRow);
       this.formSize.status=JSON.stringify(res.data.feedbackDO.status)
       if(res.data.images.length){
         this.formSize.imagesWebUrl=res.data.images.map(v=>{
           v.imageUrl=Base64.decode(v.imageUrl)
           return v
         })
      }
      }
    })
  },
  computed: {
 },
 methods:{
  goTo(){
    this.$router.push({path:'/app/feedBackList',query:JSON.parse(this.$route.query.msg)})
  },
  //保存
  submitForm(){
    feedBackSave({id:this.$route.query.id,status:this.formSize.status}).then(res=>{
     if(res.code){
        Message.error(res.msg);
      }else{
       this.goTo()
      }
    })
  }
 },
 watch:{
 }
}
</script>
<style scoped>
.content{
  padding:20px;
  overflow: hidden;
}
.info{
  width:500px;
  float: left;
  margin-right: 20px
}
.imgD{
  float: left;
}
.imgD img{
 border:1px dashed #ccc;
 border-radius: 5px;
}
.info span{
  color:#999;
  display: block;
  line-height: 46px;
}
.info span label{
  text-align: right;
  color:#333;
  float: left;
  width:120px;
  margin-right: 10px;
}
.info span i{
  font-style:normal;cursor: pointer;margin-left: 20px
}
.success{
color: #65BB31
}
.normal{
color: #21B4E0;
}
.msg{
color:#f56c6c;font-size:12px;display: block;height: 20px;line-height: 20px;
}
.iSuccess{
  color:#67c23a
}
</style>
