<template>
    <div v-if="typePower.length">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">类别管理</span>
        <el-button style="float:right;" type="primary" @click="dialogVisible=true" :disabled="!typePower[0].isCheck">新增</el-button>
      </div>
      <div style="margin-top: 10px;margin-bottom: 10px;">
        <el-input v-model="word" style="width: 200px;" suffix-icon="el-icon-search" maxlength="50" placeholder="输入关键字"></el-input>
        <span class="myWords">
        创建时间：
        <el-date-picker v-model="timeValue" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </span>
        <span>
        <span class="myWords">选择模块：</span>
        <span>
                  <el-select v-model="moduleHead" placeholder="请选择" @change="getTree">
                      <el-option label="全部" value=""></el-option>
                      <el-option v-for="item in modelItems" :key="item.id" :label="item.value" :value="item.code">
                      </el-option>
                  </el-select>
        </span>
      </span>
        <el-button @click="delectAll" :disabled="!typePower[3].isCheck" type="danger" style="float:right;" >批量删除</el-button>
      </div>
      <div>
        <el-table :data="tableData" border style="width: 100%" @selection-change="selectAll" :max-height="tableHeight" ref="mangerRef" @sort-change="changeUpadte">
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column prop="id" label="ID" width="50" align="center">
          </el-table-column>
          <el-table-column prop="name" label="类别名称" width="150" align="center" sortable="custom">
          </el-table-column>
          <el-table-column  label="所属模块"  align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.module==100">音乐</span>
              <span v-if="scope.row.module==101">动画</span>
              <span v-if="scope.row.module==102">载体模型</span>
              <span v-if="scope.row.module==103">普通模型</span>
              <span v-if="scope.row.module==104">在线视频</span>
              <span v-if="scope.row.module==105">抠像视频</span>
              <span v-if="scope.row.module==107">MP4视频</span>
              <span v-if="scope.row.module==108">钢琴</span>
              <span v-if="scope.row.module==109">动画音乐</span>
              <span v-if="scope.row.module==110">MP4模型</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" sortable="custom">
          </el-table-column>
          <el-table-column prop="updateTime" label="修改时间"  align="center" sortable="custom">
          </el-table-column>
          <el-table-column prop="updateUser" label="最后修改人"  align="center">
          </el-table-column>
          <el-table-column fixed="right" label="操作"  align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="module=scope.row.module+'';dialogVisible=true;getTree();" :disabled="!typePower[1].isCheck">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <pagination v-if="showPagenation"></pagination>
      </div>
      <div>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="40%"  @close="module='';tree=[];"><!--分类栏-->
          <div style="padding-bottom: 10px">
            <span class="myWords">选择模块</span>
            <span>
                  <el-select v-model="module" placeholder="请选择" @change="getTree">
                      <el-option v-for="item in modelItems" :key="item.id" :label="item.value" :value="item.code">
                      </el-option>
                  </el-select>
            </span>
          </div>
          <div >
            <div style="min-height: 80px">
              <div v-for="item in tree"  >
                <div class="el-tree-node__content" style="padding-left: 0;"><!--一级分类-->
                  <span class="custom-tree-node"  style="width: 100%;display: inline-block">
                   <span @click="item.show=!item.show">
                     <span :class="item.show?(`expanded el-tree-node__expand-icon el-icon-caret-right`):(`el-tree-node__expand-icon el-icon-caret-right`)" ></span>
                     <span >{{item.name}}</span>
                   </span>
                    <span style="float: right">
                      <el-button @click="showLevel(2,item.id)" size="mini" type="text" :disabled="!typePower[0].isCheck">新增二级分类</el-button>
                      <el-button @click="showEdit(1,item)" size="mini" type="text" :disabled="!typePower[1].isCheck">编辑</el-button>
                      <el-button @click="deleteTitle(item.id)" style="color: red;" size="mini" type="text" :disabled="!typePower[3].isCheck">删除</el-button>
                    </span>
                 </span>
                </div>
                <div v-for="apple in item.children" v-if="item.show">
                  <div class="el-tree-node__content" style="padding-left: 18px;"><!--二级分类-->
                    <span class="custom-tree-node" style="width: 100%;display: inline-block">
                      <span @click="apple.show=!apple.show">
                        <span :class="apple.show?(`expanded el-tree-node__expand-icon el-icon-caret-right`):(`el-tree-node__expand-icon el-icon-caret-right`)" ></span>
                        <span>{{apple.name}}</span>
                      </span>
                     <span style="float: right">
                       <el-button  @click="showLevel(3,apple.id)" size="mini" type="text" :disabled="!typePower[0].isCheck">新增三级分类</el-button>
                       <el-button @click="showEdit(2,apple)" size="mini" type="text" :disabled="!typePower[1].isCheck">编辑</el-button>
                       <el-button @click="deleteTitle(apple.id)" size="mini" type="text" style="color: red;" :disabled="!typePower[3].isCheck">删除</el-button>
                     </span>
                   </span>
                  </div>
                  <div v-if="apple.children&&apple.show">
                    <div v-for="i in apple.children" style="padding-left: 36px;" class="el-tree-node__content" >
                     <span class="custom-tree-node" style="width: 100%;display: inline-block">
                       <span>
                         <span class="expanded el-tree-node__expand-icon el-icon-caret-right"></span>
                         <span>{{i.name}}</span><!--三级分类-->
                       </span>
                       <span style="float: right">
                         <el-button @click="showEdit(3,i)" size="mini" type="text" :disabled="!typePower[1].isCheck">编辑</el-button>
                         <el-button @click="deleteTitle(i.id)" style="color: red;" size="mini" type="text" :disabled="!typePower[3].isCheck">删除</el-button>
                       </span>
                     </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style="padding-top: 10px" v-if="module">
            <el-button @click="showLevel(1)">新增一级分类</el-button>
          </div>

        </el-dialog>
        <el-dialog title="提示" :visible.sync="nav" width="30%" ><!--创建输入框提示-->
          <div>
            <span v-if="this.level==1">新增一级分类</span>
            <span v-if="this.level==2">新增二级分类</span>
            <span v-if="this.level==3">新增三级分类</span>
            <span>
              <el-input v-model="name"></el-input>
            </span>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="nav = false;cancle();">取 消</el-button>
            <el-button type="primary" @click="addTitle(id)" v-if="this.level==1">新增一级分类</el-button>
            <el-button type="primary" @click="addTitle(id)" v-if="this.level==2">新增二级分类</el-button>
            <el-button type="primary" @click="addTitle(id)" v-if="this.level==3">新增三级分类</el-button>
          </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="edit" width="30%" ><!--编辑输入框提示-->
          <div>
            <span v-if="this.level==1">编辑一级分类</span>
            <span v-if="this.level==2">编辑二级分类</span>
            <span v-if="this.level==3">编辑三级分类</span>
            <span>
              <el-input v-model="name"></el-input>
            </span>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="edit=false;cancle();">取 消</el-button>
            <el-button type="primary" @click="editTitle()" v-if="this.level==1">编辑一级分类</el-button>
            <el-button type="primary" @click="editTitle()" v-if="this.level==2">编辑二级分类</el-button>
            <el-button type="primary" @click="editTitle()" v-if="this.level==3">编辑三级分类</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
