<template>
  <div>
    <input v-show="false" type="file" ref="fileCtrl">
    <div class="uploadImg">
      <img width="250" height="250" :src="picId&&!preURL?`/download/file/get/${picId}`:preURL" v-show="preURL||picId">
      <!-- 遮罩层 -->
      <div class="cover" v-show="!preURL&&!picId&&!isloading" @click="clickButton">
        <span class="title">图片格式为jpg/png</span>
      </div>
       <!-- 上传loading -->
       <div v-if="isloading" class="loadBox">
          <svg viewBox="25 25 50 50" class="circular load"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>
          <p class="loadwenzi">图片上传中...</p>
       </div>
      
     <!-- 更换图片 -->
      <div class="change" v-show="(preURL||picId)&&!isloading" @click="clickButton">更换图片</div>
      <!-- 警告 -->
      <div class="warn" v-show="rate!==''&&rate>=0&&rate<3">
        <img src="../assets/warn.png"/>
      </div>
      
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  props: ["picId","rate","imageDatabaseId"],
  data() {
    return {
      preURL: "",
      isloading:false,
      loading:''
    };
  },
  computed:{
   
  },
  methods: {
    upload() {
      // 创建虚拟表单
      const form = new FormData();    
      // 将图片空间中的图片追加到虚拟表单中
      form.append("file", this.$refs.fileCtrl.files[0]);
      form.append("imageDatabaseId", this.imageDatabaseId);
      this.uploadMap(form).then(v=>{
        // console.log(v,111)
        //隐藏loading
        this.isloading = false;
        this.loading.close();
      }).catch(u=>{
        this.isloading = false;
        this.loading.close();
      });
    },
    ...mapActions("uploadMap", ["uploadMap"]),

    // 用户选择好图之后的事情
    changeHandle() {
     // 判断是否为jpg/png类型的图片，不是就提示不允许上传
    // console.log(this.$refs.fileCtrl.files[0].type)
    if(this.$refs.fileCtrl.files[0].type!='image/png'&&this.$refs.fileCtrl.files[0].type!='image/jpeg'){
    this.$message.error('只允许上传png/jpg类型的图片，请重新上传')
    return;
    }else if(this.$refs.fileCtrl.files[0].size>2*1024*1024){
      this.$message.error('上传的图片的大于2M,请重新选择')
      return;
    }else{
      
    }
       //显示上传loading
      this.isloading = true;
      //加载全屏loading
      this.loading = this.$loading({
          lock: true,
          text: '图片上传中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      // 创建文件读取器
      const fileReader = new FileReader();
        // let fileCtrls= this.$refs.fileCtrl.files[0]
      // 读取用户选择的文件内容，读为URL地址（就是base64编号图片）
      fileReader.readAsDataURL(this.$refs.fileCtrl.files[0]);

      // 读取完毕（此时还没上传）
      fileReader.onload = e => {
        // this.preURL = e.target.result;
        this.upload()
      };
    },
    clickButton(){
      let fileCtrls= this.$refs.fileCtrl;
      fileCtrls.value = '';//将上一次选择的图片清空
      fileCtrls.click();
      fileCtrls.onchange=()=>{
        this.changeHandle();
      }
    }
  }
};
</script>
<style scoped>
.uploadImg {
  width: 250px;
  height: 250px;
  overflow: hidden;
  background-image:url("../assets/uploadBg.png");
  background-size: 250px 250px;
  position: relative; 
}
.cover{
  width: 250px;
  height: 250px;
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 0; 
}
.title{
  color: #9F9795;
  font-size: 20px;
  position: absolute;
  left:36px;
  top:125px;
}
.change{
  background-color:#FF644E; 
  opacity: 0.7;
  position: absolute;
  width:100%;
  left: 0px;
  text-align: center;
  bottom: 0px;;
  font-size: 18px;
  color: #fff;
  cursor: pointer;
  z-index: 5;
  height:40px;
  line-height:40px;
}
.loadBox{
  position: absolute;
  left:50%;
  top:50%;
  width:100px;
  height: 150px;
  transform: translate(-50%,-50%);
}
.loadwenzi{
  position: absolute;
  bottom: 0;
  left: 0;
  text-align: center;
  color: #FF644E;
}
.load{ 
  position: absolute;
  left:50%;
  top:50%;
  transform: translate(-50%,-50%); 
  height: 42px;
  width: 42px;
  color: #606266;
  animation: loading-rotate 2s linear infinite;
}
.path{
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90,150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: #FF644E;
  stroke-linecap: round;
}

@keyframes loading-rotate{
  100% {
    transform:translate(-50%,-50%) rotate(1turn);
  }
}
@keyframes loading-dash{
  0% {
    stroke-dasharray: 1,200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90,150;
    stroke-dashoffset: -40px;
  }

  100% {
    stroke-dasharray: 90,150;
    stroke-dashoffset: -120px;
  }
}
.warn{
  position: absolute;
  right: 0;
  top: 0;
}

</style>
