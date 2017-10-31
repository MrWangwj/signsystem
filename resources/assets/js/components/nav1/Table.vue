<template>
    <div>
        <el-row :gutter="0">
            <el-col :span="20">
                <!--<el-form :inline="true" :model="formData" class="demo-form-inline">-->
                    <!--<el-form-item label="姓名">-->

                        <!--<el-input-->
                                <!--placeholder="请输入搜索姓名"-->
                                <!--icon="search"-->
                                <!--v-model="formData.user"-->
                                <!--:on-icon-click="searchUser">-->
                        <!--</el-input>-->
                    <!--</el-form-item>-->

                    <!--<el-form-item label="分组">-->
                        <!--<el-select v-model="formData.grouping" placeholder="请选择分组">-->
                            <!--<el-option label="区域一" value="shanghai"></el-option>-->
                            <!--<el-option label="区域二" value="beijing"></el-option>-->
                        <!--</el-select>-->
                    <!--</el-form-item>-->
                <!--</el-form>-->
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="addUser()">添加</el-button>
                <el-button type="primary" @click="inputVisible = true">导入</el-button>
            </el-col>
        </el-row>



        <el-table
                :data="users"
                border
                style="width: 100%">
            <el-table-column
                    prop="id"
                    label="学号"
            >
            </el-table-column>


            <el-table-column
                    prop="name"
                    label="姓名"
            >
            </el-table-column>
            <el-table-column
                    prop="grouping"
                    label="组别"
                    sortable
            >
            </el-table-column>

            <el-table-column
                    prop="position"
                    label="职务"
                    sortable
            >
            </el-table-column>

            <el-table-column
                    prop="tel"
                    label="电话"
            >
            </el-table-column>

            <el-table-column
                    prop="email"
                    label="邮箱">
            </el-table-column>


            <el-table-column label="操作">
                <template scope="scope">
                    <el-button
                            size="small"
                            @click="editUser(scope.row.id)">编辑</el-button>
                    <el-button
                            size="small"
                            type="danger"
                            @click="deleteUser(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--<el-pagination layout="prev, pager, next" :total="1000">-->
        <!--</el-pagination>-->

        <el-dialog title="导入用户" :visible.sync="inputVisible">
            <el-upload
                    class="upload-demo"
                    drag
                    action="/admin/user/input"
                    multiple
                    :headers="{'X-CSRF-TOKEN': csrfToken}"
                    name="users"
                    accept=".xlsx,xls"
                    :on-preview="excelUpload"
                    :on-success="uploadSuccess"
                    style="width: 100%;"
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">请上传正确格式的Excel文件
                    <a href="http://sign.com/storage/users/users.xlsx">Excel示例</a>
                </div>
            </el-upload>
        </el-dialog>


        <el-dialog title="错误提示" :visible.sync="inputMsgType">
            <p>{{ inputCount }}</p>
            <ul>
                <li v-for="(msg, key, index) in inputMsg" :key="key">
                    <label>第{{ parseInt(key)+1 }}条记录：</label>
                    <el-tag type="danger" v-for="(m, index2) in msg" :key="index2" style="margin-right: 10px;">{{ m }}</el-tag>
                </li>
            </ul>
        </el-dialog>

    </div>
</template>

<script>


    export default {
        data() {
            return {
                users:[],
                formData: {
                    user: '',
                    region: ''
                },
                inputVisible: false,
                csrfToken: $('meta[name="csrf-token"]').attr('content'),
                inputCount:'',
                inputMsg:[],
                inputMsgType: false,
            }
        },
        methods: {
            getUserInfo(){
                this.axios.get('/admin/user/list').then((res) =>{
                    let usersInfo = res.data.users;
//                    console.log(usersInfo);
                    for (let key in usersInfo) {


                        let positions = '';
                        for(let i in usersInfo[key].positions){
                            positions += usersInfo[key].positions[i].name+',';
                        }

                        let tmpUser = {
                            id: usersInfo[key].id,
                            name: usersInfo[key].name,
                            position: positions,
                            grouping: usersInfo[key].grouping.name,
                            tel: usersInfo[key].tel,
                            email: usersInfo[key].email,
                        };

                        this.users.push(tmpUser);
                    }
                })
            },
            onSubmit() {
                console.log('submit!');
            },
            searchUser(){

            },
            editUser(id){
                this.$router.push('/user/edit/'+id);
            },
            deleteUser(id){
//                alert(id);
                this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.post('/admin/user/delete',{
                        id: id,
                    }).then(response => {
                        console.log(response.data);

                        if(response.data.code === 1){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });

                            //判断移除用户
                            let userIndex = 0;
                            for(let i in this.users){
                                if((this.users)[i].id === id){
                                    userIndex = i;
                                }
                            }

                            this.users.splice(userIndex, 1);
                        }else{
                            this.$message.error(response.data.msg);
                        }
                    }).catch(function(err){
                        console.log(err);
                    });
                });
            },
            addUser(){
                this.$router.push('/user/add');
            },
            excelUpload(file){
//                console.log(file.response);
                let response  = file.response;
                if(response.code === 1){
                    this.inputCount = response.msg2;
                }else{
                    this.inputCount = '成功导入 0 人, 失败 '+ response.msg.length+ ' 人';
                }
                this.inputMsg = response.msg;
                this.inputMsgType = true;
            },
            uploadSuccess(response, file, fileList){
//                console.log(response);

                if(response.code === 1){
                    this.$message({
                        message: response.msg2,
                        type: 'success'
                    });
                    this.inputCount = response.msg2;
                    this.inputMsg = response.msg;
                    console.log(response.msg);


                    for (let m in response.msg){
                        this.inputMsgType = true;
                        break;
                    }

                }else{
                    this.$message.error('导入失败');
                    this.inputCount = '成功导入 0 人, 失败 '+ response.msg.length+ ' 人';
                    this.inputMsg = response.msg;
                    this.inputMsgType = true;
                }
            },
        },
        mounted(){
            this.getUserInfo();
        }

    }
</script>

<style scope>
    .el-upload{
        width:100%;
    }

    .el-upload-dragger{
        width:100%;
    }
</style>