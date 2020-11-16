<template>
  <div>
    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="first">
          <div class="divContent">
            <span class="labelSpan"><span style="color: #f56c6c;margin-right: 2px;">*</span>应用名称</span>
            <el-input style="width: 200px" v-model="name" maxlength="50"></el-input>
          </div>
          <div>
            <span class="labelSpan">副标题</span>
            <el-input style="width: 200px" v-model="subtitle" maxlength="50"></el-input>
          </div>
          <div class="divContent" style="height: 220px;line-height: 220px;margin-top: 20px">
            <span class="labelSpan"><span style="color: #f56c6c;margin-right: 2px;">*</span>封面图</span>
            <el-upload
              style="display: inline-block"
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
          <div style="margin:40px 0px" >
            <span class="labelSpan"><span style="color: #f56c6c;margin-right: 2px;">*</span>平台类型</span>
            <el-radio-group v-model="platformType" @change="changePlatformType">
            <el-radio :label="0" :disabled="recognizeType ==2">Vuforia</el-radio>
            <el-radio :label="1" >EasyAR</el-radio>
            <el-radio :label="2">LocusAR</el-radio>
          </el-radio-group>
          </div>
           <div  style="margin:40px 0px" >
            <span class="labelSpan"><span style="color: #f56c6c;margin-right: 2px;">*</span>识别方式</span>
            <el-radio-group v-model="recognizeType" @change="changeRecognizeType">
            <el-radio :label="0">图像本地识别</el-radio>
            <el-radio :label="1">图像云识别</el-radio>
            <el-radio :label="2" :disabled="parseInt(platformType)===0">空间识别</el-radio>
          </el-radio-group>
          </div>
           <div style="margin:40px 0px" v-if="parseInt(recognizeType)==2">
            <span class="labelSpan">投放单位</span>
            <el-button @click="showTree=true">+</el-button>
            <el-tag v-if="assetUnitId">{{parentNameUrl}}</el-tag>
          </div>
          <tree   @closeBox="toshow" v-if="showTree" :pId="assetUnitId" :assetUnitName="parentNameUrl"></tree>
          <div>
            <div>
              <div style="height: 80px;">
                <span class="labelSpan" ><span style="color: #f56c6c;margin-right: 2px;">*</span>应用类型</span>
                <!--                  <el-select v-model="appId" placeholder="请选择" @change="positionData=[];u3d();">-->
                <!--                    <el-option-->
                <!--                      v-for="item in app"-->
                <!--                      :key="item.id"-->
                <!--                      :label="item.name"-->
                <!--                      :value="item.id">-->
                <!--                    </el-option>-->
                <!--                  </el-select>-->
                <el-button @click="appType=true;" >+</el-button>
                <!-- :disabled="recognizeType==2&&!assetUnitId" -->
                <el-tag v-if="appId">{{app.filter(v=>v.id==appId)[0].name}}</el-tag>

              </div>
              <div class="divContent" style="height: 220px;line-height: 220px;margin-top: 20px" v-if="appRow.playId==2">
                <span class="labelSpan">水印图</span>
                <el-upload
                  style="display: inline-block;"
                  class="avatar-uploader"
                  :action="`/api/utopa/ar/material/upload/image`"
                  :show-file-list="false"
                  :headers="header"
                  :on-success="handleAvatarSuccessAdd"
                  :before-upload="beforeAvatarUploadAdd">
                  <img v-if="imageUrlAdd" :src="imageUrlAdd" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon" style="border: 1px dashed #d9d9d9;"></i>
                </el-upload>
                <div style="margin-left: 20px" class="el-upload__tip"><span style="color: #f56c6c;margin-right: 2px;">*</span>图片为png格式，小于100kb</div>
              </div>
              <div class="divContent" v-if="appRow.playId==2">
                <span class="labelSpan" style="padding-left: 40px">是否启用水印</span>
                <span>
                      <el-switch v-model="isMark" :active-value="1" :inactive-value="2"></el-switch>
                    </span>
              </div>
              <div style="margin-bottom: 20px;">
                <span class="labelSpan"><span style="color: #f56c6c;margin-right: 2px;">*</span>投放位置</span>
                <div style="margin-left: 50px;min-height: 80px;margin-top: 10px;margin-bottom:10px;font-size: 14px;color: #606266;" >
                  <div style="height: 30px;line-height: 30px"><span class="positionSpan">ID</span><span class="positionSpan">所属地区</span><span class="positionSpan">资产位置</span><span class="positionSpan">操作</span></div>
                  <div>
                    <div v-for="item in positionData" :key="item.id" v-if="item.checked" style="height: 30px;line-height: 30px;margin-left: 60px">
                      <span class="positionSpan">{{item.positionId}}</span>
                      <span class="positionSpan">{{item.provinceCityArea}}</span>
                      <span class="positionSpan">{{item.positionDesc}}</span>
                      <span class="positionSpan"><el-button @click="item.checked=false;" type="text">删除</el-button></span>
                    </div>
                  </div>
                  <el-button @click="showButton" style="width:850px;margin-left: 160px" :disabled='!appId&&recognizeType==2||!assetUnitId&&recognizeType==2'>+</el-button>
                </div>
              </div>
            </div>
          </div>
          <div style="height: 100px;">
            <span class="labelSpan" style="line-height: 100px"><span style="color: #f56c6c;margin-right: 2px;">*</span>关联页面</span>
            <div style="display: inline-block">
              <div>
                <el-radio v-model="relatePageType" label="1">详情页</el-radio>
              </div>
              <div>
                <el-radio v-model="relatePageType" label="2">自定义页面</el-radio>
                <el-input v-model="relatePageUrl" style="width: 200px;" v-if="relatePageType==2" maxlength="200"></el-input>
              </div>
              <div><el-radio v-model="relatePageType" label="3">启动应用</el-radio></div>
            </div>
          </div>
          <div class="divContent">
            <span class="labelSpan">使用对象</span>
            <span>
                <el-radio v-model="target" label="0">所有用户</el-radio>
                <el-radio v-model="target" label="1">注册用户</el-radio>
              </span>
          </div>
          <div class="divContent">
            <span class="labelSpan">地理位置</span>
            <span>
                <el-input style="width: 200px" v-model="position"  maxlength="100"></el-input>
              </span>
          </div>
          <div class="divContent">
            <span class="labelSpan">状态</span>
            <span>
                 <el-radio v-model="status" label="1">启用</el-radio>
              <el-radio v-model="status" label="2">禁用</el-radio>
              </span>
          </div>
        </el-tab-pane>
        <el-tab-pane label="详情页" name="second">
          <div class="divContent">
            <span class="labelSpan"><span style="color: #f56c6c;margin-right: 2px;">*</span>标题</span>
            <el-input style="width: 200px" v-model="title" maxlength="50"></el-input>
          </div>
          <div class="divContent" style="height: 200px">
            <span class="labelSpan"><span style="color: #f56c6c;margin-right: 2px;">*</span>头图</span>
            <el-upload
              class="avatar-uploader"
              :action="`/api/utopa/ar/material/upload/image`"
              :show-file-list="false"
              :headers="header"
              :on-success="AvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="headImageUrl" :src="headImageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" style="border: 1px dashed #d9d9d9;"></i>
            </el-upload>
          </div>
          <div class="divContent">
            <span class="labelSpan">头图关联网址</span>
            <el-input  v-model="relateUrl" style="width: 200px" maxlength="200"></el-input>
          </div>
          <div class="divContent">
            <span class="labelSpan">分享内容</span>
            <span>
               <select v-model="shareType" style="width: 90px;height: 30px" @change="clearType">
                 <option value="0">无</option>
                 <option value="5">链接</option>
                 <option value="2">图片</option>
                 <option value="6">网址</option>
               </select>
              </span>
            <!--              <el-input v-model="shareUrl" style="width: 200px" maxlength="200"></el-input>-->
          </div>
          <div v-if="shareType==5">
            <div>
              <span class="labelSpan"><span style="color: #f56c6c;margin-right: 2px;">*</span>标题</span>
              <el-input v-model="shareTitle" style="width: 200px" maxlength="200"></el-input>
            </div>
            <div style="margin-top: 10px">
              <span class="labelSpan"><span style="color: #f56c6c;margin-right: 2px;">*</span>简述</span>
              <el-input v-model="shareDesc" style="width: 200px" maxlength="200"></el-input>
            </div>
            <div style="margin-top: 10px">
              <span class="labelSpan"><span style="color: #f56c6c;margin-right: 2px;">*</span>图片</span>
              <el-upload
                style="display: inline-block"
                class="avatar-uploader"
                :action="`/api/utopa/ar/material/upload/image`"
                :show-file-list="false"
                :headers="header"
                :on-success="handleAvatarSuccessShare"
                :before-upload="beforeAvatarUpload">
                <img v-if="shareImageUrlCopy" :src="shareImageUrlCopy" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" style="border: 1px dashed #d9d9d9;"></i>
              </el-upload>
            </div>
            <div style="margin-top: 10px">
              <span class="labelSpan"><span style="color: #f56c6c;margin-right: 2px;">*</span>地址</span>
              <el-input v-model="shareUrl" style="width: 200px" maxlength="200"></el-input>
            </div>
          </div>
          <div v-if="shareType==2">
            <div style="margin-top: 10px">
              <span class="labelSpan"><span style="color: #f56c6c;margin-right: 2px;">*</span>图片</span>
              <el-upload
                style="display: inline-block"
                class="avatar-uploader"
                :action="`/api/utopa/ar/material/upload/image`"
                :show-file-list="false"
                :headers="header"
                :on-success="handleAvatarSuccessShare"
                :before-upload="beforeAvatarUpload">
                <img v-if="shareImageUrlCopy" :src="shareImageUrlCopy" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" style="border: 1px dashed #d9d9d9;"></i>
              </el-upload>
            </div>
          </div>
          <div v-if="shareType==6" style="margin-top: 10px">
            <div>
              <span class="labelSpan"><span style="color: #f56c6c;margin-right: 2px;">*</span>标题</span>
              <el-input v-model="shareTitle" style="width: 200px" maxlength="200"></el-input>
            </div>
            <div style="margin-top: 10px">
              <span class="labelSpan"><span style="color: #f56c6c;margin-right: 2px;">*</span>网址</span>
              <el-input v-model="shareUrl" style="width: 200px" maxlength="200"></el-input>
            </div>
          </div>
          <div >
            <span class="labelSpan"><span style="color: #f56c6c;margin-right: 2px;">*</span>详情描述</span>
            <br>
            <div ref="editor" style="text-align:left;margin-left: 30px;margin-top: 10px"></div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="分享信息" name="third">
          <div style="margin-top: 10px">
            <span class="labelSpan"><span style="color: #f56c6c;margin-right: 2px;">*</span>分享标题</span>
            <el-input style="width: 200px" v-model="settingTitle" maxlength="50"></el-input>
          </div>
          <div style="margin-top: 10px">
            <span class="labelSpan"><span style="color: #f56c6c;margin-right: 2px;">*</span>分享内容</span>
            <el-input style="width: 200px" v-model="settingContent" maxlength="50"></el-input>
          </div>
          <div style="margin-top: 10px">
            <span class="labelSpan"><span style="color: #f56c6c;margin-right: 2px;">*</span>分享图片</span>
            <el-upload
              style="display: inline-block"
              class="avatar-uploader"
              :action="`/api/utopa/ar/material/upload/image`"
              :show-file-list="false"
              :headers="header"
              :on-success="handleAvatarSuccessSetting"
              :before-upload="beforeAvatarUploadSetting">
              <img v-if="imageUrlSetting" :src="imageUrlSetting" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" style="border: 1px dashed #d9d9d9;"></i>
            </el-upload>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div style="margin-top: 20px;margin-left: 50px">
      <el-button @click="createApp" v-if="type=='create'" type="primary">确定</el-button>
      <el-button @click="createApp" v-if="type=='revise'" type="primary">确定</el-button>
      <el-button @click="goTo">返回</el-button>
    </div>
    <el-dialog title="选择地址" :visible.sync="positionShow" style="width: 2200px" >
      <div>
        <el-input placeholder="请输入资产位置关键字" style="width: 250px" v-model="searchWord" @input="changeWord"><el-button slot="append" icon="el-icon-search"></el-button></el-input>
      </div>
      <div style="border-bottom: 1px solid #dcdfe6;line-height: 40px">
        <span class="positionSpan"></span>
        <span class="positionSpan">ID</span>
        <span class="positionSpan">所属地区</span>
        <span class="positionSpan">资产位置</span>
      </div>
      <div>
        <div v-for="(item,index) in positionDataCopy" :key="item.id">
          <div v-if="index>page*limit-(limit+1)&&index<page*limit" style="border-bottom: 1px dashed #dcdfe6;line-height: 40px">
            <span class="positionSpan"><el-checkbox v-model="item.checked"></el-checkbox></span>
            <span class="positionSpan">{{item.id}}</span>
            <span class="positionSpan" >
              <el-tooltip class="item" effect="dark" :content="item.parentNameUrl" placement="top-start">
                <el-button type="text" >{{item.provinceCityArea}}</el-button>
              </el-tooltip>
            </span>
            <span class="positionSpan">{{item.name}}</span>
          </div>
        </div>
      </div>
      <div style="margin-top: 10px">
        <el-pagination @size-change="limitChange" @current-change="pageChange" :current-page="page"  :page-size="5"
                       :page-sizes="[5, 10, 15, 20]"
                       layout="total,sizes,prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
      <div style="padding-top: 10px">
        <div style="text-align: right">
          <el-button @click="surePos" type="primary" >确定</el-button>
          <el-button @click="positionShow=false;">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog  :visible.sync="appType" width="60%" >
      <div>
          <span>
            渲染管道
          </span>
        <span>
            <el-select v-model="loadingLine" @change="getAppId" clearable>
                <el-option v-for="item in loadingLineItems" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </span>
      </div>
      <div>
        <el-table :data="app" style="width: 100%">
          <el-table-column prop="id" label="ID" width="180">
          </el-table-column>
          <el-table-column prop="name" label="应用类型" width="180">
          </el-table-column>
          <el-table-column prop="loadingLine" label="渲染管道">
          </el-table-column>
          <el-table-column  label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="appType=false;appRow=scope.row;appId=scope.row.id;u3d();">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </el-dialog>

  </div>
