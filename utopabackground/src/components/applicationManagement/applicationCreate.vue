<template>
  <div>
    <div v-if="$route.name=='applicationCreate'">
      <div  v-if="isCreate" style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">新建应用配置</span>
      </div>
       <div v-else style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:15px;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">编辑应用配置</span>
      </div>
      <div style="margin-top:15px;">
        <el-form :model="formSize" :rules="rules" ref="formSize" label-width="100px" class="demo-formSize">
        <el-form-item label="应用名称" prop="name">
          <el-input v-model="formSize.name" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="玩法选择" prop="playId">
           <el-select v-model="formSize.playId" placeholder="请选择" @change="changePlayID(formSize.playId)">
              <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <div v-if="!isBs">
          <el-form-item label="Unity版本" prop="unityVersion">
            <el-select v-model="formSize.unityVersion" placeholder="选择版本" @change="changeUnityVersion()">
                <el-option
                v-for="item in unityOptions"
              :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="渲染管线" prop="loadingLine">
            <el-select v-model="formSize.loadingLine" placeholder="选择管线" @change="changeLoadingLine()">
                <el-option
                v-for="item in lineOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择素材库" prop="moduleList">
            <div class="tag-group">
              <el-tag v-for="item in moduleDetail" :key="item.id" @click="tag(item.module,item.moduleName)" :type="item.module == tagKey?'success':''">{{item.moduleName}}</el-tag>
            </div>
          </el-form-item>
          <span style="display:block;width:110px;text-align:right;padding-right:12px;font-weight:600;color:#614a4d">{{tagValue}}素材:</span>
          <el-divider></el-divider>
          <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
            <span>
              <el-input
                placeholder="输入素材关键字"
                class="input-with-select pl15"
                style="width: 15%"
                v-model="wd"
              ></el-input>
            </span>
            <span>
              类别筛选：
              <el-cascader
              ref="tree"
              v-model="moduleTreeSelect"
              :options="moduleTree"
              :props="props"
              :show-all-levels="false"
              @change="handleChange"
              filterable
            clearable
              >
              </el-cascader>
            </span>
            <span v-if="tagKey==101||tagKey==102">
              动画类型：
              <el-select v-model="viewTypeSelect" placeholder="请选择" style="width:150px;">
                <el-option
                v-for="item in viewTypeOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
              </el-select>
            </span>
            <span v-if="tagKey==100">
              格式筛选：
              <el-select v-model="musicTypeSelect" placeholder="请选择" style="width:150px;">
                <el-option
                v-for="item in musicTypeOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
              </el-select>
            </span>
            <span>
              <el-button type="primary"  @click="selectAll()">批量选择</el-button>
            </span>
          </el-row>
          <!-- 数据展示 -->
          <el-table :data="tableData" ref="multipleTable" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" :max-height="300" :min-height="250" border @sort-change="changeUpadte">
          <el-table-column
          type="selection"
          align="center"
          width="55"
          :selectable="(row)=>multipleSelectionAll100.map(v=>v.id).indexOf(row.id)==-1&&row.state==1"
          v-if="tagKey==100"
          :key="1"
          >
          </el-table-column>
          <el-table-column
          type="selection"
          width="55"
          align="center"
          :selectable="(row)=>multipleSelectionAll101.map(v=>v.id).indexOf(row.id)==-1&&row.state==1"
          v-if="tagKey==101"
          :key="2"
          >
          </el-table-column>
          <el-table-column
          type="selection"
          width="55"
          align="center"
          :selectable="(row)=>multipleSelectionAll102.map(v=>v.id).indexOf(row.id)==-1&&row.state==1"
          v-if="tagKey==102"
          :key="3"
          >
          </el-table-column>
          <el-table-column
          type="selection"
          width="55"
          align="center"
          :selectable="(row)=>multipleSelectionAll103.map(v=>v.id).indexOf(row.id)==-1&&row.state==1"
          v-if="tagKey==103"
          :key="4"
          >
          </el-table-column>
          <el-table-column
          type="selection"
          width="55"
          align="center"
          :selectable="(row)=>multipleSelectionAll104.map(v=>v.id).indexOf(row.id)==-1&&row.state==1"
          v-if="tagKey==104"
          :key="5"
          >
          </el-table-column>
          <el-table-column
          type="selection"
          width="55"
          align="center"
          :selectable="(row)=>multipleSelectionAll105.map(v=>v.id).indexOf(row.id)==-1&&row.state==1"
          v-if="tagKey==105"
          :key="5"
          >
          </el-table-column>
          <el-table-column
          type="selection"
          width="55"
          align="center"
          :selectable="(row)=>multipleSelectionAll106.map(v=>v.id).indexOf(row.id)==-1&&row.state==1"
          v-if="tagKey==106"
          :key="7"
          >
          </el-table-column>
          <el-table-column
          type="selection"
          width="55"
          align="center"
          :selectable="(row)=>multipleSelectionAll107.map(v=>v.id).indexOf(row.id)==-1&&row.state==1"
          v-if="tagKey==107"
          :key="8"
          >
          </el-table-column>
          <el-table-column
          type="selection"
          width="55"
          align="center"
          :selectable="(row)=>multipleSelectionAll110.map(v=>v.id).indexOf(row.id)==-1&&row.state==1"
          v-if="tagKey==110"
          :key="8"
          >
          </el-table-column>
          <el-table-column prop="id" :label="'id'" width="80" align="center"
          :key="9"
          >
          </el-table-column>
          <el-table-column prop="name" :label="`${tagValue}名称`" width="" align="center" :key="10" sortable="custom">
          </el-table-column>
          <el-table-column prop="materialFormat" :label="`格式`" width="" align="center" :key="65" v-if="tagKey==100">
          </el-table-column>
          <el-table-column prop="materialCategoryName" :label="'所属类别'" width="" align="center" :key="11">
          </el-table-column>
          <el-table-column prop="parentIdUrl" :label="`${tagValue}预览`" width="200" align="center" v-if="tagKey==100" :key="12">
            <template slot-scope="scope">
                <div>
                <span style="cursor: pointer;" >
                <img src="@/assets/play.png" alt="" v-if="!scope.row.play" @click="tableData.forEach(v=>{v.play=false;});scope.row.play=true;playMusic(scope.row.androidMaterial)">
                <img src="@/assets/stop.png" alt="" v-if="scope.row.play" @click="scope.row.play=!scope.row.play;playMusic()">
              </span>
                </div>
              </template>
          </el-table-column>
          
          <el-table-column  :label="`${tagValue}展示`" width="150" align="center" v-if="tagKey==101||tagKey==103||tagKey==102" :key="13">
              <template slot-scope="scope">
                <span style="cursor: pointer;" >
                  <img :src="scope.row.webUrl?`/static/${scope.row.webUrl}`:null" alt=""  style="width:50px;height:50px" v-focus>
                </span>
              </template>
          </el-table-column>
          <el-table-column  :label="`${tagValue}展示`" width="150" align="center" v-if="tagKey==110" :key="129">
              <template slot-scope="scope">
                <span style="cursor: pointer;" >
                  <img :src="`/api/file/get/${scope.row.pic}`" alt=""  style="width:100px;height:100px" v-focus>
                </span>
              </template>
          </el-table-column>
          <el-table-column  :label="`${tagValue}预览`" width="150" align="center" v-if="tagKey==105||tagKey==107" :key="14">
            <template slot-scope="scope">
                <span style="cursor: pointer;" >
                  <img :src="scope.row.webUrl?`/static/${scope.row.webUrl}`:null" alt=""  style="width:50px;height:50px" v-focus>
                </span>
              </template>
            </el-table-column>
            <el-table-column  :label="`${tagValue}预览`" width="150" align="center" v-if="tagKey==104" :key="15">
            <template slot-scope="scope">
                <a :href="`http://${scope.row.videoUrl}`" target="_blank">{{scope.row.videoUrl}} </a>
              </template>
            </el-table-column>
          <el-table-column  :label="`占位图展示`" width="180" align="center" v-if="tagKey==102" :key="16">
            <template slot-scope="scope">
                <span style="cursor: pointer;" >
                  <img :src="scope.row.pictureUrl?`/static/${scope.row.pictureUrl}`:null" alt=""  style="width:50px;height:50px" v-focus>
                </span>
              </template>
          </el-table-column>
          <el-table-column prop="isLyric" label="是否包含歌词" width="80" align="center" v-if="tagKey==101||tagKey==110" :key="17">
            <template slot-scope="scope">
              <span v-if="scope.row.isLyric==1">是</span>
              <span v-if="!scope.row.isLyric" style="color:#FF644E">否</span>
            </template>
            </el-table-column>
            <el-table-column prop="configFileId" label="配置文件" align="center"  :key="60" v-if="tagKey==101||tagKey==110" >
             <template slot-scope="scope">
              <span v-if="scope.row.configFileId">有</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
            <el-table-column  label="资源包大小(M)" width="150" align="center" v-if="tagKey ==100||tagKey ==107||tagKey ==110" :key="18" sortable="custom" prop="androidResourcePackageSize">
              <template slot-scope="scope">
                  {{scope.row.androidResourcePackageSize?((scope.row.androidResourcePackageSize/(1024*1024))).toFixed(2):''}}
              </template>
            </el-table-column>
             <el-table-column prop="iosResourcePackageSize" label="IOS资源包大小(M)" width="140" align="center" v-if="tagKey ==101||tagKey ==102&&!equipmentEyeglass||tagKey ==103&&!equipmentEyeglass||tagKey ==105&&!equipmentEyeglass||tagKey ==106&&!equipmentEyeglass" :key="20" sortable="custom">
              <template slot-scope="scope">
                  {{scope.row.iosResourcePackageSize?((scope.row.iosResourcePackageSize/(1024*1024))).toFixed(2):''}}
              </template>
            </el-table-column>
            <el-table-column  label="Android资源包大小(M)" width="150" align="center" v-if="tagKey ==101||tagKey ==102||tagKey ==103" :key="119" sortable="custom" prop="androidResourcePackageSize">
              <template slot-scope="scope">
                 {{scope.row.androidResourcePackageSize?((scope.row.androidResourcePackageSize/(1024*1024))).toFixed(2):''}}
              </template>
            </el-table-column>
            <el-table-column prop="windowsResourcePackageSize" label="Windows(UWP)资源包(M)" width="140" align="center" v-if="tagKey==101||tagKey==102&&equipmentEyeglass||tagKey==103&&equipmentEyeglass" :key="40" sortable="custom">
              <template slot-scope="scope">
                  {{scope.row.windowsResourcePackageSize?((scope.row.windowsResourcePackageSize/(1024*1024))).toFixed(2):''}}
              </template>
            </el-table-column>
            <el-table-column prop="unityVersion" :label="'unity版本'" width="120" align="center" v-if="tagKey==101||tagKey==102||tagKey==103" :key="Math.random()+13">
            </el-table-column>
            <el-table-column prop="loadingLine" :label="'渲染管线'" width="120" align="center" v-if="tagKey==101||tagKey==102||tagKey==103" :key="Math.random()+14" >
            </el-table-column>
            <el-table-column prop="viewType" :label="'动画类型'" width="120" align="center" v-if="tagKey==101||tagKey==102" :key="Math.random()+14" >
            </el-table-column>
            <el-table-column prop="durationTimeStr" label="总时长" width align="center" v-if="tagKey==100||tagKey==101||tagKey ==105||tagKey ==106||tagKey ==107||tagKey ==110" :key="21" sortable="custom"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="110" align="center"  :key="15" sortable="custom" ></el-table-column>
            <el-table-column prop="updateTime" label="修改时间" width="110" align="center" :key="46" sortable="custom" ></el-table-column>
            <el-table-column prop="state" label="状态"  align="center" width="80" >
              <template slot-scope="scope">
              <span v-if="scope.row.state==1">上架</span>
              <span v-if="scope.row.state==2" style="color:#FF644E">下架</span>
            </template>
            </el-table-column>
          </el-table>
          <div>
          <audio :src="url" autoplay="autoplay" ref="audio"></audio>
          </div>
    </div> 
    <!-- 结束 其他玩法 -->
    <!-- 开始虚拟货架BS table -->
    
    <div v-if="isBs">
      <span style="display:block;width:150px;text-align:right;padding-right:12px;font-weight:600;color:#614a4d">BS内容关联管理:</span>
            <el-divider></el-divider>
            <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
              <span>
                <el-input
                  placeholder="输入素材关键字"
                  class="input-with-select pl15"
                  style="width: 15%"
                  v-model="wd"
                ></el-input>
              </span>
              <span>
                <el-button type="primary"  @click="selectAll2()">批量选择</el-button>
              </span>
            </el-row>
            
      <el-table :data="tableData" ref="multipleTable2" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange2"  :max-height="300" :min-height="250" border @sort-change="changeUpadte" >
        <el-table-column
        type="selection"
        align="center"
        width="55"
        :key="99"
        :selectable="(row)=>multipleSelectionAll200.map(v=>v.id).indexOf(row.id)==-1"
        >
        </el-table-column>
      <el-table-column prop="id" label="id" width="80" align="center" :key="83">
      </el-table-column>
      <el-table-column prop="identifyPhotoCode" label="识别图编号" width="" align="center"  sortable="custom" :key="84">
      </el-table-column>
      <el-table-column prop="photoUrl" label="识别图图片" width="150" align="center" :key="85">
         <template slot-scope="scope">
            <span style="cursor: pointer;" >
              <img :src="scope.row.photoUrl?`${scope.row.photoUrl}`:null" alt=""  style="width:50px;height:50px" v-focus>
            </span>
          </template>
      </el-table-column>
      <el-table-column prop="identifyPhotoName" label="识别图名称" width="" align="center"  sortable="custom" :key="86">
      </el-table-column>
      <el-table-column prop="relatedShelveCode" label="关联货架" width="" align="center" :key="87">
      </el-table-column>
      <el-table-column prop="identifyPhotoDesc" label="识别图描述" width="" align="center" :key="88">
      </el-table-column> 
       <el-table-column prop="createTime" label="新增时间" width="180" align="center"  sortable="custom" :key="89">
      </el-table-column>
      </el-table>
    </div>
    <!-- 结束虚拟货架BS table -->
		<div style="margin-top:15px;margin-bottom:15px">
       <!-- <pagination v-if="showPagination"></pagination> -->
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
       </div>
    <div style="position:relative">
    <span style="display:block;padding-right:12px;font-weight:600;color:#614a4d" v-if="!isBs">已选{{tagValue}}素材列表:</span>
    <span style="display:block;padding-right:12px;font-weight:600;color:#614a4d" v-if="isBs">已选素材列表:</span>
    <el-divider></el-divider>
     <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;" >
          <span>
            <el-input
              placeholder="输入素材关键字"
              class="input-with-select pl15"
              style="width: 15%"
              v-model="keyWord"
              clearable
            ></el-input>
          </span>
          <!-- <span>
            类别筛选：
          <el-cascader
            ref="treeOther"
            v-model="moduleTreeOtherSelect"
            :options="moduleTree"
            :props="props"
            :show-all-levels="false"
            @change="handleChange2"
            filterable
				   clearable
            >
            </el-cascader>
          </span> -->
          <span v-if="isBs">已选择{{multipleSelectionAll200.length}}条</span>
          <span>
            <el-button type="danger" plain @click="delAll(multipleSelectionList)">批量取消</el-button>
          </span>
          
        </el-row>
         <div class="tag-group" style="margin-top:15px" v-if="!isBs">
            <el-tag v-for="item in moduleDetail2" :key="item.id" @click="tag2(item.module,item.moduleName)" :type="item.module == tagCode?'success':''">{{item.moduleName}}
              <span v-if="item.module==''">({{multipleSelectionAll.length}})</span>
              <span v-if="item.module==100">({{multipleSelectionAll100.length}})</span>
              <span v-if="item.module==101">({{multipleSelectionAll101.length}})</span>
              <span v-if="item.module==102">({{multipleSelectionAll102.length}})</span>
              <span v-if="item.module==103">({{multipleSelectionAll103.length}})</span>
              <span v-if="item.module==104">({{multipleSelectionAll104.length}})</span>
              <span v-if="item.module==105">({{multipleSelectionAll105.length}})</span>
              <span v-if="item.module==106">({{multipleSelectionAll106.length}})</span>
              <span v-if="item.module==107">({{multipleSelectionAll107.length}})</span>
              <span v-if="item.module==110">({{multipleSelectionAll110.length}})</span>
              </el-tag>
          </div>
        <!-- 数据展示  已选素材列表 start-->
        <el-table :data="electionFlag" ref="selectMultipleTable" tooltip-effect="dark"  style="width: 100%" @selection-change="selectList" border  v-if="!isBs">
        <el-table-column
        type="selection"
        width="55"
        align="center"
        > 
        </el-table-column>
        <el-table-column prop="id" :label="'id'" width="80" align="center" :key="30">
        </el-table-column>
        <el-table-column prop="name" :label="`${tagValue}名称`" min-width="120" align="center" :key="31" sortable>
        </el-table-column>
         <el-table-column prop="materialFormat" :label="`格式`" width="" align="center" :key="65" v-if="tagKey==100">
          </el-table-column>
        <el-table-column prop="materialCategoryName" :label="'所属类别'" width="" align="center" :key="32">
        </el-table-column>
        <el-table-column prop="parentIdUrl" :label="`${tagValue}预览`" width="200" align="center" v-if="tagKey==100" :key="33">
           <template slot-scope="scope">
             <div>
              <span style="cursor: pointer;" >
              <img src="@/assets/play.png" alt="" v-if="!scope.row.play" @click="electionFlag.forEach(v=>{v.play=false;});scope.row.play=true;playMusic(scope.row.androidMaterial)">
               <img src="@/assets/stop.png" alt="" v-if="scope.row.play" @click="scope.row.play=!scope.row.play;playMusic()">
            </span>
             </div>
             </template>
        </el-table-column>
        
        <el-table-column  :label="`${tagValue}展示`" width="150" align="center" v-if="tagKey==101||tagKey==103||tagKey==102" :key="34">
            <template slot-scope="scope">
              <span style="cursor: pointer;" >
                <img :src="scope.row.webUrl?`/static/${scope.row.webUrl}`:null" alt=""  style="width:50px;height:50px" v-focus>
              </span>
            </template>
        </el-table-column>
          <el-table-column  :label="`${tagValue}展示`" width="150" align="center" v-if="tagKey==110" :key="19">
              <template slot-scope="scope">
                <span style="cursor: pointer;" >
                  <img :src="`/api/file/get/${scope.row.pic}`" alt=""  style="width:100px;height:100px" v-focus>
                </span>
              </template>
          </el-table-column>
        <el-table-column  :label="`${tagValue}预览`" width="150" align="center" v-if="tagKey==105||tagKey==107" :key="35">
           <template slot-scope="scope">
              <span style="cursor: pointer;" >
                <img :src="scope.row.webUrl?`/static/${scope.row.webUrl}`:null" alt=""  style="width:50px;height:50px" v-focus>
              </span>
            </template>
          </el-table-column>
           <el-table-column  :label="`${tagValue}预览`" width="150" align="center" v-if="tagKey==104" :key="36">
           <template slot-scope="scope">
              <a :href="`${scope.row.videoUrl}`" target="_blank">{{scope.row.videoUrl}} </a>
            </template>
          </el-table-column>
        <el-table-column  :label="`占位图展示`" width="180" align="center" v-if="tagKey==102" :key="37">
           <template slot-scope="scope">
              <span style="cursor: pointer;" >
               <img :src="scope.row.pictureUrl?`/static/${scope.row.pictureUrl}`:null" alt=""  style="width:50px;height:50px" v-focus>
              </span>
            </template>
        </el-table-column>
          <el-table-column prop="isLyric" label="是否包含歌词" width="80" align="center" v-if="tagKey==101||tagKey==110" :key="17">
            <template slot-scope="scope">
              <span v-if="scope.row.isLyric==1">是</span>
              <span v-if="!scope.row.isLyric" style="color:#FF644E">否</span>
            </template>
            </el-table-column>
            <el-table-column prop="configFileId" label="配置文件" align="center"  :key="60" v-if="tagKey==101||tagKey==110" >
             <template slot-scope="scope">
              <span v-if="scope.row.configFileId">有</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
            <el-table-column  label="资源包大小(M)" width="150" align="center" v-if="tagKey ==100||tagKey ==107||tagKey ==110" :key="18" sortable="custom" prop="androidResourcePackageSize">
              <template slot-scope="scope">
                 {{scope.row.androidResourcePackageSize?((scope.row.androidResourcePackageSize/(1024*1024))).toFixed(2):''}}
              </template>
            </el-table-column>
             <el-table-column prop="iosResourcePackageSize" label="IOS资源包大小(M)" width="140" align="center" v-if="tagKey ==101||tagKey ==102&&!equipmentEyeglass||tagKey ==103&&!equipmentEyeglass||tagKey ==105&&!equipmentEyeglass||tagKey ==106&&!equipmentEyeglass" :key="20" sortable="custom">
              <template slot-scope="scope">
                  {{scope.row.iosResourcePackageSize?((scope.row.iosResourcePackageSize/(1024*1024))).toFixed(2):''}}
              </template>
            </el-table-column>
            <el-table-column  label="Android资源包大小(M)" width="150" align="center" v-if="tagKey ==101||tagKey ==102||tagKey ==103" :key="119" sortable="custom" prop="androidResourcePackageSize">
              <template slot-scope="scope">
                {{scope.row.androidResourcePackageSize?((scope.row.androidResourcePackageSize/(1024*1024))).toFixed(2):''}}
              </template>
            </el-table-column>
            <el-table-column prop="windowsResourcePackageSize" label="Windows(UWP)资源包(M)" width="140" align="center" v-if="tagKey==101||tagKey==102&&equipmentEyeglass||tagKey==103&&equipmentEyeglass" :key="40" sortable="custom">
              <template slot-scope="scope">
                 {{scope.row.windowsResourcePackageSize?((scope.row.windowsResourcePackageSize/(1024*1024))).toFixed(2):''}}
              </template>
            </el-table-column>
            <el-table-column prop="unityVersion" :label="'unity版本'" width="120" align="center" v-if="tagKey==101||tagKey==102||tagKey==103" :key="131">
            </el-table-column>
            <el-table-column prop="loadingLine" :label="'渲染管线'" width="120" align="center" v-if="tagKey==101||tagKey==102||tagKey==103" :key="141" >
            </el-table-column>
            <el-table-column prop="viewType" :label="'动画类型'" width="120" align="center" v-if="tagKey==101||tagKey==102" :key="14" >
            </el-table-column>
            <el-table-column prop="durationTimeStr" label="总时长" width align="center" v-if="tagKey==100||tagKey==101||tagKey ==105||tagKey ==106||tagKey ==107||tagKey ==110" :key="21" sortable="custom"></el-table-column>
           <el-table-column prop="createTime" label="创建时间" width="110" align="center"  :key="15" sortable ></el-table-column>
          <el-table-column prop="updateTime" label="修改时间" width="110" align="center" :key="51" sortable ></el-table-column>
           <el-table-column prop="state" label="状态" width="80" align="center" :key="43">
              <template slot-scope="scope">
                <span v-if="scope.row.state==1">上架</span>
                <span v-if="scope.row.state==2" style="color:#FF644E">下架</span>
              </template>
          </el-table-column>
           <el-table-column label="操作" align="center" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="danger"
                size="mini"
               @click="del(scope.row,scope.$index,tagKey)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
         <!-- 开始虚拟货架BS table -->
        <el-table :data="electionFlag" ref="selectMultipleTable2" tooltip-effect="dark" style="width: 100%"   border  v-if="isBs" @selection-change="selectList">
        <el-table-column
        type="selection"
        width="55"
        align="center"
        > 
        </el-table-column>
        <el-table-column prop="id" label="id" width="" align="center">
        </el-table-column>
        <el-table-column prop="identifyPhotoCode" label="识别图编号" width="" align="center"  sortable>
        </el-table-column>
        <el-table-column prop="photoUrl" label="识别图图片" width="" align="center" >
           <template slot-scope="scope">
            <span style="cursor: pointer;" >
              <img :src="scope.row.photoUrl?`${scope.row.photoUrl}`:null" alt=""  style="width:50px;height:50px" v-focus>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="identifyPhotoName" label="识别图名称" width="" align="center" sortable>
        </el-table-column>
        <el-table-column prop="identifyPhotoDesc" label="识别图描述" width="" align="center">
        </el-table-column>
        <el-table-column prop="relatedShelveCode" label="关联货架" width="" align="center" >
        </el-table-column>
        <el-table-column prop="createTime" label="新增时间" width="" align="center"  sortable>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="danger"
                size="mini"
               @click="del2(scope.row,scope.$index)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    <!-- 结束虚拟货架BS table -->
        </div>
        <!-- 数据展示  已选音乐素材列表 end-->
        <el-form-item style="margin-top:15px;">
          <el-button v-if="isCreate" type="primary" @click="submitForm('formSize')" >确认</el-button >
          <el-button v-else type="primary" @click="updateForm('formSize')" >确认</el-button>
          <el-button @click="goTo()">取消</el-button>
        </el-form-item>
      </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import {applicationPlay,applicationM,applicationToTree,getFile,applicationConfigList} from "../../http/request";
