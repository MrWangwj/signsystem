<template>
    <div>

        <div class="title">
            <button @click="count = true">统计</button>
        </div>

        <div v-transfer-dom>
            <popup v-model="count" position="right">
                <div style="width:300px;">
                    <divider>周数</divider>

                    <div class="weeks">
                        <div @click="setNowWeek()">
                            本周
                        </div>
                        <div>
                            <scroller lock-y :scrollbar-x=false>
                                <div class="box1" id="weeks">
                                    <div :class="{'box1-item':true, 'test':test, 'now-week': get.nowWeek == i.id, 'sel-week': i.sel }" @click="addSelWeek(i.id)" v-for="i in set.weeks" >
                                        <span>{{' ' + i.id + ' '}}</span>
                                    </div>
                                </div>
                            </scroller>
                        </div>
                    </div>



                    <divider>组别</divider>

                    <checker
                            v-model="set.selGroups"
                            type="checkbox"
                            default-item-class="group-item"
                            selected-item-class="group-item-selected"
                            @on-change="getSelStudents"
                    >
                        <checker-item v-for="i in get.groups" :key="i.id" :value="i.id" class="group-item">{{ i.name }}</checker-item>
                    </checker>

                    <divider>职务</divider>
                    <checker
                            v-model="set.selPositions"
                            type="checkbox"
                            default-item-class="group-item"
                            selected-item-class="group-item-selected"
                            @on-change="getSelStudents"
                    >
                        <checker-item v-for="i in get.positions" :key="i.id" :value="i.id" class="group-item">{{ i.name }}</checker-item>
                    </checker>


                    <divider>性别</divider>
                    <checker
                            v-model="set.selSexs"
                            type="checkbox"
                            default-item-class="group-item"
                            selected-item-class="group-item-selected"
                            @on-change="getSelStudents"
                    >
                        <checker-item :key="0" :value="0" class="group-item">男</checker-item>
                        <checker-item :key="1" :value="1" class="group-item">女</checker-item>
                    </checker>

                    <divider>年级</divider>
                    <checker
                            v-model="set.selGrades"
                            type="checkbox"
                            default-item-class="group-item"
                            selected-item-class="group-item-selected"
                            @on-change="getSelStudents"
                    >
                        <checker-item v-for="i in get.grades" :key="i" :value="i" class="group-item">{{ i }}级</checker-item>
                    </checker>
                </div>
            </popup>
        </div>







        <carousel-3d :display="5" :perspective="0" space="50" width="250" height="500" :inverseScaling="50" :loop="false" :controlsVisible="true" :minSwipeDistance="50">

            
            <slide :index="0" class="week-day" >
                <div class="week-title">
                    星期一（
                    <span v-if="haveNoCourse" @click="setHasNoCourse(false)">有课</span>
                    <span v-if="!haveNoCourse" @click="setHasNoCourse(true)">无课</span>
                    ）
                </div>

                <div class="courseContent">
                    <div style="width: 100%;" class="section" v-for="section in courses[0]">
                        <div>
                            <label>{{ section.id }}</label>
                        </div>
                        <div>
                            <label v-for="(stu,index) in section.stus" @click="courseInfo(stu.id, stu.course_id)">{{ stu.name }},</label>
                        </div>
                    </div>
                </div>
            </slide>

            <slide :index="1" class="week-day" >
                <div class="week-title">
                    星期二（
                    <span v-if="haveNoCourse" @click="setHasNoCourse(false)">有课</span>
                    <span v-if="!haveNoCourse" @click="setHasNoCourse(true)">无课</span>
                    ）
                </div>

                <div class="courseContent">
                    <div style="width: 100%;" class="section" v-for="section in courses[1]">
                        <div>
                            <label>{{ section.id }}</label>
                        </div>
                        <div>
                            <label v-for="(stu,index) in section.stus" @click="courseInfo(stu.id, stu.course_id)" >{{ stu.name }},</label>
                        </div>
                    </div>
                </div>
            </slide>

            <slide :index="2" class="week-day" >
                <div class="week-title">
                    星期三（
                    <span v-if="haveNoCourse" @click="setHasNoCourse(false)">有课</span>
                    <span v-if="!haveNoCourse" @click="setHasNoCourse(true)">无课</span>
                    ）
                </div>

                <div class="courseContent">
                    <div style="width: 100%;" class="section" v-for="section in courses[2]">
                        <div>
                            <label>{{ section.id }}</label>
                        </div>
                        <div>
                            <label v-for="(stu,index) in section.stus" @click="courseInfo(stu.id, stu.course_id)" >{{ stu.name }},</label>
                        </div>
                    </div>
                </div>
            </slide>

            <slide :index="3" class="week-day" >
                <div class="week-title">
                    星期四（
                    <span v-if="haveNoCourse" @click="setHasNoCourse(false)">有课</span>
                    <span v-if="!haveNoCourse" @click="setHasNoCourse(true)">无课</span>
                    ）
                </div>

                <div class="courseContent">
                    <div style="width: 100%;" class="section" v-for="section in courses[3]">
                        <div>
                            <label>{{ section.id }}</label>
                        </div>
                        <div>
                            <label v-for="(stu,index) in section.stus" @click="courseInfo(stu.id, stu.course_id)" >{{ stu.name }},</label>
                        </div>
                    </div>
                </div>
            </slide>

            <slide :index="4" class="week-day" >
                <div class="week-title">
                    星期五（
                    <span v-if="haveNoCourse" @click="setHasNoCourse(false)">有课</span>
                    <span v-if="!haveNoCourse" @click="setHasNoCourse(true)">无课</span>
                    ）
                </div>

                <div class="courseContent">
                    <div style="width: 100%;" class="section" v-for="section in courses[4]">
                        <div>
                            <label>{{ section.id }}</label>
                        </div>
                        <div>
                            <label v-for="(stu,index) in section.stus" @click="courseInfo(stu.id, stu.course_id)" >{{ stu.name }},</label>
                        </div>
                    </div>
                </div>
            </slide>

            <slide :index="5" class="week-day" >
                <div class="week-title">
                    星期六（
                    <span v-if="haveNoCourse" @click="setHasNoCourse(false)">有课</span>
                    <span v-if="!haveNoCourse" @click="setHasNoCourse(true)">无课</span>
                    ）
                </div>

                <div class="courseContent">
                    <div style="width: 100%;" class="section" v-for="section in courses[5]">
                        <div>
                            <label>{{ section.id }}</label>
                        </div>
                        <div>
                            <label v-for="(stu,index) in section.stus" @click="courseInfo(stu.id, stu.course_id)" >{{ stu.name }},</label>
                        </div>
                    </div>
                </div>
            </slide>

            <slide :index="6" class="week-day" >
                <div class="week-title">
                    星期日（
                    <span v-if="haveNoCourse" @click="setHasNoCourse(false)">有课</span>
                    <span v-if="!haveNoCourse" @click="setHasNoCourse(true)">无课</span>
                    ）
                </div>

                <div class="courseContent">
                    <div style="width: 100%;" class="section" v-for="section in courses[6]">
                        <div>
                            <label>{{ section.id }}</label>
                        </div>
                        <div>
                            <label v-for="(stu,index) in section.stus" @click="courseInfo(stu.id, stu.course_id)" >{{ stu.name }},</label>
                        </div>
                    </div>
                </div>
            </slide>

        </carousel-3d>

    </div>
