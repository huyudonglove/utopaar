<template>
  <div style="display: inline-block">
    <el-date-picker
      v-model="timeValue"
      type="datetimerange"
      format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
      @change="time"
      range-separator="-"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
    export default {
        name: "timeSwitch",
        data(){
          return{
              timeValue:[]
          }
        },
      computed:{
          ...mapState('timeSwitch',['value'])
      },
        methods:{
          time(){
            // console.log(this.timeValue)
            this.$store.commit('timeSwitch/setValue',this.timeValue)
          }
        },
      watch:{
          value(){
            //console.log(8888)
              this.timeValue=this.value;
          }
      },
      created() {
          //console.log(this.$route.query)
          this.timeValue=this.value;
      }
    }
</script>

<style scoped>

</style>
