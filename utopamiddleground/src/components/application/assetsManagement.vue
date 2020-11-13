<template>
  <router-view ></router-view>
</template>

<script>
export default {
  name:'assetsManagement',
  inject:['reload'],
  watch:{
    $route(to,from){
      if(from.params.appId!==to.params.appId){
        this.reload();
      }
    }
  }
}
</script>

<style scoped>

</style>