</template>


<script>
    import { Carousel3d, Slide } from 'vue-carousel-3d';
    import { Popup, TransferDom,  Checker, CheckerItem, Divider, Scroller, ToastPlugin, LoadingPlugin } from 'vux';
    Vue.use(ToastPlugin);
    Vue.use(LoadingPlugin);
    export default {
        directives: {
            TransferDom
        },
        components: {
            Carousel3d,
            Slide,
            Popup,
            TransferDom,
            Checker,
            CheckerItem,
            Divider,
            Scroller,
            ToastPlugin
        },
        data () {
            return {
                get: {
                    nowWeek:0,      //当前周
                    groups: [],     //所有分组
                    positions: [],  //所有职务
                    grades: [],     //年级
                    students: [],   //所有学生
                },
                set: {
                    weeks: [],          //一共有多少周
                    selPositions: [],   //选择额职务
                    selSexs:[],         //选择的性别
                    selGrades:[],       //选中你的年级
                    selGroups:[],       //选中的分组
                    selStudent:[],      //选中的学生
                    selWeek: 0,         //选中的周
                },
                count :false,           //是否打开统计页面
                haveNoCourse: true,     //是否有课
                courses: [
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                ],    //统计的课表人员信息
                test: true,
            }
        },
        methods: {
            //初始化信息
            info(){
                let maxWeek = 20; // 最大周
                this.$vux.loading.show({
                    text: '正在加载数据',
                });
                axios.get('/wechat/course/count').then(response => {
                    console.log(response.data);

                    //设置数据
                    let data = response.data;
                    this.get.nowWeek    = data.nowWeek;     //当前周
                    this.get.groups     = data.groups;      //分组情况
                    this.get.positions  = data.positions;   //职位情况
                    this.get.grades     = data.grades;      //年级情况
                    this.get.students   = data.students;    //学生

                    if(this.get.nowWeek > 20) maxWeek = this.get.nowWeek;   //判断若用户大于20周，则以当前为最大

                    for(let i =  1; i <= maxWeek; i++){
                        this.set.weeks[i-1] =  {
                            id: i,
                        };
                        if (this.get.nowWeek === i){
                            this.set.weeks[i-1].sel =  true;
                        }else{
                            this.set.weeks[i-1].sel =  false;
                        }
                    }

                    this.set.selWeek = this.get.nowWeek;

                    this.getSelStudents();


                    //选中今天
                    let nowWeekDay = (new Date().getDay()+6)%7;
                    this.$children[1].goSlide(nowWeekDay);

                    this.$vux.loading.hide();
                })
            },

            //设置有课无课
            setHasNoCourse(bool){
                this.haveNoCourse = bool;
                this.getCourses();
            },

            //用户选择周数
            addSelWeek(id){
                if(this.set.selWeel !== id){
                    this.test = true;
                    this.set.weeks[this.set.selWeek-1].sel = false;
                    this.set.selWeek = id;
                    this.set.weeks[id-1].sel = true;
                    this.test = false;
                    this.getCourses();
                }
            },
            //返回当前周
            setNowWeek(){

                    this.set.weeks[this.set.selWeek-1].sel = false;
                    this.set.selWeek = this.get.nowWeek;
                    this.set.weeks[this.get.nowWeek-1].sel = true;

                    this.test = !this.test;
                    document.getElementById('weeks').style.transform = 'translate('+((this.get.nowWeek-3)*-50)+'px, 0)';
                    this.getCourses();

            },


            //获取当前选择的用户
            getSelStudents(){
                this.set.selStudent = [];

                let all     = this.get.students,
                    groups  = this.set.selGroups,
                    sexs    = this.set.selSexs,
                    positions = this.set.selPositions,
                    grades  = this.set.selGrades;

                //当用户没有选择条件是默认为全部人员
                if(groups.length === 0 && positions.length === 0 && sexs.length === 0 && grades.length === 0){
                    for (let index in all){
                        this.set.selStudent.push({
                            id: index,
                            name: all[index].name,
                        });
                    }
                }else{
                    for(let index in all){
                        if(groups.indexOf(all[index].grouping_id) !== -1 || sexs.indexOf(all[index].sex) !== -1 || grades.indexOf(parseInt(index.substring(2,4))) !== -1){  //判断用户是否符合选择的条件
                            this.set.selStudent.push({
                                id: index,
                                name: all[index].name,
                            });
                        }else{
                            let userPositions = all[index].positions;
                            for (let position in userPositions){
                                if(positions.indexOf(userPositions[position].id) !== -1){
                                    this.set.selStudent.push({
                                        id: index,
                                        name: all[index].name,
                                    });
                                    break;
                                }
                            }
                        }
                    }
                }

                this.getCourses();
            },
            getCourses(){
                for(let i = 0; i < 7; i++){
                    this.courses[i] = [
                        {id: '1-2', stus: [],},
                        {id: '3-4', stus: [],},
                        {id: '5', stus: [],},
                        {id: '6-7', stus: [],},
                        {id: '8-9', stus: [],},
                        {id: '10-11', stus: [],},
                        {id: '12', stus: [],},
                    ]
                }
//                console.log(this.set.selStudent);

                let all     = this.get.students,    //所有用户信息
                    selStu  = this.set.selStudent,  //选中的用户信息
                    selWeek = this.set.selWeek,     //选中的周
                    hasCourse = this.haveNoCourse;  //是否有课

                for (let i in selStu){  //循环选中用户
                    for(let course in all[selStu[i].id].courses){  // 循环用户的课表
                        let tempCourse = all[selStu[i].id].courses[course];
                        if((tempCourse.start_week <= selWeek && selWeek <= tempCourse.end_week) && (tempCourse.status === 0 || selWeek % 2 === tempCourse.status % 2)){

                            for(let n = tempCourse.start_section; n <= tempCourse.end_section; n++){
                                switch (n){
                                    case 1:{
                                        this.courses[tempCourse.week_day-1][0].stus.push({
                                            id: selStu[i].id,
                                            name: selStu[i].name,
                                            course_id: course,
                                        });
                                        continue;
                                        break;
                                    }
                                    case 3:{
                                        this.courses[tempCourse.week_day-1][1].stus.push({
                                            id: selStu[i].id,
                                            name: selStu[i].name,
                                            course_id: course,
                                        });
                                        continue;
                                        break;
                                    }
                                    case 5:{
                                        this.courses[tempCourse.week_day-1][2].stus.push({
                                            id: selStu[i].id,
                                            name: selStu[i].name,
                                            course_id: course,
                                        });
                                        break;
                                    }
                                    case 6:{
                                        this.courses[tempCourse.week_day-1][3].stus.push({
                                            id: selStu[i].id,
                                            name: selStu[i].name,
                                            course_id: course,
                                        });
                                        continue;
                                        break;
                                    }
                                    case 8:{
                                        this.courses[tempCourse.week_day-1][4].stus.push({
                                            id: selStu[i].id,
                                            name: selStu[i].name,
                                            course_id: course,
                                        });
                                        continue;
                                        break;
                                    }
                                    case 10:{
                                        this.courses[tempCourse.week_day-1][5].stus.push({
                                            id: selStu[i].id,
                                            name: selStu[i].name,
                                            course_id: course,
                                        });
                                        continue;
                                        break;
                                    }
                                    case 12:{
                                        this.courses[tempCourse.week_day-1][6].stus.push({
                                            id: selStu[i].id,
                                            name: selStu[i].name,
                                            course_id: course,
                                        });
                                        break;
                                    }
                                }


                            }
                        }
                    }
                }
//                console.log(this.courses);


                if(!hasCourse){
                    for(let i = 0; i < 7; i++){
                        for(let j = 0; j < 7; j++){
                            let tmpStus = this.courses[i][j].stus.slice();
                            this.courses[i][j].stus = [];
                            for(let stu in selStu){
                                let id = selStu[stu].id;
                                let status = false;
                                for (let tmpStu in tmpStus){
                                    if(id === tmpStus[tmpStu].id){
                                        status = true;
                                        break;
                                    }
                                }

                                if(!status){
                                    this.courses[i][j].stus.push({
                                        id: selStu[stu].id,
                                        name: selStu[stu].name,
                                        course_id: 0,
                                    });
                                }
                            }
                        }
                    }
                }
            },

            //点击用户显示课程
            courseInfo(user_id, course_id){
                if(this.haveNoCourse){
                    let course = this.get.students[user_id].courses[course_id];

                    this.$vux.toast.text(course.name+'/'+course.location, 'top')
                }
            }
        },
        mounted(){

            this.info();

        }
    }
