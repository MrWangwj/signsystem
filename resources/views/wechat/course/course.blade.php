<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $user->openid == session('wechat_user')['id']?'我':$user->name }}的课表</title>
    <link rel="stylesheet" href="/Swiper/dist/css/swiper.min.css">

    <style>
        *{
            margin: 0;
            padding:0;
        }


        .title, .content{
            width:100%;
            font-size: small;
            text-align: center;

        }

        .title{
            position: fixed;
            top:0;
            width: 100%;
            z-index: 10;
            background-color: white;
        }
        .title>.week{
            height: 4em;

        }
        .title>.week-day{
            display: table;
            width: 100%;
            font-weight: bold;

        }
        .title>.week-day>label{
            display: table-cell;
            width: 13.3%;
            height: 3.5em;
            background-color: #F4F9F9;
            vertical-align:middle;
        }
        .title>.week-day>label>span{
            font-size: x-small;
        }
        .title>.week-day>label:first-child{
            width: 6.9%;
            box-sizing: border-box;
            border-bottom: 1px solid #dff1ff;
        }

        .content{
            width: 100%;
            margin-top: 7.5em;
            position: relative;
        }
        .content:after{
            content: '';
            clear: both;
        }
        .content>.left-title{
            width: 6.9%;
            float: left;
            background-color: #F4F9F9;

            font-weight: bold;
        }
        .content>.left-title>label{
            display: block;
            width: 100%;
            height: 4em;
            line-height: 4em;

        }


        .base-table{

            /*box-sizing: border-box;*/
            display: table;
            width:100%;
            height: 4em;
        }

        .base-table>label{
            display: table-cell;
            height: 100%;
            width: 13.3%;
            text-align: center;
            vertical-align: middle;
            border-bottom:1px dashed #cccccc;
        }

        .base-table>label:first-child{
            width: 6.9%;
            background-color: #F4F9F9;
            border-bottom: 0;
        }

        .course{
            position: absolute;
            padding: 0.5em 0.2em;
            width: 13%;
            background-color: #0bb20c;
            border-radius: 0.5em;
            box-sizing: border-box;
            color: honeydew;
            z-index: 1;
        }

        .noCourse{
            background-color: #EAEFF5 !important;
            color: #BDCAD7 !important;
            z-index: 0 !important;
        }


        #coverflow .swiper-container {
            width: 100%;
            height: 100%;
            position: fixed;
            background-color: rgba(0,0,0,0.5);
            top:0;
            display: none;
        }
        #coverflow .swiper-slide {
            background-position: center;
            background-size: cover;
            width: 50%;
            height: 15em;
            top:50%;
            margin-top: -10em;
            background-color: #66CCCC;
            color: white;
            border-radius: 1em;
            box-sizing: border-box;
            padding: 1em;
        }
        #coverflow .swiper-slide p{
            font-size: small;
        }

        .week-swiper-container{
            width:85%;
            height: 100%;
            overflow: hidden;
            background-color: #E2F7F6;
            float: right;
        }
        .week-swiper-container .swiper-wrapper{
            position: relative;
            top:50%;
            height: 3.6em;
            margin-top: -1.8em;
        }

        .week-swiper-container .swiper-slide{
            height:100%;
            box-sizing: border-box;
            border-radius: 0.5em;
            text-align: center;
            line-height: 4em;
            font-size: x-small;
        }
        .week-swiper-container .swiper-slide span{
            font-size: x-large;
        }
        .nowWeek{
            background-color: #B8F4F0 ;
        }

        .selWeek{
            background-color: white;
        }
        .week>div:first-child{
            width: 15%;
            height: 4em;
            float: left;
        }

        .week:after {
            content: '';
            clear: both;
        }


        #nowWeek{
            display: table;
        }

        #nowWeek label{
            display: table-cell;
            text-align: center;
            vertical-align: middle;
        }

        #nowWeek label>span{
            font-size: xx-small;
        }

        .selWeekDay{
            background-color: #BFF6F4 !important;
            color: #3D98B3 !important;
        }
        .selWeekDay p{
            font-size: medium !important;
        }
        .selWeekDay span{
            font-size: small !important;
        }
    </style>
</head>
<body>

<nav class="title">
    <div class="week">
        <div id="nowWeek">
            <label for=""></label>
        </div>

        <div class="week-swiper-container">
            <div class="swiper-wrapper">
                @for($i = 1; $i<=20; $i++)
                    <div class="swiper-slide"><p>第<span>{{ $i }}</span>周</p></div>
                @endfor
            </div>
        </div>
    </div>
    <div class="week-day">
        <label>
            <span id="month">8</span><br/>
            <span>月</span>
        </label>
        <label>
            <p>周一</p>
            <span id="week-day1">14日</span>
        </label>
        <label>
            <p>周二</p>
            <span id="week-day2">15日</span>
        </label>
        <label>
            <p>周三</p>
            <span id="week-day3">16日</span>
        </label>
        <label>
            <p>周四</p>
            <span id="week-day4">17日</span>
        </label>
        <label>
            <p>周五</p>
            <span id="week-day5">18日</span>
        </label>
        <label>
            <p>周六</p>
            <span id="week-day6">19日</span>
        </label>
        <label>
            <p>周日</p>
            <span id="week-day7">20日</span>
        </label>
    </div>
