<template>
  <div class="block" style="position:fixed;left:250px;bottom:10px;">
    <el-pagination
      background
      @size-change="limitChange"
      @current-change="pageChange"
      :current-page="parseInt(clickPage)"
      :page-sizes="[ 20, 40, 60,80]"
      :page-size="parseInt(limitPage)"
      layout="total,sizes, prev, pager, next,jumper"
      :total="parseInt(total?total:0)">
    </el-pagination>
  </div>
</template>

<script>
  import {mapActions,mapState,mapMutations} from 'vuex'
  export default {
    name: "pagination",
    computed:{
      ...mapState('pagination',['clickPage','limitPage','total']),
    },
    inject:['reload'],
    methods: {
      pageChange(val){
        //console.log(val,this.$route)
        this.$store.dispatch('pagination/getClickPage',val);
      },
      limitChange(val){
          //console.log(val)
        this.$store.dispatch('pagination/getLimitPage',val)
      }
    },
    data() {
      return {

      }
    },
    created() {

    },
    mounted() {

    },
    watch:{

    }
  }
</script>

<style scoped>

</style>
