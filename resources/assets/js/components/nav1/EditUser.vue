<template>
    <div>
        <el-form ref="form" :rules="rules" :model="form" label-width="80px">

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
                <el-button type="primary" @click="onSubmit('form')">保存</el-button>
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
                if(!/^1[34578]\d{9}$/.test(value)){
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
                    name: '',
                    sex: '0',
                    grouping: '',
                    email: '',
                    tel: '',
                    position: [],
                },
                rules: {
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

                        axios.post('/admin/user/edit',{
                            id: this.$route.params.id,
                            name: form.name,
                            sex: form.sex,
                            grouping_id: form.grouping,
                            positions: form.position,
                            tel: form.tel,
                            email: form.email
                        }).then(response => {
//                            console.log(response.data);
                            this.$loading().close();

                            let data = response.data;
                            if(parseInt(data.code) === 1){
                                this.$message({
                                    message: data.msg,
                                    type: 'success'
                                });

                                this.$router.push('/user/list');
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
                axios.get('/admin/user/edit/info',{
                    params:{
                        id: this.$route.params.id,
                    }
                }).then(response => {
                    let data = response.data;

                    this.infoData.groups = data.groups;
                    this.infoData.positions = data.positions;



                    this.form.name = data.user.name;
                    this.form.sex = data.user.sex.toString();
                    this.form.grouping = data.user.grouping_id;
                    this.form.tel = data.user.tel;
                    this.form.email = data.user.email;

                    for (let id in data.user.positions){
                        this.form.position.push(data.user.positions[id].id);
                    }

                    console.log(this.form);
//                    console.log(this.infoData.groups);
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