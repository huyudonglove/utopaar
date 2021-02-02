<template>
  <el-container style="margin-top: 10px">
    <el-input disabled v-model="inputPackage"></el-input>
    <el-button size="small" type="primary" @click="fileSelect">上传{{buttonName}}</el-button>
    <input ref="files" type="file" style="display:none;">
    <el-button  icon="el-icon-delete" size="mini" style='margin-left:10px' type="danger" @click='deleteFile'></el-button>
  </el-container>
</template>
<script>
import {uploadSdk,uploadMaterial,uploadlyric} from '../http/request'
export default {
  name: "uploadFile",
  props: ["buttonName","parentName","moduleCode",'type'],
  computed: {

  },
  watch:{
    parentName(){
      this.inputPackage = this.parentName;
    }
  },
  mounted(){
    this.inputPackage = this.parentName;
    console.log(this.parentName,8888)
  },
  data() {
    return {
      inputPackage: "",
      packageId:"",
      size:''
    };
  },
  created() {

  },
  methods: {
    fileSelect() {
      let fileNode = this.$refs.files;
      fileNode.value = '';//清空原有文件
      fileNode.click();
      fileNode.onchange = () => {
        //判断是否为zip类型的压缩包，不是就提示不允许上传
        // if(fileNode.files[0].name.split('.')[1]!='zip'){
        //   this.$message.error('只允许上传zip类型的压缩包，请重新上传');
        //   return;
        // }
        var name=fileNode.files[0].name.split('.');
        //console.log(name[name.length-1],999);
        var nameCopy=name[name.length-1];
        let m=fileNode.files[0].size/(1024*1024);
        //上传音乐
        this.type=='music'?(()=>{
          nameCopy=='mp3'||nameCopy=='wav'||nameCopy=='ogg'||nameCopy=='mid'?(()=>{
            m<10?(()=>{
              const loading = this.$loading({
                lock: true,
                text: '上传中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });
              const form = new FormData();
              // 将选中文件追加到虚拟表单中
              form.append("file", fileNode.files[0]);
              form.append("copyFile", fileNode.files[0]);
              form.append("type", "file");
              form.append("moduleCode", this.moduleCode);

              uploadSdk(form).then(res=>{
                res.code?this.$message.error(res.msg):(()=>{
                  this.packageId = res.data.fileId;
                  this.inputPackage = res.data.originFileName;
                  this.size=res.data.size;
                  this.$emit('getSdkId',res.data.fileId,this.inputPackage,this.size,res.data.durationTime,'music',res.data.materialFormat);
                })();
                loading.close();
              })
            })():this.$message.error('文件过大，请更换小于10M文件')
          })():this.$message.error('音乐格式错误');
        })():'';
        //上传安卓包
        this.type=='android'?(()=>{
          nameCopy=='utopa'?(()=>{
            const loading = this.$loading({
              lock: true,
              text: '上传中',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            const form = new FormData();
            // 将选中文件追加到虚拟表单中
            form.append("file", fileNode.files[0]);
            //form.append("copyFile", fileNode.files[0]);
            form.append("type", "file");
            form.append("moduleCode", this.moduleCode);

            uploadMaterial(form).then(res=>{
              res.code?this.$message.error(res.msg):(()=>{
                console.log(res,9999)
                this.packageId = res.data.fileId;
                this.inputPackage = res.data.originFileName;
                this.size=res.data.size;
                this.$emit('getSdkId',res.data.fileId,this.inputPackage,this.size,res.data.durationTime,'android');
              })();
              loading.close();
            })
          })():this.$message.error('安卓包格式错误')
        })():'';
        //上传IOS包
        this.type=='ios'?(()=>{
          nameCopy=='utopa'?(()=>{
            const loading = this.$loading({
              lock: true,
              text: '上传中',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            const form = new FormData();
            // 将选中文件追加到虚拟表单中
            form.append("file", fileNode.files[0]);
            //form.append("copyFile", fileNode.files[0]);
            form.append("type", "file");
            form.append("moduleCode", this.moduleCode);

            uploadMaterial(form).then(res=>{
              res.code?this.$message.error(res.msg):(()=>{
                console.log(res,9999)
                this.packageId = res.data.fileId;
                this.inputPackage = res.data.originFileName;
                this.size=res.data.size;
                this.$emit('getSdkId',res.data.fileId,this.inputPackage,this.size,res.data.durationTime,'ios');
              })();
              loading.close();
            })
          })():this.$message.error('ios包格式错误')
        })():'';
      //上传歌词
      this.type=='lyric'?(()=>{
        nameCopy=='lrc'?(()=>{
          const loading = this.$loading({
            lock: true,
            text: '上传中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          const form = new FormData();
          // 将选中文件追加到虚拟表单中
          form.append("file", fileNode.files[0]);
          //form.append("copyFile", fileNode.files[0]);
          uploadlyric(form).then(res=>{
            res.code?this.$message.error(res.msg):(()=>{
              console.log(res,999);
              this.packageId = res.data.fileId;
              this.inputPackage = res.data.originFileName;
              this.$emit('getSdkId',res.data.fileId,this.inputPackage,res.data.size,res.data.durationTime,'lyric');
            })();
            loading.close();
          })
        })():this.$message.error('歌词格式错误');
      })():'';
      //上传mp4视频
        this.type=='video'?(()=>{
          nameCopy=='mp4'?(()=>{
            const loading = this.$loading({
              lock: true,
              text: '上传中',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            const form = new FormData();
            // 将选中文件追加到虚拟表单中
            form.append("file", fileNode.files[0]);
            form.append("copyFile", fileNode.files[0]);
            form.append("type", "file");
            form.append("moduleCode", this.moduleCode);
            uploadSdk(form).then(res=>{
              res.code?this.$message.error(res.msg):(()=>{
                console.log(res,999);
                this.packageId = res.data.fileId;
                this.inputPackage = res.data.originFileName;
                this.size=res.data.size;
                this.$emit('getSdkId',res.data.fileId,this.inputPackage,this.size,res.data.durationTime,'video');
              })();
              loading.close();
            })
          })():this.$message.error('视频格式错误');
        })():'';
        //上传window包
        this.type=='windows'?(()=>{
          nameCopy=='utopa'?(()=>{
            const loading = this.$loading({
              lock: true,
              text: '上传中',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            const form = new FormData();
            // 将选中文件追加到虚拟表单中
            form.append("file", fileNode.files[0]);
            //form.append("copyFile", fileNode.files[0]);
            form.append("type", "file");
            form.append("moduleCode", this.moduleCode);

            uploadMaterial(form).then(res=>{
              res.code?this.$message.error(res.msg):(()=>{
                console.log(res,9999)
                this.packageId = res.data.fileId;
                this.inputPackage = res.data.originFileName;
                this.size=res.data.size;
                this.$emit('getSdkId',res.data.fileId,this.inputPackage,this.size,res.data.durationTime,'windows');
              })();
              loading.close();
            })
          })():this.$message.error('windows包格式错误');
        })():'';
       //上传uwp
       this.type=='uwp'?(()=>{
          nameCopy=='utopa'?(()=>{
            const loading = this.$loading({
              lock: true,
              text: '上传中',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            const form = new FormData();
            // 将选中文件追加到虚拟表单中
            form.append("file", fileNode.files[0]);
            //form.append("copyFile", fileNode.files[0]);
            form.append("type", "file");
            form.append("moduleCode", this.moduleCode);

            uploadMaterial(form).then(res=>{
              res.code?this.$message.error(res.msg):(()=>{
                console.log(res,9999)
                this.packageId = res.data.fileId;
                this.inputPackage = res.data.originFileName;
                this.size=res.data.size;
                this.$emit('getSdkId',res.data.fileId,this.inputPackage,this.size,res.data.durationTime,'uwp');
              })();
              loading.close();
            })
          })():this.$message.error('pc包格式错误');
        })():''; 
      //上传配置文件
      this.type=='config'?(()=>{
            const loading = this.$loading({
              lock: true,
              text: '上传中',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            const form = new FormData();
            // 将选中文件追加到虚拟表单中
            form.append("file", fileNode.files[0]);
            //form.append("copyFile", fileNode.files[0]);
            form.append("type", "file");
            form.append("moduleCode", this.moduleCode);

            uploadMaterial(form).then(res=>{
              res.code?this.$message.error(res.msg):(()=>{
                console.log(res,9999)
                this.packageId = res.data.fileId;
                this.inputPackage = res.data.originFileName;
                this.size=res.data.size;
                this.$emit('getSdkId',res.data.fileId,this.inputPackage,this.size,res.data.durationTime,'config');
              })();
              loading.close();
            })
        })():'';

      };

    },
    deleteFile(){
      //console.log(111);
      if(this.type=='music'){
          this.$emit('getSdkId',null,null,null,null,'music',null);
      }else if(this.type=='android'){
          this.$emit('getSdkId',null,null,null,null,'android');
      }else if(this.type=='ios'){
          this.$emit('getSdkId',null,null,null,null,'ios');
      }else if(this.type=='lyric'){
          this.$emit('getSdkId',null,null,null,null,'lyric');
      }else if(this.type=='video'){
          this.$emit('getSdkId',null,null,null,null,'video');
      }else if(this.type=='windows'){
          this.$emit('getSdkId',null,null,null,null,'windows');
      }else if(this.type=='uwp'){
          this.$emit('getSdkId',null,null,null,null,'uwp');
      }
    }
  }
};
</script>
<style scoped>
</style>

