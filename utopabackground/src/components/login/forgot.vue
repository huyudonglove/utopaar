<template>
    <div class="h-div">
      <div class="h-login">
        <div class="h-head">utopa AR管理后台</div>
        <div style="margin-top: 10px;padding-left: 40px">
          <el-input v-model="email" style="width: 250px" placeholder="账号"></el-input> <el-button @click="sendCode" :disabled="disabled">发送验证码 <span v-if="disabled">{{time+'s'}}</span></el-button>
        </div>
        <div style="margin-top: 10px;padding-left: 40px">
          <el-input v-model="code" style="width: 350px" placeholder="请输入验证码"></el-input>
        </div>
        <div style="margin-top: 10px;padding-left: 40px">
          <el-input v-model="newPass" style="width: 350px" type="password" placeholder="请输入新密码"></el-input>
        </div>
        <div style="margin-top: 10px;padding-left: 40px">
          <el-input v-model="checkPass" style="width: 350px" type="password" placeholder="请确认密码"></el-input>
        </div>
        <div class="btnDiv" style="margin-top: 10px">
          <input type="button" class="currentBtn "  @click="resetPass" value="确定" style="margin-right:30px"/>
          <input type="button" @click="$router.push('/login')" value="取消">
        </div>
      </div>
    </div>
</template>

<script>
  import {sendCode,resetPass} from "../../http/request";

  export default {
        name: "forget",
        data(){
          return{
              email:'',
              code:'',
              newPass:'',
              checkPass:'',
              disabled:false,
              time:60,
              inter:''
          }
        },
        methods:{
          sendCode(){
              let apple={
                email: this.email
              }
              this.email?(()=>{
                sendCode(apple).then(
                  v=>{
                    this.disabled=true;
                    this.inter=setInterval((()=>{
                      this.time--;
                    }),1000)
                  }
                )
              })():this.$message.error('邮箱不能为空');
          },
          resetPass(){
            this.code?(()=>{
              this.newPass?(()=>{
                let apple={
                  code:this.code,
                  password:this.newPass,

                };
                this.newPass==this.checkPass?(()=>{
                  resetPass(apple).then(res=>{
                    res.code?this.$message.error(res.msg):(()=>{
                      this.$message.success(res.msg);
                      this.$router.push('/login');
                    })();
                  })
                })():this.$message.error('两次密码不同，请重新输入')
              })():this.$message.error('密码不能为空');
            })():this.$message.error('验证码不能为空')
          }
        },
       watch:{
          time(){
            this.time?'':(()=>{
              this.disabled=false;
              this.time=60;
              clearInterval(this.inter)
            })();
          }
       }
    }
</script>

<style scoped>
  .h-div{
    background: url("../../assets/bg.png") no-repeat center  center;
    background-size:100% 100%;
    width: 100%;
    height: 100%;
    position: absolute
  }
  .h-login{
    position: relative;
    width: 440px;
    padding-bottom: 20px;
    background: rgb(250,250,250);
    left: 50%;
    margin-left:340px;
    top: 20%;
    box-shadow:0px 0px 4px 0px rgba(0, 0, 0, 0.1);
    border-radius:10px;
  }

  .h-head{
    text-align: center;
    border-bottom: 1px solid #e5e5e5;
    height:90px;
    line-height: 90px;
    font-size:24px;
    color:#0074E4
  }

  /* input[type="text"]{
     width:200px;
     border: 0;
   outline: none;
   border: 1px solid #e5e5e5;
     line-height: 24px;
     font-size: 14px
    }
    input[type="passWord"]{
     width:280px;
     border: 0;
   outline: none;
   border: 1px solid #e5e5e5;
     line-height: 24px;
     font-size: 14px;
    } */
  .btnDiv	input[type="button"]{
    width:160px;
    height:50px;
    background:rgba(223,220,220,1);
    box-shadow:0px 4px 10px 0px rgba(223,220,220,0.3);
    border-radius:10px;
    font-size: 18px;
    border:0px none;
    cursor: pointer;
  }
  .h-login .el-input{
    width:280px;

  }

  .btnDiv input.currentBtn{

    background:#0074E4;
    border:2px solid #0074E4;
    box-shadow:0px 4px 10px 0px #0074E4;
    color:#fff
  }
  .code{
    width:68px;
    text-align: center;
    /* color:#fff; */
    height:36px;
    line-height: 36px;
    /* background:rgba(245,124,4,1); */
    /* border-radius:10px; */
    position:absolute;
    right:40px;
    font-size:14px;
    top:4px;
    cursor: pointer;
    /* border: 1px solid #ff644e */
  }
  .posR{
    position:relative
  }
  .btnDiv{
    clear: both;
    text-align: center;
  }
  ::-webkit-input-placeholder{
    color: #DFDCDC
  }    /* 使用webkit内核的浏览器 */
  :-moz-placeholder{	color: #DFDCDC}                  /* Firefox版本4-18 */
  ::-moz-placeholder{	color: #DFDCDC}                  /* Firefox版本19+ */
  :-ms-input-placeholder{	color: #DFDCDC}           /* IE浏览器 */
  /* .el-form-item__label{
       text-align: right;
   font-size: 16px !important;
   color: #606266;
   line-height: 40px;
   padding: 0 12px 0 0;
   -webkit-box-sizing: border-box;
   box-sizing: border-box
   } */
  .is-hidden {
    position: absolute;
    left: -10000px;
    top: -10000px;
  }
</style>