</script>

<style>
    * {
        margin: 0;
        padding: 0;
    }
</style>

<style scoped>

    .week-day{
        border-radius: 25px;
        padding: 10px;
    }
    .week-title{
        height: 30px;
        text-align: center;
        line-height: 30px;
    }
    .courseContent{
        overflow-y: scroll;
        width: 210px;
        height: 420px;
        margin: 10px auto;
    }


    .courseContent label{
        text-align: center;
    }
    .section>div:first-child{
        height: 50px;
    }
    .section>div:first-child label{
        border: 1px solid black;
        padding: 8px;
        border-radius: 10px;
        margin: 10px auto;
        display: block;
        width: 50px;
        text-align: center;
    }

    .section>div:last-child {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        border-radius: 10px;
        border: 1px solid black;
    }
    .section>div:last-child label {
        display: block;
        width: 33.3%;
        float: left;

     }
    .section>div:last-child:after {
        display: block;
        content: '';
        clear: both;
    }

    .group-item {
        width: 90px;
        height: 26px;
        line-height: 26px;
        text-align: center;
        border-radius: 3px;
        border: 1px solid #ccc;
        background-color: #fff;
        margin: 5px;
        box-sizing: border-box;
    }
    .group-item-selected {
        background: #ffffff url(/images/course/download.png) no-repeat right bottom;
        border-color: #ff4a00;
    }

    .box1-item {
        width: 40px;
        height: 40px;
        background-color: #ccc;
        display:inline-block;
        margin-left: 10px;
        float: left;
        text-align: center;
        line-height: 40px;
    }

    .box1 {
        position: relative;
        width: max-content;
    }


    .weeks:after{
        display: block;
        content: '';
        clear: both;
    }

    .weeks>div:first-child{
        text-align: center;
        width: 40px;
        float: left;
        line-height: 40px;
        text-align: center;
    }

    .weeks>div:last-child{
        float: left;
        width: 250px;
        overflow: hidden;
    }

    .now-week{
        background-color: #10AEFF;
    }
    .sel-week{
        background-color: #ff4a00;
    }

    .test{

    }
</style>