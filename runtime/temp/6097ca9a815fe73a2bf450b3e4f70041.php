<?php if (!defined('THINK_PATH')) exit(); /*a:2:{s:76:"/var/www/html/SignSystem/public/../application/home/view/schedule/count.html";i:1501053472;s:73:"/var/www/html/SignSystem/public/../application/home/view/public/base.html";i:1501053472;}*/ ?>
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
	
	<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>schedule-count.css">

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
			
<div>
	<form action="<?php echo url('home/schedule/count'); ?>" method="post" id="test">
		<div class="setup clearfix">
			<button type="button" class="btn" id="lastweek">上一周</button>
			
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
			<button type="button" class="btn" id="nextweek">下一周</button>
			<div class="seeStatus">
				<span>
					查看：
				</span>
				<div>	
					<button type="button" class="btn seltButton" id="haveClass">有课表</button>
					<button type="button" class="btn " id="noClass">无课表</button>
					<input type="hidden" name="status" value="1" id="whetherClass">

				</div>
			</div>			
		</div>	
		<ul class="term-input">
			<li class="clearfix">
				<label>选择组别:</label>
				<div id="term-group">
					<?php if(is_array($group) || $group instanceof \think\Collection): $i = 0; $__LIST__ = $group;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($i % 2 );++$i;?>
						<label class="checkbox-inline">
							<input type="checkbox"  value="<?php echo $vo['group_id']; ?>"> <?php echo $vo['group_name']; ?>
						</label>
					<?php endforeach; endif; else: echo "" ;endif; ?>
				</div>
			</li>
			<li  class="clearfix">
				<div id="term-post">
					<span>
						<label class="checkbox-inline ">
							<input type="checkbox"  value="1"> 成员
						</label>
						<label class="checkbox-inline">
							<input type="checkbox"  value="2"> 组长
						</label>
						<label class="checkbox-inline">
							<input type="checkbox"  value="3"> 事务负责人
						</label>
					</span>

					<span>
						<label class="checkbox-inline">
							<input type="checkbox"  value="0">男
						</label>
						<label class="checkbox-inline">
							<input type="checkbox"  value="1">女
						</label>
					</span>

					<span>
						<?php if(is_array($grade) || $grade instanceof \think\Collection): $i = 0; $__LIST__ = $grade;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($i % 2 );++$i;?>
							<label class="checkbox-inline">
								<input type="checkbox"  value="<?php echo $vo['grade']; ?>"><?php echo $vo['grade']; ?>级
							</label>
						<?php endforeach; endif; else: echo "" ;endif; ?>
					</span>
				</div>
				<label>条件筛选:</label>
			</li>
			<li>
				<label>选择人员:</label>
				<div>
					<button style="background-color:#5bc0de;" type="button" class="btn btn-success" data-toggle="modal" data-target="#myModal">选择人员</button>
				</div>
			</li>
		</ul>

		<div class="term">
			<div class="term-result clearfix">
				<label>筛选条件：</label>
				<div class="term-label">
					
				</div>
					
				<div class="term-but">
					
				</div>
			</div>
		</div>

	</form>

	<div class="table-responsive personnel">
		<table class="table table-bordered">

		</table>
	</div>
