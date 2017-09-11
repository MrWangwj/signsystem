<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item prop="captcha">
      <el-col :span="12"><div class="grid-content bg-purple"><el-input type="text" v-model="ruleForm2.captcha" auto-complete="off" placeholder="验证码"></el-input></div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple-light" style="margin-left: 10px;"><img @click="getCaptcha"  :src="ruleForm2.imgUrl" class="image"></img></div></el-col>
    </el-form-item>    
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: '',
          captcha: '',
          imgUrl:'',
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ],
          captcha: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ],
        },
      };
    },
    methods: {
      getCaptcha(){
        var _this = this
        _this.axios.post('/sign/captcha').then((res) =>{
           this.ruleForm2.imgUrl = res.data
           console.log(this.ruleForm2.imgUrl)
        })
      },      
      handleSubmit() {
        var _this = this
        if(!(_this.ruleForm2.account == '' || _this.ruleForm2.checkPass ==''|| _this.ruleForm2.captcha =='')){
          _this.axios.post('/sign/login',{
            id: _this.ruleForm2.account,
            password: _this.ruleForm2.checkPass,
            captcha: _this.ruleForm2.captcha,
          }).then((res) => {
              console.log(res.data)
              if(res.data.code == 0){
                _this.$message({
                  message: '登陆成功！',
                  type: 'success',
                  duration: 1000,
                  onClose: function() {
                    window.location="/";
                  },
                });                                      
              }else{
                _this.$message({
                  message: '账号密码错误！',
                  type: 'warning',
                });  
                _this.getCaptcha()
              }
          }).catch(function (error) {
              _this.$message({
                message: '验证码错误！',
                type: 'warning',
              });
              _this.getCaptcha()
          });            
        }
      }
    },
    mounted(){
      this.getCaptcha()
      var _this = this
      document.addEventListener('keydown',function(event){
        if(event.key == 'Enter'){
          _this.handleSubmit() 
        }
      })     
    }
  }
</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>