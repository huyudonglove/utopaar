<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">{{title}}模块</span>
    </div>
    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="模块类型">
        <el-select :disabled="isSee" v-model="moduleTypeX" style="width:150px;" @change="typeChange">
          <el-option v-for="(item,idx) in moduleTypeList" :key="idx" :label="item.description" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模块标题" prop="moduleTitle">
        <el-input style="width:200px;" :disabled="isSee" v-model="form.moduleTitle" placeholder="请输入内容" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="副标题" v-if="moduleTypeX=='Slide'" prop="subTitle">
        <el-input style="width:200px;" :disabled="isSee" v-model="form.subTitle" placeholder="请输入内容" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="投放时间段" prop="bigTime">
        <el-date-picker
          v-model="form.bigTime"
          type="datetimerange"
          :disabled="isSee"
          format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
          @change="bigTimeChange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="moduleTypeX=='CyclePlay'||moduleTypeX=='Slide'||moduleTypeX=='ImageShow'?'投放内容':'投放应用'" required>
        <el-table ref="multipleTable"
        :data="moduleList"
        tooltip-effect="dark"
        border>
          <el-table-column label="序号" width="50" align="center">
            <template slot-scope="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column label="投放内容" v-if="moduleTypeX=='CyclePlay'||moduleTypeX=='Slide'||moduleTypeX=='ImageShow'||moduleTypeX=='Module3'" align="center" width='210' :key="1">
            <template slot-scope="scope">
              <uploadImg buttonName="图片" :isSee="isSee" :parentName="scope.row.releaseContent" :idx="scope.$index" moduleCode="ARModuleImg" @getImgId="getImgId"></uploadImg>
            </template>
          </el-table-column>
          <el-table-column label="所属地区" align="center"  width="120" :key="2">
            <template slot-scope="scope">
              <div>
                <div style="white-space:pre-line;">{{scope.row.provinceCityArea.split(',').slice(0,2).join('\n')}}</div>
                <div style="cursor:pointer;" v-if="scope.row.provinceCityArea.split(',').length>2&&scope.row.relateType!='2'" @click="showCity(scope)">...</div>
                <div style="cursor:pointer;" v-if="scope.row.provinceCityArea.split(',').length>2&&scope.row.relateType=='2'" @click="openCityDialog(scope)">...</div>
              </div>
              <el-button size="mini" type="primary" plain :disabled="isSee" v-if="scope.row.relateType=='2'&&scope.row.provinceCityArea.split(',').length<=2||moduleTypeX=='Module3'" @click="openCityDialog(scope)">选择地区</el-button>
            </template>
          </el-table-column>
           <el-table-column label="个性化投放时间段" width="440" align="center" :key="3">
            <template slot-scope="scope">
              <el-checkbox :disabled="isSee" v-model="scope.row.isAbleSelectTime"></el-checkbox>
              <el-date-picker
                v-model="scope.row.smallTime"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                :disabled="!scope.row.isAbleSelectTime||isSee"
                @change="smallTimeChange(scope.$index)"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>      
            </template>
          </el-table-column>       
          <el-table-column label="投放标题" align="center" v-if="moduleTypeX=='Module3'" :key="4">
            <template slot-scope="scope">
              <el-tooltip class="item ellipsis" effect="dark" :content="scope.row.releaseTitle" placement="top" :disabled="!scope.row.releaseTitle">
                <el-input
                type="text"
                placeholder="请输入投放标题"
                v-model="scope.row.releaseTitle"
                :disabled="isSee"
                maxlength="50"
              >
              </el-input>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="描述" align="center" v-if="moduleTypeX=='Module3'" :key="5">
            <template slot-scope="scope">
              <el-tooltip class="item ellipsis" effect="dark" :content="scope.row.remark" placement="top" :disabled="!scope.row.remark">
                <el-input
                type="text"
                placeholder="请输入描述"
                v-model="scope.row.remark"
                :disabled="isSee"
                maxlength="50"
              >
              </el-input>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="地理位置" align="center" v-if="moduleTypeX=='Module3'" :key="6">
            <template slot-scope="scope">
              <el-tooltip class="item ellipsis" effect="dark" :content="scope.row.address" placement="top" :disabled="!scope.row.address">
                <el-input
                type="text"
                placeholder="请输入地理位置"
                v-model="scope.row.address"
                :disabled="isSee"
                maxlength="50"
              >
              </el-input>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="关联" width="170" v-if="moduleTypeX=='Module3'" align="center" :key="7">
            <template slot-scope="scope">
              <el-input  style="width:140px;" v-model="scope.row.relateContent" placeholder="请输入URL地址" :disabled="isSee" maxlength="200"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="关联" width="" v-if="moduleTypeX=='CyclePlay'||moduleTypeX=='Slide'||moduleTypeX=='ImageShow'" align="center" :key="8">
            <template slot-scope="scope">
              <el-select :disabled="isSee" v-model="scope.row.relateType" style="width:120px;" @change="selectChange(scope.$index)">
                <el-option v-for="(item,idx) in relateTypeList" :key="idx" :label="item.description" :value="item.code"></el-option>
              </el-select>
              <el-input :disabled="isSee" v-if="scope.row.relateType=='2'" style="width:200px;" v-model="scope.row.relateContent" placeholder="请输入URL地址" maxlength="200"></el-input>
              <el-input disabled v-if="scope.row.relateType=='1'||scope.row.relateType=='3'" style="width:200px;" v-model="scope.row.applicationName" maxlength="50"></el-input>
              <el-button :disabled="isSee" v-if="scope.row.relateType=='1'||scope.row.relateType=='3'" type="primary" plain size="mini" @click="applicationOpen(scope.$index)">选择</el-button>
            </template>
          </el-table-column>
          <el-table-column label="关联应用" v-if="moduleTypeX=='Module1'||moduleTypeX=='Module2'||moduleTypeX=='ApplicationList'" align="center" :key="9">
            <template slot-scope="scope">
              <el-input disabled style="width:200px;" v-model="scope.row.applicationName" maxlength="50"></el-input>
              <el-button :disabled="isSee" type="primary" plain size="mini" @click="applicationOpen(scope.$index)">选择</el-button>
            </template>
          </el-table-column>
            
          <el-table-column label="操作" fixed="right" width="150" align="center">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" :disabled="isSee" @click="del(scope.$index)">删除</el-button>
              <el-button type="primary" size="mini" :disabled="isSee" v-if="scope.$index==moduleList.length-1" @click="addRow()">添加</el-button>
            </template>
          </el-table-column>
          <div slot="empty">
            <p>
              <el-button size="mini" type="primary" :disabled="isSee" @click="addRow()">添加</el-button>
            </p>
          </div>
        </el-table>
      </el-form-item>
      <el-form-item label="使用状态">
        <el-radio-group :disabled="isSee" v-model="state">
        <el-radio :label="1">启用</el-radio>
        <el-radio :label="2">禁用</el-radio>
      </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button v-if="isCreate||isEdit" type="primary" @click="addOrEdit">确 定</el-button>
        <el-button @click="$router.push({path:'/app/modulelist',query:JSON.parse($route.query.oldQuery)})">返回</el-button>       
      </el-form-item>
    </el-form>
    <div>
      <selectApplication :fSee="showApplication" @applicationClose="applicationClose" @getApplicationDtailId="getApplicationDtailId"></selectApplication>
    </div>
    <el-dialog :visible.sync="cityShow" width="200px" :destroy-on-close="true" center>
      <div style="white-space:pre-line;text-align:center;">{{this.citys}}</div>
    </el-dialog>
    <el-dialog title="选择地区" :visible.sync="cityVisible" width="500px" :close-on-click-modal="false" @close="closeDialog" :destroy-on-close="true" center>
      <div style="overflow:hidden;">
        <div style="float:left;width:49%;height:300px;overflow:auto;border:1px solid #ccc;">
          <el-tree
            :data="cityTree"
            show-checkbox
            node-key="id"
            ref="cityTree"
            highlight-current
            @check-change="getCheckedNodes"
            :props="cityProps">
          </el-tree>
        </div>
        <div style="float:left;width:49%;height:300px;overflow:auto;border:1px solid #ccc;">
          <div style="text-align:center;margin:5px 0;" v-for="(item,i) in cityValue" :key="i">
            <el-tag
              closable
              ref="cityTags"
              :disable-transitions="false"
              @close="cityTagsClose(item.id)">
              {{item.name}}
            </el-tag>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import selectApplication from './selectAppplication'
