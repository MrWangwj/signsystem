<template>
    <div>
        <div>
            <el-table
                    :data="courses"
                    border
                    style="width: 100%">
                <el-table-column
                        prop="name"
                        label="课程名称"
                >
                </el-table-column>
                <el-table-column
                        prop="teacher"
                        label="教师名称"
                >
                </el-table-column>
                <el-table-column
                        prop="info"
                        label="上课时间／地点">
                </el-table-column>

                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button
                                size="small"
                                @click="editCourseFun(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                                size="small"
                                type="danger"
                                @click="deleteCourseFun(scope.$index, scope.row)">删除</el-button>
                    </template>

                </el-table-column>
            </el-table>
        </div>

        <el-dialog title="编辑课程" :visible.sync="editCourseVisible" class="dialog-width">

            <el-form :model="editCourse" label-width="80px" :rules="rules" ref="editCourse" style="width: 460px;" >
                <el-form-item label="课程名称" prop="name">
                    <el-input v-model="editCourse.name"></el-input>
                </el-form-item>
                <el-form-item label="教师" prop="teacher">
                    <el-input v-model="editCourse.teacher"></el-input>
                </el-form-item>
                <el-form-item label="地点" prop="location">
                    <el-input v-model="editCourse.location"></el-input>
                </el-form-item>

                <el-form-item label="星期" prop="week_day">
                    <el-select v-model="editCourse.week_day" placeholder="请选择" style="width: 100%;">
                        <el-option :key="1" label="星期一" :value="1"></el-option>
                        <el-option :key="2" label="星期二" :value="2"></el-option>
                        <el-option :key="3" label="星期三" :value="3"></el-option>
                        <el-option :key="4" label="星期四" :value="4"></el-option>
                        <el-option :key="5" label="星期五" :value="5"></el-option>
                        <el-option :key="6" label="星期六" :value="6"></el-option>
                        <el-option :key="7" label="星期日" :value="7"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="节数">
                    <el-col :span="11">
                        <el-form-item prop="start_section">
                            <el-select v-model="editCourse.start_section"  placeholder="开始"  @change="startSectionChange(1)">
                                <el-option :key="1" label="第1节" :value="1"></el-option>
                                <el-option :key="3" label="第3节" :value="3"></el-option>
                                <el-option :key="6" label="第6节" :value="6"></el-option>
                                <el-option :key="8" label="第8节" :value="8"></el-option>
                                <el-option :key="10" label="第10节" :value="10"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" style="text-align: center;">—</el-col>
                    <el-col :span="11">
                        <el-form-item prop="end_section">
                            <el-select v-model="editCourse.end_section" placeholder="结束">
                                <el-option v-for="section in end_sections"
                                           :key="section"
                                           :label="'第'+section+'节'"
                                           :value="section" v-if="section >= editCourse.start_section"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>

                <el-form-item label="周数">
                    <el-col :span="6">
                        <el-form-item prop="start_week">
                            <el-select v-model="editCourse.start_week" placeholder="开始" @change="startWeekChange(1)">
                                <el-option v-for="n in 20" :key="n" :label="'第'+n+'周'" :value="n"></el-option>
                            </el-select>
                        </el-form-item>

                    </el-col>
                    <el-col :span="2" style="text-align: center;">—</el-col>
                    <el-col :span="6">
                        <el-form-item prop="end_week">
                            <el-select v-model="editCourse.end_week" placeholder="结束">
                                <el-option v-for="week in end_weeks"
                                           :key="week"
                                           :label="'第'+week+'周'"
                                           :value="week" v-if="week >= editCourse.start_week"></el-option>
                            </el-select>
                        </el-form-item>

                    </el-col>
                    <el-col :span="4" style="text-align: right;padding-right: 3px;">类型:</el-col>
                    <el-col :span="6">
                        <el-form-item prop="status">
                            <el-select v-model="editCourse.status" placeholder="类型">
                                <el-option key="0" label="全部" :value="0"></el-option>
                                <el-option key="1" label="单周" :value="1"></el-option>
                                <el-option key="2" label="双周" :value="2"></el-option>
                            </el-select>
                        </el-form-item>

                    </el-col>
                </el-form-item>

            </el-form>


            <div slot="footer" class="dialog-footer">
                <el-button @click="editCourseVisible = false">取 消</el-button>
                <el-button type="primary" @click="editSubmit('editCourse')">修 改</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: {
            userId: {
                required: true,
            },
            courseInfos:{
                type: Array,
                required: true,
            }
        },
        data() {

            return {
                courses: [],
                editCourseVisible: false,
                editCourse:{
                    id:0,
                    name: '',
                    teacher:'',
                    location: '',
                    week_day:1,
                    start_week:1,
                    status: 0,
                    end_week:1,
                    start_section: 1,
                    end_section: '',
                },
                end_weeks: [
                    1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
                ],
                end_sections: [
                    2,4,5,7,9,11,12
                ],

                rules: {
                    name: [
                        { required: true, message: '请输入课程名称', trigger: 'blur' },
                        { max: 50, message: '长度在50个字符内', trigger: 'blur' }
                    ],
                    teacher: [
                        { required: true, message: '请输入上课教师', trigger: 'blur' },
                        { max: 15, message: '长度在15个字符内', trigger: 'blur' }
                    ],
                    location: [
                        { required: true, message: '请输入上课地点', trigger: 'blur' },
                        { max: 50, message: '长度在50个字符内', trigger: 'blur' }
                    ],
                    week_day: [
                        { required: true, message: '请选择星期' }
                    ],
                    start_week: [
                        { required: true, message: '请选择开始周' }
                    ],
                    end_week: [
                        { required: true, message: '请选择结束周' }
                    ],
                    start_section: [
                        { required: true, message: '请选择开始节数' }
                    ],
                    end_section: [
                        { required: true, message: '请选择结束节数' }
                    ],
                    status: [
                        { required: true, message: '请选择周类型' }
                    ]
                },
            }
        },
        methods: {
            editCourseFun(index, row){
//                console.log(this.courses[index]);
                this.editCourse = this.courseInfos[index];

                this.editCourseVisible = true;
            },
            deleteCourseFun(index, row){
                this.$confirm('此操作将删除当前课程, 是否继续?', '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.post('/admin/user/course/delete',{
                        'user-id':  this.userId,
                        id:         this.courses[index].id,
                    }).then(response => {
//                            console.log(response.data);
                        let data = response.data;
                        if(parseInt(data.code) === 0){
                            this.$message.error(data.msg);
                        }else{
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.$emit('courseInfo');
                        }
                    });
                });

            },
            startSectionChange(type){
                if(type === 0){
                    if(this.newCourse.end_section < this.newCourse.start_section) this.newCourse.end_section = '';
                }else{
                    if(this.editCourse.end_section < this.editCourse.start_section) this.editCourse.end_section = '';
                }
            },

            startWeekChange(type){
                if(type === 0){
                    if(this.newCourse.end_week < this.newCourse.start_week) this.newCourse.end_week = '';
                }else{
                    if(this.editCourse.end_week < this.editCourse.start_week) this.editCourse.end_week = '';
                }
            },
            editSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log(this.editCourse);
                        axios.post('/admin/user/course/edit',{
                            'user-id':  this.userId,
                            id:         this.editCourse.id,
                            name:       this.editCourse.name,
                            teacher:    this.editCourse.teacher,
                            location:   this.editCourse.location,
                            week_day:   this.editCourse.week_day,
                            start_week: this.editCourse.start_week,
                            end_week:   this.editCourse.end_week,
                            status:     this.editCourse.status,
                            start_section:  this.editCourse.start_section,
                            end_section:    this.editCourse.end_section,
                        }).then(response => {
//                            console.log(response.data);
                            let data = response.data;
                            if(parseInt(data.code) === 1){
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.$emit('courseInfo');
                                this.editCourseVisible = false;
                                this.$refs[formName].resetFields();
                            }else{
                                this.$message.error(data.msg);
                            }
                        });

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        },

        watch:{
            courseInfos:{
                handler(curVal,oldVal){
                    this.courses = [];
                    let temText = ['','单','双'];
                    let weekDays = ['', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
                    for(let id in this.courseInfos){
                        let d = this.courseInfos[id];

                        let weeks = (d.start_week === d.end_week)?(d.end_week):(d.start_week + '-' + d.end_week);
                        let info = '[' + weeks+temText[d.status] +'周]' +weekDays[d.week_day] +'['+d.start_section+'-'+d.end_section+'节]/' +d.location;

                        this.courses.push( {
                            id: d.id,
                            name: d.name,
                            teacher: d.teacher,
                            info: info
                        });
                    }

                },
                deep:true
            }
        },
        mounted(){

        }

    }
</script>

<style>

</style>