</div>

		<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  			<div class="modal-dialog">
    			<div class="modal-content">
      				<div class="modal-header">
        				<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        				<h4 class="modal-title" id="myModalLabel">选择人员</h4>
      				</div>
      				<div class="modal-body">
        				<h4>组长</h4>
        				<hr>
        				<div>
        					<?php if(is_array($users) || $users instanceof \think\Collection): $i = 0; $__LIST__ = $users;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($i % 2 );++$i;if($vo['position'] == 2): ?> 
									<button type="button" class="btn" value="<?php echo $vo['user_id']; ?>" data-post="<?php echo $vo['position']; ?>" data-group="<?php echo $vo['group_id']; ?>" data-grade="<?php echo $vo['grade']; ?>" data-sex="<?php echo $vo['sex']; ?>"><?php echo $vo['name']; ?></button>
								<?php endif; endforeach; endif; else: echo "" ;endif; ?>
        				</div>
        				<h4>事务负责人</h4>
        				<hr>
        				<div>
        					<?php if(is_array($users) || $users instanceof \think\Collection): $i = 0; $__LIST__ = $users;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($i % 2 );++$i;if($vo['position'] == 3): ?> 
									<button type="button" class="btn" value="<?php echo $vo['user_id']; ?>" data-post="<?php echo $vo['position']; ?>" data-group="<?php echo $vo['group_id']; ?>" data-grade="<?php echo $vo['grade']; ?>" data-sex="<?php echo $vo['sex']; ?>"><?php echo $vo['name']; ?></button>
								<?php endif; endforeach; endif; else: echo "" ;endif; ?>        				
						</div>
        				<h4>成员</h4>
        				<hr>
        				<div>
        					<?php if(is_array($users) || $users instanceof \think\Collection): $i = 0; $__LIST__ = $users;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($i % 2 );++$i;if($vo['position'] == 1): ?> 
									<button type="button" class="btn" value="<?php echo $vo['user_id']; ?>" data-post="<?php echo $vo['position']; ?>" data-group="<?php echo $vo['group_id']; ?>" data-grade="<?php echo $vo['grade']; ?>" data-sex="<?php echo $vo['sex']; ?>"><?php echo $vo['name']; ?></button>
								<?php endif; endforeach; endif; else: echo "" ;endif; ?>         				
						</div>
      				</div>

      				<div class="modal-footer">
        				<button type="button" class="btn btn-primary" id="save" >选择</button>
        				<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
      				</div>
    			</div>
  			</div>
		</div>