import uploadImg from '../../share/uploadImg'
import {getDropdown,getModuleDetail,createModule,editModule,getCityTree} from '../../http/request'
export default {
  name:'createModule',
  inject:['reload'],
  components:{
    selectApplication,
    uploadImg,
  },
  data(){
    return{
      isCreate:false,
      title:'',//头部标题
      isEdit:false,
      isSee:false,
      moduleTypeX:'',//类型
      moduleTypeList:[],//下拉框列表
      relateType:'',//关联类型
      relateTypeList:[],//关联类型下拉框列表
      form:{
        moduleTitle:'',
        subTitle:'',//副标题
        bigTime:[],//模块时间段
      },
      rules:{
        moduleTitle: [
          { required: true, message: '请输入模块标题', trigger: 'blur' }
        ],
        subTitle: [
          { required: true, message: '请输入副标题', trigger: 'blur' }
        ],
        bigTime: [
          { required: true, message: '请选择投放时间', trigger: 'blur' }
        ],
      },
      moduleList:[],
      state:1,
      showApplication:false,
      smallTime:[],//个性化时间段
      // relateOption:"1",//关联选择器
      // address:'',//自定义url地址
      applicationIndex:'',//保存选择弹窗的行索引
      loading:'',//请求数据加载框
      cityShow:false,
      citys:'',
      cityTree:[],
      cityValue:[],
      cityProps:{
        children:'children',
        label:'name'
      },
      cityVisible:false,
      cityIndex:''
    }
  },
  computed:{
    module(){
      return{
        "category": this.moduleTypeX,
        "title": this.form.moduleTitle,
        "effectFrom": this.form.bigTime&&this.form.bigTime.length?this.form.bigTime[0]:'',
        "effectTo": this.form.bigTime&&this.form.bigTime.length?this.form.bigTime[1]:'',
        "status": this.state,
        "subTitle":this.form.subTitle,
        "modifyBy": ""
      }
    },
    contents(){
      return{
        "id":"",
        "moduleId":this.$route.query.id?this.$route.query.id:'',
        "releaseContent":"",
        "relateType":this.moduleTypeX !=='Module3'?this.relateType=this.relateType:this.relateType='2',
        "relateContent":"",
        "applicationName":"",
        "provinceCityArea":"",
        "cityIds":"",
        "releaseTitle":"",
        "remark":"",
        "address":""
      }
    }
  },
  watch:{
    
  },
  methods:{
    showCity(scope){
      this.cityShow=true;
      this.citys = scope.row.provinceCityArea.split(',').join('\n');
    },
    cityTagsClose(id) {
      this.cityValue.splice(this.cityValue.map(v=>v.id).indexOf(id), 1);
      this.$refs.cityTree.setChecked(id,false);
    },
    getCheckedNodes(data,checked,indeterminate){
      let arr =this.$refs.cityTree.getCheckedNodes().filter(v=>v.children===undefined);
      let brr =[];
      arr.forEach(v=>{
        brr.push({"name":this.$refs.cityTree.getNode(v.parentId).data.name+'-'+v.name,"id":v.id});
      })
      this.cityValue=brr;
      console.log(brr)
    },
    openCityDialog(scope){
      this.cityVisible=true;
      this.cityIndex=scope.$index;
      let arr = scope.row.provinceCityArea.split(',');
      let brr = scope.row.cityIds.split(',');
      console.log(arr,12)
      arr.forEach((v,i)=>{
        if(v!==""){
          this.cityValue.push({"name":v,'id':brr[i]});
          this.$nextTick(()=>{
            this.$refs.cityTree.setChecked(brr[i],true);
          })
        }
      })
    },
    closeDialog(){
      this.moduleList[this.cityIndex].provinceCityArea=this.cityValue.map(v=>v.name).join(',');
      this.moduleList[this.cityIndex].cityIds=this.cityValue.map(v=>v.id).join(',');
      this.cityValue=[];
    },
    typeChange(){//模块切换清空数据
      this.form.moduleTitle='';
      this.form.subTitle='';
      this.form.bigTime=[];
      this.moduleList=[];
    },
    addRow(){
      this.moduleList.push({isAbleSelectTime:true,...this.contents,"effectFrom":this.form.bigTime.length?this.form.bigTime[0]:'',"effectTo":this.form.bigTime.length?this.form.bigTime[1]:'',"smallTime":this.form.bigTime.length?JSON.parse(JSON.stringify(this.form.bigTime)):[]});
    },
    del(index){
      this.moduleList.splice(index,1) 
    },
    applicationOpen(index){//打开应用详情弹窗
      this.showApplication = true;
      this.applicationIndex = index;
    },
    getApplicationDtailId(data){//获取选择的应用详情id
      this.moduleList[this.applicationIndex].relateContent=data.id;
      this.moduleList[this.applicationIndex].applicationName = data.name;
      this.moduleList[this.applicationIndex].provinceCityArea=data.provinceCityArea;
      this.moduleList[this.applicationIndex].cityIds=data.cityIds;
    },
    applicationClose(){//关掉应用详情弹窗
      this.showApplication = false;
    },
    getModuleType(){//获取下拉框
      return new Promise((resolve,reject)=>{
        getDropdown({category:'moduleType'}).then(res=>{
          this.moduleTypeList = res.data;
          this.moduleTypeX = this.moduleTypeList[0].code;
          resolve();
        })
        getDropdown({category:'relateType'}).then(res=>{
          console.log('下拉框列表')
          this.relateTypeList = res.data.slice(0,2);
          this.relateType = this.relateTypeList[0].code;
        })
      })
    },
    getImgId(imgId,imgName,idx){//获取上传的图片id
      this.moduleList[idx].releaseContent=imgId;
    },
    bigTimeChange(){
      if(this.form.bigTime==null||(typeof this.form.bigTime[0]) =='object'){
        this.form.bigTime=[];
        return;
      }else{
        if(!this.judgeBigTime(this.form.bigTime)){
          this.$message.error('有个性化投放时间超出投放时间');
          this.form.bigTime=[];
          return;
        }
      }
    },
    smallTimeChange(index){
      if(this.moduleList[index].smallTime){
        if(!this.judgeSmallTime(this.moduleList[index].smallTime)){
          this.moduleList[index].smallTime=null;
          return;
        };
        this.moduleList[index].effectFrom =this.moduleList[index].smallTime[0];
        this.moduleList[index].effectTo =this.moduleList[index].smallTime[1];
      }else{
        this.moduleList[index].effectFrom='';
        this.moduleList[index].effectTo='';
      }
    },
    selectChange(index){//关联类型变化，清掉选的内容
      this.moduleList[index].relateContent='';
      this.moduleList[index].applicationName='';
      this.moduleList[index].provinceCityArea='';
      this.moduleList[index].cityIds='';
      console.log(111,22,'关联')
      // this.moduleList[index].effectFrom='';
      // this.moduleList[index].effectTo='';
      // this.moduleList[index].isAbleSelectTime=false;
      // this.moduleList[index].smallTime=[];
    },
    getTree(){
      getCityTree().then(res=>{
        this.cityTree=res.data;
      })
    },
    getDetail(){
      this.loading=this.$loading({
        lock: true,
        text: `数据获取中...`,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      getModuleDetail({moduleId:this.$route.query.id}).then(res=>{
        this.loading.close();
        if(res.data.contents.length>0){
          res.data.contents.forEach(v=>{
            if(v.effectFrom){
              v.smallTime=[v.effectFrom,v.effectTo];
              v.isAbleSelectTime=true;
            }else{
              v.smallTime=[];
              v.isAbleSelectTime=false;
            }
          });
        }
        this.moduleList = res.data.contents;
        this.moduleTypeX = res.data.module.category;
        this.form.moduleTitle = res.data.module.title;
        this.form.subTitle = res.data.module.subTitle;
        this.form.bigTime = [res.data.module.effectFrom,res.data.module.effectTo];
        this.state = res.data.module.status;
        this.moduleId = res.data.module.id;//保存模块id
      }).catch(u=>{
        this.loading.close();
      })
    },
    judgeBigTime(time){
      if(!this.moduleList.length){
        return true;
      }
      let bigTime1 = new Date(time[0].replace('-','/'));
      let bigTime2 = new Date(time[1].replace('-','/'));
      let timeLIst = this.moduleList.filter(v=>v.effectFrom&&v.effectTo);
      if(!timeLIst.length){return true;}
      return !timeLIst.some(v=>{
        var startTime = new Date(v.effectFrom.replace('-','/'));
        var endTime = new Date(v.effectTo.replace('-','/'));
        return startTime-bigTime1<0||endTime-bigTime2>0;
      })
    },
    judgeSmallTime(time){
      if(!this.form.bigTime.length){
        return true;
      }
      let startTime = new Date(time[0].replace('-','/'));
      let endTime = new Date(time[1].replace('-','/'));
      let bigTime1 = new Date(this.form.bigTime[0].replace('-','/'));
      let bigTime2 = new Date(this.form.bigTime[1].replace('-','/'));
      if(startTime-bigTime1<0||endTime-bigTime2>0){
        this.$message.error('个性化投放时间必须在投放时间内');
        return false;
      }else{
        return true;
      }
    },
    addOrEdit(type){
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(this.moduleList.length<1){
            this.$message.error(`请添加${this.moduleTypeX=='CyclePlay'||this.moduleTypeX=='Slide'||this.moduleTypeX=='ImageShow'?'投放内容':'投放应用'}`);
            return;
          }
          if(this.moduleList.length>0){
            var isTimeOk = this.moduleList.some(v=>v.effectFrom==false);
            if(isTimeOk){
              this.$message.error('请选择个性化投放时间段');
              return;
            }
            var isContentOk = this.moduleList.some(v=>v.relateContent==false);
            if(isContentOk){
              this.$message.error('请选择关联应用或者输入关联地址');
              return;
            }
            // var isReleaseTitle = this.moduleList.some(v=>v.releaseTitle==="");
            // if(isReleaseTitle&&this.moduleTypeX=='Module3'){
            //   this.$message.error('请输入投放标题');
            //   return;
            // }
            // var isRemark = this.moduleList.some(v=>v.remark==="");
            // if(isRemark&&this.moduleTypeX=='Module3'){
            //   this.$message.error('请输入投放描述');
            //   return;
            // }
            // var isAddress = this.moduleList.some(v=>v.address==="");
            // if(isAddress&&this.moduleTypeX=='Module3'){
            //   this.$message.error('请输入地理位置');
            //   return;
            // }
          }
          if(this.isCreate){
            createModule({"module":this.module,"contents":this.moduleList}).then(res=>{
              this.$router.push({path:'/app/modulelist',query:JSON.parse(this.$route.query.oldQuery)});
              this.reload();
            })  
          }else if(this.isEdit){
            editModule({"module":{id:this.moduleId,...this.module},"contents":this.moduleList}).then(res=>{
              this.$router.push({path:'/app/modulelist',query:JSON.parse(this.$route.query.oldQuery)});
              this.reload();
            })
          }      
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      
    },   
  },
  async created(){
    await this.getModuleType();
    this.getTree();
    if(this.$route.query.isEdit){
      this.isEdit = true;
      this.title = '编辑';
      this.getDetail();
    }else if(this.$route.query.isSee){
      this.isSee = true;
      this.title = '查看';
      this.getDetail();
    }else{
      this.isCreate = true;
      this.title = '创建';
    }
  }
}
</script>

<style>
.ellipsis input.el-input__inner{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>