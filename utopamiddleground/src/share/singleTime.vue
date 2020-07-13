<template>
    <span>
      <span>
        <el-date-picker
          v-model="value"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
          @change="changeTime(value)"
        >
        </el-date-picker>
      </span>
    </span>
</template>

<script>
import {mapState,mapActions} from 'vuex'
    export default {
        name: "singleTime",
        data(){
          return{
            value:''
          }
        },
        methods:{
          ...mapActions('singleTime',['changeTime'])
        }
    }
</script>

<style scoped>

</style>
