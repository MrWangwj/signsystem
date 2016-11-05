<?php if (!defined('THINK_PATH')) exit(); /*a:2:{s:78:"/var/www/html/SignSystem2/public/../application/home/view/attendance/test.html";i:1478260979;s:74:"/var/www/html/SignSystem2/public/../application/home/view/public/base.html";i:1478260979;}*/ ?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>三月软件小组签到系统</title>
	<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>css/bootstrap.min.css">
	<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>public-base.css">
	<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>js/jquery-3.0.0.min.js"></script>
	<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>js/bootstrap.min.js"></script>
	<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>js/layer/layer.js"></script>
	<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>js/public-base.js"></script>	
	
<link rel="stylesheet" type="text/css" href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>attendance.css">
<!--<script  src="<?php echo \think\Config::get('parse_str.__JS__'); ?>Chart.js"></script>-->
<script  src="<?php echo \think\Config::get('parse_str.__JS__'); ?>Chart-1.0.1-beta.4.js"></script>

</head>
<body>
	<div class="backgd">
		<div class="title">
			<nav>
				<label class="logo"> 
					
				</label>
				<div class="right-menu">
					<ul class="menu">
						<a href="<?php echo url('Homepage/index'); ?>"><li>首页</li></a>
						<a href="<?php echo url('Schedule/count'); ?>"><li>课表统计</li></a>
						<a href="<?php echo url('Schedule/index'); ?>"><li>查看课表</li></a>
						<a href="<?php echo url('attendance/test'); ?>"><li>本周考勤统计</li></a>
						
					</ul>
					<div class="exit">
						<a href="<?php echo url('Index/exitlogin'); ?>">退出</a>	
					</div>					
				</div>
			</nav>
		</div>
		<div class="main">
			
<table class="table table-striped" id="table">
    <tr>
        <th>排名</th>
        <th>组别</th>
        <th>成员</th>
        <th>学号</th>
        <th>在线时长(分钟)</th>
    </tr>
</table>

		</div>
		<div class="footer">
			<span>三月软件@版权所有</span>
		</div>
	</div>
	
<script>
    $('.menu li:eq(3)').css('background','black');
    $(function () {
        $.post("<?php echo url('home/attendance/getThisTime'); ?>",function (data) {
            var table = $("#table");
            for(var i =0;i<data.length;i++) {
                table.append(
                        "<tr> " +
                        "<td>" + (i+1) +"</td> " +
                        "<td>" + data[i]['group_name'] + "</td> " +
                        "<td>" + data[i]['name'] + "</td>" +
                        "<td>" + data[i]['user_id'] + "</td>" +
                        "<td>" + Math.round(data[i]['times']/60) + "</td>" +
                        "</tr>")
            }

            $.post("<?php echo url('home/attendance/getNo'); ?>",function (data) {
                var table = $("#table");
                if(data.length==0) return;
                for(var j =0;j<data.count;j++) {
                    table.append(
                            "<tr> " +
                            "<td>" + "--" +"</td> " +
                            "<td>" + data.list[j]['group_name'] + "</td> " +
                            "<td>" + data.list[j]['name'] + "</td>" +
                            "<td>" + data.list[j]['user_id'] + "</td>" +
                            "<td>" + data.list[j]['time'] + "</td>" +
                            "</tr>")
                }
            })
        })

    })

</script>

</body>
</html>