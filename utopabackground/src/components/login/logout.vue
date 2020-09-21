<template>
  <div>
    888888
  </div>
</template>

<script>
  export default {
    name: "logout",
    inject:['reload'],
    created() {
      this.$cookies.remove('backgroundToken');
      new Promise(resolve => {
        this.$router.push('/login');
        resolve(1);
      }).then(v=>{
        window.location.reload();
       }
      )
    }
  }
</script>

<style scoped>

</style>