import pagination from '../../share/pagination'
export default {
  name: "applicationCreate",
  inject:['replace','reload'],
  data(){
	  return{
      delPush:[],
      options:[],//玩法
      moduleDetail:[],//素材种类
      moduleDetail2:[],//素材种类
      moduleTree:[],//模块分类
      tableData2:[],//bs数据
      wd:'',
      showPagination:false,
      tagValue:'',
      tagKey:'',
      tagCode:'',
      keyWord:'',
      lineOptionsFilter:[],
      lineOptions:[],
      unityOptionsFilter:[],
      unityOptions:[],
      viewTypeOptions:[],
      musicTypeOptions:[],
      lineSelect:'',
      unitySelect:'',
      viewTypeSelect:'',
      musicTypeSelect:'',
      sortField:'',
      sortType:'',
      url:'',
      multipleSelection100:[],
      multipleSelection101:[],
      multipleSelection102:[],
      multipleSelection103:[],
      multipleSelection104:[],
      multipleSelection105:[],
      multipleSelection106:[],
      multipleSelection107:[],
      multipleSelection110:[],
      multipleSelection200:[],
      multipleSelectionAll:[],//已选全部素材
      multipleSelectionAll100:[],
      multipleSelectionAll101:[],
      multipleSelectionAll102:[],
      multipleSelectionAll103:[],
      multipleSelectionAll104:[],
      multipleSelectionAll105:[],
      multipleSelectionAll106:[],
      multipleSelectionAll107:[],
      multipleSelectionAll110:[],
      multipleSelectionAll200:[],
      multipleSelectionList:[],
      materialIdsAarray:[],
      electionFlag:[],
      electionFlagCopy:[],//已选择内容 关键字的筛选备份
      flag:false,
      moduleTreeVal:'',
      moduleTreeSelect:[],
      moduleTreeValOther:'',
      moduleTreeOtherSelect:[],
      isCreate:true,
      firstTime:0,
      equipmentEyeglass:'',//眼镜端
      isBs:false,
      formSize:{
        "name": '',
        "playId":'',
        "unityVersion":'',
        "loadingLine":'',
        "moduleList":[],
        "identifyPhotosList":[]  
      },
      rules: {
          name: [
            { required: true, message: '请输入应用名称', trigger: 'blur' }
          ],
          playId: [
            { required: true, message: '请选择玩法', trigger: 'change' }
          ],
          unityVersion: [
            { required: true, message: '请选择Unity版本', trigger: ['change','blur'] }
          ],
          loadingLine: [
            { required: true, message: '请选择渲染管线', trigger: ['change','blur']}
          ],
          moduleList: [
            { type: 'array', required: true, message: '请至少选择一个素材题库', trigger: 'change' }
          ]
        },
     props: {
        label: "name",
        children: 'children',
        value:'id',
        checkStrictly: true,
        expandTrigger:'click'
    },
    tableHeight:0,
    tableHeight2:0,
    limit:20,
    page:1,
    aa:true,
    unityVersionEdit:'',
    loadingLineEdit:'',
    playIdEdit:'',
	  }
  },
 async created(){
	let query=this.$route.query
  let pageRecord = query.page;//记录上一次页码操作
  let limitRecord = query.limit;//记录上一次limit操作
  this.wd=query.wd?query.wd:'';
  this.moduleTreeVal=query.moduleTreeVal?parseInt(query.moduleTreeVal):'';
  this.replace('sortField','');
  this.replace('sortType','');
  applicationConfigList({type:2}).then(res=>{
    this.unityOptions=res.data
    if(this.isCreate){
       this.formSize.unityVersion=this.unityOptions.length?this.unityOptions[0]:''
      //  console.log(this.unityOptions[0],'this.unityOptions[0]')
    }
    
  })
  applicationConfigList({type:1}).then(res=>{
    this.lineOptions=res.data
    if(this.isCreate){
       this.formSize.loadingLine=this.lineOptions.length?this.lineOptions[0]:''
      //  console.log(this.lineOptions[0],'this.lineOptions[0]')
    }
    
  })
  applicationConfigList({type:3}).then(res=>{
    this.viewTypeOptions=res.data
    this.viewTypeOptions.push("全部")
  })
  applicationConfigList({type:4}).then(res=>{
    this.musicTypeOptions=res.data
    this.musicTypeOptions.push("全部")
  })
  applicationPlay({}).then(res=>{
    this.options=res.data
    if(this.isCreate&&!this.isBs){
      this.formSize.playId=this.options[this.options.length-1].id
      applicationM({playId:this.formSize.playId}).then(res=>{
      this.moduleDetail=res.data
      this.moduleDetail2=this.moduleDetail.map(v=>v)
      this.tagValue=this.moduleDetail[0].moduleName
      this.tagKey=this.moduleDetail[0].module
      this.tagCode=this.moduleDetail[0].module
      this.initModule({...this.$route.query,module:this.moduleDetail[0].module,materialCategoryId:null}).then(res=>{
      this.$store.commit('pagination/setTotal',this.total);
      applicationToTree({moduleId:this.moduleDetail[0].module}).then(res=>{
        this.moduleTree=res.data
        this.moduleTree.push({id: "",name:"全部"})
      })
    })
  })
    }else{
    }
  })
  if(this.$route.query.id){
    this.isCreate=false;
    this.aa=false;
    await this.changeData()
  }
  },
  
  computed:{
	// ...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
  ...mapState('applicationList',{tableData:'tableData2',total:'total2',currentRow:'currentRow'}),
  playId(){
    return this.formSize.playId
  },
  unityVersion(){
    return this.formSize.unityVersion
  },
  loadingLine(){
    return this.formSize.loadingLine
  }
  },
  methods:{
    ...mapActions('applicationList',['initModule','save','info','initListModule','update','initPlayModule']),
    changeLoadingLine(){//管道
      this. multipleSelection100=[],
      this.multipleSelection101=[],
      this.multipleSelection102=[],
      this.multipleSelection103=[],
      this.multipleSelection104=[],
      this.multipleSelection105=[],
      this.multipleSelection106=[],
      this.multipleSelection107=[],
      this.multipleSelection110=[]
      this.multipleSelectionAll100=[]
      this.multipleSelectionAll101=[]
      this.multipleSelectionAll102=[]
      this.multipleSelectionAll103=[]
      this.multipleSelectionAll104=[]
      this.multipleSelectionAll105=[]
      this.multipleSelectionAll106=[]
      this.multipleSelectionAll107=[]
      this.multipleSelectionAll110=[]
      this.formSize.moduleList=[]
      this.formSize.identifyPhotosList=[]
      if(!this.isCreate&&this.formSize.unityVersion==this.unityVersionEdit&&this.formSize.loadingLine==this.loadingLineEdit&&this.playIdEdit==this.formSize.playId){
        // console.log(11111115555555555,this.formSize.unityVersion,this.unityVersionEdit)
        this.initModule({...this.$route.query,module:this.tagKey}).then(res=>{
        this.$store.commit('pagination/setTotal',this.total);
        this.changeData()
    })
      }
      
    },
    changeData(){
      this.getDataInfo().then(v=>{
      this.formSize.name=v.data.name
      this.formSize.id=v.data.id
      this.formSize.playId=v.data.playId
      this.formSize.moduleList=v.data.moduleList
      this.formSize.unityVersion=v.data.unityVersion
      this.formSize.loadingLine=v.data.loadingLine;
      this.unityVersionEdit=this.formSize.unityVersion;
      this.loadingLineEdit=this.formSize.loadingLine;
      this.playIdEdit=this.formSize.playId;
      if(this.playId ==7){
        this.multipleSelectionAll200=v.data.identifyPhotosList||[]
        this.initPlayModule({...this.$route.query,playId:this.formSize.playId}).then(res=>{
          //  console.log(222222222244444444444)
          })
      }
      if(this.playId !==7){
      // console.log('ggggggggggggggggggggggggggg')
      applicationM({playId:this.formSize.playId}).then(res=>{
      this.moduleDetail=res.data
      this.moduleDetail2=this.moduleDetail.map(v=>v)
      this.tagValue=this.moduleDetail[0].moduleName
      this.tagKey=this.moduleDetail[0].module
      this.tagCode=this.moduleDetail[0].module
      this.initModule({...this.$route.query,module:this.moduleDetail[0].module,materialCategoryId:null}).then(res=>{
      this.$store.commit('pagination/setTotal',this.total);
      applicationToTree({moduleId:this.moduleDetail[0].module}).then(res=>{
        this.moduleTree=res.data
        this.moduleTree.push({id: "",name:"全部"})
      })
    })
    this.moduleDetail.forEach((v,index)=>{
      if(!this.isCreate){
        this.initListModule({appId:this.$route.query.id,module:v.module,limit:999,isDel:'0'}).then(res=>{
          switch (v.module) {
            case 100:
            // console.log(res,res,'res111')
            this.multipleSelectionAll100=res.data.items||[]
              break;
            case 101:
            // console.log(res,res,'res222')
            this.multipleSelectionAll101=res.data.items||[]
            break;
            case 102:
            this.multipleSelectionAll102=res.data.items||[]
            console.log(111,222,102)
            break;
            case 103:
            this.multipleSelectionAll103=res.data.items||[]
            console.log(111,222,103)
            break;
            case 104:
            this.multipleSelectionAll104=res.data.items||[]
            console.log(111,222,104)
            break;
            case 105:
            this.multipleSelectionAll105=res.data.items||[]
            break;
            case 106:
            this.multipleSelectionAll106=res.data.items||[]
            break;
            case 107:
            this.multipleSelectionAll107=res.data.items||[]
            break;
            case 110:
            this.multipleSelectionAll110=res.data.items||[]
            break;
            default:
              break;
          }
           
      })
      }
  })
  })
      }
      
    })
    },
    changeUnityVersion(){//版本
      this.multipleSelectionAll100=[]
      this.multipleSelectionAll101=[]
      this.multipleSelectionAll102=[]
      this.multipleSelectionAll103=[]
      this.multipleSelectionAll104=[]
      this.multipleSelectionAll105=[]
      this.multipleSelectionAll106=[]
      this.multipleSelectionAll107=[]
      this.multipleSelectionAll110=[]
      this. multipleSelection100=[]
      this.multipleSelection101=[]
      this.multipleSelection102=[]
      this.multipleSelection103=[]
      this.multipleSelection104=[]
      this.multipleSelection105=[]
      this.multipleSelection106=[]
      this.multipleSelection107=[]
      this.multipleSelection110=[]
      this.formSize.moduleList=[]
      this.formSize.identifyPhotosList=[]
      if(!this.isCreate&&this.formSize.unityVersion==this.unityVersionEdit&&this.formSize.loadingLine==this.loadingLineEdit&&this.playIdEdit==this.formSize.playId){
        // console.log(11111115555555555,this.formSize.unityVersion,this.unityVersionEdit)
        this.initModule({...this.$route.query,module:this.tagKey}).then(res=>{
        this.$store.commit('pagination/setTotal',this.total);
        this.changeData()
    })
      }
    },
    selectAllCheck(val){
   
    },
    selectSinge(val){
    },
    fn(arr1,arr2){
    },
	  handleSelectionChange(val) {
    console.log(val.map(v=>v.id),'val3333333333333322')
		switch (this.tagKey) {
      case 100:
        this.multipleSelection100=this.multipleSelectionAll100.concat(val)
        console.log('音乐',this.multipleSelection100)
        break;
      case 101:
        
        this.multipleSelection101=this.multipleSelectionAll101.concat(val)
        
        break;
        case 102:
        this.multipleSelection102=this.multipleSelectionAll102.concat(val)
        break;
        case 103:
        this.multipleSelection103=this.multipleSelectionAll103.concat(val)
        break;
        case 104:
        this.multipleSelection104=this.multipleSelectionAll104.concat(val)
        break;
        case 105:
        this.multipleSelection105=this.multipleSelectionAll105.concat(val)
        break;
        case 106:
        this.multipleSelection106=this.multipleSelectionAll106.concat(val)
        break;
        case 107:
        this.multipleSelection107=this.multipleSelectionAll107.concat(val)
        break;
        case 110:
        this.multipleSelection110=this.multipleSelectionAll110.concat(val)
        break;
      default:
        break;
    }
    },
    handleSelectionChange2(val){
      this.multipleSelection200=this.multipleSelectionAll200.concat(val)
    }
    ,
    getDataInfo(){
       return new Promise((resolve,reject)=>{
          this.info({appId:this.$route.query.id}).then(v=>{
          resolve(v);
        }).catch(err=>{
          reject();
        })
       })
    },
    tag(code,value){
      this.tagKey=code;
      this.tagValue=value;
      this.tagCode=code;
      this.firstTime++
    },
    selectAllCom(){
        this.$message({
          showClose: true,
          message: '请最少选择一个选项',
          type: 'error'
        });
    },
    selectAll(){
      this.aa=true;
      switch (this.tagCode) {
        case 100:
          if(this.multipleSelection100.length>0){
          // console.log(this.fn(this.multipleSelectionAll100,this.delPush))
          console.log(this.multipleSelection100,'multipleSelection100',this.delPush)
          this.multipleSelectionAll100=this.multipleSelection100;

          this.multipleSelectionAll100=this.uniqueChoose(this.multipleSelectionAll100)
          }else{
          this.selectAllCom()
          }
          break;
        case 101:
        if(this.multipleSelection101.length>0){
          this.multipleSelectionAll101=this.multipleSelection101
          this.multipleSelectionAll101=this.uniqueChoose(this.multipleSelectionAll101)
          }else{
          this.selectAllCom()
          }
          break;
          case 102:
          if(this.multipleSelection102.length>0){
           this.multipleSelectionAll102=this.multipleSelection102
           this.multipleSelectionAll102=this.uniqueChoose(this.multipleSelectionAll102)
          }else{
          this.selectAllCom()
          }
          break;
        case 103:
         if(this.multipleSelection103.length>0){
          this.multipleSelectionAll103=this.multipleSelection103
          this.multipleSelectionAll103=this.uniqueChoose(this.multipleSelectionAll103)
          }else{
          this.selectAllCom()
          }
        break;
        case 104:
         if(this.multipleSelection104.length>0){
          this.multipleSelectionAll104=this.multipleSelection104
          this.multipleSelectionAll104=this.uniqueChoose(this.multipleSelectionAll104)
          }else{
          this.selectAllCom()
          }
        break;
        case 105:
         if(this.multipleSelection105.length>0){
          this.multipleSelectionAll105=this.multipleSelection105
          this.multipleSelectionAll105=this.uniqueChoose(this.multipleSelectionAll105)
          }else{
          this.selectAllCom()
          }
        break;
        case 106:
         if(this.multipleSelection106.length>0){
          this.multipleSelectionAll106=this.multipleSelection106
          this.multipleSelectionAll106=this.uniqueChoose(this.multipleSelectionAll106)
          }else{
          this.selectAllCom()
          }
        break;
        case 107:
         if(this.multipleSelection107.length>0){
          this.multipleSelectionAll107=this.multipleSelection107
          this.multipleSelectionAll107=this.uniqueChoose(this.multipleSelectionAll107)
          }else{
          this.selectAllCom()
          }
        break;
        case 110:
         if(this.multipleSelection110.length>0){
          this.multipleSelectionAll110=this.multipleSelection110
          this.multipleSelectionAll110=this.uniqueChoose(this.multipleSelectionAll110)
          }else{
          this.selectAllCom()
          }
        break;
      default:
        
        break;
    }
    },
      selectAll2(){ //bs 选择
      if(this.multipleSelection200.length>0){
      this.multipleSelectionAll200=this.multipleSelection200;
      this.multipleSelectionAll200=this.uniqueChoose(this.multipleSelectionAll200)
      }else{
      this.selectAllCom()
      }
      }
     ,
    delCom(row){
      this.aa=true;
      this.formSize.moduleList.forEach((v,index)=>{
         if(this.tagCode==v.module){
         this.formSize.moduleList.splice(index,1,{})
        }
      })
      let index=this.tableData.map(v=>v.id).indexOf(row.id)
      this.$nextTick(()=>{
        this.$refs.multipleTable.toggleRowSelection(this.tableData[index]);
      })
    },
    del(row,idx,ref){
      this.aa=true;
      switch (ref) {
        case 100:
        var i=this.multipleSelectionAll100.map(v=>v.id).indexOf(row.id)
        this.multipleSelectionAll100.splice(i, 1)
        this.delCom(row,idx)
        break;
        case 101:
        var i=this.multipleSelectionAll101.map(v=>v.id).indexOf(row.id)
        this.multipleSelectionAll101.splice(i, 1)
        this.delCom(row,idx)
        break;
        case 102:
        var i=this.multipleSelectionAll102.map(v=>v.id).indexOf(row.id)
        this.multipleSelectionAll102.splice(i, 1)
        this.delCom(row,idx)
        break;
        case 103:
        var i=this.multipleSelectionAll103.map(v=>v.id).indexOf(row.id)
        this.multipleSelectionAll103.splice(i, 1)
        this.delCom(row,idx)
        break;
        case 104:
        var i=this.multipleSelectionAll104.map(v=>v.id).indexOf(row.id)
        this.multipleSelectionAll104.splice(i, 1)
        this.delCom(row,idx)
        break;
        case 105:
        var i=this.multipleSelectionAll105.map(v=>v.id).indexOf(row.id)
        this.multipleSelectionAll105.splice(i, 1)
        this.delCom(row,idx)
        break;
        case 106:
        var i=this.multipleSelectionAll106.map(v=>v.id).indexOf(row.id)
        this.multipleSelectionAll106.splice(i, 1)
        this.delCom(row,idx)
        break;
        case 107:
        var i=this.multipleSelectionAll107.map(v=>v.id).indexOf(row.id)
        this.multipleSelectionAll107.splice(i, 1)
        this.delCom(row,idx)
        break;
        case 110:
        var i=this.multipleSelectionAll110.map(v=>v.id).indexOf(row.id)
        this.multipleSelectionAll110.splice(i, 1)
        this.delCom(row,idx)
        break;
          default:
           break;
       } 
    },
     del2(row,idx){
      var i=this.multipleSelectionAll200.map(v=>v.id).indexOf(row.id)
      this.multipleSelectionAll200.splice(i, 1)
      this.delCom2(row)
      },
     delCom2(row){
      let idx=this.formSize.identifyPhotosList.map(v=>v.id).indexOf(row.id)
      this.formSize.identifyPhotosList.splice(idx,1,{})
      let index=this.tableData.map(v=>v.id).indexOf(row.id)
      this.$nextTick(()=>{
        this.$refs.multipleTable2.toggleRowSelection(this.tableData[index]);
      })
    },
    selectList(val){
      this.aa=true;
      // console.log(val,'seltlist')
      this.multipleSelectionList=val;
      console.log(val.map(v=>v.id),'vallllwwwwwwww')
    },
    delAllCom(){
      if(this.playId !==7){
        this.formSize.moduleList.forEach((v,index)=>{
          if(this.tagCode==v.module){
          this.formSize.moduleList.splice(index,1,{})
          this.formSize.moduleList=this.formSize.moduleList.filter(v=>v.materialIds&&v.materialIds.length>0)
          }
          })
          
          // for(let j = 0 ;j<this.multipleSelectionList.length;j++){
          // let idxArray2=this.multipleSelectionList.map(v=>v.id)
          // let index= this.tableData.map(v=>v.id).indexOf(idxArray2[j]);
          // this.$refs.multipleTable.toggleRowSelection(this.tableData[index]);
          // }
            
           if(this.isCreate){
           }else{
             this.$nextTick(()=>{
              this.multipleSelectionList.forEach(row=>{
              this.$refs.multipleTable.toggleRowSelection(row);
              })
              })
           }
          
      }if(this.playId ==7){
        // console.log(this.multipleSelectionList,'multipleSelectionList.length66666666666666666666666',this.tableData)
        
          // for(let j = 0 ;j<this.multipleSelectionList.length;j++){
          // let idxArray2=this.multipleSelectionList.map(v=>v.id)
          // let index= this.tableData.map(v=>v.id).indexOf(idxArray2[j]);
          // // console.log(index,'isssss')
          // this.$refs.multipleTable2.toggleRowSelection(this.tableData[index]);
          // }
          if(this.isCreate){
           }else{
          this.$nextTick(()=>{
         this.multipleSelectionList.forEach(row=>{
              this.$refs.multipleTable2.toggleRowSelection(row);
          })
           })
           }
      } 
    },
    //批量取消
    delAll(rows){
      this.aa=true;
      if(rows.length>0){
        let idxArray=this.multipleSelectionList.map(v=>v.id)
        if(this.playId==7){
          for(let i = 0 ;i<this.multipleSelectionAll200.length;i++){
          let idx= this.multipleSelectionAll200.map(v=>v.id).indexOf(idxArray[i]);
          this.multipleSelectionAll200.splice(idx,1,{})
          }
          this.delAllCom()
          this.multipleSelectionAll200=this.multipleSelectionAll200.filter(v=>v.id)
          this.formSize.identifyPhotosList=this.multipleSelectionAll200.filter(v=>v.id)
        }
        else{
          switch (this.tagKey) {
        case 100:
          for(let i = 0 ;i<this.multipleSelectionAll100.length;i++){
          let idx= this.multipleSelectionAll100.map(v=>v.id).indexOf(idxArray[i]);
          this.delPush.push(this.multipleSelectionAll100[idx])
          this.multipleSelectionAll100.splice(idx,1,{})
          }
          this.delAllCom()
          this.multipleSelectionAll100=this.multipleSelectionAll100.filter(v=>v.id)
          this.delPush=this.delPush.filter(v=>v.id)
          break;
        case 101:
          for(let i = 0 ;i<this.multipleSelectionAll101.length;i++){
          let idx= this.multipleSelectionAll101.map(v=>v.id).indexOf(idxArray[i]);
          this.multipleSelectionAll101.splice(idx,1,{})
          }
          this.delAllCom()
          this.multipleSelectionAll101=this.multipleSelectionAll101.filter(v=>v.id)
          break;
        case 102:
          for(let i = 0 ;i<this.multipleSelectionAll102.length;i++){
          let idx= this.multipleSelectionAll102.map(v=>v.id).indexOf(idxArray[i]);
          this.multipleSelectionAll102.splice(idx,1,{})
          }
          this.delAllCom()
          this.multipleSelectionAll102=this.multipleSelectionAll102.filter(v=>v.id)
          break;
        case 103:
           for(let i = 0 ;i<this.multipleSelectionAll103.length;i++){
          let idx= this.multipleSelectionAll103.map(v=>v.id).indexOf(idxArray[i]);
          this.multipleSelectionAll103.splice(idx,1,{})
          }
          this.delAllCom()
          this.multipleSelectionAll103=this.multipleSelectionAll103.filter(v=>v.id)
          break;
        case 104:
          for(let i = 0 ;i<this.multipleSelectionAll104.length;i++){
          let idx= this.multipleSelectionAll104.map(v=>v.id).indexOf(idxArray[i]);
          this.multipleSelectionAll104.splice(idx,1,{})
          }
          this.delAllCom()
          this.multipleSelectionAll104=this.multipleSelectionAll104.filter(v=>v.id)
          break;
        case 105:
          for(let i = 0 ;i<this.multipleSelectionAll105.length;i++){
          let idx= this.multipleSelectionAll105.map(v=>v.id).indexOf(idxArray[i]);
          this.multipleSelectionAll105.splice(idx,1,{})
          }
          this.delAllCom()
          this.multipleSelectionAll105=this.multipleSelectionAll105.filter(v=>v.id)
          break;
        case 106:
          for(let i = 0 ;i<this.multipleSelectionAll106.length;i++){
          let idx= this.multipleSelectionAll106.map(v=>v.id).indexOf(idxArray[i]);
          this.multipleSelectionAll106.splice(idx,1,{})
          }
          this.delAllCom()
          this.multipleSelectionAll106=this.multipleSelectionAll106.filter(v=>v.id)
          break;
        case 107:
           for(let i = 0 ;i<this.multipleSelectionAll107.length;i++){
          let idx= this.multipleSelectionAll107.map(v=>v.id).indexOf(idxArray[i]);
          this.multipleSelectionAll107.splice(idx,1,{})
          }

          this.delAllCom()
          this.multipleSelectionAll107=this.multipleSelectionAll107.filter(v=>v.id)
          break;
          case 110:
           for(let i = 0 ;i<this.multipleSelectionAll110.length;i++){
          let idx= this.multipleSelectionAll110.map(v=>v.id).indexOf(idxArray[i]);
          this.multipleSelectionAll110.splice(idx,1,{})
          }
          this.delAllCom()
          this.multipleSelectionAll110=this.multipleSelectionAll110.filter(v=>v.id)
          break;
        default:
          break;
    }
        }
      }else{
        this.selectAllCom()
      }
      
    },
    //保存
     submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.playId !==7){
              this.save({...this.formSize,identifyPhotosList:[]}).then(res=>{
              this.goTo()
            })
            }else{
              this.save({...this.formSize,moduleList:[],loadingLine:'',unityVersion:''}).then(res=>{
              this.goTo()
            })
            }
          } else {
            this.$message({
            showClose: true,
            message: '有必填项未填写',
            type: 'error'
            });
            return false;
          }
        });
      },
      // update
      updateForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
             if(this.playId !==7){
             this.update({...this.formSize,identifyPhotosList:[]}).then(res=>{
              this.goTo()
            })
             }else{
              this.update({...this.formSize,moduleList:[],loadingLine:'',unityVersion:''}).then(res=>{
              this.goTo()
            })
             }
          } else {
            this.$message({
            showClose: true,
            message: '有必填项未填写',
            type: 'error'
            });
            return false;
          }
        });
      },
      //change play
      changePlayID(id){
        if(id !==7){
          applicationM({playId:this.formSize.playId}).then(res=>{
            this.moduleDetail=res.data
            this.moduleDetail2=this.moduleDetail.map(v=>v)
            this.tagValue=this.moduleDetail[0].moduleName
            this.tagKey=this.moduleDetail[0].module
            this.tagCode=this.moduleDetail[0].module
            this.initModule({...this.$route.query,module:this.moduleDetail[0].module,materialCategoryId:null}).then(res=>{
            this.$store.commit('pagination/setTotal',this.total);
            applicationToTree({moduleId:this.moduleDetail[0].module}).then(res=>{
              this.moduleTree=res.data
              this.moduleTree.push({id: "",name:"全部"})
            })
          })
            
          })
            this.moduleTreeVal=''
            this.wd=''
            this.page=1;
            this.formSize.moduleList=[]
            this.multipleSelectionAll100=[]
            this.multipleSelectionAll101=[]
            this.multipleSelectionAll102=[]
            this.multipleSelectionAll103=[]
            this.multipleSelectionAll104=[]
            this.multipleSelectionAll105=[]
            this.multipleSelectionAll106=[]
            this.multipleSelectionAll107=[]
            this.multipleSelectionAll110=[]
            this.formSize.identifyPhotosList=[]
            if(!this.isCreate&&this.formSize.unityVersion==this.unityVersionEdit&&this.formSize.loadingLine==this.loadingLineEdit&&this.playIdEdit==this.formSize.playId){
            // console.log(11111115555555555,this.formSize.unityVersion,this.unityVersionEdit)
            this.initModule({...this.$route.query,module:this.tagKey}).then(res=>{
            this.$store.commit('pagination/setTotal',this.total);
            this.changeData()
        })
        }
        }if(id ==7){
          this.multipleSelectionAll100=[]
          this.multipleSelectionAll101=[]
          this.multipleSelectionAll102=[]
          this.multipleSelectionAll103=[]
          this.multipleSelectionAll104=[]
          this.multipleSelectionAll105=[]
          this.multipleSelectionAll106=[]
          this.multipleSelectionAll107=[]
          this.multipleSelectionAll110=[]
          this.initPlayModule({...this.$route.query,playId:this.formSize.playId}).then(res=>{
          // if(!this.isCreate){
          //   this.changeData()
          // }
          })
        }
      },
      //返回
      goTo(){
        // console.log(this.$route.query.msg,'this.$route.msg')
        this.$router.push({path:'/applicationManagement/applicationList',query:JSON.parse(this.$route.query.msg)})
      },
      tag2(code,value){
        this.tagValue=value
        this.tagCode=code
        this.firstTime++
      },
      watchSelectAll(){
        if(!this.aa){
          return;
        }
          let idx=this.formSize.moduleList.map(v=>v.module).indexOf(this.tagKey)
          if(idx !== -1){
          this.formSize.moduleList.splice(idx,1,{module:this.tagKey,materialIds:this.materialIdsAarray})
          }else{
            this.formSize.moduleList.push({module:this.tagKey,materialIds:this.materialIdsAarray})
          }
         this.formSize.moduleList.forEach((v,index)=>{
                if(this.tagCode==v.module){
                this.formSize.moduleList=this.formSize.moduleList.filter(v=>v.materialIds&&v.materialIds.length>0)
                }
          })
      },
      watchSelectAll2(){
        //  this.formSize.identifyPhotosList.forEach((v,index)=>{
        //   this.formSize.identifyPhotosList=this.formSize.identifyPhotosList.filter(v=>v.id)   
        //   })
      },
      handleChange(value){
        this.moduleTreeVal=value[value.length-1]
        this.$refs.tree.dropDownVisible = false; //监听值发生变化就关闭它
//         this.$nextTick(()=>{
//         let arr = document.getElementsByClassName('el-cascader__dropdown');
//         for(let i=0;i<arr.length;i++){
//           arr[i].parentElement.removeChild(arr[i]);
//           arr[i]?arr[i].style.display='none':null;
//         }
//       })
      },
      handleChange2(value){
        this.moduleTreeValOther=value[value.length-1]
      },
      playMusic(id,row){
          id?(()=>{
              this.url=`/static/${Base64.decode(id)}`;
              this.$refs.audio.load();
              this.$refs.audio.play();
              this.$refs.audio.onended=function () {
                row.play=!row.play;
              }
              })():(()=>{
                this.$refs.audio.pause();
              })();
        },
      handleSizeChange(value){
        this.limit = value;
      },
      handleCurrentChange(value){
        this.page = value;
      },
      changeUpadte(data){
        // console.log(data,'data')
      if(data.order=='ascending'){
          this.sortType='asc'
        }else if(data.order=='descending'){
          this.sortType='desc'
        }else{
          this.sortType=''
        }
      switch (data.prop) {
          case 'name':
            this.sortField='name'
            break;
          case 'androidResourcePackageSize':
            this.sortField='android_resource_package_size'
            break;
          case 'iosResourcePackageSize':
            this.sortField='ios_resource_package_size'
            break;
          case 'createTime':
            this.sortField='create_time'
            break;
          case 'updateTime':
            this.sortField='update_time'
            break;
          case 'windowsResourcePackageSize':
            this.sortField='windows_resource_package_size'
            break;
          case 'identifyPhotoCode':
          this.sortField='identify_photo_code'
          break;
          case 'identifyPhotoName':
          this.sortField='identify_photo_name'
          break;
          case 'createTime':
          this.sortField='create_time'
          break;
          case 'durationTimeStr':
          this.sortField='duration_time'
          break;    
          default:
            this.sortField=''
            break;
        }
      },
      unique (){
      let obj = {};
      this.electionFlag = this.electionFlag.reduce((item, next)=>{
          obj[next.id] ? '' : obj[next.id] = true && item.push(next);
          return item;
      }, []);
      },
      uniqueChoose (array){
      let result = [];
      let obj = {};
      for(let i =0; i<array.length; i++){
            if(!obj[array[i].id]){
                result.push(array[i]);
                obj[array[i].id] = true;
            }
        }
       return result
      }
  },
  watch:{
  playId(){
// equipmentEyeglass  
   let item = this.options.filter(item=>item.id==this.playId)
   item[0].equipmentType==1?this.equipmentEyeglass=false:item[0].equipmentType==2?this.equipmentEyeglass=true:this.equipmentEyeglass=''
   item[0].id==7?this.isBs=true:this.isBs=false
  },
	page(){
		this.replace("page",this.page);
    },
  limit(){
      this.replace('limit',this.limit);
  },
  wd(){
    console.log(this.wd,'www')
    this.page=1;
    this.replace('wd',this.wd);
  },
  keyWord(){
    console.log(this.keyWord,'keyWord')
    switch (this.tagKey) {
          case 100:
          this.keyWord?this.electionFlag=this.multipleSelectionAll100.filter(item=>item.name.toLowerCase().indexOf(this.keyWord.toLowerCase()) != -1):this.electionFlag=this.multipleSelectionAll100
          // this.electionFlagCopy=this.electionFlag
           break;
           case 101:
           this.keyWord?this.electionFlag=this.multipleSelectionAll101.filter(item=>item.name.toLowerCase().indexOf(this.keyWord.toLowerCase()) != -1):this.electionFlag=this.multipleSelectionAll101
           break;
           case 102:
           this.keyWord?this.electionFlag=this.multipleSelectionAll102.filter(item=>item.name.toLowerCase().indexOf(this.keyWord.toLowerCase()) != -1):this.electionFlag=this.multipleSelectionAll102
           break;
           case 103:
           this.keyWord?this.electionFlag=this.multipleSelectionAll103.filter(item=>item.name.toLowerCase().indexOf(this.keyWord.toLowerCase()) != -1):this.electionFlag=this.multipleSelectionAll103
           break;
           case 104:
           this.keyWord?this.electionFlag=this.multipleSelectionAll104.filter(item=>item.name.toLowerCase().indexOf(this.keyWord.toLowerCase()) != -1):this.electionFlag=this.multipleSelectionAll104
           break;
           case 105:
           this.keyWord?this.electionFlag=this.multipleSelectionAll105.filter(item=>item.name.toLowerCase().indexOf(this.keyWord.toLowerCase()) != -1):this.electionFlag=this.multipleSelectionAll105
           break;
          case 106:
           this.keyWord?this.electionFlag=this.multipleSelectionAll106.filter(item=>item.name.toLowerCase().indexOf(this.keyWord.toLowerCase()) != -1):this.electionFlag=this.multipleSelectionAll106
           break;
           case 107:
           this.keyWord?this.electionFlag=this.multipleSelectionAll107.filter(item=>item.name.toLowerCase().indexOf(this.keyWord.toLowerCase()) != -1):this.electionFlag=this.multipleSelectionAll107
           break;
           case 110:
           this.keyWord?this.electionFlag=this.multipleSelectionAll110.filter(item=>item.name.toLowerCase().indexOf(this.keyWord.toLowerCase()) != -1):this.electionFlag=this.multipleSelectionAll110
           break;
          default:
            break;
        }
       if(this.playId==7){
       this.keyWord?this.electionFlag=this.multipleSelectionAll200.filter(item=>item.identifyPhotoName.toLowerCase().indexOf(this.keyWord.toLowerCase()) != -1):this.electionFlag=this.multipleSelectionAll200
    }
  },
  //过滤 已经选择分类
  moduleTreeValOther(){
    switch (this.tagKey) {
          case 100:
          if(this.keyWord){
            this.electionFlag=this.electionFlag.filter(item=>item.materialCategoryId ==this.moduleTreeValOther)
          }else{
            this.electionFlag=this.multipleSelectionAll100.filter(item=>item.materialCategoryId ==this.moduleTreeValOther)
          }
            break;
          case 101:
            this.keyWord?this.electionFlag=this.electionFlag.filter(item=>item.materialCategoryId ==this.moduleTreeValOther):this.electionFlag=this.multipleSelectionAll101.filter(item=>item.materialCategoryId ==this.moduleTreeValOther)
           break;
          default:
            break;
        }
  },
  moduleTreeVal(){
    this.page=1;
    this.replace('moduleTreeVal',this.moduleTreeVal);
  },
  tagKey(){
     this.initModule({...this.$route.query,module:this.tagKey}).then(res=>{
     this.$store.commit('pagination/setTotal',this.total);
     applicationToTree({moduleId:this.tagKey}).then(res=>{
      this.moduleTree=res.data?res.data:[]
      this.moduleTree.push({id: "",name:"全部"})
    })
    })
    this.$refs.audio.pause();
    this.moduleTreeVal=''
    this.wd=''
    this.sortField=''
    this.sortType=''
    this.viewTypeSelect=''
    this.musicTypeSelect=''
    // this.replace('loadingLine','');
    // this.replace('unityVersion','');
    
    this.multipleSelectionList=[]
    this.page=1
    this.$nextTick(() => {
      this.$refs.multipleTable.doLayout();
    });
    
    switch (this.tagKey) {
      case 100:
        this.electionFlag=this.multipleSelectionAll100;this.unique()
        break;
      case 101:
        this.electionFlag=this.multipleSelectionAll101;this.unique()
        break;
      case 102:
        this.electionFlag=this.multipleSelectionAll102;this.unique()
        break;
      case 103:
        this.electionFlag=this.multipleSelectionAll103;this.unique()
        break;
      case 104:
        this.electionFlag=this.multipleSelectionAll104;this.unique()
        break;
      case 105:
        this.electionFlag=this.multipleSelectionAll105;this.unique()
        break;
      case 106:
        this.electionFlag=this.multipleSelectionAll106;this.unique()
        break;
      case 107:
        this.electionFlag=this.multipleSelectionAll107;this.unique()
        break;
      case 110:
        this.electionFlag=this.multipleSelectionAll110;this.unique()
        break;
      default:
        break;
    }
  },
	currentRow(){
    // console.log(this.currentRow,'currentRow')
    // // this.formSize = Object.assign(this.formSize, this.currentRow);
    // console.log( this.formSize,' this.formSize44')
  },
  
  multipleSelectionAll100(){
    this.materialIdsAarray=this.multipleSelectionAll100.length>0?this.multipleSelectionAll100.map(v=>v.id):[]
    this.watchSelectAll()
    if(this.tagKey==100){this.electionFlag=this.multipleSelectionAll100;this.unique()}
  },
  multipleSelectionAll101(){
    this.materialIdsAarray=this.multipleSelectionAll101.length>0?this.multipleSelectionAll101.map(v=>v.id):[]
    this.watchSelectAll()
    if(this.tagKey==101){this.electionFlag=this.multipleSelectionAll101;this.unique()}
    // this.$nextTick(()=>{
    //   this.multipleSelectionAll101.forEach(row=>{
    //     this.$refs.multipleTable.toggleRowSelection(row);
    //   })
    // })
  },
  multipleSelectionAll102(){
    this.materialIdsAarray=this.multipleSelectionAll102.length>0?this.multipleSelectionAll102.map(v=>v.id):[]
    this.watchSelectAll()
    if(this.tagKey==102){this.electionFlag=this.multipleSelectionAll102;this.unique()}
  },
  multipleSelectionAll103(){
    this.materialIdsAarray=this.multipleSelectionAll103.length>0?this.multipleSelectionAll103.map(v=>v.id):[]
    this.watchSelectAll()
    if(this.tagKey==103){this.electionFlag=this.multipleSelectionAll103;this.unique()}
  },
  multipleSelectionAll104(){
    this.materialIdsAarray=this.multipleSelectionAll104.length>0?this.multipleSelectionAll104.map(v=>v.id):[]
    this.watchSelectAll()
    if(this.tagKey==104){this.electionFlag=this.multipleSelectionAll104;this.unique()}
  },
  multipleSelectionAll105(){
    this.materialIdsAarray=this.multipleSelectionAll105.length>0?this.multipleSelectionAll105.map(v=>v.id):[]
    this.watchSelectAll()
    if(this.tagKey==105){this.electionFlag=this.multipleSelectionAll105;this.unique()}
  },
  multipleSelectionAll106(){
    this.materialIdsAarray=this.multipleSelectionAll106.length>0?this.multipleSelectionAll106.map(v=>v.id):[]
    this.watchSelectAll()
    if(this.tagKey==106){this.electionFlag=this.multipleSelectionAll106;this.unique()}
  },
  multipleSelectionAll107(){
    this.materialIdsAarray=this.multipleSelectionAll107.length>0?this.multipleSelectionAll107.map(v=>v.id):[]
    this.watchSelectAll()
    if(this.tagKey==107){this.electionFlag=this.multipleSelectionAll107;this.unique()}
  },
  multipleSelectionAll110(){
    this.materialIdsAarray=this.multipleSelectionAll110.length>0?this.multipleSelectionAll110.map(v=>v.id):[]
    this.watchSelectAll()
    if(this.tagKey==110){this.electionFlag=this.multipleSelectionAll110;this.unique()}
  },
  multipleSelectionAll200(){
    // console.log('this.watchSelectAll2',this.multipleSelectionAll200)
    if(this.multipleSelectionAll200.length>0){
      this.formSize.identifyPhotosList = Array(this.multipleSelectionAll200.length).fill({})
        // for(var i in this.multipleSelectionAll200) {
        //         for(var j in this.multipleSelectionAll200[i]) {
        //            
        //       
        //         }
        //     }
         this.formSize.identifyPhotosList=JSON.parse(JSON.stringify(this.multipleSelectionAll200))
         this.formSize.identifyPhotosList.forEach(v=>{delete v.identifyPhotoDesc;delete v.createTime;delete v.photoUrl;delete v.identifyPhotoCode;delete v.photoTargetId;delete v.relatedShelveCode;})
    }
    // this.watchSelectAll2()
    if(this.isBs){this.electionFlag=this.multipleSelectionAll200;this.unique()}
  },
  tagCode(){
    if(this.tagCode){
      this.tagKey=this.tagCode
    }
  },
  loadingLine(){
    this.$store.commit('pagination/setClickPage',1);
    // console.log(this.loadingLine,'loadingLineloadingLineloadingLineloadingLineloadingLine')
    this.replace('loadingLine',this.loadingLine)
  },
  unityVersion(){
    this.$store.commit('pagination/setClickPage',1);
    this.replace('unityVersion',this.unityVersion)
  },
  viewTypeSelect(){
    this.$store.commit('pagination/setClickPage',1);
    this.viewTypeSelect !=='全部'?this.replace('viewTypeSelect',this.viewTypeSelect):this.replace('viewTypeSelect','');
  },
  musicTypeSelect(){
    this.$store.commit('pagination/setClickPage',1);
    this.musicTypeSelect !=='全部'?this.replace('musicTypeSelect',this.musicTypeSelect):this.replace('musicTypeSelect','');
  },
  sortField(){
    // console.log(111,this.sortField,'sortField')
    this.$store.commit('pagination/setClickPage',1);
    this.replace('sortField',this.sortField);
  },
  sortType(){
    this.$store.commit('pagination/setClickPage',1);
    this.replace('sortType',this.sortType);
  },
	$route(){//判断路由query变化执行请求
    if(this.$route.name=='applicationCreate'){
    if(!this.isBs){
      // console.log(this.$route.query,'this.$route.query')
		this.initModule({...this.$route.query,module:this.tagKey}).then(res=>{
      console.log(res,'res')
		this.$store.commit('pagination/setTotal',this.total);
    })
    // this.loadingLine=this.$route.query.loadingLine
    // this.unityVersion=this.$route.query.unityVersion
    // this.viewTypeSelect=this.$route.query.viewTypeSelect
    }else{
      this.initPlayModule({...this.$route.query,playId:this.formSize.playId}).then(res=>{
        
      })
    }
      }
    }
  },
   updated(){
    // this.$nextTick(()=>{
    //   this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 110;
    // })
  },
  components: {
    pagination
  }
};
</script>

<style scoped>
.tac span {
  font-size:14px;
  color:#606266;
  padding-left: 5px;
  padding-right: 10px;
}
.el-tag{
  margin-right: 10px;cursor: pointer;
}
</style>
