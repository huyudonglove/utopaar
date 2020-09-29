<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span v-if="isCreate" style="font-size:24px;font-weight:bold;color:#614a4d;">添加用户</span>
      <span v-if="isEdit" style="font-size:24px;font-weight:bold;color:#614a4d;">编辑用户</span>
    </div>
    <div>
      <el-card class="box-card"  style="margin-bottom:10px;">
        <div slot="header" class="clearfix">
          <span style="font-size:20px;">基本信息</span>
        </div>
        <el-form label-position="right" label-width="150px" style="width: 70%">
          <el-form-item label="用户名称" :required="true">
            <el-input type="text" v-model="userName" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="邮箱账号" :required="true">
            <el-input type="text" v-model="email" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="角色" :required="true">
            <el-select v-model="roleType" style="width:150px;">
              <el-option v-for="(item,idx) in roleTypeList" :key="idx" :label="item.roleName" :value="item.roleCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" :required="true">
            <el-radio-group v-model="status">
              <el-radio :label="1">在职</el-radio>
              <el-radio :label="2">离职</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="font-size:20px;">账号设置</span>
        </div>
        <el-form label-position="right" label-width="150px" style="width: 70%">
          <el-form-item label="登录密码" :required="true">
            <input  type="text"  class="is-hidden" />
            <el-input :disabled="isEdit" type="password" v-model="password" autocomplete="new-password" placeholder="由6-16位字母+数字的组合" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" :required="true">
            <input  type="text"  class="is-hidden" />
            <el-input :disabled="isEdit" type="password" v-model="confirmPassword" autocomplete="new-password" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addOrEdit">确 定</el-button>
            <el-button @click="$router.push({path:'/system/userlist',query:JSON.parse($route.query.oldQuery)});">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import {addUser,editUser,getUserInfo,getRoleDropDown} from '../../http/request'
export default {
  name:'createUser',
  inject:['reload'],
  data(){
    return{
      isCreate:false,
      isEdit:false,
      userName:'',//用户名
      email:'',//邮箱
      password:'',//密码
      confirmPassword:'',//确认密码
      roleType:'',//角色类型
      roleTypeList:[],//角色类型列表
      status:1,//状态,
      loading:'',//loading框
    }
  },
  computed:{
    allPrams(){
      return{
        userName:this.userName,
        email:this.email,
        status:this.status,
        roleCode:this.roleType,
      }
    }
  },
  methods:{
    dropDown(){//角色下拉框
      return new Promise((resolve,reject)=>{
        getRoleDropDown().then(res=>{
          if(res.code){
            this.$message.error(res.msg);
          }else{
            this.roleTypeList = res.data;
            this.roleType = res.data.length?res.data[0].roleCode:'';
          } 
          resolve();
        }).catch(err=>{
          reject(err);
        })
      })
    },
    userInfo(){
      this.loading=this.$loading({
        lock: true,
        text: '数据获取中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      getUserInfo({"userId":parseInt(this.$route.query.id)}).then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{  
          this.userName = res.data.userName;
          this.email = res.data.email;
          this.status = res.data.status;
          this.roleType = res.data.roleCode;
          this.password=this.confirmPassword='我是密码你信吗？';
        }
        this.loading.close();
      }).catch(err=>{
        this.loading.close();
      })
    },
    addOrEdit(){
      if(!this.allPrams.userName){
        this.$message.error('请填写用户名');
        return;
      }
      if(!this.allPrams.email===''){
        this.$message.error('请填写邮箱');
        return;
      }
      let regEmail = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
      if(regEmail.test(this.allPrams.email)==false){
        this.$message.error('请输入正确的邮箱格式');
        return;
      }
      if(this.password===''){
        this.$message.error('请填写密码');
        return;
      }
      if(this.password !== this.confirmPassword){
        this.$message.error('密码不一致');
        return;
      }
      if(this.isCreate){
        addUser({"password":this.password,...this.allPrams}).then(res=>{
          this.$router.push({path:'/system/userlist',query:JSON.parse(this.$route.query.oldQuery)});
          this.reload();
        })
      }else if(this.isEdit){
        editUser({"id":parseInt(this.$route.query.id),...this.allPrams}).then(res=>{
          this.$router.push({path:'/system/userlist',query:JSON.parse(this.$route.query.oldQuery)});
          this.reload();
        })
      }
      
    },
  },
  async created(){
    try {
      await this.dropDown();
    } catch (error) {
      console.log(error)
    }
    if(this.$route.query.id){
      this.isEdit=true;
      this.userInfo();
    }else{
      this.isCreate=true;
    }
  }
}
</script>

<style scoped>
.is-hidden {
    position: absolute;
    left: -10000px;
    top: -10000px;
}
</style>