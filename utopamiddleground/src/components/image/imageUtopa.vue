<template>
  <div v-if="mapListPower.length">
    <headNav></headNav>
    <div class="pa_body">
      <div class="body-menu" :style="{'overflow':'auto','height':treeHeight+'px'}">
        <el-row class="tac">
          <el-col :span="24" style="border-top:1px solid #eee">
            <div style="position:relative;background:#0074E4FF;top:2px;height:2px;width:55px;left:-55px;"></div>
            <div style="padding:15px 5px 10px 5px;">
              <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
              </el-input>
              <div v-if="isShowTree">
                <el-tree
                  :data="treeData"
                  :props="props"
                  accordion
                  @node-click="handleNodeClick"
                  ref="tree"
                  node-key="id"
                  :default-expanded-keys="expandedKeys"
                  :highlight-current="true"
                  :render-content="renderContent"
                  :default-expand-all="isExpand"
                >
                  <span class="span-ellipsis" slot-scope="{ node, data }">
                                <span :title="node.label">{{ node.label }}</span>
                              </span>
                </el-tree>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="body-content">
      <el-main>
        <div>
          <div v-if="positionData.id">
            <el-radio-group v-model="recongizeType" style="padding-bottom: 10px">
              <el-radio-button :label="0" >图像云识别</el-radio-button>
              <el-radio-button :label="1" >图像本地识别</el-radio-button>
              <el-radio-button :label="2" >空间识别</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div style="width: 100%">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick();">
            <el-tab-pane label="全部" name="first"></el-tab-pane>
            <el-tab-pane label="待审核" name="second"></el-tab-pane>
            <el-tab-pane label="通过" name="third"></el-tab-pane>
            <el-tab-pane label="不通过" name="fourth"></el-tab-pane>
          </el-tabs>
          <div style="float: right;margin-top:-60px;display: flex">
            <el-input v-model="searchName" suffix-icon="el-icon-search" maxlength="50" placeholder="输入关键字"></el-input>
          </div>
        </div>

        <div>
          <div style="display: flex;justify-content: space-between">
            <div class="ten" style="text-align: center;line-height: 300px;cursor: pointer;" @click="mapListPower[0].isCheck?dialogVisible=true:dialogVisible=false;" v-if="positionId&&activeName=='first'&&isValid==1">
              <img src="@/assets/addI.png" alt="" width="200px" height="200px" style="margin-top: 40px">
            </div>
            <div class="ten" v-else style="text-align: center;line-height: 300px;cursor: not-allowed;">
              <img src="@/assets/forbidden.png" alt="" width="200px" height="200px" style="margin-top: 40px">
            </div>
            <div class="ten" v-if="items[0]">
              <div style="display: flex;justify-content: space-between">
                <span>ID  {{items[0].id}} </span>
                <span>
                  <span v-if="items[0].mapEngine.includes('0')" class="h-button">高通</span>
                  <span v-if="items[0].mapEngine.includes('1')" class="h-button">Easyar</span>
                  <span v-if="items[0].mapEngine.includes('2')" class="h-button">Locus</span>
                </span>
              </div>
              <div class="title">名称
                {{items[0].name}}
              </div>
              <div class="title" >宽度
                {{items[0].width}}m
              </div>
              <div class="time">坐标：
                X:{{items[0].positionX}}
                Y:{{items[0].positionY}}
                Z:{{items[0].positionZ}}
              </div>
              <div class="time">方向：
                α:{{items[0].relationX}}°
                β:{{items[0].relationY}}°
                γ:{{items[0].relationZ}}°
              </div>
              <div class="time" >创建时间
                {{items[0].createTime}}
              </div>
              <div style="text-align: center">
                <img :src="`/static/${items[0].webUrl}`" alt="" width="300px" height="200px">
              </div>
              <div class="foot" style="display: flex;justify-content: space-between">
                <div>
                  <span v-if="items[0].checkState==1"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:#FFFF00;">● </span>待审核</span>
                  <span v-if="items[0].checkState==2"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:#7EC856;">● </span>通过</span>
                  <span v-if="items[0].checkState==3"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:red;">● </span>不通过</span>
                </div>
                <div>
                  <el-button type="text" size="small" @click="editName = true;editId=items[0].id;imageName=items[0].name;imageWidth=items[0].width;state=items[0].checkState;positionX=items[0].positionX;positionY=items[0].positionY;positionZ=items[0].positionZ;relationX=items[0].relationX;relationY=items[0].relationY;relationZ=items[0].relationZ"
                             :disabled="!mapListPower[1].isCheck||isValid==2">编辑</el-button>
                  <el-button type="text" size="small" @click="deleteImg(items[0].id)" :disabled="!mapListPower[3].isCheck||isValid==2">删除</el-button>
                </div>
              </div>
            </div>
            <div class="ten" v-else></div>
            <div class="ten" v-if="items[1]">
              <div style="display: flex;justify-content: space-between">
                <span>ID  {{items[1].id}} </span>
                <span>
                  <span v-if="items[1].mapEngine.includes('0')" class="h-button">高通</span>
                  <span v-if="items[1].mapEngine.includes('1')" class="h-button">Easyar</span>
                  <span v-if="items[1].mapEngine.includes('2')" class="h-button">Locus</span>
                </span>
              </div>
              <div class="title">名称
                {{items[1].name}}
              </div>
              <div class="title" >宽度
                {{items[1].width}}m
              </div>
              <div class="time">坐标：
                X:{{items[1].positionX}}
                Y:{{items[1].positionY}}
                Z:{{items[1].positionZ}}
              </div>
              <div class="time">方向：
                α:{{items[1].relationX}}°
                β:{{items[1].relationY}}°
                γ:{{items[1].relationZ}}°
              </div>
              <div class="time">创建时间
                {{items[1].createTime}}
              </div>
              <div style="text-align: center">
                <img :src="`/static/${items[1].webUrl}`" alt="" width="300px" height="200px">
              </div>
              <div class="foot" style="display: flex;justify-content: space-between">
                <div>
                  <span v-if="items[1].checkState==1"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:#FFFF00;">● </span>待审核</span>
                  <span v-if="items[1].checkState==2"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:#7EC856;">● </span>通过</span>
                  <span v-if="items[1].checkState==3"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:red;">● </span>不通过</span>
                </div>
                <div>
                  <el-button type="text" size="small" @click="editName = true;editId=items[1].id;imageName=items[1].name;imageWidth=items[1].width;state=items[1].checkState;positionX=items[1].positionX;positionY=items[1].positionY;positionZ=items[1].positionZ;relationX=items[1].relationX;relationY=items[1].relationY;relationZ=items[1].relationZ"
                             :disabled="!mapListPower[1].isCheck||isValid==2">编辑</el-button>
                  <el-button type="text" size="small" @click="deleteImg(items[1].id)" :disabled="!mapListPower[3].isCheck||isValid==2">删除</el-button>
                </div>
              </div>
            </div>
            <div class="ten" v-else></div>
          </div>
          <div style="display: flex;justify-content: space-between;margin-top: 10px">
            <div class="ten" v-if="items[2]">
              <div style="display: flex;justify-content: space-between">
                <span>ID  {{items[2].id}} </span>
                <span>
                  <span v-if="items[2].mapEngine.includes('0')" class="h-button">高通</span>
                  <span v-if="items[2].mapEngine.includes('1')" class="h-button">Easyar</span>
                  <span v-if="items[2].mapEngine.includes('2')" class="h-button">Locus</span>
                </span>
              </div>
              <div class="title">名称
                {{items[2].name}}
              </div>
              <div class="title" >宽度
                {{items[2].width}}m
              </div>
              <div class="time">坐标：
                X:{{items[2].positionX}}
                Y:{{items[2].positionY}}
                Z:{{items[2].positionZ}}
              </div>
              <div class="time">方向：
                α:{{items[2].relationX}}°
                β:{{items[2].relationY}}°
                γ:{{items[2].relationZ}}°
              </div>
              <div class="time">创建时间
                {{items[2].createTime}}
              </div>
              <div style="text-align: center">
                <img :src="`/static/${items[2].webUrl}`" alt="" width="300px" height="200px">
              </div>
              <div class="foot" style="display: flex;justify-content: space-between">
                <div>
                  <span v-if="items[2].checkState==1"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:#FFFF00;">● </span>待审核</span>
                  <span v-if="items[2].checkState==2"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:#7EC856;">● </span>通过</span>
                  <span v-if="items[2].checkState==3"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:red;">● </span>不通过</span>
                </div>
                <div>
                  <el-button type="text" size="small" @click="editName = true;editId=items[2].id;imageName=items[2].name;imageWidth=items[2].width;state=items[2].checkState;positionX=items[2].positionX;positionY=items[2].positionY;positionZ=items[2].positionZ;relationX=items[2].relationX;relationY=items[2].relationY;relationZ=items[2].relationZ"
                             :disabled="!mapListPower[1].isCheck||isValid==2">编辑</el-button>
                  <el-button type="text" size="small" @click="deleteImg(items[2].id)" :disabled="!mapListPower[3].isCheck||isValid==2">删除</el-button>
                </div>
              </div>
            </div>
            <div class="ten" v-else></div>
            <div class="ten" v-if="items[3]">
              <div style="display: flex;justify-content: space-between">
                <span>ID  {{items[3].id}} </span>
                <span>
                  <span v-if="items[3].mapEngine.includes('0')" class="h-button">高通</span>
                  <span v-if="items[3].mapEngine.includes('1')" class="h-button">Easyar</span>
                  <span v-if="items[3].mapEngine.includes('2')" class="h-button">Locus</span>
                </span>
              </div>
              <div class="title">名称
                {{items[3].name}}
              </div>
              <div class="title" >宽度
                {{items[3].width}}m
              </div>
              <div class="time">坐标：
                X:{{items[3].positionX}}
                Y:{{items[3].positionY}}
                Z:{{items[3].positionZ}}
              </div>
              <div class="time">方向：
                α:{{items[3].relationX}}°
                β:{{items[3].relationY}}°
                γ:{{items[3].relationZ}}°
              </div>
              <div class="time">创建时间
                {{items[3].createTime}}
              </div>
              <div style="text-align: center">
                <img :src="`/static/${items[3].webUrl}`" alt="" width="300px" height="200px">
              </div>
              <div class="foot" style="display: flex;justify-content: space-between">
                <div>
                  <span v-if="items[3].checkState==1"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:#FFFF00;">● </span>待审核</span>
                  <span v-if="items[3].checkState==2"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:#7EC856;">● </span>通过</span>
                  <span v-if="items[3].checkState==3"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:red;">● </span>不通过</span>
                </div>
                <div>
                  <el-button type="text" size="small" @click="editName = true;editId=items[3].id;imageName=items[3].name;imageWidth=items[3].width;state=items[3].checkState;positionX=items[3].positionX;positionY=items[3].positionY;positionZ=items[3].positionZ;relationX=items[3].relationX;relationY=items[3].relationY;relationZ=items[3].relationZ"
                             :disabled="!mapListPower[1].isCheck||isValid==2">编辑</el-button>
                  <el-button type="text" size="small" @click="deleteImg(items[3].id)" :disabled="!mapListPower[3].isCheck||isValid==2">删除</el-button>
                </div>
              </div>
            </div>
            <div class="ten" v-else></div>
            <div class="ten" v-if="items[4]">
              <div style="display: flex;justify-content: space-between">
                <span>ID  {{items[4].id}} </span>
                <span>
                  <span v-if="items[4].mapEngine.includes('0')" class="h-button">高通</span>
                  <span v-if="items[4].mapEngine.includes('1')" class="h-button">Easyar</span>
                  <span v-if="items[4].mapEngine.includes('2')" class="h-button">Locus</span>
                </span>
              </div>
              <div class="title">名称
                {{items[4].name}}
              </div>
              <div class="title" >宽度
                {{items[4].width}}m
              </div>
              <div class="time">坐标：
                X:{{items[4].positionX}}
                Y:{{items[4].positionY}}
                Z:{{items[4].positionZ}}
              </div>
              <div class="time">方向：
                α:{{items[4].relationX}}°
                β:{{items[4].relationY}}°
                γ:{{items[4].relationZ}}°
              </div>
              <div class="time">创建时间
                {{items[4].createTime}}
              </div>
              <div style="text-align: center">
                <img :src="`/static/${items[4].webUrl}`" alt="" width="300px" height="200px">
              </div>
              <div class="foot" style="display: flex;justify-content: space-between;">
                <div>
                  <span v-if="items[4].checkState==1"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:#FFFF00;">● </span>待审核</span>
                  <span v-if="items[4].checkState==2"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:#7EC856;">● </span>通过</span>
                  <span v-if="items[4].checkState==3"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:red;">● </span>不通过</span>
                </div>
                <div>
                  <el-button type="text" size="small" @click="editName = true;editId=items[4].id;imageName=items[4].name;imageWidth=items[4].width;state=items[4].checkState;positionX=items[4].positionX;positionY=items[4].positionY;positionZ=items[4].positionZ;relationX=items[4].relationX;relationY=items[4].relationY;relationZ=items[4].relationZ"
                             :disabled="!mapListPower[1].isCheck||isValid==2">编辑</el-button>
                  <el-button type="text" size="small" @click="deleteImg(items[4].id)" :disabled="!mapListPower[3].isCheck||isValid==2">删除</el-button>
                </div>
              </div>
            </div>
            <div class="ten" v-else></div>
          </div>
        </div>
        <div style="margin-top: 10px">
          <el-pagination v-if="showPagination"  @current-change="pageChange" :current-page="currentPage"  :page-size="5" layout="total, prev, pager, next, jumper" :total="total" background>
          </el-pagination>
        </div>
      </el-main>

    </div>
    <div>
      <el-dialog title="新建识别图" :visible.sync="dialogVisible" width="40%" @close="cancle()">
        <div>
          <p><span style="color: #f56c6c;margin-right: 2px;">*</span>识别引擎选择（可多选）：</p>
          <p>
            <el-checkbox-group v-model="mapEngine" size="medium" @change="aa()">
              <el-checkbox-button v-for="item in engine" :label="item.val" :key="item.val">{{item.name}}</el-checkbox-button>
            </el-checkbox-group>
          </p>
        </div>
        <div><span style="color: #f56c6c;margin-right: 2px;">*</span>识别图名称：
        <el-input v-model="imageName" maxlength="50"></el-input>
        </div>
        <div>
          <span style="color: #f56c6c;margin-right: 2px;">*</span>上传识别图：
          <el-upload
            class="avatar-uploader"
            :action="`/api/utopa/ar/material/upload/image`"
            :show-file-list="false"
            :headers="header"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" style="border: 1px dashed #d9d9d9;"></i>
          </el-upload>
        </div>
        <div>
          宽度：
          <el-input  v-model="imageWidth" onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''" maxlength="50">
            <template slot="append">m</template>
          </el-input>
        </div>
        <div>
          <span style="color: #f56c6c;margin-right: 2px;">*</span>坐标：
          <div>
            <span style="display:inline-block;width: 120px">
              <span style="display:inline-block;width: 10px">x</span>
              <el-input style="width: 100px" v-model="positionX"></el-input>
            </span>
            <span style="display:inline-block;width: 120px">
              <span style="display:inline-block;width: 10px">y</span>
              <el-input style="width: 100px" v-model="positionY"></el-input>
            </span>
            <span style="display:inline-block;width: 120px">
              <span style="display:inline-block;width: 10px">z</span>
              <el-input style="width: 100px" v-model="positionZ"></el-input>
            </span>
          </div>

        </div>
        <div>
          <span style="color: #f56c6c;margin-right: 2px;">*</span>方向：
          <div>
            <span style="display:inline-block;width: 120px">
              <span style="display:inline-block;width: 10px">α</span>
              <el-input style="width: 100px" v-model="relationX"></el-input></span>
            <span style="display:inline-block;width: 120px">
              <span style="display:inline-block;width: 10px">β</span>
              <el-input style="width: 100px" v-model="relationY"></el-input></span>
            <span style="display:inline-block;width: 120px">
              <span style="display:inline-block;width: 10px">γ</span>
              <el-input style="width: 100px" v-model="relationZ"></el-input></span>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false;cancle();">取 消</el-button>
          <el-button type="primary" @click="createImage()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="修改识别图" :visible.sync="editName" width="40%"  @close="cancle()">
        <div><span style="color: #f56c6c;margin-right: 2px;">*</span>识别图名称：
          <el-input v-model="imageName" maxlength="50"></el-input>
        </div>
        <div>
          <span style="color: #f56c6c;margin-right: 2px;">*</span>坐标：
          <div>
            <span style="display:inline-block;width: 120px">
              <span style="display:inline-block;width: 10px">x</span>
              <el-input style="width: 100px" v-model="positionX"></el-input>
            </span>
            <span style="display:inline-block;width: 120px">
              <span style="display:inline-block;width: 10px">y</span>
              <el-input style="width: 100px" v-model="positionY"></el-input>
            </span>
            <span style="display:inline-block;width: 120px">
              <span style="display:inline-block;width: 10px">z</span>
              <el-input style="width: 100px" v-model="positionZ"></el-input>
            </span>
          </div>

        </div>
        <div>
          <span style="color: #f56c6c;margin-right: 2px;">*</span>方向：
          <div>
            <span style="display:inline-block;width: 120px">
              <span style="display:inline-block;width: 10px">α</span>
              <el-input style="width: 100px" v-model="relationX"></el-input></span>
            <span style="display:inline-block;width: 120px">
              <span style="display:inline-block;width: 10px">β</span>
              <el-input style="width: 100px" v-model="relationY"></el-input></span>
            <span style="display:inline-block;width: 120px">
              <span style="display:inline-block;width: 10px">γ</span>
              <el-input style="width: 100px" v-model="relationZ"></el-input></span>
          </div>
        </div>
        <div v-if="state==1">
          宽度：
          <el-input  v-model="imageWidth" onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''" maxlength="50">
            <template slot="append">m</template>
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editName = false;cancle();">取 消</el-button>
          <el-button type="primary" @click="editImgName()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {getImage,putInTree,createImage,editImgName,deleteImg} from "../../http/request";
  import navMenu from "@/share/navMenu.vue";
  import headNav from "@/share/headNav.vue";
  import { Base64 } from 'js-base64';
  import {mapState,mapActions} from 'vuex'

  export default {
        name: "imageUtopa",
        data(){
          return{
              activeName:'first',
              currentPage:1,
              total:0,
              page:1,
              showPagination:false,
              items:[],
              dialogVisible:false,
              imageName:'',
              imageUrl:'',
              header:{
                Authorization:this.$cookies.get('middlegroundToken')
              },
            treeData:[],
            filterText:'',
            props: {
              label: "name",
              children: 'children',
              value:'id',
            },
            positionId:'',
            imageWidth:'',
            imageId:'',
            editName:false,
            editId:'',
            searchName:'',
            treeHeight:'',
            state:'',
            positionX:'',
            positionY:'',
            positionZ:'',
            relationX:'',
            relationY:'',
            relationZ:'',
            mapEngine:[],
            engine:[
              {name:'高通',val:0},
              {name:'Easyar',val:1},
              {name:'locus',val:2}
            ],
            isValid:null,
            isShowTree:true,
            isExpand:false,
            recongizeType:0,
            positionData:{},
            expandedKeys:[],
            assetId:''
          }
        },
        components: {
          navMenu,
          headNav
        },
       computed:{
          ...mapState('currentUserPower',['mapListPower'])
       },
       inject:['replace','reload'],
       methods:{
         ...mapActions('currentUserPower',['getUserPower']),
         renderContent(h, { node, data, store }) {
          if (data.isValid == 2) {
            return <span style="background:#ccc">{node.label}</span>;
          } else {
            return <span>{node.label}</span>;
          }
        },
         handleClick(tab, event) {
           console.log(tab, event);
           this.currentPage=1;
           this.getImage();
         },
         getImage(){
           let checkState='';
           this.activeName=="first"?(()=>{
              checkState='';
           })():'';
           this.activeName=="second"?(()=>{
             checkState=1;
           })():'';
           this.activeName=="third"?(()=>{
             checkState=2;
           })():'';
           this.activeName=="fourth"?(()=>{
             checkState=3;
           })():'';

           let msg={
             name:this.searchName,
             'checkState':checkState,
             pageNum:this.currentPage,
             pageSize:5,
             source:'Middleground',
             middleGroundAssertId:this.positionId
           }
          getImage(msg).then(res=>{
            //console.log(res,999)
            res.code?this.$message.error(res.msg):(()=>{
              res.data.items.map(v=>v.webUrl=Base64.decode(v.pic))
              console.log(res.data.items,88888)
              this.items=res.data.items;
              this.items.map(v=>{
                v.mapEngineData=v.mapEngine.split(',')
              })
              this.total=res.data.total;
            })();
          })
         },
         pageChange(val){
          console.log(val)
           this.currentPage=val;
         } ,
         handleAvatarSuccess(res, file) {
           console.log(res,file,777777);
           this.imageId=res.data.fileId;
           this.imageUrl = URL.createObjectURL(file.raw);
         },
         beforeAvatarUpload(file) {
           console.log(file,999999)
           const isJPG = file.type === 'image/jpeg'||file.type==='image/png';
           //const isPng=file.type==='image/png';
           const isLt2M = file.size / 1024 / 1024 < 2;
           if (!isJPG) {
             this.$message.error('上传图片只能是 JPG/PNG 格式!');
           }
           if (!isLt2M) {
             this.$message.error('上传图片大小不能超过 2MB!');
           }
           return isJPG && isLt2M;
         },
         handleNodeClick(data) {
           console.log(data);
           data.type==6?(()=>{
             this.assetId=data.id
             this.currentPage=1;
             this.searchName='';
             this.isValid=data.isValid
             this.positionId=data.id;
             this.positionData=data;
           })():(()=>{
             this.positionId=''
           })();
         },
         filterNode(value, data) {
           if (!value) return true;
           return data.name.indexOf(value) !== -1;
         },
         createImage(){
           if(!this.mapEngine.length){
             this.$message.error('识别引擎不能为空')
             return
           }
           let msg={
             name:this.imageName,
             pic:this.imageId,
             type:2,
             middleGroundAssertId:this.positionId,
             width:this.imageWidth,
             height:'',
            positionX: this.positionX,
            positionY: this.positionY,
            positionZ: this.positionZ,
            relationX: this.relationX,
            relationY: this.relationY,
            relationZ: this.relationZ,
            mapEngine: this.mapEngine.join(',')
           }
           msg.name?(()=>{
             msg.pic?(()=>{
               msg.middleGroundAssertId?(()=>{
                 msg.positionY&&msg.positionY&&msg.positionZ?(()=>{
                   msg.relationX&&msg.relationY&&msg.relationZ?(()=>{
                     createImage(msg).then(res=>{res.code?this.$message.error(res.msg):(()=>{
                       this.$message.success(res.msg)
                       this.cancle();
                       this.getImage();
                       this.dialogVisible=false;
                     })();})
                   })():this.$message.error('方向不能为空')

                 })():this.$message.error('坐标不能为空')
               })():this.$message.error('地理位置不能为空');
             })():this.$message.error('识别图不能为空');
           })():this.$message.error('识别图名称不能为空');
         },
         cancle(){
           this.imageId='';
           this.imageName='';
           this.imageWidth='';
           this.editId='';
           this.imageUrl='';
           this.positionX='';
           this.positionY='';
           this.positionZ='';
           this.relationX='';
           this.relationY='';
           this.relationZ='';
         },
         editImgName(){
           let msg={
             name:this.imageName,
             id:this.editId,
             width:this.imageWidth,
             positionX: this.positionX,
             positionY: this.positionY,
             positionZ: this.positionZ,
             relationX: this.relationX,
             relationY: this.relationY,
             relationZ: this.relationZ
           };
           msg.id&&msg.name?(()=>{
             this.positionX&&this.positionY&&this.positionZ?(()=>{
               this.relationX&&this.relationY&&this.relationZ?(()=>{
                 editImgName(msg).then(res=>{
                   res.code?this.$message.error(res.msg):this.$message.success(res.msg);
                   this.getImage();
                   this.cancle();
                   this.editName=false;
                 })
               })():this.$message.error('方向不能为空')
             })():this.$message.error('坐标不能为空')
           })():this.$message.error('名称不能为空')
         },
         deleteImg(id){
           deleteImg(id).then(res=>{
             this.getImage();
           })
         },
         aa(){
           console.log(this.mapEngine,77777777)
         }
       },
       watch:{
         filterText(val) {
          //  this.$refs.tree.filter(val);
           putInTree({source:'Middleground',name:this.filterText}).then(res=>{
              this.treeData=res.data
              this.isExpand = false;
              this.isShowTree =false;
              if(this.filterText!==''){ 
                this.isExpand = true
              }
                this.$nextTick(()=>{
                this.isShowTree=true;
                })
            })
         },
         isValid(){
         this.replace('isValid',this.isValid);
         },
         searchName(){
             this.currentPage=1;
             this.showPagination=false;
             this.getImage();
             this.showPagination=true;
         },
         currentPage(){
           this.getImage();
         },
         assetId(){
           // console.log('assetId',this.assetId)
           this.currentPage=1;
           this.showPagination=false;
           this.replace('assetId',this.assetId);
           this.getImage();
           this.showPagination=true;
         },
       },
      created() {
          let query=this.$route.query
          this.filterText=query.filterText||''
          this.isValid=query.isValid;
          this.assetId=query.assetId||''
          this.currentPage=1;
          //this.expandedKeys=[parseInt(query.assetId)]
          this.$nextTick(()=>{
            this.currentPage=1;
          //分页显示隐藏
            this.getImage();
            putInTree({source:'Middleground',name:this.filterText}).then(res=>{
              this.treeData=res.data
              this.isExpand = false;
              this.isShowTree =false;
              if(this.filterText!==''){ 
                this.isExpand = true
              }
             
                this.isShowTree=true;
             
            })
          this.showPagination=true;
        })
        this.getUserPower();
      },
    updated(){
      this.$nextTick(()=>{
        // this.treeHeight = window.innerHeight - this.$refs.tree.$el.offsetTop -10;
      })
    }
  }
