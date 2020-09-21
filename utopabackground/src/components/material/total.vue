<template>
    <div v-if="pageShow">
      <div v-if="musicPower.length">
       <div style="height:50px;border-bottom:1px solid #DFDCDC;" >
        <span style="font-size:24px;font-weight:bold;color:#614a4d;" v-if="type==100">音乐素材</span>
        <span style="font-size:24px;font-weight:bold;color:#614a4d;" v-if="type==101">动画素材</span>
        <span style="font-size:24px;font-weight:bold;color:#614a4d;" v-if="type==102">载体模型素材</span>
        <span style="font-size:24px;font-weight:bold;color:#614a4d;" v-if="type==103">普通模型素材</span>
        <span style="font-size:24px;font-weight:bold;color:#614a4d;" v-if="type==104">在线视频素材</span>
        <span style="font-size:24px;font-weight:bold;color:#614a4d;" v-if="type==107">MP4视频素材</span>
        <el-button style="float:right;" type="primary" @click="dialogVisible=true" v-if="type==100" :disabled="!musicPower[0].isCheck">新增</el-button>
        <el-button style="float:right;" type="primary" @click="dialogVisible=true" v-if="type==101"  :disabled="!scenePower[0].isCheck">新增</el-button>
        <el-button style="float:right;" type="primary" @click="dialogVisible=true" v-if="type==102"  :disabled="!carrierPower[0].isCheck">新增</el-button>
        <el-button style="float:right;" type="primary" @click="dialogVisible=true" v-if="type==103" :disabled="!modelPower[0].isCheck">新增</el-button>
        <el-button style="float:right;" type="primary" @click="dialogVisible=true" v-if="type==104" :disabled="!onlineVideoPower[0].isCheck">新增</el-button>
        <el-button style="float:right;" type="primary" @click="dialogVisible=true" v-if="type==107" :disabled="!videoPower[0].isCheck">新增</el-button>

      </div>
      <div style="margin-top: 10px;margin-bottom: 10px;">
        <el-input v-model="word" style="width: 200px;" maxlength="50" suffix-icon="el-icon-search" placeholder="输入关键字"></el-input>
        <span class="myWords">
            类别筛选：
             <el-cascader
               ref="tree"
               v-model="moduleTreeSelect"
               :options="moduleTree"
               :props="props"
               :show-all-levels="false"
               @change="handleChange"
               filterable
               :key="Math.random()"
               clearable>
             </el-cascader>
          </span>
        <span class="myWords">
          创建时间：
        </span>
        <el-date-picker v-model="timeValue" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
        <span >
          <span v-if="type==101||type==102||type==103">
            <span class="myWords">Unity版本：</span>
            <span>
              <el-select v-model="unityVersion" placeholder="请选择" style="width: 150px" clearable>
                <el-option v-for="item in unity" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </span>
          </span>
          <span v-if="type==101||type==102||type==103">
            <span class="myWords">渲染管线：</span>
            <span>
              <el-select v-model="loadingLine" placeholder="请选择" style="width: 150px" clearable>
                <el-option v-for="item in drawing"  :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </span>
          </span>
        <span v-if="type==101||type==102">
          <span class="myWords">动画类型：</span>
          <span>
            <el-select v-model="viewType" placeholder="请选择" style="width: 150px" clearable>
              <el-option v-for="item in cartoon"  :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </span>
        </span>
          <span v-if="type==100">
          <span class="myWords">音乐类型：</span>
          <span>
            <el-select v-model="musicType" placeholder="请选择" style="width: 150px" clearable>
              <el-option v-for="item in musicData"  :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </span>
        </span>
        </span>
        <span style="display: none;">
          <el-button style="float:right;" @click="delectAll" v-if="type==100" :disabled="!musicPower[3].isCheck" type="danger">批量删除</el-button>
          <el-button style="float:right;"  @click="delectAll" v-if="type==101"  :disabled="!scenePower[3].isCheck" type="danger">批量删除</el-button>
          <el-button style="float:right;"  @click="delectAll" v-if="type==102"  :disabled="!carrierPower[3].isCheck" type="danger">批量删除</el-button>
          <el-button style="float:right;"  @click="delectAll" v-if="type==103" :disabled="!modelPower[3].isCheck" type="danger">批量删除</el-button>
          <el-button style="float:right;"  @click="delectAll" v-if="type==104" :disabled="!onlineVideoPower[3].isCheck" type="danger">批量删除</el-button>
          <el-button style="float:right;"  @click="delectAll" v-if="type==107" :disabled="!videoPower[3].isCheck" type="danger">批量删除</el-button>
        </span>
      </div>
      <div v-if="type==100"><!--音乐-->
        <el-table :data="tableData" style="width: 100%" @selection-change="selectAll" :key="1" border :max-height="tableHeight" ref="musicRef" @sort-change="changeUpadte">
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column prop="id" label="ID" width="80" align="center" >
          </el-table-column>
          <el-table-column  label="歌曲名称" width="180" align="center" prop="name" sortable="custom">
            <template slot-scope="scope">
                  {{scope.row.name}}
            </template>
          </el-table-column>
          <el-table-column prop="address" label="音乐预览" width="80" align="center">
            <template slot-scope="scope">
              <span style="cursor: pointer;" >
              <img src="@/assets/play.png" alt="" v-if="!scope.row.play" @click="tableData.forEach(v=>{v.play=false});scope.row.play=true;playMusic(scope.row.androidMaterial,scope.row)">
               <img src="@/assets/stop.png" alt="" v-if="scope.row.play" @click="scope.row.play=!scope.row.play;playMusic()">
            </span>
             </template>
          </el-table-column>
          <el-table-column prop="materialCategoryName" label="所属类别" align="center" >
          </el-table-column>
          <el-table-column  label="资源包大小(m)" align="center" sortable="custom" prop="androidResourcePackageSize">
            <template slot-scope="scope" >
                {{((scope.row.androidResourcePackageSize/(1024*1024))+'').slice(0,4)}}
              <img src="@/assets/down.png" alt="" style="vertical-align: bottom;float: right;cursor: pointer;" @click="downMusic(scope.row.androidMaterial,scope.row)">
            </template>
          </el-table-column>
          <el-table-column prop="materialFormat" label="音乐类型" align="center">
          </el-table-column>
          <el-table-column prop="durationTimeStr" label="总时长" align="center" sortable="custom">
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" sortable="custom">
          </el-table-column>
          <el-table-column prop="updateTime" label="修改时间" align="center" sortable="custom">
          </el-table-column>
          <el-table-column prop="updateUser" label="最后修改人" align="center">
          </el-table-column>
