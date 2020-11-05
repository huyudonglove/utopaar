<template>
  <div style="display:inline-block;">
    <a class="q" href="javascript:void(0)" @click="up(0)" v-if="hasAuthority==0&&!arrayResource[0]"></a>
    <a class="e" href="javascript:void(0)" @click="up(1)" v-if="hasAuthority==1&&!arrayResource[1]"></a>
    <a class="l" href="javascript:void(0)" @click="up(2)" v-if="hasAuthority==2&&!arrayResource[2]"></a>
    <a class="q_hasResource" href="javascript:void(0)" @click="up(0)" v-if="hasAuthority==0&&arrayResource[0]"></a>
    <a class="e_hasResource" href="javascript:void(0)" @click="up(1)" v-if="hasAuthority==1&&arrayResource[1]"></a>
    <a class="l_hasResource" href="javascript:void(0)" @click="up(2)" v-if="hasAuthority==2&&arrayResource[2]"></a>
    <a class="q_hasAuthority" href="javascript:void(0)" @click="up(0)" v-if="hasAuthority !==0&&!arrayResource[0]"></a>
    <a class="e_hasAuthority" href="javascript:void(0)" @click="up(1)" v-if="hasAuthority !==1&&!arrayResource[1] "></a>
    <a class="l_hasAuthority" href="javascript:void(0)" @click="up(2)" v-if="hasAuthority !==2&&!arrayResource[2] "></a>
  </div>
</template>
<script>
import { Base64 } from 'js-base64';
export default {
  name:'downLoad',
  inject:['replace','reload'],
  props: ["id","disabled","hasResource","hasAuthority","showMoudle"],
  data(){
    return{
      arrayAuthority:[],
      arrayResource:[]
    }
  },
  created(){
    // this.arrayAuthority=this.hasAuthority?this.hasAuthority.split(','):[]
    this.arrayResource=this.hasResource?this.hasResource.split(','):[]
  },
  mounted(){
  },
  methods:{
   up(platformType){
     console.log(platformType,'platformType',this.hasAuthority,platformType)
     this.$emit('uploadAction',{"platformType":platformType,"id":this.id,"disabled":this.disabled,has:this.hasAuthority !==platformType});
   }
  },
  watch:{
    showMoudle(){
    this.reload()
    
    }
  }
}
</script>
<style scoped>
a{
  width: 22px;height: 22px;display: inline-block;cursor: pointer;
}
.q{
  background: url("../../assets/q.png") no-repeat center  center;
}
.e{
  background: url("../../assets/e.png") no-repeat center  center;
}
.l{
  background: url("../../assets/l.png") no-repeat center  center;
}

.q_hasResource{
  background: url("../../assets/q_2.png") no-repeat center  center;
}
.e_hasResource{
  background: url("../../assets/e_2.png") no-repeat center  center;
}
.l_hasResource{
  background: url("../../assets/l_2.png") no-repeat center  center;
}

.q_hasAuthority{
  background: url("../../assets/q_1.png") no-repeat center  center;
}
.e_hasAuthority{
  background: url("../../assets/e_1.png") no-repeat center  center;
}
.l_hasAuthority{
  background: url("../../assets/l_1.png") no-repeat center  center;
}
</style>