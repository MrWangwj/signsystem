<?php if (!defined('THINK_PATH')) exit(); /*a:2:{s:84:"D:\Apache24\htdocs\SignSystem2\public/../application/home\view\attendance\index.html";i:1475936651;s:78:"D:\Apache24\htdocs\SignSystem2\public/../application/home\view\index\base.html";i:1475762330;}*/ ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>三月签到系统</title>
    <link rel="stylesheet" type="text/css" href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>bootstrap.css">
    <link rel="stylesheet" type="text/css" href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>base.css">
    
<link rel="stylesheet" type="text/css" href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>attendance.css">
<script type="text/javascript" href="<?php echo \think\Config::get('parse_str_.__JS__'); ?>Chart-1.0.1-beta.4.js"></script>
<script>
    var data = {
        labels : ["January","February","March","April","May","June","July"],
        datasets : [
            {
                barItemName: "name1",
                fillColor : "rgba(220,220,220,0.5)",
                strokeColor : "rgba(220,220,220,1)",
                data : [65,59,90,81,56,55,40]
            },
            {
                barItemName: "name2",
                fillColor : "rgba(151,187,205,0.5)",
                strokeColor : "rgba(151,187,205,1)",
                data : [28,48,40,19,96,27,100]
            }
        ]
    };

    var chartBar = null;
    window.onload = function() {
        var ctx = document.getElementById("myChart").getContext("2d");
        chartBar = new Chart(ctx).Bar(data);

        initEvent(chartBar, clickCall);
    }

    function clickCall(evt){
        var activeBar = chartBar.getBarSingleAtEvent(evt);
        if ( activeBar !== null )
            alert(activeBar.label + ": " + activeBar.barItemName + " ____ " + activeBar.value);
    }

    function initEvent(chart, handler) {
        var method = handler;
        var eventType = "click";
        var node = chart.chart.canvas;

        if (node.addEventListener) {
            node.addEventListener(eventType, method);
        } else if (node.attachEvent) {
            node.attachEvent("on" + eventType, method);
        } else {
            node["on" + eventType] = method;
        }
    }
</script>

</head>
<body>
    <header style="background: url('<?php echo \think\Config::get('parse_str.__IMAGE__'); ?>header.gif')">
        <div id="title">
            <div id="logo_div">
                <img src="<?php echo \think\Config::get('parse_str.__IMAGE__'); ?>Logo.png"  class="img-circle">
            </div>
            <div id="sign_div">
                三月签到系统
            </div>
        </div>
    </header>
    <!--<center>-->
    <div id="inner">
        <nav class="navbar navbar-default" role="navigation">
            <div class="container-fluid">
                <!-- Brand and toggle get grouped for better mobile display -->
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="#">三月</a>
                </div>

                <!-- Collect the nav links, forms, and other content for toggling -->
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="nav navbar-nav">
                        <li class="active"><a href="<?php echo url('homepage/index'); ?>">首页</a></li>
                        <li><a href="#">课表</a></li>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">统计 <span class="caret"></span></a>
                            <ul class="dropdown-menu" role="menu">
                                <li><a href="<?php echo url('Attendance/index'); ?>">个人考勤</a></li>
                                <li><a href="#">Another action</a></li>
                                <li><a href="#">Something else here</a></li>
                                <li class="divider"></li>
                                <li><a href="#">Separated link</a></li>
                                <li class="divider"></li>
                                <li><a href="#">One more separated link</a></li>
                            </ul>
                        </li>
                    </ul>
                    <form class="navbar-form navbar-left" role="search">
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="Search">
                        </div>
                        <button type="submit" class="btn btn-default">Submit</button>
                    </form>
                    <ul class="nav navbar-nav navbar-right">
                        <li><a href="#">Link</a></li>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown <span class="caret"></span></a>
                            <ul class="dropdown-menu" role="menu">
                                <li><a href="#">Action</a></li>
                                <li><a href="#">Another action</a></li>
                                <li><a href="#">Something else here</a></li>
                                <li class="divider"></li>
                                <li><a href="#">Separated link</a></li>
                            </ul>
                        </li>
                    </ul>
                </div><!-- /.navbar-collapse -->
            </div><!-- /.container-fluid -->
        </nav>
    <!--</center>-->
    <div id="content">
        
<div id="top_box">
    <div id="topleft_box">
        <canvas id="myChart" width="400" height="400"></canvas>
    </div>
    <div id="topright_box">
        <div id="ownaAttendance_box">
                <p id="alltime"></p>
                <p id="weektime"></p>
                <p id="lasttime"></p>
        </div>
    </div>
</div>
<div id="under_box">


</div>

    </div>
    <footer style="background: url('<?php echo \think\Config::get('parse_str.__IMAGE__'); ?>header.gif')">
        <div>三月签到系统页脚</div>
    </footer>
    <script type="text/javascript" src="<?php echo \think\Config::get('parse_str.__JS__'); ?>jquery-3.0.0.min.js"></script>
    <script type="text/javascript" src="<?php echo \think\Config::get('parse_str.__JS__'); ?>bootstrap.min.js"></script>
    <script type="text/javascript" src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>js/layer/layer.js"></script>
    
<script>
    window.onload = function(){
        $.post("<?php echo url('Attendance/getSum'); ?>",function (data) {
            if(data.code==-1){
                $("#alltime").html("欢迎"+data.name+"同学来小组")
            }else if(data.code == 1){
                $("#alltime").html(data.name+"同学已经在小组学习了"+data.time)
            }
        })
        $.post("<?php echo url('Attendance/getWeekSum'); ?>",function (data) {
            if(data.code==-1){
                $("#weektime").html("本周暂无签到记录")
            }else if(data.code == 1){
                $("#weektime").html(data.name+"同学本周在线"+data.time)
            }
        })
        $.post("<?php echo url('Attendance/lastOnline'); ?>",function (data) {
            if(data.code==-1){
                $("#lasttime").html("快去签个到吧")
            }else if(data.code == 1){
                $("#lasttime").html("最后操作时间"+data.time)
            }
        })
    }
</script>

</body>
</html>