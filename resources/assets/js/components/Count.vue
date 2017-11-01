<template>
    <div class="main">
        <div class="title">
            <el-row :gutter="0">
                <el-col :span="2">
                    <el-button @click="preWeek()">上一周</el-button>
                </el-col>
                <el-col :span="2">
                    <el-select v-model="sleWeek" placeholder="请选择" @change="seleteWeek()">
                        <el-option
                                v-for="item in set.weeks"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2">
                    <el-button @click="nextWeek()">下一周</el-button>
                </el-col>


                <el-col :span="2" :offset="16">
                    <el-switch v-model="haveNoCourse" on-color="#13ce66" off-color="#ff4949" on-text="有课" off-text="无课" @change="getCourses()">
                    </el-switch>
                </el-col>

            </el-row>

            <el-row>
                <el-col :span="2">
                    选择组别：
                </el-col>

                <el-col :span="22">
                    <el-checkbox-group v-model="set.selGroups" @change="getStu()">

                        <el-checkbox v-for="group in get.groups" :label="group.id" :key="group.id">{{ group.name }}</el-checkbox>

                    </el-checkbox-group>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="2">
                    条件筛选：
                </el-col>

                <el-col :span="22">
                    <el-checkbox-group v-model="set.selPositions"  @change="getStu()">
                        <el-checkbox v-for="position in get.positions" :label="position.id" :key="position.id">{{ position.name }}</el-checkbox>
                    </el-checkbox-group>

                    <el-checkbox-group v-model="set.selSexs"  @change="getStu()">
                        <el-checkbox  :label="0" :key="0">男</el-checkbox>
                        <el-checkbox  :label="1" :key="1">女</el-checkbox>
                    </el-checkbox-group>

                    <el-checkbox-group v-model="set.selGrades"  @change="getStu()">
                        <el-checkbox v-for="grade in get.grades" :label="grade" :key="grade">{{ grade }}级</el-checkbox>
                    </el-checkbox-group>
                </el-col>

            </el-row>

            <el-row>
                <el-col :span="2">
                    已选人员：
                </el-col>

                <el-col :span="22">
                    <el-tag
                            v-for="(student, index) in set.selStudent"
                            :key="index"
                            :closable="true"
                            type="primary"
                            @close="delStu(index)"
                    >
                        {{student.name}}
                    </el-tag>
                </el-col>
            </el-row>

            <el-table
                    :data="courses"
                    border
                    style="width: 100%">
                <el-table-column prop="section" label="节数">
                    <template scope="scope">
                        <label>{{ scope.row.section }}</label>
                    </template>
                </el-table-column>


                <el-table-column  label="周一">
                    <template scope="scope">
                        <label v-for="user in scope.row.mon">{{ user.name }},</label>
                    </template>
                </el-table-column>

                <el-table-column label="周二">
                    <template scope="scope">
                        <label v-for="user in scope.row.tue">{{ user.name }},</label>
                    </template>
                </el-table-column>


                <el-table-column  label="周三">
                    <template scope="scope">
                        <label v-for="user in scope.row.wed">{{ user.name }},</label>
                    </template>
                </el-table-column>

                <el-table-column label="周四">
                    <template scope="scope">
                        <label v-for="user in scope.row.thu">{{ user.name }},</label>
                    </template>
                </el-table-column>

                <el-table-column  label="周五">
                    <template scope="scope">
                        <label v-for="user in scope.row.fri">{{ user.name }},</label>
                    </template>
                </el-table-column>

                <el-table-column  label="周六">
                    <template scope="scope">
                        <label v-for="user in scope.row.sat">{{ user.name }},</label>
                    </template>
                </el-table-column>

                <el-table-column  label="周日">
                    <template scope="scope">
                        <label v-for="user in scope.row.sun">{{ user.name }},</label>
                    </template>
                </el-table-column>

            </el-table>

        </div>
    </div>
</template>


