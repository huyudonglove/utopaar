<template>
    <div>
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">玩法管理</span>
      </div>
      <div style="margin-top: 10px;margin-bottom: 10px">
        <el-input v-model="word" style="width: 500px" suffix-icon="el-icon-search" maxlength="50" placeholder="输入关键字"></el-input>
      </div>
      <div>
        <div ><!--音乐-->
          <el-table :data="tableData" style="width: 100%" :max-height="tableHeight" ref="playRef" border>
            <el-table-column prop="id" label="ID" width="180" align="center">
            </el-table-column>
            <el-table-column prop="name" label="玩法名称" width="180" align="center">
            </el-table-column>
            <el-table-column prop="key" label="key" align="center">
            </el-table-column>
            <el-table-column  label="包含素材" align="center">
              <template slot-scope="scope">
                  <span>{{scope.row.moduleCount}}</span> <br>
                  <el-button @click="getDetail(scope.row.id,scope.row.name,scope.row.remark)" type="text">查看详情</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="交互" align="center">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center">
            </el-table-column>
            <el-table-column prop="updateTime" label="修改时间" align="center">
            </el-table-column>
            <el-table-column prop="updateBy" label="最后修改人" align="center">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div>
        <pagination v-if="showPagination"></pagination>
      </div>
      <div>
        <el-dialog title="素材种类详情" :visible.sync="visible" width="40%" ><!--详情弹窗-->
          <div style="padding-left: 30px">
            <div >
              <el-input style="width: 200px" v-model="moduleName" suffix-icon="el-icon-search" maxlength="50"></el-input>
            </div>
            <div style="margin-top: 10px;margin-bottom: 10px;">
              <el-table :data="detailData" style="width: 90%" border >
                <el-table-column prop="moduleName" label="功能名" width="180" align="center">
                </el-table-column>
                <el-table-column  label="所属玩法" width="180" align="center">
                  <template>
                    {{playName}}
                  </template>
                </el-table-column>
                <el-table-column label="玩法说明"  align="center">
                  <template>
                    {{remark}}
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div >
              <el-pagination @size-change="limitChange" @current-change="pageChange" :current-page="page" :page-sizes="[20, 40, 60, 80]"
                             :page-size="limit" v-if="show"
                             layout="total, sizes, prev, pager, next, jumper"
                             :total="detailTotal">
              </el-pagination>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
</template>

<script>
  import {getPlayList,getPlayDetail} from "@/http/request";
  import pagination from '@/share/pagination';
  import {mapState} from 'vuex'
  export default {
        name: "playList",
        data(){
          return{
            tableData:[],
            showPagination:false,
            word:'',
            visible:false,
            page:1,
            limit:20,
            detailTotal:0,
            moduleName: '',
            detailData:[],
            id:'',
            show:true,
            tableHeight:0,
            playName:'',
            remark:''
          }
        },
        components:{
          pagination
        },
        inject:['replace','reload'],
        computed:{
          ...mapState('pagination',['limitPage','clickPage'])
        },
        methods:{
          getPlayList(){
            let msg={
              page:this.$route.query.page||1,
              limit:this.$route.query.limit||20,
              name:this.$route.query.word
            }
            getPlayList(msg).then(res=>{
              res.code?this.$message.error(res.msg):(()=>{
                this.tableData=res.data.items;
                this.$store.commit('pagination/setTotal',res.data.total)
              })();
            })
          },
          getDetail(id,name,remark){
            //console.log(id,name,8999)
            this.visible=true;
            this.page=1;
            this.limit=20;
            this.moduleName='';
            this.id=id;
            this.playName=name;
            this.remark=remark;
            this.getPlayDetail(this.id);
          },
          getPlayDetail(id){
            let msg={
              page:this.page,
              limit: this.limit,
              playId:id,
              moduleName:this.moduleName
            };
            getPlayDetail(msg).then(res=>{
              res.code?this.$message.error(res.msg):(()=>{
                this.detailTotal=res.data.total;
                this.detailData=res.data.items;
              })();
            })
          },
          limitChange(val){
            console.log(val);
            this.limit=val||20;
          },
          pageChange(val){
            console.log(val);
            this.page=val||1;
          }
        },
        created() {
          this.word=this.$route.query.word||'';
          let limit=this.$route.query.limitPage||20;
          let page=this.$route.query.clickPage||1;
          this.$nextTick(()=>{
            this.$store.commit('pagination/setLimitPage',limit);
            this.$store.commit('pagination/setClickPage',page);
            //分页显示隐藏
            this.getPlayList();
            this.showPagination=true;
          })
        },
        watch:{
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
          $route(){
            this.getPlayList();
          },
          limit(){
              this.page=1;
              this.getPlayDetail(this.id);
          },
          page(){
            this.getPlayDetail(this.id);
          },
          moduleName(){
            this.page=1;
            this.show=false;
            this.show=true;
            this.getPlayDetail(this.id);
          }
        },
        updated() {
          this.$route.name=='playList'?(()=>{
            this.tableHeight = window.innerHeight - this.$refs.playRef.$el.offsetTop - 120;
          })():'';
        }
  }
</script>

<style scoped>

</style>
