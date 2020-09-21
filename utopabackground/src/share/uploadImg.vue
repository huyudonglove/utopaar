<template>
    <div>
      <el-upload
        class="avatar-uploader"
        :action="`/api/utopa/ar/material/upload/image`"
        :data="msg"
        :headers="header"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
</template>

<script>
    export default {
      name: "uploadImg",
      props:['size','type','id'],
      data() {
        return {
          imageUrl: '',
          msg:{
            limit:5
          },
          header:{
            Authorization:this.$cookies.get('backgroundToken')
          }
        };
      },
      methods: {
        handleAvatarSuccess(res, file) {
          //console.log(res,777)
          this.imageUrl = URL.createObjectURL(file.raw);
          this.$emit('getImg',res.data.originFileName,res.data.fileId,res.data.size,res.data.durationTime,this.type)
        },
        beforeAvatarUpload(file) {
          const isLt2M = file.size / 1024 / 1024 < (this.size*1);
          const isGIF = file.type === 'image/gif';
          const isPNG=file.type=='image/jpeg'||file.type=='image/png';
          if (!isLt2M) {
            this.$message.error(`上传图片大小不能超过 ${this.size}MB!`);
            return  false;//判断size
          }
          if(this.type=='gif'){
            if(!isGIF){
              this.$message.error(`上传图片格式必须为gif!`);
            }
            return isLt2M && isGIF;
          }
          if(this.type=='model'){
            if(!isPNG){
              this.$message.error(`上传图片格式必须为jpg或png!`);
            }
            return isLt2M && isPNG;
          }
        }
      },
      watch:{
        id(){
          this.id?(()=>{
            this.imageUrl=`/api/file/get/${this.id}`;
          })():(()=>{
            this.imageUrl='';
          })();
        }
      },
      mounted() {
        console.log(this.type,999)
        this.id?(()=>{
          this.imageUrl=`/api/file/get/${this.id}`;
        })():(()=>{
          this.imageUrl='';
        })();

      }
    }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px !important;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