<!--          <el-table-column  label="上下架" align="center" >-->
<!--            <template slot-scope="scope">-->
<!--              <el-switch-->
<!--                v-model="scope.row.state"-->
<!--                active-value="1"-->
<!--                inactive-value="2"-->
<!--                @change="upState(scope.row.state,scope.row.id)"-->
<!--                :disabled="!musicPower[1].isCheck"-->
<!--              >-->
<!--              </el-switch>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column prop="address" label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click.native.prevent="reviseRow(scope.row, tableData)" type="primary" size="small" :disabled="!musicPower[1].isCheck">
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <audio :src="url" autoplay="autoplay" ref="audio"></audio>
      </div>
      <div v-if="type==102"><!--载体-->
        <el-table :data="tableData" style="width: 100%" @selection-change="selectAll" :key="2" border :max-height="tableHeight" ref="containerRef" @sort-change="changeUpadte">
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column prop="id" label="ID" width="50" align="center">
          </el-table-column>
          <el-table-column prop="name" label="模型名称" width="120" align="center" sortable="custom">
          </el-table-column>
          <el-table-column  label="模型预览" align="center">
            <template slot-scope="scope">
              <span style="cursor: pointer;" >
                <img :src="`/api/file/get/${scope.row.pic}`" alt=""  style="width:100px;height:100px" v-focus>
              </span>
            </template>
          </el-table-column>
          <el-table-column  label="占位图预览" align="center">
            <template slot-scope="scope">
              <span style="cursor: pointer;" >
                <img :src="`/api/file/get/${scope.row.placeholderPictureUrl}`" alt="" style="width:100px;height:100px" v-focus >
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="placeholderNum" label="占位符数量" align="center">
          </el-table-column>
          <el-table-column prop="materialCategoryName" label="所属类别" align="center">
          </el-table-column>
          <el-table-column  label="安卓包大小(M)" align="center" sortable="custom" prop="androidResourcePackageSize">
            <template slot-scope="scope">
              {{((scope.row.androidResourcePackageSize/(1024*1024))+'').slice(0,4)}}
              <img v-if="scope.row.androidResourcePackageSize" src="@/assets/down.png" alt="" style="vertical-align: bottom;float: right;cursor: pointer;" @click="downAndroid(scope.row.androidMaterial,scope.row)">
            </template>
          </el-table-column>
          <el-table-column  label="IOS包大小(M)" align="center" sortable="custom" prop="iosResourcePackageSize">
            <template slot-scope="scope">
              {{((scope.row.iosResourcePackageSize/(1024*1024))+'').slice(0,4)}}
              <img v-if="scope.row.iosResourcePackageSize" src="@/assets/down.png" alt="" style="float: right;cursor: pointer;" @click="downIos(scope.row.iosMaterial,scope.row)">
            </template>
          </el-table-column>
          <el-table-column  label="windows包大小(M)" align="center" sortable="custom" prop="windowsResourcePackageSize">
            <template slot-scope="scope">
              {{((scope.row.windowsResourcePackageSize/(1024*1024))+'').slice(0,4)}}
              <img v-if="scope.row.windowsResourcePackageSize" src="@/assets/down.png" alt="" style="float: right;cursor: pointer;" @click="downWindows(scope.row.windowsMaterial,scope.row)">
            </template>
          </el-table-column>
          <el-table-column prop="unityVersion" label="Unity版本" align="center" >
          </el-table-column>
          <el-table-column prop="loadingLine" label="渲染管线" align="center" >
          </el-table-column>
          <el-table-column prop="viewType" label="动画类型" align="center" >
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" sortable="custom">
          </el-table-column>
          <el-table-column prop="updateTime" label="修改时间" align="center" sortable="custom">
          </el-table-column>
          <el-table-column prop="updateUser" label="最后修改人" align="center">
          </el-table-column>
<!--          <el-table-column  label="上下架" align="center">-->
<!--            <template slot-scope="scope">-->
<!--              <el-switch-->
<!--                v-model="scope.row.state"-->
<!--                active-value="1"-->
<!--                inactive-value="2"-->
<!--                @change="upState(scope.row.state,scope.row.id)"-->
<!--                :disabled="!carrierPower[1].isCheck"-->
<!--              >-->
<!--              </el-switch>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column prop="address" label="操作" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button @click.native.prevent="reviseRow(scope.row, tableData)" type="primary" size="small" :disabled="!carrierPower[1].isCheck">
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="type==103"><!--普通载体-->
        <el-table :data="tableData" style="width: 100%" @selection-change="selectAll" :key="3" border :max-height="tableHeight" ref="nomarlRef" @sort-change="changeUpadte">
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column prop="id" label="ID" width="50" align="center">
          </el-table-column>
          <el-table-column prop="name" label="模型名称" width="120" align="center" sortable="custom">
          </el-table-column>
          <el-table-column  label="模型预览" align="center">
            <template slot-scope="scope">
              <span style="cursor: pointer;" >
                <img :src="`/api/file/get/${scope.row.pic}`" alt=""  style="width:100px;height:100px" v-focus>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="materialCategoryName" label="所属类别" align="center">
          </el-table-column>
          <el-table-column  label="安卓包大小(M)" align="center" sortable="custom" prop="androidResourcePackageSize">
            <template slot-scope="scope">
              {{((scope.row.androidResourcePackageSize/(1024*1024))+'').slice(0,4)}}
              <img v-if="scope.row.androidResourcePackageSize" src="@/assets/down.png" alt="" style="vertical-align: bottom;float: right;cursor: pointer;" @click="downAndroid(scope.row.androidMaterial,scope.row)">
            </template>
          </el-table-column>
          <el-table-column  label="IOS包大小(M)" align="center" sortable="custom" prop="iosResourcePackageSize">
            <template slot-scope="scope">
              {{((scope.row.iosResourcePackageSize/(1024*1024))+'').slice(0,4)}}
              <img v-if="scope.row.iosResourcePackageSize" src="@/assets/down.png" alt="" style="float: right;cursor: pointer;" @click="downIos(scope.row.iosMaterial,scope.row)">
            </template>
          </el-table-column>
          <el-table-column  label="windows包大小(M)" align="center" sortable="custom" prop="windowsResourcePackageSize">
            <template slot-scope="scope">
              {{((scope.row.windowsResourcePackageSize/(1024*1024))+'').slice(0,4)}}
              <img  v-if="scope.row.windowsResourcePackageSize"src="@/assets/down.png" alt="" style="float: right;cursor: pointer;" @click="downWindows(scope.row.windowsMaterial,scope.row)">
            </template>
          </el-table-column>
          <el-table-column prop="unityVersion" label="Unity版本" align="center" >
          </el-table-column>
          <el-table-column prop="loadingLine" label="渲染管线" align="center" >
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" sortable="custom">
          </el-table-column>
          <el-table-column prop="updateTime" label="修改时间" align="center" sortable="custom">
          </el-table-column>
          <el-table-column prop="updateUser" label="最后修改人" align="center">
          </el-table-column>
<!--          <el-table-column  label="上下架" align="center">-->
<!--            <template slot-scope="scope">-->
<!--              <el-switch-->
<!--                v-model="scope.row.state"-->
<!--                active-value="1"-->
<!--                inactive-value="2"-->
<!--                @change="upState(scope.row.state,scope.row.id)"-->
<!--                :disabled="!modelPower[1].isCheck"-->
<!--              >-->
<!--              </el-switch>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column prop="address" label="操作" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button @click.native.prevent="reviseRow(scope.row, tableData)" type="primary" size="small" :disabled="!modelPower[1].isCheck">
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="type==101"><!--动画-->
        <el-table :data="tableData" style="width: 100%" @selection-change="selectAll" :key="4" border :max-height="tableHeight" ref="animationRef" @sort-change="changeUpadte">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="id" label="ID" width="50" align="center">
          </el-table-column>
          <el-table-column prop="name" label="动画名称" width="120" align="center" sortable="custom">
          </el-table-column>
          <el-table-column  label="动画展示" align="center">
            <template slot-scope="scope">
              <span style="cursor: pointer;" >
                <img :src="`/api/file/get/${scope.row.pic}`" alt=""  style="width:100px;height:100px" v-focus>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="materialCategoryName" label="所属类别" align="center">
          </el-table-column>
          <el-table-column label="是否配置歌词" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isLyric">是</span>
              <img v-if="scope.row.isLyric" src="@/assets/down.png" alt="" style="vertical-align: bottom;float: right;cursor: pointer;" @click="downLyric(scope.row.lyricUrl,scope.row)">
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column  label="安卓包大小(M)" align="center" sortable="custom" prop="androidResourcePackageSize">
            <template slot-scope="scope">
              {{((scope.row.androidResourcePackageSize/(1024*1024))+'').slice(0,4)}}
              <img v-if="scope.row.androidResourcePackageSize" src="@/assets/down.png" alt="" style="vertical-align: bottom;float: right;cursor: pointer;" @click="downAndroid(scope.row.androidMaterial,scope.row)">
            </template>
          </el-table-column>
          <el-table-column  label="IOS包大小(M)" align="center" sortable="custom" prop="iosResourcePackageSize">
            <template slot-scope="scope">
              {{((scope.row.iosResourcePackageSize/(1024*1024))+'').slice(0,4)}}
              <img v-if="scope.row.iosResourcePackageSize" src="@/assets/down.png" alt="" style="float: right;cursor: pointer;" @click="downIos(scope.row.iosMaterial,scope.row)">
            </template>
          </el-table-column>
          <el-table-column  label="windows包大小(M)" align="center" sortable="custom" prop="windowsResourcePackageSize">
            <template slot-scope="scope">
              {{((scope.row.windowsResourcePackageSize/(1024*1024))+'').slice(0,4)}}
              <img v-if="scope.row.windowsResourcePackageSize" src="@/assets/down.png" alt="" style="float: right;cursor: pointer;" @click="downWindows(scope.row.windowsMaterial,scope.row)">
            </template>
          </el-table-column>
          <el-table-column prop="durationTimeStr" label="动画时长" align="center">
          </el-table-column>
          <el-table-column prop="unityVersion" label="Unity版本" align="center" >
          </el-table-column>
          <el-table-column prop="loadingLine" label="渲染管线" align="center" >
          </el-table-column>
          <el-table-column prop="viewType" label="动画类型" align="center" >
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" sortable="custom">
          </el-table-column>
          <el-table-column prop="updateTime" label="修改时间" align="center" sortable="custom">
          </el-table-column>
          <el-table-column prop="updateUser" label="最后修改人" align="center">
          </el-table-column>
