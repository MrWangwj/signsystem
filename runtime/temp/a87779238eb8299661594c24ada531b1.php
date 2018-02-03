<?php if (!defined('THINK_PATH')) exit(); /*a:2:{s:77:"/var/www/html/SignSystem/public/../application/home/view/attendance/test.html";i:1501053471;s:73:"/var/www/html/SignSystem/public/../application/home/view/public/base.html";i:1501053472;}*/ ?>
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
	
<link rel="stylesheet" type="text/css" href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>attendance-test.css">
<!--<script  src="<?php echo \think\Config::get('parse_str.__JS__'); ?>Chart.js"></script>-->
<script  src="<?php echo \think\Config::get('parse_str.__JS__'); ?>Chart-1.0.1-beta.4.js"></script>

</head>
<body>
	<div class="backgd">

		<header>
			<nav class="top">
				<a class="logo" href=""><img src="<?php echo \think\Config::get('parse_str.__IMAGE__'); ?>logo.png" alt=""></a>
				<ul>

					<li class="nav_options_bottom exit_font">
					<?php if(\think\Session::get('userid')!=''): ?>
							<a href="" id="exit"><i>退出</i></a>
						<?php else: ?>
							<a href="<?php echo url('home/index/index'); ?>"><i>登陆</i></a>
					<?php endif; ?>
					</li>
					<li class="nav_options_top management_font"><a href="<?php echo url('admin/login/index'); ?>"><i>管理</i></a></li>
					<li class="nav_options_bottom"><a href="<?php echo url('home/attendance/test'); ?>"><i>本周考勤统计</i></a></li>
					<li class="nav_options_top"><a href="<?php echo url('home/schedule/index'); ?>"><i>查看课表</i></a></li>
					<li class="nav_options_bottom"><a href="<?php echo url('home/schedule/count'); ?>"><i>课表统计</i></a></li>
					<li class="nav_options_top"><a href="<?php echo url('home/homepage/index'); ?>"><i>首页</i></a></li>

				</ul>
			</nav>
		</header>
		<div class="main">
			


    <div class="bg-up"></div>
    <div class="bg-middle">  
        <div class="term">
            <label>周数：</label>
            <select class="form-control" name="week" id="weeks">
                <option value='0'>本周</option>
                <option value='1'>第1周</option>
                <option value='2'>第2周</option>
                <option value='3'>第3周</option>
                <option value='4'>第4周</option>
                <option value='5'>第5周</option>
                <option value='6'>第6周</option>
                <option value='7'>第7周</option>
                <option value='8'>第8周</option>
                <option value='9'>第9周</option>
                <option value='10'>第10周</option>
                <option value='11'>第11周</option>
                <option value='12'>第12周</option>
                <option value='13'>第13周</option>
                <option value='14'>第14周</option>
                <option value='15'>第15周</option>
                <option value='16'>第16周</option>
                <option value='17'>第17周</option>
                <option value='18'>第18周</option>
                <option value='19'>第19周</option>
                <option value='20'>第20周</option>
            </select>


            <label style="margin-left: 10px;">组别：</label>
            <select class="form-control" name="group" id="group">
                <option value="0">全部</option>
                <?php if(is_array($group) || $group instanceof \think\Collection): $i = 0; $__LIST__ = $group;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($i % 2 );++$i;?>
                    <option value='<?php echo $vo['group_id']; ?>'><?php echo $vo['group_name']; ?></option>
                <?php endforeach; endif; else: echo "" ;endif; ?>
            </select>
        </div>
        <table class="table " id="table">
            <tbody>
                
            </tbody>
        </table>
    </div>
    <div class="bg-down"></div>


		</div>

		<footer>
			<span>三月是最棒的</span>
		</footer>
	</div>
	
<script>
    $('.top>ul>li:eq(2)').addClass('nav_selected');
    
    getSign();
    $('#group').on('change',function(){
        getSign();
    });
    $('#weeks').on('change',function(){
        getSign();
    });
    function getSign(){
        var group = $('#group').val();
        var week = $('#weeks').val();
        $.post("<?php echo url('home/attendance/getThisTime'); ?>", { group:group, week:week,}, function (data) {
            console.log(data);
            var table = $("#table>tbody");
            table.html("<tr><th>排名</th><th>组别</th><th>成员</th><th>学号</th><th>在线时长</th></tr>");
            for(var i =0;i<data.length;i++) {
                table.append(
                        "<tr> " +
                        "<td>" + (i+1) +"</td> " +
                        "<td>" + data[i]['group_name'] + "</td> " +
                        "<td>" + data[i]['name'] + "</td>" +
                        "<td>" + data[i]['user_id'] + "</td>" +
                        "<td>" + second2time(data[i]['times']) + "</td>" +
                        "</tr>");
            }
            $.post("<?php echo url('home/attendance/getNo'); ?>", { group:group, }, function (data2) {
                    var table = $("#table>tbody");
                    if(data2.length==0) return;
                    for(var j =0;j<data2.count;j++) {
                        table.append(
                                "<tr> " +
                                "<td>" + "--" +"</td> " +
                                "<td>" + data2.list[j]['group_name'] + "</td> " +
                                "<td>" + data2.list[j]['name'] + "</td>" +
                                "<td>" + data2.list[j]['user_id'] + "</td>" +
                                "<td>--</td>" +
                                "</tr>")
                    }
                }
            )
        })       
    }


    function second2time($seconds){
        // $seconds = Math.round($seconds);
        if( $seconds >= 3600 ){    // 如果超过一个小时
            // $time = explode(':', gmstrftime('%H:%M', $seconds));
            $format_time = (Math.floor(($seconds/3600)))+'小时'+(Math.floor($seconds%3600/60))+'分钟';
        }else{
            $format_time =(Math.floor($seconds/60))+'分钟';
        }
        return $format_time;
    }

</script>

	<script type="text/javascript">
		$('#exit').on('click', function(){
			$.post(
				"<?php echo url('Index/exitlogin'); ?>",
				{},
				function(data){
					if(data.code == 1){
						window.location.reload();
					}
				}
			);
		});
	</script>
</body>
</html>