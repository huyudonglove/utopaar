<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span v-if="isCreate" style="font-size:24px;font-weight:bold;color:#614a4d;">新增</span>
      <span v-if="isEdit" style="font-size:24px;font-weight:bold;color:#614a4d;">编辑</span>
      <el-button v-if="!isCreate&&!isEdit" @click="$router.push({path:'/glassesList',query:JSON.parse($route.query.oldQuery)});">返回</el-button>
    </div>
    <el-form label-position="right" label-width="200px" style="width: 100%">
      <el-form-item label="位置选择">
        <div style="position:relative;">
          <el-tree ref="bigTree" :data="treedata" node-key="id" @node-click="showTable" :props="defaulProps" :default-expanded-keys="expandedKeys" :highlight-current="true">
            <span class="span-ellipsis" slot-scope="{ node }">
              <span :title="node.label">{{ node.label }}</span>
            </span>
          </el-tree>
          <div v-if="!isCreate&&!isEdit" style="width:100%;height:110%;position:absolute;left:0;top:-10px;z-index:200"></div>
        </div>
      </el-form-item>
      <el-form-item label="识别图">
        <el-table ref="imgApp" border :data="imgTable" tooltip-effect="dark">
          <el-table-column prop="id" label="投放ID" align="center"></el-table-column>
          <el-table-column label="识别图名称" prop="name" align="center"></el-table-column>
          <el-table-column label="识别图" prop="imgUrl" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.imgUrl?`/static/${scope.row.imgUrl}`:''" alt="" style="width:70px;height:70px;" v-focus>
            </template>
          </el-table-column>
          <el-table-column label="投放位置" align="center">
            <template slot-scope="scope">
              <span>x={{scope.row.positionX}},y={{scope.row.positionY}},z={{scope.row.positionZ}}</span>
            </template>
          </el-table-column>
          <el-table-column label="投放方向" align="center">
            <template slot-scope="scope">
              <span>α={{scope.row.relationX}}°,β={{scope.row.relationY}}°,γ={{scope.row.relationZ}}°</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="应用列表">
        <el-table ref="imgApp" border :data="appTable" tooltip-effect="dark">
          <el-table-column prop="id" label="投放ID" align="center"></el-table-column>
          <el-table-column label="应用名称" prop="name" align="center"></el-table-column>
          <el-table-column label="投放时间" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.startTime}}---{{scope.row.endTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="投放位置" align="center">
            <template slot-scope="scope">
              <span>x={{scope.row.positionX}},y={{scope.row.positionY}},z={{scope.row.positionZ}}</span>
            </template>
          </el-table-column>
          <el-table-column label="投放方向" align="center">
            <template slot-scope="scope">
              <span>α={{scope.row.relationX}}°,β={{scope.row.relationY}}°,γ={{scope.row.relationZ}}°</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button v-if="isCreate||isEdit" type="primary" @click="addOrEdit">确定</el-button>
        <el-button v-if="isCreate||isEdit" @click="$router.push({path:'/glassesList',query:JSON.parse($route.query.oldQuery)});">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {putInTree,putInList,getImage,addGlasses,editGlasses} from '../../http/request'
import {Base64} from 'js-base64'
export default {
  name:'createGlasses',
  inject:['reload'],
  data(){
    return{
      isCreate:false,
      isEdit:false,
      imgTable:[],
      appTable:[],
      treedata:[],
      defaulProps:{label:'name'},
      selectId:'',
      expandedKeys:[]
    }
  },
  methods:{
    getTree(){
      return new Promise((resolve,reject)=>{
        putInTree({}).then(res=>{
          this.treedata = res.data;
          resolve();
        })
      })
    },
    showTable(arr){
      if(arr.type!=6){
        return;
      }
      this.selectId = arr.id;
      getImage({"source":"Middleground","middleGroundAssertId":arr.id,"checkState":2}).then(res=>{
        this.imgTable =res.data.items.map(v=>{
            v.pic?v.imgUrl=Base64.decode(v.pic):null;
            return v;
          });;
      })
      putInList({"assetId":arr.id,"state":1}).then(res=>{
        this.appTable =res.data.items;
      })

    },
    addOrEdit(){
      if(!this.selectId){
        this.$message.error('请选择位置');
        return;
      }
      if(this.isCreate){
        addGlasses({"assetId":this.selectId}).then(res=>{
          this.$router.push({path:'/glassesList',query:JSON.parse(this.$route.query.oldQuery)})
          this.reload();
        })
      }else if(this.isEdit){
        editGlasses({"id":this.$route.query.id,"assetId":this.selectId}).then(res=>{
          this.$router.push({path:'/glassesList',query:JSON.parse(this.$route.query.oldQuery)})
          this.reload();
        })
      }
    }
  },
  async created(){
    await this.getTree();
    if(this.$route.query.assetId){
      this.isEdit = this.$route.query.isEdit?true:false;
      this.expandedKeys =[parseInt(this.$route.query.assetId)];
      this.$nextTick(() => {
        this.$refs.bigTree.setCurrentKey(JSON.parse(this.$route.query.assetId));
      });
      this.showTable({"type":6,"id":parseInt(this.$route.query.assetId)})
    }else{
      this.isCreate=true;
    }
  }
}
</script>
<style scoped>

</style>