<!--          <el-table-column  label="上下架" align="center">-->
<!--            <template slot-scope="scope">-->
<!--              <el-switch-->
<!--                v-model="scope.row.state"-->
<!--                active-value="1"-->
<!--                inactive-value="2"-->
<!--                @change="upState(scope.row.state,scope.row.id)"-->
<!--                :disabled="!scenePower[1].isCheck"-->
<!--              >-->
<!--              </el-switch>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column prop="address" label="操作" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button @click.native.prevent="reviseRow(scope.row, tableData)" type="primary" size="small" :disabled="!scenePower[1].isCheck">
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="type==104" ><!--在线视频-->
        <el-table :data="tableData" style="width: 100%" @selection-change="selectAll" :key="5" border :max-height="tableHeight" ref="onlineRef" @sort-change="changeUpadte">
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column prop="id" label="ID" width="50" align="center">
          </el-table-column>
          <el-table-column prop="name" label="视频名称" width="120" align="center" sortable="custom">
          </el-table-column>
          <el-table-column  label="视频预览" align="center">
            <template slot-scope="scope">
              <a :href="`${scope.row.videoUrl}`" target="_blank">{{scope.row.videoUrl}} </a>
            </template>
          </el-table-column>
          <el-table-column prop="materialCategoryName" label="所属类别" align="center">
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" sortable="custom">
          </el-table-column>
          <el-table-column prop="updateTime" label="修改时间" align="center" sortable="custom">
          </el-table-column>
          <el-table-column prop="updateUser" label="最后修改人" align="center">
          </el-table-column>
<!--          <el-table-column  label="上下架" align="center">-->
<!--            <template slot-scope="scope">-->
<!--              <el-switch-->
<!--                v-model="scope.row.state"-->
<!--                active-value="1"-->
<!--                inactive-value="2"-->
<!--                @change="upState(scope.row.state,scope.row.id)"-->
<!--                :disabled="!onlineVideoPower[1].isCheck"-->
<!--              >-->
<!--              </el-switch>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column prop="address" label="操作" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button @click.native.prevent="reviseRow(scope.row, tableData)" type="primary" size="small" :disabled="!onlineVideoPower[1].isCheck">
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="type==105"><!--抠像视频-->
        <el-table :data="tableData" style="width: 100%" @selection-change="selectAll" :key="6" border :max-height="tableHeight" @sort-change="changeUpadte">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="id" label="ID" width="50">
          </el-table-column>
          <el-table-column prop="name" label="视频名称" width="120" sortable="custom">
          </el-table-column>
          <el-table-column  label="视频预览">
            <template slot-scope="scope">
              <a :href="`${scope.row.videoUrl}`" target="_blank">{{scope.row.videoUrl}} </a>
            </template>
          </el-table-column>
          <el-table-column prop="materialCategoryName" label="所属类别">
          </el-table-column>
          <el-table-column prop="androidResourcePackageSize" label="安卓包大小(M)">
          </el-table-column>
          <el-table-column prop="androidResourcePackageSize" label="总时长">
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" sortable="custom">
          </el-table-column>
          <el-table-column prop="updateTime" label="修改时间" sortable="custom">
          </el-table-column>
          <el-table-column prop="updateUser" label="最后修改人">
          </el-table-column>
          <el-table-column prop="address" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button @click.native.prevent="reviseRow(scope.row, tableData)" type="primary" size="small">
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="type==107"><!--MP4视频-->
        <el-table :data="tableData" style="width: 100%" @selection-change="selectAll" :key="7" border :max-height="tableHeight" ref="mp4Ref" @sort-change="changeUpadte">
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column prop="id" label="ID" width="50" align="center">
          </el-table-column>
          <el-table-column prop="name" label="视频名称" width="120" align="center" sortable="custom">
          </el-table-column>
          <el-table-column  label="视频预览" align="center">
            <template slot-scope="scope">
              <span style="cursor: pointer">
                <img :src="`/api/file/get/${scope.row.pic}`" alt=""  style="width:100px;height:100px" v-focus>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="materialCategoryName" label="所属类别" align="center">
          </el-table-column>
          <el-table-column  label="资源包大小(M)" align="center" sortable="custom" prop="androidResourcePackageSize">
            <template slot-scope="scope">
              {{((scope.row.androidResourcePackageSize/(1024*1024))+'').slice(0,4)}}
              <img src="@/assets/down.png" alt="" style="float: right;cursor: pointer;" @click="downMusic(scope.row.androidMaterial,scope.row)">
            </template>
          </el-table-column>
          <el-table-column  label="总时长" align="center" prop="durationTimeStr" sortable="custom">
            <template slot-scope="scope">
              {{scope.row.durationTimeStr}}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" sortable="custom">
          </el-table-column>
          <el-table-column prop="updateTime" label="修改时间" align="center" sortable="custom">
          </el-table-column>
          <el-table-column prop="updateUser" label="最后修改人" align="center">
          </el-table-column>