</nav>

<div class="content">
    <div class="base-table">
        <label for="">1</label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
    </div>
    <div class="base-table">
        <label for="">2</label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
    </div>
    <div class="base-table">
        <label for="">3</label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
    </div>
    <div class="base-table">
        <label for="">4</label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
    </div>
    <div class="base-table">
        <label for="">5</label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
    </div>
    <div class="base-table">
        <label for="">6</label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
    </div>
    <div class="base-table">
        <label for="">7</label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
    </div>
    <div class="base-table">
        <label for="">8</label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
    </div>
    <div class="base-table">
        <label for="">9</label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
    </div>
    <div class="base-table">
        <label for="">10</label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
    </div>
    <div class="base-table">
        <label for="">11</label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
    </div>
    <div class="base-table">
        <label for="">12</label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
        <label for=""></label>
    </div>

    @foreach($user->courses as $course)
        <label
                class="course"
                data-name="{{ $course->name }}"
                data-teacher="{{ $course->teacher }}"
                data-location="{{ $course->location }}"
                data-start-week="{{ $course->start_week }}"
                data-end-week="{{ $course->end_week }}"
                data-start-section="{{ $course->start_section }}"
                data-end-section="{{ $course->end_section }}"
                data-week-day="{{ $course->week_day }}"
                data-status="{{ $course->status }}"
        >
            {{ $course->name }}{{ $course->location }}
        </label>
    @endforeach
</div>

<div id="coverflow">

