<template>
    <div>
        <el-form ref="form" :rules="rules" :model="form" label-width="80px">
            <el-form-item label="学号" prop="id" >
                <el-input class="nameWidth" v-model.number="form.id"></el-input>
            </el-form-item>

            <el-form-item label="姓名" prop="name">
                <el-input class="nameWidth" v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="form.sex">
                    <el-radio label="0">男</el-radio>
                    <el-radio label="1">女</el-radio>
                </el-radio-group>
            </el-form-item>


            <el-form-item label="分组" prop="grouping">
                <el-select v-model="form.grouping" placeholder="请选择分组">
                    <el-option v-for="group in infoData.groups" :key="group.id" :label="group.name" :value="group.id"></el-option>
                </el-select>
            </el-form-item>



            <el-form-item label="职务" prop="position">
                <el-checkbox-group v-model="form.position">
                    <el-checkbox  v-for="position in infoData.positions" :key="position.id" :label="position.id" :value="position.id" name="type">{{ position.name }}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="电话" prop="tel">
                <el-input class="nameWidth" v-model="form.tel"></el-input>
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
                <el-input class="nameWidth" v-model="form.email"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">立即添加</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {

            let checkId = (rule, value, callback) => {
                if(!/^\d{10,11}$/.test(value)){
                    return callback(new Error('请输入正确的学号'));
                }else{
                    callback();
                }
            };

            let checkTel = (rule, value, callback) => {
                if(!/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(value)){
                    return callback(new Error('请输入正确的手机号'));
                }else{
                    callback();
                }
            };




            return {
                infoData:{
                    groups: [],
                    positions: [],
                },
                form: {
                    id: '',
                    name: '',
                    sex: '0',
                    grouping: '',
                    email: '',
                    tel: '',
                    position: [],
                },
                rules: {
                    id: [
                        { required: true, message: '请输入学号',  },
                        { validator: checkId, message: '请输入正确的学号' }
                    ],
                    name: [
                        { required: true, message: '请输入姓名' },
                        { min: 2, max: 4, message: '请输入正确的姓名' },
                    ],
                    sex:[
                        { required: true, message: '请输选择性别' },
                    ],
                    grouping: [
                        { required: true, message: '请选择分组' }
                    ],
                    position: [
                        { type: 'array', required: true, message: '请选择职务' }
                    ],
                    tel: [
                        { required: true, message: '请输入手机号' },
                        { validator: checkTel, message: '请输入正确的手机号' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱' },
                        { type: 'email', message: '请输入正确的邮箱' }
                    ],
                },

            }
        },
        methods: {
            onSubmit(formName) {


                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$loading();
                        let form = this.form;

                        axios.post('/admin/user/add',{
                            id: form.id,
                            name: form.name,
                            sex: form.sex,
                            grouping_id: form.grouping,
                            positions: form.position,
                            tel: form.tel,
                            email: form.email
                        }).then(response => {
                            console.log(response.data);
                            this.$loading().close();

                            let data = response.data;
                            if(parseInt(data.code) === 1){
                                this.$confirm('人员添加成功，是否继续添加？', '提示', {
                                    confirmButtonText: '继续',
                                    cancelButtonText: '返回',
                                    type: 'info'
                                }).then(() => {
                                    this.$refs[formName].resetFields();
                                }).catch(() => {
                                    this.$router.push('/user/list');
                                });
                            }else{
                                this.$message({
                                    message: data.msg,
                                    type: 'warning'
                                });
                            }
                        }).catch(function(err){
                            console.log(err);
                        });

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            info(){
                axios.get('/admin/user/add/info',{
                }).then(response => {
                    let data = response.data;


                    this.infoData.groups = data.groups;
                    this.infoData.positions = data.positions;


                    console.log(this.infoData.groups);
                }).catch(function(err){
                    console.log(err);
                });


            }
        },
        mounted (){
            this.info();
        }
    }
</script>

<style scoped>
    .nameWidth{
        width: 22%;
    }
</style>