<!--          <el-table-column  label="上架" align="center">-->
<!--            <template slot-scope="scope">-->
<!--              <el-switch-->
<!--                v-model="scope.row.state"-->
<!--                active-value="1"-->
<!--                inactive-value="2"-->
<!--                @change="upState(scope.row.state,scope.row.id)"-->
<!--                :disabled="!videoPower[1].isCheck"-->
<!--              >-->
<!--              </el-switch>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column prop="address" label="操作" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button @click.native.prevent="reviseRow(scope.row, tableData)" type="primary" size="small" :disabled="!videoPower[1].isCheck">
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <pagination v-if="showPagenation"></pagination>
      </div>
      <div><!--弹窗-->
        <el-dialog :title=" id?'编辑':'新增' " :visible.sync="dialogVisible" width="30%"  @close="cancle()"><!--弹窗-->
          <div>
            <span><span style="color: #f56c6c;margin-right: 2px;">*</span>选择分类</span>
            <span v-if="checkedName">
            <el-tag>{{checkedName}}</el-tag>
          </span>
          </div>
          <div style="margin-top: 10px">
            <span>
              <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" ></el-tree>
            </span>
          </div>
          <div v-if="type==100">
            <div style="margin-top: 10px">
              <span>
                <span style="color: #f56c6c;margin-right: 2px;">*</span>音乐名称
              <el-input style="width: 300px" v-model="inputName" maxlength="50"></el-input>
            </span>
            </div>
            <div style="margin-top: 10px">
              <span>
                <span style="color: #f56c6c;margin-right: 2px;">*</span>资源包上传
                <uploadFile buttonName="文件" moduleCode="utopar" type="music" @getSdkId="getSdkId" :parentName="fileName" ></uploadFile>
              </span>
            </div>
          </div>
          <div v-if="type==102"><!--载体模型-->
              <div>
                <span style="color: #f56c6c;margin-right: 2px;">*</span>模型名称 <el-input style="width: 200px;margin-top: 10px;" v-model="inputName" maxlength="50"></el-input>
              </div>
              <div style="margin-top: 10px">
               <h3>上传资源包 </h3>
                安卓包资源<uploadFile buttonName="文件" moduleCode="utopar" type="android" @getSdkId="getSdkId" :parentName="androidFileName"></uploadFile>
                IOS包资源<uploadFile buttonName="文件" moduleCode="utopar" type="ios" @getSdkId="getSdkId" :parentName="iosFileName"></uploadFile>
                windows包资源<uploadFile buttonName="文件" moduleCode="utopar" type="windows" @getSdkId="getSdkId" :parentName="windowsFileName"></uploadFile>
              </div>
              <div>
                <div style="margin-top: 10px">
                  <span style="color: #f56c6c;margin-right: 2px;">*</span>unity版本
                  <el-select v-model="unityVersionAdd" placeholder="请选择" style="width: 180px;margin-left: 10px" clearable>
                    <el-option v-for="item in unity" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </div>
                <div>
                  <div style="margin-top: 10px">
                    <span style="color: #f56c6c;margin-right: 2px;">*</span>渲染管道
                    <el-select v-model="loadingLineAdd" placeholder="请选择" style="width: 180px;margin-left: 14px" clearable>
                      <el-option v-for="item in drawing" :key="item" :label="item" :value="item">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div>
                  <div style="margin-top: 10px">
                    <span style="color: #f56c6c;margin-right: 2px;">*</span>动画类型
                    <el-select v-model="viewTypeAdd" placeholder="请选择" style="width: 180px;margin-left: 14px" clearable>
                      <el-option v-for="item in cartoon" :key="item" :label="item" :value="item">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
               <div style="margin-top: 10px;">
                 <span style="color: #f56c6c;margin-right: 2px;">*</span>上传模型预览图 <br>
                 <uploadImg size="5" type="model" @getImg="getImg" :id="modelId"></uploadImg>
               </div>
                <div style="margin-top: 10px">
                  <span style="color: #f56c6c;margin-right: 2px;">*</span>上传载体占位图 <br>
                  <uploadImg size="2" type="container" @getImg="getImg" :id="containerId"></uploadImg>
                </div>
                <div style="margin-top: 10px">
                  <span style="color: #f56c6c;margin-right: 2px;">*</span>占位符数量<el-input v-model="containerNum" style="width: 200px" maxlength="50" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input>
                </div>
          </div>
          <div v-if="type==103">
            <div style="margin-top: 10px;">
              <span style="color: #f56c6c;margin-right: 2px;">*</span>模型名称 <el-input style="width: 200px" v-model="inputName" maxlength="50"></el-input>
            </div>
            <div style="margin-top: 10px;">
              <h3>上传资源包 </h3>
              安卓包资源<uploadFile buttonName="文件" moduleCode="utopar" type="android" @getSdkId="getSdkId" :parentName="androidFileName"></uploadFile>
              IOS包资源<uploadFile buttonName="文件" moduleCode="utopar" type="ios" @getSdkId="getSdkId" :parentName="iosFileName"></uploadFile>
              windows包资源<uploadFile buttonName="文件" moduleCode="utopar" type="windows" @getSdkId="getSdkId" :parentName="windowsFileName"></uploadFile>
            </div>
            <div>
              <div style="margin-top: 10px">
                <span style="color: #f56c6c;margin-right: 2px;">*</span>unity版本
                <el-select v-model="unityVersionAdd" placeholder="请选择" style="width: 180px;margin-left: 10px" clearable>
                  <el-option v-for="item in unity" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </div>
              <div>
                <div style="margin-top: 10px">
                  <span style="color: #f56c6c;margin-right: 2px;">*</span>渲染管道
                  <el-select v-model="loadingLineAdd" placeholder="请选择" style="width: 180px;margin-left: 14px" clearable>
                    <el-option v-for="item in drawing" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </div>
              </div>
<!--              <div>-->
<!--                <div style="margin-top: 10px">-->
<!--                  <span style="color: #f56c6c;margin-right: 2px;">*</span>动画类型-->
<!--                  <el-select v-model="viewTypeAdd" placeholder="请选择" style="width: 180px;margin-left: 14px" clearable>-->
<!--                    <el-option v-for="item in cartoon" :key="item" :label="item" :value="item">-->
<!--                    </el-option>-->
<!--                  </el-select>-->
<!--                </div>-->
<!--              </div>-->
            </div>
            <div style="margin-top: 10px;">
              <span style="color: #f56c6c;margin-right: 2px;">*</span>上传模型预览图 <br>
              <uploadImg size="5" type="model" @getImg="getImg" :id="modelId"></uploadImg>
            </div>
          </div>
          <div v-if="type==101"><!--动画-->
            <div style="margin-top: 10px;">
              <span style="color: #f56c6c;margin-right: 2px;">*</span>动画名称 <el-input style="width: 200px" v-model="inputName" maxlength="50"></el-input>
            </div>
            <div style="margin-top: 10px;">
              <span style="color: #f56c6c;margin-right: 2px;">*</span>动画时长 <el-input style="width: 200px" v-model="durationTimeStr" maxlength="50" placeholder="00:02:00" onkeyup="value=value.replace(/[^0-9:]/g,'')"></el-input>
            </div>
            <div style="margin-top: 10px;">
              <h3>上传资源包</h3>
              安卓包资源<uploadFile buttonName="文件" moduleCode="utopar" type="android" @getSdkId="getSdkId" :parentName="androidFileName"></uploadFile>
              IOS包资源<uploadFile buttonName="文件" moduleCode="utopar" type="ios" @getSdkId="getSdkId" :parentName="iosFileName"></uploadFile>
              windows包资源<uploadFile buttonName="文件" moduleCode="utopar" type="windows" @getSdkId="getSdkId" :parentName="windowsFileName"></uploadFile>
            </div>
            <div>
              <div style="margin-top: 10px">
                <span style="color: #f56c6c;margin-right: 2px;">*</span>unity版本
                <el-select v-model="unityVersionAdd" placeholder="请选择" style="width: 180px;margin-left: 10px" clearable>
                  <el-option v-for="item in unity" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </div>
              <div>
                <div style="margin-top: 10px">
                  <span style="color: #f56c6c;margin-right: 2px;">*</span>渲染管道
                  <el-select v-model="loadingLineAdd" placeholder="请选择" style="width: 180px;margin-left: 14px" clearable>
                    <el-option v-for="item in drawing" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div>
                <div style="margin-top: 10px">
                  <span style="color: #f56c6c;margin-right: 2px;">*</span>动画类型
                  <el-select v-model="viewTypeAdd" placeholder="请选择" style="width: 180px;margin-left: 14px" clearable>
                    <el-option v-for="item in cartoon" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div style="margin-top: 10px;">
              <span style="color: #f56c6c;margin-right: 2px;">*</span>动画预览图上传 <br>
              <uploadImg size="5" type="gif" @getImg="getImg" :id="gifId"></uploadImg>
            </div>
            <div style="margin-top: 10px;">
              是否配置歌词
              <el-switch v-model="(isLyric)" ></el-switch>
              <span v-if="isLyric">
                <uploadFile buttonName="歌词" moduleCode="utopar" type="lyric" @getSdkId="getSdkId" :parentName="lyricFileName"></uploadFile>
              </span>
            </div>
          </div>
          <div v-if="type==104"><!--在线视频-->
            <div style="margin-top: 10px;">
              <span style="color: #f56c6c;margin-right: 2px;">*</span>视频名称 <el-input style="width: 200px" v-model="inputName" maxlength="50"></el-input>
            </div>
            <div style="margin-top: 10px;">
              <span style="color: #f56c6c;margin-right: 2px;">*</span>视频地址 <el-input style="width: 200px" v-model="videoUrl" maxlength="50"></el-input>
            </div>
          </div>
          <div v-if="type==105"><!--抠像视频不做-->
            <div>
              视频名称 <el-input style="width: 200px" v-model="inputName" maxlength="50"></el-input>
            </div>
            <div>
              上传gif图
              <uploadImg size="5" type="model" @getImg="getImg" :id="modelId"></uploadImg>
            </div>
            <div>
              上传资源包
              <uploadFile buttonName="文件" moduleCode="utopar" type="android" @getSdkId="getSdkId" :parentName="androidFileName"></uploadFile>
            </div>
          </div>
          <div v-if="type==107"><!--MP4视频-->
            <div style="margin-top: 10px;">
              <span style="color: #f56c6c;margin-right: 2px;">*</span>视频名称 <el-input style="width: 200px" v-model="inputName" maxlength="50"></el-input>
            </div>
            <div style="margin-top: 10px;">
              <span style="color: #f56c6c;margin-right: 2px;">*</span>上传gif图
              <uploadImg size="5" type="gif" @getImg="getImg" :id="gifId"></uploadImg>
            </div>
            <div style="margin-top: 10px;">
              <span style="color: #f56c6c;margin-right: 2px;">*</span>上传资源包
              <uploadFile buttonName="文件" moduleCode="utopar" type="video" @getSdkId="getSdkId" :parentName="androidFileName"></uploadFile>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false;">取 消</el-button>
            <el-button type="primary" @click="addTotal">确 定</el-button>
          </span>
        </el-dialog>
       </div>
      </div>
    </div>