<script>
    export default{
        components : {

        },
        data(){
            return {
                get:{
                    nowWeek: 0,
                    groups:[],
                    positions: [],
                    grades: [],
                    students: []
                },
                set:{
                    weeks: [],
                    selGroups: [],
                    selPositions: [],
                    selSexs: [],
                    selGrades: [],
                    selStudent:[],
                },
                courses: [],
                dialogVisible: false,
                haveNoCourse: true,
                sleWeek: '',           //选中的周
            }
        },
        methods : {
            preWeek(){
                if(this.sleWeek > 1 ){
                    this.sleWeek--;
                }else{
                    this.$message({
                        message: '已达到第一周',
                        type: 'warning'
                    });
                }
            },
            nextWeek(){
//                console.log(this.sleWeek +"-"+ this.set.weeks.length-1);

                if(this.sleWeek < this.set.weeks.length-1 ){
                    this.sleWeek++;
                }else{
                    this.$message({
                        message: '已达到最后一周',
                        type: 'warning'
                    });
                }
            },
            seleteWeek(){
                if(this.sleWeek  === 0){
                    this.sleWeek = this.get.nowWeek;
                }

                this.getCourses();
            },
            getCourses(){

                let sections = ['1－2节','3-4节','5节','6-7节','8-9节','10-11节','12节'];
                this.courses = [];
                for(let i = 0; i < 7; i++){
                    this.courses[i] = {
                        section: sections[i],
                        mon: [],
                        tue: [],
                        wed: [],
                        thu: [],
                        fri: [],
                        sat: [],
                        sun: [],
                    }
                }

                let weekDay = ['','mon','tue','wed','thu','fri','sat','sun'];


//                console.log(this.courses);
                let all     = this.get.students,    //所有的学生
                    selStu  = this.set.selStudent,  //选中的学生
                    selWeek = this.sleWeek,     //选中的周
                    hasCourse = this.haveNoCourse;  //选中要查看的有课状态




                //获取用户的有课 信息
                for(let id in selStu){
                    for (let course in all[selStu[id].id].courses){
                        let tmpCourse = all[selStu[id].id].courses[course];
                        if(tmpCourse.start_week <= selWeek && selWeek <= tmpCourse.end_week){



                            if(tmpCourse.status === 0 || selWeek % 2 === tmpCourse.status % 2){
                                for(let n = tmpCourse.start_section; n <= tmpCourse.end_section; n++){
                                    let i ;
                                    switch (n) {
                                        case 1:
                                            i = 0;
                                            break;
                                        case 3:
                                            i = 1;
                                            break;
                                        case 5:
                                            i = 2;
                                            break;
                                        case 6:
                                            i = 3;
                                            break;
                                        case 8:
                                            i = 4;
                                            break;
                                        case 10:
                                            i = 5;
                                            break;
                                        case 12:
                                            i = 6;
                                            break;
                                        default:
                                            continue;
                                            break;
                                    }

                                    this.courses[i][weekDay[tmpCourse.week_day]].push({
                                        id : selStu[id].id,
                                        name: selStu[id].name,
                                        course: course,
                                    });


                                }
                            }

                        }
                    }
                }

                if(!hasCourse){
                    for(let i = 0; i < 7; i++){
                        for(let j = 1; j <= 7; j++){
                            let tmpUsers = this.courses[i][weekDay[j]];
                            this.courses[i][weekDay[j]] = [];

                            for(let id in selStu){

                                let status = true;
                                for(let i = 0; i < tmpUsers.length; i ++){
                                    if(tmpUsers[i].id === selStu[id].id){
                                        status = false;
                                        break;
                                    }

                                }
                                if(status){
                                    this.courses[i][weekDay[j]].push(selStu[id]);
                                }
                            }
                        }
                    }
                }

            },
            delStu(index){
                this.set.selStudent.splice(index, 1);
                this.getCourses();
            },

            //设置选中学生
            getStu(){
                this.set.selStudent = [];  //清空数组

                let all = this.get.students,
                    groups = this.set.selGroups,
                    positions = this.set.selPositions,
                    sexs = this.set.selSexs,
                    grades = this.set.selGrades;

//                console.log(all);

                if(groups.length === 0 &&    //当用户没有选择是默认为所有人员
                    positions.length === 0 &&
                    sexs.length === 0 &&
                    grades.length === 0){
                    for(let student in all){
                        this.set.selStudent.push({
                            id: student,
                            name: all[student].name,
                        });
                    }
                }else{
                    for(let student in all){
                        if(groups.indexOf(all[student].grouping_id) !== -1 ||
                            sexs.indexOf(all[student].sex) !== -1 ||
                            grades.indexOf(parseInt(student.substring(2,4))) !== -1){   //判断用户是否在条件中
                            this.set.selStudent.push({
                                id: student,
                                name: all[student].name,
                            });
                        }else{
                            let userPositions = all[student].positions;
                            for (let position in userPositions){
                                if(positions.indexOf(userPositions[position].id) !== -1){
                                    this.set.selStudent.push({
                                        id: student,
                                        name: all[student].name,
                                    });
                                }
                            }
                        }
                    }
                }
                this.getCourses();
            },

            //初始化
            info(){
                let maxWeek = 20;  //最大周数
                axios.get('/count',{
                }).then(response => {
//                    console.log(response.data);
                    //设置数据
                    let data = response.data;
                    this.get.nowWeek = data.nowWeek;        //当前周
                    this.get.groups = data.groups;          //分组情况
                    this.get.positions = data.positions;    //职位情况
                    this.get.grades = data.grades;          //年级情况
                    this.get.students = data.students;      //学生

                    if(this.get.nowWeek > 20) maxWeek = this.get.nowWeek; // 判断若用户大于20周，则以当前周为最大

                    //设置周下拉列表框
                    for(let i = 0; i <= maxWeek; i++){
                        this.set.weeks[i] = {
                            value:i,
                            label: i+'周'
                        };
                    }
                    this.set.weeks[0].label = '本周';

                    //设置选中当前周
                    this.sleWeek = this.get.nowWeek;


                    this.getStu(); //设置选中人员
                    this.getCourses(); //获取表格
                    //关闭加载
                    this.$loading().close();
                }).catch(function(err){
                    console.log(err);
                });
            }
        },
        mounted(){
            this.$loading();
            this.info();

        }
    }
</script>

<style scoped>
    .main{
        width: 80%;
        margin: 0 auto;
        min-width: 1024px;
    }
    .title{

    }


    .content{

    }


    .el-checkbox{
        margin-left: 0 !important;
        margin-right: 15px;
    }
    .el-checkbox-group{
        display: inline-block;
    }
</style>

