<template>
    <div >
        <div>
            <el-button type="primary" @click="illegalVisible = true">添加违规</el-button>
        </div>

        <div>
            <el-table
                    v-loading.body="loading"

                    :data="userIllegals"
                    style="width: 100%">
                <el-table-column type="expand">
                    <template scope="props">
                        <ul>
                            <li v-for="illegal in props.row.illegals">
                                {{ mtDate(illegal.time) }}-{{ illegal.cause }}

                                <el-button size="small" @click="delUserIllegal(illegal.id)">删除</el-button>
                            </li>
                        </ul>
                    </template>
                </el-table-column>
                <el-table-column
                        label="分组"
                >
                    <template scope="props">
                        <span>{{ props.row.grouping.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="姓名"
                        prop="name">
                </el-table-column>
                <el-table-column
                        label="类型"
                        prop="type"
                        sortable
                >

                </el-table-column>

                <el-table-column
                        label="次数"
                        prop="count">
                </el-table-column>

                <el-table-column
                        label="操作"
                >
                    <template scope="props">
                        <el-button size="small" @click="punishFun(props.$index, props.row)">惩罚</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>


        <el-dialog title="添加违规" :visible.sync="illegalVisible">
            <el-form :model="addIllegal" label-width="80px">
                <el-form-item label="用户">
                    <el-select
                            v-model="addIllegal.ids"
                            multiple
                            filterable
                            placeholder="请选择用户"
                            style="width: 100%;"
                    >
                        <el-option
                                v-for="user in users"
                                :key="user.id"
                                :label="user.name"
                                :value="user.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="类型">
                    <el-select v-model="addIllegal.illegal_id" placeholder="请选择类型" style="width: 100%;"
                    >
                        <el-option v-for="illegal in illegals" :label="illegal.name" :value="illegal.id" :key="illegal.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="时间">
                    <el-date-picker
                            v-model="addIllegal.time"
                            type="datetime"
                            placeholder="选择日期时间"
                            align="right"
                            style="width: 100%;"
                    >
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="说明">
                    <el-input type="textarea" placeholder="请输入事情细节(选填)" v-model="addIllegal.cause"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="illegalVisible = false">取 消</el-button>
                <el-button type="primary" @click="addIllegalFun">添 加</el-button>
            </div>
        </el-dialog>

        <el-dialog title="惩罚" :visible.sync="punishVisible">
            <el-form :model="addPunish" label-width="80px" :rules="punishRules" ref="addPunish">
                <el-form-item label="用户">
                    <span>{{ addPunish.user_id }}</span>
                </el-form-item>

                <el-form-item label="类型">
                    <span>{{ addPunish.type }}</span>
                </el-form-item>

                <el-form-item label="数量" prop="count">
                    <el-input type="number" v-model="addPunish.count" placeholder="请输入惩罚抵消的违规数量"></el-input>
                </el-form-item>

                <el-form-item label="时间" prop="time">
                    <el-date-picker
                            v-model="addPunish.time"
                            type="datetime"
                            placeholder="选择日期时间"
                            align="right"
                            style="width: 100%;"
                    >
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="内容" prop="content">
                    <el-input type="textarea" placeholder="请输入惩罚内容" v-model="addPunish.content"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="punishVisible = false">取 消</el-button>
                <el-button type="primary" @click="addPunishFun('addPunish')">惩 罚</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>


    export default {

        data() {
            return {
                illegalVisible: false,
                punishVisible: false,

                loading: true,

                users:[],       //所有用户
                illegals:[],    //违规种类
                userIllegals:[],//用户违规记录

                selIllegalUser:[],     //选中要登记违规的用户

                addIllegal:{
                    ids: [],
                    illegal_id:'',
                    cause:'',
                    time: '',
                },

                addPunish:{
                    user_id:'',
                    illegal_id:'',
                    type:'',
                    count:'',
                    content:'',
                    time:'',
                },

                punishRules: {
                    count: [
                        { required: true, message: '请输入抵消数量', },
                    ],
                    time: [
                        { required: true, message: '请输入惩罚时间' },
                    ],
                    content: [
                        { required: true, message: '请输入惩罚内容' },
                    ]
                },

            }
        },
        methods: {
            info(){
                this.loading = true;
                axios.get('/admin/user/get/illegal').then(response => {
                    console.log(response.data);
                    let data = response.data;


                    this.users = data.users;
                    this.illegals = data.illegals;
                    this.userIllegals = data.userIllegals;

                    this.loading =  false;
                });
            },
            mtDate(timeStamp){
                let date = new Date();
                date.setTime(timeStamp * 1000);
                let y = date.getFullYear();
                let m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                let h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                let minute = date.getMinutes();
                let second = date.getSeconds();
                minute = minute < 10 ? ('0' + minute) : minute;
                second = second < 10 ? ('0' + second) : second;
                return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
            },

            addIllegalFun(){


                if(this.addIllegal.ids.length === 0){
                    this.$message({
                        message: '请选择用户',
                        type: 'warning'
                    });
                }else if(!this.addIllegal.illegal_id){
                    this.$message({
                        message: '请选择类型',
                        type: 'warning'
                    });
                }else if(!this.addIllegal.time){
                    this.$message({
                        message: '请选择时间',
                        type: 'warning'
                    });
                }else{

                    this.loading = true;
                    axios.post('/admin/user/set/illegal', this.addIllegal).then(response => {
                        console.log(response.data);
                        let data = response.data;
                        if(data.code === 1){

                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            this.illegalVisible = false;

                            this.addIllegal = {
                                ids: [],
                                    illegal_id:'',
                                    cause:'',
                                    time: '',
                            };

                            this.info();

                        }else{
                            this.$message({
                                message: data.msg,
                                type: 'error'
                            });
                        }
                        this.loading = false;
                    });
                }

            },
            punishFun(index, row){
                console.log(index);
                console.log(row);
                this.addPunish = {
                    user_id:'',
                    illegal_id:'',
                    type:'',
                    count:'',
                    content:'',
                    time:'',
                };

                this.addPunish.user_id = row.id;
                this.addPunish.illegal_id = row.illegal.id;
                this.addPunish.type = row.illegal.name;
                this.punishVisible = true;
            },

            addPunishFun(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        axios.post('/admin/user/set/punish',this.addPunish).then(response => {
                            console.log(response.data);
                            let data = response.data;
                            if(data.code === 1){
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                });
                                this.punishVisible = false;
                                this.info();
                            }else{
                                this.$message({
                                    message: data.msg,
                                    type: 'error'
                                });
                            }
                            this.loading = false;
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            delUserIllegal(illegalId){
                this.$confirm('确认删除此条违规吗，删除后将无法恢复？')
                    .then(_ => {
                        this.loading = true;
                        axios.post('/admin/user/del/illegal',{
                            id: illegalId,
                        }).then(response => {
                            console.log(response.data);
                            let data = response.data;
                            if(data.code === 1){
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                this.info();
                            }else{
                                this.$message({
                                    message: data.msg,
                                    type: 'error'
                                });
                            }
                            this.loading = false;
                        });
                    });
            }
        },

        mounted(){
            this.info();
        }

    }
</script>

<style>

</style>