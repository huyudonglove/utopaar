<template>
  <div>
    <el-dialog title="背景音乐" :visible.sync="dialogVisible" @close="close" width="80%">
      <el-row class="tac" style="padding-bottom:15px">
        <el-input v-model="bgmName" style="width: 20%" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入关键字"></el-input>
      </el-row>
      <el-table ref="multipleTable" :data="bgmList" border style="width: 100%" class="mt15 mb15">
        <el-table-column prop="id" label="ID" width="150" align="center"></el-table-column>
        <el-table-column prop="name" label="歌曲名称" align="center"></el-table-column>
        <el-table-column label="音乐试听" align="center">
          <template slot-scope="scope">
            <span style="cursor: pointer;" >
              <img src="@/assets/play.png" alt="" v-if="!scope.row.play" @click="bgmList.forEach(v=>{v.play=false;});scope.row.play=true;playMusic(scope.row.fileId,scope.row)">
              <img src="@/assets/stop.png" alt="" v-if="scope.row.play" @click="scope.row.play=!scope.row.play;playMusic()">
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="所属类别" align="center"></el-table-column>
        <el-table-column prop="duration" label="总时长" align="center"></el-table-column>
        <el-table-column label="上下架状态" prop="state" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.state==1">上架</span>
            <span v-if="scope.row.state==2" style="color:red;">下架</span>
          </template>
        </el-table-column>
      </el-table>
      <span>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[ 20, 40, 60,80]"
          :page-size="limit"
          layout="total,sizes, prev, pager, next,jumper"
          :total="total?total:0">
        </el-pagination>
      </span>
      <div>
        <audio :src="url" autoplay="autoplay" ref="audio"></audio>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getStageMusicList} from '../../../http/request'
import { Base64 } from 'js-base64';
export default {
  name:'bgmDialog',
  props:['sceneId'],
  data(){
    return{
      dialogVisible:true,
      bgmName:'',
      bgmList:[],
      total:0,//总行数
      page:1,//页码
      limit:20,//一页行数
      url:'',
    }
  },
  computed:{
    allParams(){
      return{
        "parentCarrierId":this.sceneId,
        "name":this.bgmName,
        "page":this.page,
        "limit":this.limit,
      }
    }
  },
  watch:{
    page(){
      this.getList();
    },
    limit(){
      if(this.page!=1){
        this.page=1;
      }
      this.getList();
    },
    bgmName(){
      if(this.page!=1){
        this.page=1;
      }
      this.getList();
    },
  },
  methods:{
    handleSizeChange(val){
      this.limit = val;
    },
    handleCurrentChange(val){
      this.page = val;
    },
    close(){
      this.$emit("bgmDialogClose");
    },
    getList(){
      getStageMusicList(this.allParams).then(res=>{
        if(res.data&&res.data.length){
          this.bgmList=res.data.filter((item,index)=>index>=(this.page-1)*this.limit && index<this.page*this.limit).map(v=>{
              v.play=false;
              return v;
            });;
          this.total = res.data.length;
        }
      })
    },
    playMusic(id,row){
      if(id){
        this.url=`/static/${Base64.decode(id)}`;
        this.$refs.audio.load();
        this.$refs.audio.play();
        this.$refs.audio.onended=()=>{
          row.play = !row.play;
        }
      }else{
        this.$refs.audio.pause();
      }     
    },
  },
  created(){
    this.getList();
  }
}
</script>

<style scoped>

</style>