</template>

<script>
  import {getTotal,getFile,getTree,addTotal,deletAll,editTotal,upState,offState,getU3d,getMusic} from "../../http/request";
  import pagination from '@/share/pagination'
  import uploadFile from '@/share/uploadFile'
  import uploadImg from '@/share/uploadImg'
  import {mapState} from 'vuex'
  import { Base64 } from 'js-base64';
    export default {
        name: "total",
        components:{
          pagination,
          uploadFile,
          uploadImg
        },
        inject:['replace','reload'],
        computed:{
          ...mapState('pagination',['limitPage','clickPage']),
          ...mapState('currentUserPower',['musicPower','carrierPower','scenePower','videoPower','onlineVideoPower','modelPower']),
        },
        data(){
          return{
            showPagenation:false,
            word:'',
            type:0,
            createTime:'',
            reviseTime:'',
            tableData:[],
            materialCategoryId:'',
            url:'',
            dialogVisible:false,
            data:[],
            defaultProps: {
              children: 'children',
              label: 'name'
            },
            checked:{},
            sdkId:'',
            fileName:'',
            size:'',
            time:'',
            inputName:'',
            selected:[],
            checkedName:'',
            checkedModule:'',
            checkedId:'',
            id:'',//编辑id
            href:window.location.origin,
            androidMaterial:'',
            androidFileName:'',
            androidResourcePackageSize:'',
            iosMaterial:'',
            iosFileName:'',
            iosResourcePackageSize:'',
            modelName:'',
            modelId:'',
            modelSize:'',
            containerName:'',
            containerId:'',
            containerSize:'',
            containerNum:'',
            durationTimeStr:'',//动画时长
            isLyric:false,//歌词
            lyricFileName:'',//歌词名
            lyricId:'',//歌词id
            lyricSize:'',//歌词大小
            videoUrl:'',
            gifName:'',
            gifId:'',
            gifSize:'',
            pageShow:false,
            tableHeight:0,
            props: {
              label: "name",
              children: 'children',
              value:'id',
              checkStrictly: true,
              expandTrigger:'click'
            },
            moduleTreeSelect:[],
            moduleTree:[],
            moduleTreeVal:'',
            timeValue:[],
            state:'',
            wordState:'',
            upS:'',
            unity:[],
            drawing:[],
            cartoon:[],
            unityVersion:'',
            loadingLine:'',
            viewType:'',
            unityVersionAdd:'',
            loadingLineAdd:'',
            viewTypeAdd:'',
            windowsFileName:'',
            windowsMaterial:'',
            windowsResourcePackageSize:'',
            musicData:[],
            musicType:'',
            materialFormat:''
          }
        },
        methods:{
          changeUpadte(state){
            console.log(state.prop)
            //this.$store.commit('pagination/setClickPage',1);
            //this.wordState=state.prop;
            state.prop=='name'&&(()=>{this.wordState='name'})();
            state.prop=='createTime'&&(()=>{this.wordState='create_time'})();
            state.prop=='updateTime'&&(()=>{this.wordState='update_time'})();
            state.prop=='androidResourcePackageSize'&&(()=>{this.wordState='android_resource_package_size'})();
            state.prop=='iosResourcePackageSize'&&(()=>{})(this.wordState='ios_resource_package_size');
            state.prop=='windowsResourcePackageSize'&&(()=>{})(this.wordState='windows_resource_package_size');
            state.prop=='durationTimeStr'&&(()=>{this.wordState='duration_time'})();
            console.log(this.wordState,789)
            this.upS=state.order;
            state.order=='ascending'&&(()=>{this.upS='asc'})();
            state.order=='descending'&&(()=>{this.upS='desc'})();
            this.getTotal();
          },
          getTotal(){
            let msg={
              name:this.$route.query.word||'',
              materialCategoryId:this.moduleTreeVal||'',
              pageNum:this.$route.query.clickPage||1,
              pageSize:this.$route.query.limitPage||20,
              createTimeStart:this.timeValue?this.timeValue[0]:'',
              createTimeEnd:this.timeValue?this.timeValue[1]:'',
              module:this.type,
              unityVersion:this.unityVersion,
              loadingLine:this.loadingLine,
              viewType:this.viewType,
              materialFormat:this.musicType !=='全部'?this.musicType:''
            }
            this.wordState&&(()=>{
              msg.sortField=this.wordState;
              msg.sortType=this.upS;
            })();

            console.log(msg,7777)
            getTotal(msg).then(v=>{
              //console.log(v,8888)
              v.code?this.$message.error(v.msg):(()=>{
                try {
                  var apple=v.data.items.map(r=>{
                    //console.log(r)
                    r.play=false;
                    r.state=r.state+'';
                    return r;
                  })
                }catch (e) {
                  var apple=[];
                }
                this.tableData=apple;
                this.$store.commit('pagination/setTotal',v.data.total)
              })();
            })
          },
          playMusic(id,row){
            id?(()=>{
                // getFile(id).then(v=>{
                //   this.url=v.data.requestUrl;
                //   this.$refs.audio.load();
                //   this.$refs.audio.play();
                // })
              this.url=`/static/${Base64.decode(id)}`;
              this.$refs.audio.load();
              this.$refs.audio.play();
              this.$refs.audio.onended=function () {
                row.play=!row.play;
              }
              //console.log(this.url,9999)
              })():(()=>{
                this.$refs.audio.pause();
              })();
          },
          getTree(){
            getTree(this.type).then(res=>{
              res.code?this.$message.error(res.msg):(()=>{
                //console.log(res.data);
                this.data=res.data;
                this.moduleTree=res.data?[...res.data]:[];
                this.moduleTree.unshift({id:'',name:"全部"})


              })();
            })
          },
          handleNodeClick(data) {
            //console.log(data);
            data.children?(()=>{

            })():(()=>{
              console.log(data);
              this.checked=data;
              this.checkedName=data.name;
              this.checkedModule=data.module;
              this.checkedId=data.id;
            })();
          },
          getSdkId(sdkId,fileName,size,time,type,format){
            //console.log(sdkId,fileName,size,time,type,999)
            type=='music'?(()=>{
                this.sdkId=sdkId;
                this.fileName=fileName;
                this.size=size;
                this.time=time;
                this.materialFormat=format;
              })():'';
            type=='android'?(()=>{
                this.androidMaterial=sdkId;
                this.androidFileName=fileName;
                this.androidResourcePackageSize=size;
            })():'';
            type=='ios'?(()=>{
                this.iosMaterial=sdkId;
                this.iosFileName=fileName;
                this.iosResourcePackageSize=size;
            })():'';
            type=='lyric'?(()=>{
                this.lyricFileName=fileName;
                this.lyricId=sdkId;
                this.lyricSize=size;
                //console.log(this.lyricSize,789)
            })():'';
            type=='video'?(()=>{
              console.log(sdkId,fileName,size)
              this.androidMaterial=sdkId;
              this.androidFileName=fileName;
              this.androidResourcePackageSize=size;
              this.time=time;
            })():'';
            type=='windows'?(()=>{
                this.windowsMaterial=sdkId;
                this.windowsFileName=fileName;
                this.windowsResourcePackageSize=size;
            })():'';
          },
          addTotal(){
            let msg={
              name:'',
              materialCategory:'',
              materialCategoryId:'',
              androidMaterial:'',
              androidFileName:'',
              androidResourcePackageSize:'',
              durationTime:''
            };
            msg.id=this.id;
            this.type=='100'?(()=>{ //音乐
              msg.name=this.inputName;
              msg.materialCategory=this.checkedModule;
              msg.materialCategoryId=this.checkedId;
              msg.androidMaterial=this.sdkId;
              msg.androidFileName=this.fileName;
              msg.androidResourcePackageSize=this.size;
              msg.durationTime=this.time;
              //增加字段
              msg.iosMaterial=this.sdkId;
              msg.iosFileName=this.fileName;
              msg.iosResourcePackageSize=this.size;
              msg.windowsMaterial=this.sdkId;
              msg.windowsResourcePackageSize=this.size;
              msg.windowsFileName=this.fileName;
              msg.materialFormat=this.materialFormat;
              msg.name?(()=>{
                msg.materialCategoryId?(()=>{
                  msg.androidMaterial?(()=>{

                    this.id?(()=>{
                      editTotal(msg).then(res=>{
                        res.code?this.$message.error(res.msg):(()=>{
                          this.$message.success(res.msg);
                          this.getTotal();
                          this.dialogVisible=false;
                          this.cancle();
                        })();
                      })
                    })():(()=>{
                      msg.state=1;
                      addTotal(msg).then(res=>{
                        res.code?this.$message.error(res.msg):(()=>{
                          this.$message.success(res.msg);
                          this.reload();
                        })();
                      })
                    })();

                  })():this.$message.error('音乐素材不能为空');
                })():this.$message.error('分类不能为空')
              })():this.$message.error('音乐名不能为空');

            })():'';
            this.type=='102'?(()=>{
              msg.name=this.inputName;
              msg.materialCategory=this.checkedModule;
              msg.materialCategoryId=this.checkedId;
              msg.androidMaterial=this.androidMaterial;
              msg.androidFileName=this.androidFileName;
              msg.androidResourcePackageSize=this.androidResourcePackageSize;
              msg.iosMaterial=this.iosMaterial;
              msg.iosFileName=this.iosFileName;
              msg.iosResourcePackageSize=this.iosResourcePackageSize;
              msg.placeholderNum=this.containerNum;
              msg.pic=this.modelId;
              msg.placeholderPictureUrl=this.containerId;
              msg.unityVersion=this.unityVersionAdd;
              msg.loadingLine=this.loadingLineAdd;
              msg.viewType=this.viewTypeAdd;
              msg.windowsMaterial=this.windowsMaterial;
              msg.windowsFileName=this.windowsFileName;
              msg.windowsResourcePackageSize=this.windowsResourcePackageSize;
              msg.name?(()=>{
                msg.materialCategoryId?(()=>{
                      msg.placeholderNum?(()=>{
                        msg.pic?(()=>{
                          msg.placeholderPictureUrl?(()=>{
                            msg.unityVersion?(()=>{
                                msg.loadingLine?(()=>{
                                  msg.viewType?(()=>{
                                    this.id?(()=>{
                                      editTotal(msg).then(res=>{
                                        res.code?this.$message.error(res.msg):(()=>{
                                          this.$message.success(res.msg);
                                          this.getTotal();
                                          this.dialogVisible=false;
                                          this.cancle();
                                        })();
                                      })
                                    })():(()=>{
                                      msg.state=1;
                                      addTotal(msg).then(res=>{
                                        res.code?this.$message.error(res.msg):(()=>{
                                          this.$message.success(res.msg);
                                          this.reload();
                                        })();
                                      })
                                    })();
                                  })():this.$message.error('动画类型不能为空')
                                })():this.$message.error('渲染管道不能为空');
                            })():this.$message.error('unity版本不能为空');
                          })():this.$message.error('载体占位图不能为空');
                        })():this.$message.error('模型预览图不能为空')
                      })():this.$message.error('占位符数量不能为空');
                })():this.$message.error('分类不能为空')
              })():this.$message.error('模型名称不能为空');
            })():'';
            this.type=='103'?(()=>{
              msg.name=this.inputName;
              msg.materialCategory=this.checkedModule;
              msg.materialCategoryId=this.checkedId;
              msg.androidMaterial=this.androidMaterial;
              msg.androidFileName=this.androidFileName;
              msg.androidResourcePackageSize=this.androidResourcePackageSize;
              msg.iosMaterial=this.iosMaterial;
              msg.iosFileName=this.iosFileName;
              msg.iosResourcePackageSize=this.iosResourcePackageSize;
              msg.pic=this.modelId;
              msg.unityVersion=this.unityVersionAdd;
              msg.loadingLine=this.loadingLineAdd;
              msg.windowsMaterial=this.windowsMaterial;
              msg.windowsFileName=this.windowsFileName;
              msg.windowsResourcePackageSize=this.windowsResourcePackageSize;
              //msg.viewType=this.viewTypeAdd;
              msg.name?(()=>{
                msg.materialCategoryId?(()=>{
                      msg.pic?(()=>{
                        msg.unityVersion?(()=>{
                          msg.loadingLine?(()=>{
                              this.id?(()=>{
                                editTotal(msg).then(res=>{
                                  res.code?this.$message.error(res.msg):(()=>{
                                    this.$message.success(res.msg);
                                    this.getTotal();
                                    this.dialogVisible=false;
                                    this.cancle();
                                  })();
                                })
                              })():(()=>{
                                msg.state=1;
                                addTotal(msg).then(res=>{
                                  res.code?this.$message.error(res.msg):(()=>{
                                    this.$message.success(res.msg);
                                    this.reload();
                                  })();
                                })
                              })();
                          })():this.$message.error('渲染管道不能为空')
                        })():this.$message.error('unity版本不能为空')
                      })():this.$message.error('模型预览图不能为空')
                })():this.$message.error('分类不能为空')
              })():this.$message.error('模型名称不能为空')
            })():'';
            this.type=='101'?(()=>{  //动画
              msg.name=this.inputName;
              msg.materialCategory=this.checkedModule;
              msg.materialCategoryId=this.checkedId;
              msg.androidMaterial=this.androidMaterial;
              msg.androidFileName=this.androidFileName;
              msg.androidResourcePackageSize=this.androidResourcePackageSize;
              msg.iosMaterial=this.iosMaterial;
              msg.iosFileName=this.iosFileName;
              msg.iosResourcePackageSize=this.iosResourcePackageSize;
              msg.pic=this.gifId;
              msg.durationTimeStr=this.durationTimeStr;
              msg.isLyric=this.isLyric||true;
              this.isLyric?(()=>{
                msg.lyricUrl=this.lyricId;
                msg.lyricFileName=this.lyricFileName;
                msg.lyricSize=this.lyricSize;
                msg.isLyric=1;
              })():(()=>{
                msg.lyricUrl='';
                msg.lyricFileName='';
                msg.lyricSize='';
                msg.isLyric=0;
              })();
              msg.unityVersion=this.unityVersionAdd;
              msg.loadingLine=this.loadingLineAdd;
              msg.viewType=this.viewTypeAdd;
              msg.windowsMaterial=this.windowsMaterial;
              msg.windowsFileName=this.windowsFileName;
              msg.windowsResourcePackageSize=this.windowsResourcePackageSize;
              msg.name?(()=>{
                msg.materialCategoryId?(()=>{
                      msg.pic?(()=>{
                        msg.durationTimeStr?(()=>{
                          msg.unityVersion?(()=>{
                            msg.loadingLine?(()=>{
                              msg.viewType?(()=>{
                                this.id?(()=>{
                                  editTotal(msg).then(res=>{
                                    res.code?this.$message.error(res.msg):(()=>{
                                      this.$message.success(res.msg);
                                      this.getTotal();
                                      this.dialogVisible=false;
                                      this.cancle();
                                    })();
                                  })
                                })():(()=>{
                                  msg.state=1;
                                  addTotal(msg).then(res=>{
                                    res.code?this.$message.error(res.msg):(()=>{
                                      this.$message.success(res.msg);
                                      this.reload();
                                    })();
                                  })
                                })();
                              })():this.$message.error('动画类型不能为空')
                            })():this.$message.error('渲染管道不能为空')
                          })():this.$message.error('unity版本不能为空')
                        })():this.$message.error('动画时长不能为空')
                      })():this.$message.error('动画预览图不能为空')
                })():this.$message.error('分类不能为空');
              })():this.$message.error('动画名称不能为空');
            })():'';
            this.type=='104'?(()=>{
              msg.name=this.inputName;
              msg.materialCategory=this.checkedModule;
              msg.materialCategoryId=this.checkedId;
              msg.videoUrl=this.videoUrl;
              msg.name?(()=>{
                msg.materialCategoryId?(()=>{
                  msg.videoUrl?(()=>{
                    this.id?(()=>{
                      editTotal(msg).then(res=>{
                        res.code?this.$message.error(res.msg):(()=>{
                          this.$message.success(res.msg);
                          this.getTotal();
                          this.dialogVisible=false;
                          this.cancle();
                        })();
                      })
                    })():(()=>{
                      msg.state=1;
                      addTotal(msg).then(res=>{
                        res.code?this.$message.error(res.msg):(()=>{
                          this.$message.success(res.msg);
                          this.reload();
                        })();
                      })
                    })();
                  })():this.$message.error('视频地址不能为空')
                })():this.$message.error('分类不能为空')
              })():this.$message.error('视频名称不能为空');
            })():'';
            this.type=='107'?(()=>{
              //mp4
              msg.name=this.inputName;
              msg.materialCategory=this.checkedModule;
              msg.materialCategoryId=this.checkedId;
              msg.androidMaterial=this.androidMaterial;
              msg.androidFileName=this.androidFileName;
              msg.androidResourcePackageSize=this.androidResourcePackageSize;
              msg.durationTime=this.time;
              msg.pic=this.gifId;
              //增加字段
              msg.iosMaterial=this.androidMaterial;
              msg.iosFileName=this.androidFileName;
              msg.iosResourcePackageSize=this.androidResourcePackageSize;
              msg.windowsMaterial=this.androidMaterial;
              msg.windowsFileName=this.androidFileName;
              msg.windowsResourcePackageSize=this.androidResourcePackageSize;
              msg.name?(()=>{
                msg.materialCategoryId?(()=>{
                  msg.androidMaterial?(()=>{
                      msg.pic?(()=>{
                        this.id?(()=>{
                          editTotal(msg).then(res=>{
                            res.code?this.$message.error(res.msg):(()=>{
                              this.$message.success(res.msg);
                              this.getTotal();
                              this.dialogVisible=false;
                              this.cancle();
                            })();
                          })
                        })():(()=>{
                          msg.state=1;
                          addTotal(msg).then(res=>{
                            res.code?this.$message.error(res.msg):(()=>{
                              this.$message.success(res.msg);
                              this.reload();
                            })();
                          })
                        })();
                      })():this.$message.error('gif图不能为空')
                  })():this.$message.error('资源包不能为空')
                })():this.$message.error('分类不能为空')
              })():this.$message.error('视频名称不能为空')
            })():'';
            console.log(msg,9999);


          },
          selectAll(val){
            console.log(val,888)
            this.selected=val;
          },
          delectAll(){
              this.selected.length?(()=>{
                let ids='';
                for(let i=0;i<this.selected.length;i++){
                  ids+=this.selected[i].id+','
                }
                deletAll(ids).then(res=>{
                  this.replace('clickPage',1);
                  this.reload();
                })
              })():this.$message.error('请选择需要删除的选项');
          },
          reviseRow(row,all){
            this.dialogVisible=true;
            console.log(row,all,888)
            this.type=='100'?(()=>{
              this.id=row.id;
              this.checkedName=row.materialCategoryName;
              this.inputName=row.name;
              this.checkedModule=row.materialCategory;
              this.checkedId=row.materialCategoryId;
              this.sdkId=row.androidMaterial;
              this.fileName=row.androidFileName;
              this.size=row.androidResourcePackageSize;
              this.time=row.durationTime;
              //增加字段
              this.iosMaterial=row.androidMaterial;
              this.iosFileName=row.androidFileName;
              this.iosResourcePackageSize=row.androidResourcePackageSize;
              this.windowsMaterial=row.androidMaterial;
              this.windowsFileName=row.androidFileName;
              this.windowsResourcePackageSize=row.androidResourcePackageSize;
              this.materialFormat=row.materialFormat;
            })():'';
            this.type=='102'?(()=>{
              this.id=row.id;
              this.checkedName=row.materialCategoryName;
              this.inputName=row.name;
              this.checkedModule=row.materialCategory;
              this.checkedId=row.materialCategoryId;
              this.androidFileName=row.androidFileName;
              this.androidMaterial=row.androidMaterial;
              this.androidResourcePackageSize=row.androidResourcePackageSize;
              this.iosFileName=row.iosFileName;
              this.iosMaterial=row.iosMaterial;
              this.iosResourcePackageSize=row.iosResourcePackageSize;
              this.containerNum=row.placeholderNum;
              this.modelId=row.pic;//模型图片
              this.containerId=row.placeholderPictureUrl;//占位图图片
              this.unityVersionAdd=row.unityVersion;
              this.loadingLineAdd=row.loadingLine;
              this.viewTypeAdd=row.viewType;
              this.windowsMaterial=row.windowsMaterial;
              this.windowsFileName=row.windowsFileName;
              this.windowsResourcePackageSize=row.windowsResourcePackageSize;
            })():'';
            this.type=='103'?(()=>{
              this.id=row.id;
              this.checkedName=row.materialCategoryName;
              this.inputName=row.name;
              this.checkedModule=row.materialCategory;
              this.checkedId=row.materialCategoryId;
              this.androidFileName=row.androidFileName;
              this.androidMaterial=row.androidMaterial;
              this.androidResourcePackageSize=row.androidResourcePackageSize;
              this.iosFileName=row.iosFileName;
              this.iosMaterial=row.iosMaterial;
              this.iosResourcePackageSize=row.iosResourcePackageSize;
              this.modelId=row.pic;//模型图片
              this.containerId=row.placeholderPictureUrl;//占位图图片
              this.unityVersionAdd=row.unityVersion;
              this.loadingLineAdd=row.loadingLine;
              //this.viewTypeAdd=row.viewType;
              this.windowsMaterial=row.windowsMaterial;
              this.windowsFileName=row.windowsFileName;
              this.windowsResourcePackageSize=row.windowsResourcePackageSize;
            })():'';
            this.type=='101'?(()=>{ //动画
              this.id=row.id;
              this.checkedName=row.materialCategoryName;
              this.inputName=row.name;
              this.checkedModule=row.materialCategory;
              this.checkedId=row.materialCategoryId;
              this.androidFileName=row.androidFileName;
              this.androidMaterial=row.androidMaterial;
              this.androidResourcePackageSize=row.androidResourcePackageSize;
              this.iosFileName=row.iosFileName;
              this.iosMaterial=row.iosMaterial;
              this.iosResourcePackageSize=row.iosResourcePackageSize;
              this.gifId=row.pic;
              this.durationTimeStr=row.durationTimeStr;
              row.isLyric==0?this.isLyric=false:this.isLyric=true;
              this.lyricFileName=row.lyricFileName;
              this.lyricId=row.lyricUrl;
              this.containerId=row.placeholderPictureUrl;//占位图图片
              this.unityVersionAdd=row.unityVersion;
              this.loadingLineAdd=row.loadingLine;
              this.viewTypeAdd=row.viewType;
              this.windowsMaterial=row.windowsMaterial;
              this.windowsFileName=row.windowsFileName;
              this.windowsResourcePackageSize=row.windowsResourcePackageSize;
            })():'';
            this.type=='104'?(()=>{
              this.id=row.id;
              this.checkedName=row.materialCategoryName;
              this.inputName=row.name;
              this.checkedModule=row.materialCategory;
              this.checkedId=row.materialCategoryId;
              this.videoUrl=row.videoUrl;
            })():'';
            this.type=='107'?(()=>{
              this.id=row.id;
              this.checkedName=row.materialCategoryName;
              this.inputName=row.name;
              this.checkedModule=row.materialCategory;
              this.checkedId=row.materialCategoryId;
              this.androidMaterial=row.androidMaterial;
              this.androidFileName=row.androidFileName;
              this.androidResourcePackageSize=row.androidResourcePackageSize;
              this.time=row.durationTime;
              this.gifId=row.pic;
              //增加字段
              this.iosMaterial=row.androidMaterial;
              this.iosFileName=row.androidFileName;
              this.iosResourcePackageSize=row.androidResourcePackageSize;
              this.windowsFileName=row.androidFileName;
              this.windowsMaterial=row.androidMaterial;
              this.windowsResourcePackageSize=row.androidResourcePackageSize;
            })():'';
            this.state=row.state;
          },
          reviseTotal(msg){
              //console.log(msg,999)
          },
          cancle(){
            //清空操作
            this.checked={};
            this.id='';
            this.checkedName='';
            this.inputName='';
            this.checkedModule='';
            this.checkedId='';
            this.sdkId='';
            this.fileName='';
            this.size='';
            this.time='';
            this.androidMaterial='';
            this.androidFileName='';
            this.androidResourcePackageSize='';
            this.iosMaterial='';
            this.iosFileName='';
            this.iosResourcePackageSize='';
            this.modelName='';
            this.modelId='';
            this.modelSize='';
            this.containerId='';
            this.containerName='';
            this.containerSize='';
            this.containerNum='';
            this.durationTimeStr='';
            this.isLyric=false;
            this.lyricFileName='';
            this.lyricId='';
            this.lyricSize='';
            this.videoUrl='';
            this.gifId='';
            this.gifName='';
            this.gifSize='';
            this.moduleTreeSelect=[];
            this.state='';
            this.unityVersionAdd='';
            this.loadingLineAdd='';
            this.viewTypeAdd='';
            this.windowsResourcePackageSize='';
            this.windowsMaterial='';
            this.windowsFileName='';
            this.windowsResourcePackageSize='';
            this.materialFormat='';
            this.getTree();
          },
          getImg(name,id,size,time,type){
            //console.log(name,id,size,time,type,9999)
              type=='model'?(()=>{
                  this.modelId=id;
                  this.modelSize=size;
                  this.modelName=name;
              })():'';
              type=='container'?(()=>{
                this.containerId=id;
                this.containerName=name;
                this.containerSize=size;
              })():'';
              type=='gif'?(()=>{
                this.gifId=id;
                this.gifName=name;
                this.gifSize=size;
              })():'';
          },
          handleChange(value){
            console.log(value);
            this.moduleTreeVal=value[value.length-1];
            this.$nextTick(()=>{
              let arr = document.getElementsByClassName('el-cascader__dropdown');
              for(let i=0;i<arr.length;i++){
                arr[i].parentElement.removeChild(arr[i]);
                arr[i]?arr[i].style.display='none':null;
              }
            })
          },
          upState(state,id){
              //console.log(state,9999999)
              state==1?(()=>{
                upState(id);
              })():'';
              state==2?(()=>{
                offState(id);
              })():'';
          },
          downMusic(id,row){
            let url=`/static/${Base64.decode(id)}`;
            let aTag = document.createElement('a')
            aTag.download = row.name;
            aTag.href = url;
            aTag.click()
          },
          downAndroid(id,row){
            let url=`/static/${Base64.decode(id)}`;
            let aTag = document.createElement('a')
            aTag.download = row.androidFileName;
            aTag.href = url;
            aTag.click()
          },
          downIos(id,row){
            let url=`/static/${Base64.decode(id)}`;
            let aTag = document.createElement('a')
            aTag.download = row.iosFileName;
            aTag.href = url;
            aTag.click()
          },
          downLyric(id,row){
            //console.log(id,row)
            //return;
            let url=`/static/${Base64.decode(id)}`;
            let aTag = document.createElement('a')
            aTag.download = row.lyricFileName;
            aTag.href = url;
            aTag.click()
          },
          downWindows(id,row){
            let url=`/static/${Base64.decode(id)}`;
            let aTag = document.createElement('a')
            aTag.download = row.windowsFileName;
            aTag.href = url;
            aTag.click()
          },
          getU3d(){
            getU3d(2).then(v=>{
              //console.log(v,789);
              this.unity=v.data;
            })
            getU3d(1).then(v=>{
              //console.log(v,789);
              this.drawing=v.data;
            })
            getU3d(3).then(v=>{
              this.cartoon=v.data;
            })
          },
          getMusic(){
            getMusic().then(res=>{
              !res.code&&(()=>{
                this.musicData=res.data;
                this.musicData.unshift("全部")
              })();
              console.log(res,77777)
            })
          }
        },
        watch:{
          createTime(){
            //console.log(this.createTime)
            this.$store.commit('pagination/setClickPage',1);
            this.replace('createTime',this.createTime)
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
          timeValue(){
            this.replace('clickPage',1);
            console.log(this.timeValue,99);
            this.getTotal();
          },
          moduleTreeVal(){
            this.replace('clickPage',1);
            this.getTotal();
          },
          unityVersion(){
            this.replace('clickPage',1);
            this.getTotal();
          },
          loadingLine(){
            this.replace('clickPage',1);
            this.getTotal();
          },
          viewType(){
            this.replace('clickPage',1);
            this.getTotal();
          },
          musicType(){
            this.replace('clickPage',1);
            this.getTotal();
          },
          $route(){
            console.log(this.type,777);
            this.url='';
            this.moduleTreeVal='';
            this.moduleTreeSelect=[];
            switch (this.$route.name) {
              case 'music':
                this.type=100;
                //this.reload();
                break;
              case 'animation':
                this.type=101;
                break;
              case 'container':
                this.type=102;
                break;
              case 'nomarl':
                this.type=103;
                break;
              case 'online':
                this.type=104;
                break;
              case 'mp4':
                this.type=107;
                break;
              default:
                break;
            }
            this.getTotal();
            this.getTree();
            this.pageShow=false;
            this.pageShow=true;
            //this.moduleTreeSelect=this.$route.query.moduleTreeSelect?JSON.parse(this.$route.query.moduleTreeSelect):[]
          },
          type(){
            //this.reload();
            this.unityVersion='';
            this.viewType='';
            this.loadingLine='';
            this.word='';
            this.timeValue=[];
            this.viewTypeAdd='';
            this.unityVersionAdd='';
            this.loadingLineAdd='';
            this.$store.commit('pagination/setLimitPage',20);
            this.wordState='';
            this.upS='';
          }
        },
        created() {
          switch (this.$route.name) {
            case 'music':
              this.type=100;
              break;
            case 'animation':
              this.type=101;
              break;
            case 'container':
              this.type=102;
              break;
            case 'nomarl':
              this.type=103;
              break;
            case 'online':
              this.type=104;
              break;
            case 'mp4':
              this.type=107;
              break;
            default:
              break;
          }
          this.createTime=this.$route.query.createTime||'';
          this.reviseTime=this.$route.query.reviseTime||'';
          this.word=this.$route.query.word||'';
          let limit=this.$route.query.limitPage||20;
          let page=this.$route.query.clickPage||1;
          this.$nextTick(()=>{
              this.$store.commit('pagination/setLimitPage',limit);
              this.$store.commit('pagination/setClickPage',page);
              //分页显示隐藏
            this.getTotal();
            this.getTree();
            this.getU3d();
            this.getMusic();
            this.showPagenation=true;
            this.pageShow=true;
          })
        },
      updated(){
        //console.log(this.$route,888)
        (this.$route.name=='music'&&this.type==100)||this.$route.name=='animation'||this.$route.name=='container'||this.$route.name=='nomarl'||this.$route.name=='online'||this.$route.name=='mp4'?(()=>{
          this.$nextTick(()=>{
            try {
              switch (this.$route.name) {
                case 'music':
                  this.tableHeight = window.innerHeight - this.$refs.musicRef.$el.offsetTop - 120;
                  break;
                case 'animation':
                  this.tableHeight = window.innerHeight - this.$refs.animationRef.$el.offsetTop - 120;
                  break;
                case 'container':
                  this.tableHeight = window.innerHeight - this.$refs.containerRef.$el.offsetTop - 120;
                  break;
                case 'nomarl':
                  this.tableHeight = window.innerHeight - this.$refs.nomarlRef.$el.offsetTop - 120;
                  break;
                case 'online':
                  this.tableHeight = window.innerHeight - this.$refs.onlineRef.$el.offsetTop - 120;
                  break;
                case 'mp4':
                  this.tableHeight = window.innerHeight - this.$refs.mp4Ref.$el.offsetTop - 120;
                  break;
                default:
                  break;
              }
            }catch (e) {
              //console.log(e)
            }

          })
        })():'';
      }
    }
</script>

<style scoped>
.music{
  background: url("../../assets/icon_mus_AD.png") no-repeat left;
}
.container{
  background: url("../../assets/icon_Carrier_model_AD.png") no-repeat left;
}
.nomarl{
  background: url("../../assets/icon_model_AD.png") no-repeat left;
}
.animation{
  background: url("../../assets/icon_cartoon_AD.png") no-repeat left;
}
.mp4{
 background: url("../../assets/icon_MP4video_AD.png") no-repeat left;
}
.online{
  background: url("../../assets/icon_Online-Video_AD.png") no-repeat left;
}

</style>