</template>

<script>
  import {getmaterial,getSelect,addTitle,getTree,editTitle,deleteTitle} from "@/http/request";
  import pagination from '@/share/pagination'
  import {mapState} from 'vuex'
    export default {
        name: "manger",
        data() {
          return {
            word: '',
            createTime: '',
            reviseTime: '',
            dialogVisible: false,
            tableData:[],
            selected:[],
            type:'',
            model:'',
            modelItems:[],
            nav:false,
            name:'',
            parentId:0,
            module:'',
            tree:[],
            level:'',
            id:0,
            edit:false,
            first:false,
            second:false,
            moduleHead:'',
            showPagenation:false,
            tableHeight:0,
            timeValue:[],
            wordState:'',
            upS:''
          }
        },
      inject:['replace','reload'],
      components:{
          pagination
      },
      computed:{
        ...mapState('pagination',['limitPage','clickPage']),
        ...mapState('currentUserPower',['typePower'])
      },
      methods:{
        delectAll(){
          let apple=[];
          this.selected.map(v=>{
            apple.push(v.id)
          })
          apple.length?(()=>{
            deleteTitle(apple).then(res=>{
              this.reload();
            })

          })():this.$message.error('请选择需要删除的对象')
        },
        selectAll(val){
          console.log(val,888)
          this.selected=val;
        },
        getmaterial(){
          let msg={
            name:this.$route.query.word||'',
            pageNum:this.$route.query.clickPage||1,
            pageSize:this.$route.query.limitPage||20,
            createTimeStart:this.timeValue?this.timeValue[0]:'',
            createTimeEnd:this.timeValue?this.timeValue[1]:'',
            module:this.moduleHead,
            sortColumn:this.wordState,
            order:this.upS
          }
          getmaterial(msg).then(res=>{
            this.tableData=res.data.items;
            this.$store.commit('pagination/setTotal',res.data.total);
          })
        },
        getSelect(){
              getSelect().then(res=>{
                this.modelItems=res.data;
              })
        },
        addTitle(type){
          let msg={
            name:this.name,
            parentId:type,
            module:this.module
          };
          addTitle(msg).then(res=>{
            //this.reload();
            //console.log(res,888)
            res.code?this.$message.error(res.msg):(()=>{
              this.nav=false;
              this.cancle();
              this.getmaterial();
              this.getTree();
            })();
          })
        },
        getTree(){
          this.module?(()=>{
            getTree(this.module).then(v=>{
              //console.log(v,999);
              v.data?(()=>{
                v.data.map(i=>{
                  i.show=true;
                  i.children&&i.children.map(f=>{
                    f.show=true;
                  })
                })
              })():'';
              this.tree=v.data;
              //console.log(tree,999)
            })
          })():'';
        },
        showLevel(r,id){//显示弹窗
          this.level=r;
          this.nav=true;
          this.id=id||0;//新建时传入当前组件id
        },
        cancle(){
          this.name='';
          this.id=0;
          this.parentId=0;
        },
        showEdit(r,row){
          this.level=r;
          this.edit=true;
          this.id=row.id;
          this.parentId=row.parentId;
          this.name=row.name;
          console.log(row,999)
        },
        editTitle(){
          let msg={
            id:this.id,
            name:this.name,
            parentId:this.parentId,
            module:this.module
          };
          editTitle(msg).then(res=>{
            console.log(res);
            this.getTree();
            this.getmaterial();
            this.cancle();
            this.edit=false;
          })
        },
        deleteTitle(id){
          let apple=[];
          apple.push(id)
            deleteTitle(apple).then(res=>{
              res.code?(()=>{
                //this.$message.error(res.msg);
                this.getTree();
                this.cancle();
              })():(()=>{
                //this.$message.success(res.msg);
                this.getTree();
                this.getmaterial();
                this.cancle();
              })();
            })
        },
        changeUpadte(state){
          state.prop=='createTime'&&(()=>{this.wordState='create_time'})();
          state.prop=='updateTime'&&(()=>{this.wordState='update_time'})();
          state.prop=='name'&&(()=>{this.wordState='name'})();
          console.log(this.wordState,789)
          this.upS=state.order;
          state.order=='ascending'&&(()=>{this.upS='true'})();
          state.order=='descending'&&(()=>{this.upS='false'})();
          this.getmaterial();
        }
      },
      watch:{
        timeValue(){
          console.log(1111)
          this.$store.commit('pagination/setClickPage',1);
          this.getmaterial();
        },
        reviseTime(){
          this.$store.commit('pagination/setClickPage',1);
          this.replace('reviseTime',this.reviseTime);
        },
        limitPage(){
          this.replace('limitPage',this.limitPage)
        },
        clickPage(){
          this.replace('clickPage',this.clickPage)
        },
        word(){
          this.$store.commit('pagination/setClickPage',1);
          this.replace('word',this.word);
        },
        moduleHead(){
          this.$store.commit('pagination/setClickPage',1);
          this.replace('moduleHead',this.moduleHead);
        },
        $route(){
          this.getmaterial();
        }

      },
      created() {
        this.createTime=this.$route.query.createTime||'';
        this.reviseTime=this.$route.query.reviseTime||'';
        this.word=this.$route.query.word||'';
        this.moduleHead=this.$route.query.moduleHead||'';
        let limit=this.$route.query.limitPage||20;
        let page=this.$route.query.clickPage||1;
        this.$nextTick(()=>{
          this.$store.commit('pagination/setLimitPage',limit);
          this.$store.commit('pagination/setClickPage',page);
          this.showPagenation=true;//分页显示隐藏
          this.getmaterial();
          this.getSelect();
        })
      },
      updated(){
        this.$route.name=='manger'?(()=>{
          this.$nextTick(()=>{
            this.tableHeight = window.innerHeight - this.$refs.mangerRef.$el.offsetTop - 110;
          })
        })():'';
      }
    }
</script>

<style scoped>
.manger{
  background: url("../../assets/icon_category_AD.png") no-repeat left;
}
</style>
