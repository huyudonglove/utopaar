<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span v-if="isCreate" style="font-size:24px;font-weight:bold;color:#614a4d;">添加角色</span>
      <span v-if="isEdit" style="font-size:24px;font-weight:bold;color:#614a4d;">编辑角色</span>
    </div>
    <div>
      <el-form label-position="right" label-width="150px" style="width: 70%">
        <el-form-item label="角色名称" :required="true">
          <el-input type="text" v-model="roleName" style="width:300px;" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="description" style="width:300px;" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="权限设置">
          <el-table ref="multipleTable" :data="roleTree" border style="width: 100%" class="mt15 mb15">
            <el-table-column label="功能模块">
              <template slot-scope="scope">
                <!-- <el-checkbox v-model="scope.row.isCheck">{{scope.row.name}}</el-checkbox> -->
                {{scope.row.name}}
              </template>
            </el-table-column>
            <el-table-column label="模块操作">
              <template slot-scope="scope">
                <el-checkbox v-for="(item,idx) in scope.row.permissionList" :key="idx" v-model="item.isCheck">{{item.name}}</el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addOrEdit">确定</el-button>
          <el-button @click="$router.push({path:'/system/rolelist',query:JSON.parse($route.query.oldQuery)});">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {addRole,editRole,getRoleInfo,getRoleTree} from '../../http/request'
export default {
  name:'createRole',
  inject:['reload'],
  data(){
    return{
      isCreate:false,
      isEdit:false,
      roleName:'',
      roleCode:'',//用于保存角色信息的编码
      description:'',
      roleTree:[],
      loading:'',//loading框
    }
  },
  methods:{
    getTree(){
      this.loading=this.$loading({
        lock: true,
        text: '数据获取中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      getRoleTree().then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{ 
          this.roleTree=res.data;
        }
        this.loading.close();
      }).catch(err=>{
        this.loading.close();
      })
    },
    roleInfo(){
      this.loading=this.$loading({
        lock: true,
        text: '数据获取中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      getRoleInfo({"roleId":parseInt(this.$route.query.id)}).then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{  
          this.roleName = res.data.roleName;
          this.roleCode = res.data.roleCode;
          this.description = res.data.description;
          this.roleTree=res.data.list;
        }
        this.loading.close();
      }).catch(err=>{
        this.loading.close();
      })
    },
    addOrEdit(){
      if(this.roleName===''){
        this.$message.error('请输入角色名称');
        return;
      }
      if(this.isCreate){
        addRole({"roleName":this.roleName,"description":this.description,"list":this.roleTree}).then(res=>{
          this.$router.push({path:'/system/rolelist',query:JSON.parse(this.$route.query.oldQuery)});
          this.reload();
        })
      }else if(this.isEdit){
        editRole({"id":parseInt(this.$route.query.id),"roleName":this.roleName,"roleCode":this.roleCode,"description":this.description,"list":this.roleTree}).then(res=>{
          this.$router.push({path:'/system/rolelist',query:JSON.parse(this.$route.query.oldQuery)});
          this.reload();
        })
      }
    }
  },
  created(){
    if(this.$route.query.id){
      this.isEdit=true;
      this.roleInfo();
    }else{
      this.isCreate=true;
      this.getTree();
    }
  }
}
</script>

<style scoped>

</style>