</script>

<style scoped>
.ten{
  width: 400px;
  height: 350px;
  /*background: #614a4d;*/
  padding: 10px 18px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}
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
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-main{
  padding-top: 10px;
}
.pa_body .body-menu{
  position:absolute;
  top:60px;
  left:0;
  bottom:0;
  width:300px;
  padding-left:55px;
  /*background-color:#545c64;*/
  background: url("../../assets/menu-bg.jpg") repeat-y ;
}
 .body-content{
  position:absolute;
  top:66px;
  left:355px;
  right:0;
  background-color:#fff;
  bottom:0;
  overflow:auto;
  border-left: 1px solid #eeeeee;
}
.cur{ cursor: pointer;}
.tac span {
  font-size:14px;
  color:#606266;
  padding-left: 5px;
  padding-right: 10px;
}
.time{
  color: #999;
  font-family: "PingFang SC","Microsoft YaHei",arial,"Hiragino Sans GB","Hiragino Sans GB W3";
  font-size: 12px;
  margin-top: 2px;
  margin-bottom: 2px;
}
  .title{
    height: 20px;
    line-height: 20px;
    color: #333;
    font-size: 14px;
    text-overflow:ellipsis;
    overflow:hidden;
    white-space:nowrap;
    width:280px;
  }
.foot{
  height: 29px;
  line-height: 29px;
  color: #333;
  font-size: 14px;
}
.span-ellipsis {
    width:100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
  .h-button{
    border-left: 1px solid #dcdfe6;
    border-radius: 4px 0 0 4px;
    box-shadow: none!important;
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
  }
</style>