</div>
<script src="/jquery-weui/dist/lib/jquery-3.2.1.min.js"></script>
<script src="/Swiper/dist/js/swiper.jquery.min.js"></script>
<script>

    var startSchoolTime,  //开学时间
        nowWeek,  //当前周
        weekSwiper; //周数的插件对象
    $(document).ready(function () {

        var startSchool = '{{ $startSchool->value }}'; // 获取开学时间
            startSchoolTime = startSchool*1000;
        //获取当前周
        nowWeek = getWeek(startSchoolTime,new Date().getTime());
        if(nowWeek > 20)  infoWeek(nowWeek); //判断当前周数是否大于20 ，添加多出的选项

        $('.week').find('.swiper-slide').eq(nowWeek-1).addClass('nowWeek');//设置当前周

        $('#nowWeek').find('label').append('<p>本周<br/><span>('+nowWeek+'周)</span></p>');//设置回退当前周按钮


        weekSwiper = new Swiper('.week-swiper-container', {
            slidesPerView: 5,
            paginationClickable: true,
            spaceBetween: 5
        });

        setWeek(nowWeek); //回退当前周
    });


    /**
     * 设置课程的位置，颜色
     */
    function setCourse($week) {
        setDate(nowWeek);
        var color = [
                '#66CCCC', '#FF99CC', '#FF9999', '#FFCC99','#99CC66','#666699','#FF9999','#99CC33','#FF9900','#CCFF00','#CC3399','#99CC33','#FF6600','#993366','#66CCCC','#666699'
            ],
            colorI = 0;
        var courseColor = {};

        $('.course').each(function(){
            var options = {
                name        : $(this).data('name'),
                teacher     : $(this).data('teacher'),
                location    : $(this).data('location'),
                startWeek   : $(this).data('start-week'),
                endWeek     : $(this).data('end-week'),
                startSection: $(this).data('start-section'),
                endSection  : $(this).data('end-section'),
                weekDay     : $(this).data('week-day'),
                status      : $(this).data('status')
            };

            $(this).css('height', function () {
                return ((options.endSection-options.startSection+1)*4-0.2)+'em';
            });

            $(this).css('top', function () {
                return ((options.startSection-1)*4+0.1)+'em';
            });

            $(this).css('left', function () {
                return (((options.weekDay-1)*13.3)+7.05)+'%';
            });

            $(this).css('backgroundColor', function () {
                if(!courseColor.hasOwnProperty((options.name))){
                    courseColor[(options.name)] = color[colorI];
                    colorI++;
                    if(colorI == color.length) colorI = 0;
                }
                return courseColor[(options.name)];
            });

            //判断是否有课
            if(($week >= options.startWeek &&
                    $week <= options.endWeek) &&
                ((options.status == 0 ) ||
                    (options.status == 1 && $week%2 == 1) ||
                    (options.status == 2 && $week%2 == 0))){
                if($(this).hasClass('noCourse')) $(this).removeClass('noCourse');
            }else{
                $(this).addClass('noCourse');
            }

        });
    }


    //查看详细课程时间
    $('.course').click(function () {
        setCourseDiv($(this));
        $('#coverflow').find('.swiper-container').show();
        swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            coverflow: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows : true
            }
        });
    });


    //设置详细课程单击隐藏
    $('#coverflow').on('click', '.swiper-container', function () {
        $(this).hide();
    });

    //设置单击某周时 更新课表
    $('.week-swiper-container').on('click', '.swiper-slide', function () {
        var week = $(this).find('span').text();
        $('.selWeek').each(function () {
            $(this).removeClass('selWeek');
        });
        if(parseInt(week) !== parseInt(nowWeek))
            $('.selWeekDay').each(function () {
                $(this).removeClass('selWeekDay');
            });
        else{
            $('.week-day').find('label').eq(new Date().getDay()).addClass('selWeekDay');
        }
        $(this).addClass('selWeek');
        setCourse(week);
    });


    //返回当前周
    $('#nowWeek').click(function () {
        setWeek(nowWeek);
    });


    //设置课表详情页的html
    function setCourseDiv(course) {
        var  html = '<div class="swiper-container">' +
                        '<div class="swiper-wrapper">' +
                        '</div>' +
                        '<div class="swiper-pagination"></div>' +
                    '</div>';
        $('#coverflow').html(html);

        var option = {
                startSection: course.data('start-section'),
                endSection  : course.data('end-section'),
                weekDay     : course.data('week-day')
            },
            weekDays = {
                1: '周一',
                2: '周二',
                3: '周三',
                4: '周四',
                5: '周五',
                6: '周六',
                7: '周日'
            },
            swiperWrapper = $('#coverflow').find('.swiper-wrapper');
        swiperWrapper.html('');

        $('.course').each(function () {
            var options = {
                name        : $(this).data('name'),
                teacher     : $(this).data('teacher'),
                location    : $(this).data('location'),
                startWeek   : $(this).data('start-week'),
                endWeek     : $(this).data('end-week'),
                startSection: $(this).data('start-section'),
                endSection  : $(this).data('end-section'),
                weekDay     : $(this).data('week-day'),
                status      : $(this).data('status')
            };

            if(option.weekDay == options.weekDay){
                if((Math.max(option.startSection, options.startSection) <
                        Math.min(option.endSection, options.endSection))){

                    var week = '',     //显示单双周
                        courseClass = '';  //无课的样式
                    if(options.status == 1) week = '(单)';
                    else if(options.status == 2) week = '(双)';

                    if($(this).hasClass('noCourse')) courseClass = 'noCourse';
                    var slide = '<div class="swiper-slide '+courseClass+'">' +
                        '<h4>'+ options.name + '</h4>' +
                        '<p>教师 '+ options.teacher +'</p>' +
                        '<p>教室 '+ options.location +'</p>' +
                        '<p>周数 '+ options.startWeek +'-'+options.endWeek +'周'+week +'</p>' +
                        '<p>节数 '+weekDays[options.weekDay] +' '+options.startSection+'-'+options.endSection+'节</p>' +
                        '</div>';
                    if($(this).hasClass('noCourse')){
                        swiperWrapper.append(slide);
                    }
                    else
                        swiperWrapper.prepend(slide);
                }
            }
        });
    }


    /**
     * 当前周
     * @param startSchoolTime 开学时间
     * @param nowTime  现在的时间
     */
    function getWeek(startSchoolTime, nowTime) {
        var week = 1;
        week = ((nowTime-startSchoolTime)/1000)/(60*60*24*7);
        return Math.ceil(week);
    }

    //当周数大于20时自动添加
    function infoWeek(nowWeek){
        var content = $('.week .swiper-wrapper');
        for(i = 21; i <= nowWeek; i++){
           var html = '<div class="swiper-slide"><p>第<span>'+i+'</span>周</p></div>';
           content.append(html);
        }
    }

    //初始化选中当前周
    function setWeek(nowWeek) {
        $('.week-day').find('label').eq(new Date().getDay()).addClass('selWeekDay');

        $('.selWeek').each(function () {
            $(this).removeClass('selWeek');
        });
        var slideIndex =  (nowWeek-3) < 0 ? 0 :nowWeek-3;
        weekSwiper.slideTo(slideIndex, 1000, false);
        setCourse(nowWeek);
    }

    //设置日期
    function setDate(nowWeek) {
        var selWeek = nowWeek;
        if($('.selWeek').length != 0){
            selWeek = parseInt($('.selWeek').find('span').text());
        }

        var weekTime = new Date();
            weekTime.setTime(startSchoolTime+((selWeek-1)*(7*24*60*60*1000)));
        var month = weekTime.getMonth()+1;
            $('#month').text(month);
        for(i = 0 ; i < 7; i++){
            if(i != 0) weekTime.setDate(weekTime.getDate()+1);
            var date = weekTime.getDate();
            if(i != 0 && date == 1) $('#week-day'+(i+1)).text((weekTime.getMonth()+1)+'月');
            else $('#week-day'+(i+1)).text(date+'日');
        }
    }
</script>
</body>
</html>