<script>
	$('.top>ul>li:eq(4)').addClass('nav_selected');
	
	
	$('#weeks').on('change', function(event) {
		getUser();
	});

	$('#haveClass').on('click', function(){
		$('#whetherClass').val('1');
		// console.log($('#whetherClass').val());
		$('.seltButton').removeClass("seltButton");
		$(this).addClass("seltButton");
		getUser();
	});

	$('#noClass').on('click', function(){
		$('#whetherClass').val('2');
		// console.log($('#whetherClass').val());
		$('.seltButton').removeClass("seltButton");
		$(this).addClass("seltButton");
		getUser();
	});

	$('#term-group').on('change', 'input', function(event) {
		// var groupid = $(this).val();
		// var selt = false;
	 //    if($(this).is(':checked')) selt = true;

	 //    $('.modal-body').find('button').each(function(index, element){
	 //    	if($(this).data('group') == groupid){
	 //    		if(selt){
		// 			$(this).addClass('selt');
	 //    		}else{
	 //    			if($(this).hasClass('selt')) $(this).removeClass('selt');	
	 //    		}
	 //    	}
	 //    });
	    getUserId();
	    getUser();
	});


	$('#term-post').on('change', 'input', function(event) {
		// var postid = $(this).val();
		// var selt = false;
	 //    if($(this).is(':checked')) selt = true;

	 //    $('.modal-body').find('button').each(function(index, element){
	 //    	if($(this).data('post') == postid || $(this).data('grade') == postid){
	 //    		if(selt){
		// 			$(this).addClass('selt');
	 //    		}else{
	 //    			if($(this).hasClass('selt')) $(this).removeClass('selt');	
	 //    		}
	 //    	}
	 //    });
	    getUserId();
	    getUser();
	});   

	$('.modal-body').on('click', 'button', function(event){
		if($(this).hasClass('selt')){
			$(this).removeClass('selt');	
		}else{
			$(this).addClass('selt');
		}
	});

	$('#save').on('click', function(event){
		getUser();
		$('#myModal').modal('hide');
		getUsers();
	});

	$('.personnel').on('click', '.user', function(){
		layer.open({
					type: 1,
		  	title: false,
		  	closeBtn: 0,
		  	shadeClose: true,
		  	skin: 'tdText',
		  	content:$(this).text(),
		});
	});	$('.personnel').on('change', 'input', function(){
		if($(this).is(':checked')){
			$('.personnel').find('td').each(function(){
				$(this).removeClass('tdhidden');
			});
		}
		else {
			$('.personnel').find('td').each(function(){
				$(this).addClass('tdhidden');
			});
		}
	});
	$('.term-label').on('click', 'span', function(event) {
		var userid = $(this).parent().find('input').val();
		$('.selt').each(function(index, element){
			if(userid == $(this).val())
				$(this).removeClass('selt');
		});
		$(this).parent().remove();
		getUser();
	});

	$('#lastweek').on('click',function(){
			$('#weeks').find("option").each(function(index, element){
				if($(this).attr("selected") == "selected"){
					if(index > 1){
						selWeek(index-1);
						getUser();
						return false;
					}
				}
			});		
	});
	$('#nextweek').on('click',function(){
		var weeks = $('#weeks').find("option");
			weeks.each(function(index, element){
				if($(this).attr("selected") == "selected"){
					if(index < weeks.length-1){
						selWeek(index+1);
						getUser();
						return false;
					}
				}
			});		
	});
	getUser();

	function getUser(){

		var term = $('.term-label');
		var html = "";

		$('.selt').each(function(index, element){
			html += "<label><input type='hidden' name='term[]' value='"+$(this).val()+"'>"+$(this).text()+"<span class='term-close'>X</span></label>";
		});
		term.html(html);


		var $terms = [];
		$('.selt').each(function(index, element){
			$terms[index] = $(this).val();  
		});

		var week = $('#weeks').val();
		var whetherClass = $('#whetherClass').val();

		$.post(
			"<?php echo url('Schedule/getCount'); ?>",
			{	
				week: week,
				term: $terms,
				status: whetherClass,
			},
			function(data){
				
				selWeek(data.week);
				var inputsel = "";
				// var inputsel = "checked='checked'";
				var hidd = "tdhidden";
				var hidden = $('.personnel').find('input');
				if(hidden.length > 0) 
					if(!hidden.is(':checked')){
						inputsel = "";
						hidd = "tdhidden";
					}
				htmltext = "<tr><th><label class='checkbox-inline'><input type='checkbox'  value='0' "+inputsel+"> 是否隐藏</label></th><th>星期一</th><th>星期二</th><th>星期三</th><th>星期四</th><th>星期五</th><th>星期六</th><th>星期日</th></tr>";
				for (var i = 0; i < data.user.length; i++) {
					htmltext += "<tr>";
					htmltext += ("<td>第"+(i+1)+"节</td>");
					for (var j = 0; j < data.user[i].length; j++) {
						htmltext += "<td class='user "+hidd+"'>";
						for (var k = 0; k < data.user[i][j].length; k++) {
							htmltext += (data.user[i][j][k].name+",");
						}	
						htmltext += "</td>";
					}		
					htmltext += "</tr>";
				}
				$('.personnel').find('table').html(htmltext);
			}
		);
	}

	function selWeek(week){
		$('#weeks').find("option").each(function(){
			if($(this).val() != week){
				$(this).attr("selected",false);
			}else{
				$(this).attr("selected",true);
			}
		});
	}

	function getUserId(){
		var $grade = [];
		var $termval = [];
		var $label = ['post', 'sex', 'grade'];
		$('#term-group').find('input:checked').each(function(index, element){
			$grade[index] = $(this).val();
		});
		$('#term-post').find('span').each(function(index1, element1){
            $termval[index1] = [];
		    $(this).find('input:checked').each(function (index2, element2) {
                $termval[index1][index2] = $(this).val();
            });
		});
		$('.modal-body').find('button').each(function(index, element){
			if ($(this).hasClass("selt")) $(this).removeClass('selt');
	    	for (var i = 0; i < $grade.length; i++) {
	    		if($grade[i] == $(this).data('group')){
	    			$(this).addClass('selt');
	    			break;
	    		}
	    	}
	    	if(!$(this).hasClass("selt")){

	    		for (var i = 0; i < $termval.length; i++) {
					for(var j = 0; j < $termval[i].length; j++){
					    console.log("数组："+$termval[i][j]+"数组："+$(this).data($label[i]));
                        console.log($termval.length);
					    if($termval[i][j] == $(this).data($label[i])){
                            $(this).addClass('selt');
                            break;
						}
					}
	    		}
	    	}
	    });
	}
</script>

		</div>

		<footer>
			<span>三月是最棒的</span>
		</footer>
	</div>
	
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