</template>

<script>
  //import uploadFile from "../../share/uploadFile";
  import E from 'wangeditor';
  import { Base64 } from 'js-base64';
  import tree   from './tree'
  import {getPlay,addPut,getDetail,getAppId,getPosition,getLoad,getMiddleTree} from "../../http/request";
  export default {
    name: "createApplication",
    data(){
      return{
        activeName: 'first',
        id:'',
        name:'',
        subtitle:'',
        coverImage:'',
        playType:'',
        relateMaterial:'',
        relatePageType:'',
        relatePageUrl:'',
        target:0+'',
        category:'',
        title:'',
        headImage:'',
        relateUrl:'',
        description:'',
        useCount:0,
        play:[],
        type:'',
        positions:{

        },
        app:[],
        appId:'',
        positionData:[],
        positionShow:false,
        positionChecked:[],
        limit:5,
        page:1,
        total:0,
        position:'',
        shareUrl:'',
        content:'',
        editorContent:'',
        status:1+'',
        header:{
          Authorization:this.$cookies.get('middlegroundToken')
        },
        imageUrl:'',
        coverImage:'',
        headImageUrl:'',
        relateTypeId:'',
        shareType:'0',
        shareTitle:'',
        shareDesc:'',
        shareImageUrl:'',
        shareImageUrlCopy:'',
        appType:false,
        loadingLine:'',
        loadingLineItems:[],
        appRow:{},
        imageUrlAdd:'',
        markImageUrl:'',
        imageUrlSetting:'',
        settingThumbnail:'',
        settingTitle:'',
        settingContent:'',
        isMark:1,
        searchWord:'',
        positionDataCopy:[],
        platformType:0,
        recognizeType:0,
        assetUnitId:'',
        parentNameUrl:'',
        showTree:false,
        assetUnitIdCopy:'',
        isClick:false
      }
    },
    methods:{
      handleClick(tab, event) {
        console.log(tab, event);
      },
      createApp(){
        let msg={
          id:this.id,
          name:this.name,
          subtitle:this.subtitle,
          coverImage:this.coverImage,
          relateApplicationId:this.appId,
          relatePageType:this.relatePageType,
          relatePageUrl:this.relatePageUrl,
          target:Number(this.target),
          position:this.position,
          title:this.title,
          headImage:this.headImage,
          relateUrl:this.relateUrl,
          description:this.editorContent,
          shareUrl:this.shareUrl,
          status:this.status,
          positions:[],
          relateTypeId:this.relateTypeId,
          shareImageUrl:this.shareImageUrl,
          shareTitle:this.shareTitle,
          shareType:this.shareType,
          shareDesc:this.shareDesc,
          markImageUrl:this.markImageUrl,
          settingTitle: this.settingTitle,
          settingContent: this.settingContent,
          settingThumbnail:this.settingThumbnail,
          isMark:this.isMark,
          recognizeType:this.recognizeType,
          platformType:this.platformType,
          assetUnitId:this.assetUnitId,
        }
        msg.name?(()=>{
          msg.coverImage?(()=>{
            msg.relateApplicationId?(()=>{
              msg.relatePageType?(()=>{
                msg.title?(()=>{
                  msg.headImage?(()=>{
                    msg.description?(()=>{
                      this.positionData.map(v=>{
                        v.checked?msg.positions.push({positionId:v.id}):'';
                      });
                      msg.positions.length?(()=>{
                        msg.settingTitle&&msg.settingContent&&msg.settingThumbnail?(()=>{
                          this.id?(()=>{
                            //修改
                            // this.positionData.map(v=>{
                            //   v.checked?msg.positions.push({positionId:v.id}):'';
                            // })
                            msg.shareType==0?(()=>{
                              addPut(msg).then(res=>{
                                res.code?(()=>{
                                  // this.$message.error(res.msg);
                                })():(()=>{
                                  // this.$message.success(res.msg);
                                  this.goTo();
                                })()
                              })
                            })():'';
                            (msg.shareType==5)?(()=>{
                              msg.shareImageUrl&&msg.shareTitle&&msg.shareDesc&&msg.shareUrl?(()=>{
                                addPut(msg).then(res=>{
                                  res.code?(()=>{
                                    // this.$message.error(res.msg);
                                  })():(()=>{
                                    // this.$message.success(res.msg);
                                    this.goTo();
                                  })()
                                })
                              })():this.$message.error('分享内容必填项不能为空')
                            })():'';
                            (msg.shareType==2)?(()=>{
                              msg.shareImageUrl?(()=>{
                                addPut(msg).then(res=>{
                                  res.code?(()=>{
                                    // this.$message.error(res.msg);
                                  })():(()=>{
                                    // this.$message.success(res.msg);
                                    this.goTo();
                                  })()
                                })
                              })():this.$message.error('分享图片不能为空')
                            })():'';
                            (msg.shareType==6)?(()=>{
                              msg.shareTitle&&msg.shareUrl?(()=>{
                                addPut(msg).then(res=>{
                                  res.code?(()=>{
                                    // this.$message.error(res.msg);
                                  })():(()=>{
                                    // this.$message.success(res.msg);
                                    this.goTo();
                                  })()
                                })
                              })():this.$message.error('分享内容必填项不能为空')
                            })():'';

                            console.log(msg,88);
                            // addPut(msg).then(res=>{
                            //   res.code?(()=>{
                            //     this.$message.error(res.msg);
                            //   })():(()=>{
                            //     this.$message.success(res.msg);
                            //     this.goTo();
                            //   })()
                            // })
                          })():(()=>{
                            //新增
                            // this.positionData.map(v=>{
                            //   v.checked?msg.positions.push({positionId:v.id}):'';
                            // })
                            console.log(msg.shreType,777)
                            msg.shareType==0?(()=>{
                              addPut(msg).then(res=>{
                                res.code?(()=>{
                                  // this.$message.error(res.msg);
                                })():(()=>{
                                  // this.$message.success(res.msg);
                                  this.goTo();
                                })()
                              })
                            })():'';
                            (msg.shareType==5)?(()=>{
                              msg.shareImageUrl&&msg.shareTitle&&msg.shareDesc&&msg.shareUrl?(()=>{
                                addPut(msg).then(res=>{
                                  res.code?(()=>{
                                    // this.$message.error(res.msg);
                                  })():(()=>{
                                    // this.$message.success(res.msg);
                                    this.goTo();
                                  })()
                                })
                              })():this.$message.error('分享内容必填项不能为空')
                            })():'';
                            (msg.shareType==2)?(()=>{
                              msg.shareImageUrl?(()=>{
                                addPut(msg).then(res=>{
                                  res.code?(()=>{
                                    // this.$message.error(res.msg);
                                  })():(()=>{
                                    // this.$message.success(res.msg);
                                    this.goTo();
                                  })()
                                })
                              })():this.$message.error('分享图片不能为空')
                            })():'';
                            (msg.shareType==6)?(()=>{
                              msg.shareTitle&&msg.shareUrl?(()=>{
                                addPut(msg).then(res=>{
                                  res.code?(()=>{
                                    // this.$message.error(res.msg);
                                  })():(()=>{
                                    // this.$message.success(res.msg);
                                    this.goTo();
                                  })()
                                })
                              })():this.$message.error('分享内容必填项不能为空')
                            })():'';

                            console.log(msg,88);
                            // addPut(msg).then(res=>{
                            //   res.code?(()=>{
                            //     this.$message.error(res.msg);
                            //   })():(()=>{
                            //     this.$message.success(res.msg);
                            //     this.goTo();
                            //   })()
                            // })


                          })();
                        })():this.$message.error('分享信息必填项不能为空')
                      })():this.$message.error('投放位置不能为空')
                    })():this.$message.error('详情描述不能为空')
                  })():this.$message.error('头图不能为空')
                })():this.$message.error('标题不能为空')
              })():this.$message.error('关联页面不能为空')
            })():this.$message.error('应用类型不能为空')
          })():this.$message.error('封面图不能为空')
        })():this.$message.error('应用名称不能为空')


      },
      toshow(val){
        console.log(111,222,val)
        this.isClick=true
        this.assetUnitId=val.selectId;
        this.parentNameUrl=val.parentNameUrl
        this.showTree=false;
        if(this.assetUnitIdCopy!==this.assetUnitId&& this.type=='revise'){
          this.positionData=[]
        }
      },
      goTo(){
        this.$router.push({
          path:'/app/applicationList',
          query:JSON.parse(this.$route.query.msg)
        })
      },
      getAppId(){
        getAppId(this.loadingLine).then(res=>{
          //console.log(res)
          res.code?this.$message.error(res.msg):(()=>{
            this.app=res.data
          })();
        })
      },
      getPosition(){
        let msg={
          name:'',
          backgroundAppId:this.appId,
          page:1,
          limit:10000,
          recognizeType:this.recognizeType,
          platformType:this.platformType,
          parentId:this.assetUnitId
        }
        return new Promise((resolve,reject)=>{
          getPosition(msg).then(res=>{
            //console.log(res,9999)
            res.code?this.$message.error(res.msg):(()=>{
              let apple=res.data.items;
              this.positionData=apple.map(v=>{v.checked=false;v.positionId=v.id;v.positionDesc=v.name;return v;});
              this.id?(()=>{
                let ban=[];
                this.positionChecked.map(v=>ban.push(v.positionId))
                console.log(ban,'ban')
                //判断是否选中
                this.positionData.map(r=>{
                  ban.includes(r.id)?r.checked=true:r.checked=false;
                  return r;
                });
                this.positionDataCopy=JSON.parse(JSON.stringify(this.positionData));
                this.total=this.positionDataCopy.length;
                resolve(res);
              })():'';
              //console.log(this.positionData,789)
            })();
          })
        })

      },
      limitChange(val){
        this.limit=val*1;
      },
      pageChange(val){
        this.page=val*1;
      },
      cancle(){

      },
      // addPosition(){
      //   console.log(this.positionData,7777)
      //   this.positionChecked=this.positionData.filter(v=>v.checked==true)
      //   this.positionChecked.map(v=>{
      //     v.positionId=v.id;
      //     v.positionDesc=v.name;
      //   })
      //   this.positionShow=false;
      //   console.log(this.positionChecked,888)
      // },
      handleAvatarSuccess(res, file) {
        console.log(res,file,777777);
        this.coverImage=res.data.fileId;
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      handleAvatarSuccessShare(res, file){
        //上传分享图片
        console.log(res,file,777777);
        this.shareImageUrl=res.data.fileId;
        this.shareImageUrlCopy = URL.createObjectURL(file.raw);
      },
      handleAvatarSuccessAdd(res, file) {
        console.log(res,file,777777);
        this.markImageUrl=res.data.fileId;
        this.imageUrlAdd = URL.createObjectURL(file.raw);
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
      beforeAvatarUploadAdd(file) {
        console.log(file,999999)
        const isJPG = file.type==='image/png';
        //const isPng=file.type==='image/png';
        const isLt2M = file.size / 1024  < 100;
        if (!isJPG) {
          this.$message.error('上传图片只能是 PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 100kb!');
        }
        return isJPG && isLt2M;
      },
      AvatarSuccess(res, file) {
        console.log(res,file,777777);
        this.headImage=res.data.fileId;
        this.headImageUrl = URL.createObjectURL(file.raw);
      },
      u3d(){
        console.log(this.app)
        console.log(this.appId)
        let apple=this.app.filter(v=>v.id==this.appId);
        console.log(apple,8)
        this.relateTypeId=apple[0].playId;
      },
      clearType(){
        this.shareImageUrl='';
        this.shareUrl='';
        this.shareImageUrlCopy='';
        this.shareDesc='';
        this.shareTitle='';
      },
      getLoad(){
        getLoad().then(v=>{
          this.loadingLineItems=v.data;
        })
      },
      handleAvatarSuccessSetting(res, file){
        console.log(res,file,777777);
        this.settingThumbnail=res.data.fileId;
        this.imageUrlSetting = URL.createObjectURL(file.raw);
      },
      beforeAvatarUploadSetting(file){
        console.log(file,999999)
        const isJPG = file.type === 'image/jpeg'||file.type==='image/png';
        //const isPng=file.type==='image/png';
        const isLt2M = file.size / 1024 / 1024 < 0.3;
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG/PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 300Kb!');
        }
        return isJPG && isLt2M;
      },
      changeWord(){
        this.page=1;
        this.positionDataCopy=JSON.parse(JSON.stringify(
          this.positionData.filter(data=>{
            return data.name.toLowerCase().includes(this.searchWord.toLowerCase());
          })
        ))
        this.total=this.positionDataCopy.length;
        console.log(this.positionDataCopy,99999)
      },
      surePos(){
        this.positionDataCopy.map(v=>{
          this.positionData.map(u=>{
            if(u.id==v.id){
              u.checked=v.checked;
            }
          })
        });
        this.positionShow=false;
      },
      showButton(){
        this.positionDataCopy=JSON.parse(JSON.stringify(this.positionData));
        this.total=this.positionDataCopy.length;
        this.$nextTick(()=>{
          this.page=1;
          this.limit=5;
          this.positionShow=true;
        });
        this.searchWord='';
      },
     changePlatformType(){
      if(this.appId&&this.recognizeType!==2){
        this.getPosition().then(res=>{
          this.positionData=res.data.items.map(v=>{v.checked=false;v.positionId=v.id;v.positionDesc=v.name;return v;});
          this.positions=[]
            
         })
        this.assetUnitId='';
        }
      if(this.appId&&this.recognizeType==2&&this.assetUnitId){
        this.getPosition().then(res=>{
          this.positionData=res.data.items.map(v=>{v.checked=false;v.positionId=v.id;v.positionDesc=v.name;return v;});
          this.positions=[]
            
         })
        this.assetUnitId='';
        }
      },
      changeRecognizeType(){
         if(this.appId&&this.recognizeType!==2){
          this.assetUnitId='';
          this.getPosition().then(res=>{
            this.positionData=res.data.items.map(v=>{v.checked=false;v.positionId=v.id;v.positionDesc=v.name;return v;});
            this.positions=[]
          })
      }
      if(this.appId&&this.recognizeType==2&&this.assetUnitId){
          this.assetUnitId='';
          this.getPosition().then(res=>{
             this.positionData=res.data.items.map(v=>{v.checked=false;v.positionId=v.id;v.positionDesc=v.name;return v;});
            this.positions=[]
          })
      }
      }
    },
    watch:{
      // appId(){
      //   // console.log(111111)
      //   this.appId?(()=>{
      //     //this.positionData=[];
      //     //this.positionChecked=[];
      //     this.getPosition();
      //   })():(()=>{
      //     //this.positionData=[];
      //     //this.positionChecked=[];
      //   })();
      //   this.positionData=[];
      // },
      appId(){
       if(this.appId&&this.recognizeType!==2)
        {
          this.getPosition()
        }
        else if(this.appId&&this.recognizeType==2 &&this.assetUnitId){
          this.getPosition()
        };
      },
      relatePageType(){
        console.log(this.relatePageType)
        this.relatePageType!=2?this.relatePageUrl='':'';
      },
      onEditorChange({ quill, html, text }) {
        console.log('editor change!', quill, html, text)
        this.content = html
      },
      shareType(){



        //5链接
        // this.shareType==5&&(()=>{
        //
        // })();
        // //2图片
        // this.shareType==2&&(()=>{
        //   this.shareUrl='';
        //   this.shareDesc='';
        //   this.shareTitle='';
        // })();
        // this.shareType=='6'&&(()=>{
        //   this.shareImageUrl='';
        //   this.shareImageUrlCopy='';
        //   this.shareDesc='';
        //   this.shareTitle='';
        // })();
      },
      // platformType(){
      // if(this.appId&&this.recognizeType!==2)
      //   {
      //     this.getPosition()
      //   }
      //   else if(this.appId&&this.recognizeType==2&&this.assetUnitId){
      //     this.getPosition()
      //   };

      // },
      // recognizeType(){
      // if(this.appId&&this.recognizeType!==2)
      //   { this.assetUnitId='';
      //     this.getPosition()
      //   }
      //   else if(this.appId&&this.recognizeType==2 &&this.assetUnitId){
      //     this.getPosition()
      //   };

      // },
      assetUnitId(){
        if(this.appId&&this.isClick) {
          this.positionData=[]
          this.positions=[]
        }
        if(this.appId&&this.assetUnitId) {
        this.getPosition()
        };
      }
    },
    computed:{
    },
    components:{
    tree
    },
    created() {
      //this.getPlay();
      //console.log(this.type,88);
      this.getLoad();
    },
    mounted() {
      var editor = new E(this.$refs.editor);
      editor.customConfig.onchange = (html) => {
        this.editorContent = html
      }
      editor.create();
      this.getAppId();
      this.type=this.$route.query.type;
      this.type=='create'?'':(()=>{
        getDetail(this.$route.query.id).then(
          res=>{
            if(res.code){
              this.$message.error(res.msg);
            }else {
              this.id = res.data.id;
              this.name = res.data.name;
              this.subtitle = res.data.subtitle;
              this.coverImage = res.data.coverImage;
              this.imageUrl=`/static/${Base64.decode(res.data.coverImage)}`;
              this.headImage=res.data.headImage;
              this.headImageUrl=`/static/${Base64.decode(res.data.headImage)}`;
              // relateApplicationId:this.appId,
              this.appId=res.data.relateApplicationId;
              this.relatePageType = res.data.relatePageType+'';
              this.appRow.playId=res.data.relateTypeId;
              this.relatePageUrl = res.data.relatePageUrl;
              this.position = res.data.position;
              this.category = res.data.category;
              this.title = res.data.title;
              this.headImage = res.data.headImage;
              this.relateUrl = res.data.relateUrl;
              this.editorContent = res.data.description;
              this.shareUrl=res.data.shareUrl;
              this.status=res.data.status+'';
              this.positionChecked=res.data.positions.map(v=>{v.checked=true;v.id=v.positionId;return v;});
              console.log(this.positionChecked,9999)
              this.relateTypeId=res.data.relateTypeId;
              this.target=res.data.target+'';
              this.shareUrl=res.data.shareUrl;
              this.shareType=res.data.shareType+'';
              this.shareTitle=res.data.shareTitle;
              this.shareDesc=res.data.shareDesc;
              this.shareImageUrl=res.data.shareImageUrl;
              this.shareImageUrlCopy=`/static/${Base64.decode(res.data.shareImageUrl)}`;
              this.markImageUrl=res.data.markImageUrl;
              this.markImageUrl&&(()=>{ this.imageUrlAdd=`/static/${Base64.decode(res.data.markImageUrl)}`})();
              this.settingTitle=res.data.settingTitle;
              this.settingContent=res.data.settingContent;
              this.settingThumbnail=res.data.settingThumbnail;
              this.isMark=res.data.isMark||1;
              this.imageUrlSetting=`/static/${Base64.decode(res.data.settingThumbnail)}`;
              editor.txt.html(this.editorContent)
              this.platformType=res.data.platformType
              this.recognizeType=res.data.recognizeType
              this.assetUnitId=res.data.assetUnitId
              this.assetUnitIdCopy=res.data.assetUnitId
              this.parentNameUrl=res.data.assetUnitName
            }
          }
        )
      })();
    }
  }
</script>

<style scoped>
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
  .labelSpan{
    display: inline-block;
    width: 100px;
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    padding: 0 12px 0 0;
  }
  .divContent{
    height: 100px;
    line-height: 100px;
    display: flex;
  }
  .positionSpan{
    display: inline-block;
    width: 250px;
    text-align: center;
    height: 40px;
  }

</style>
