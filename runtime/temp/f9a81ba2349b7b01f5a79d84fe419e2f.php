<?php if (!defined('THINK_PATH')) exit(); /*a:2:{s:76:"/var/www/html/SignSystem/public/../application/home/view/schedule/other.html";i:1501053472;s:73:"/var/www/html/SignSystem/public/../application/home/view/public/base.html";i:1501053472;}*/ ?>
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
	
	<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>schedule-index.css">
	<script src="<?php echo \think\Config::get('parse_str.__JS__'); ?>/schedule-index.js"></script>

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
			
		<div class="major">
			<div class="major-title">
				<h1><?php echo $otheruser['name']; ?>课表</h1>
				<span></span>
				<p>Other schedule</p>
			</div>
			<div class="major-content clearfix">
				<div class="content-left">
					<p></p>
					<label><?php echo $otheruser['name']; ?></label>
					<ul>
						<li>有课</li>
						<li>无课</li>
					</ul>
				</div>
				<div class="content-right">
					<div class="clearfix">
						<div class="schedule-section">
							<form action="<?php echo url('home/schedule/other',['otheruser' => $otheruser['user_id']]); ?>" method="get" id="test">
							<ul>
								<li class="arrow"><img src="<?php echo \think\Config::get('parse_str.__IMAGE__'); ?>up.png" id="lastWeek"></li>
								<div>
									
								</div>
								<li class="arrow"><img src="<?php echo \think\Config::get('parse_str.__IMAGE__'); ?>down.png" id="nextWeek"></li>
							</ul>
							</form>
						</div>
						<div class="schedule">
				  			<table class="table table-bordered">
								<tr>
									
									<th>星期一</th>
									<th>星期二</th>
									<th>星期三</th>
									<th>星期四</th>
									<th>星期五</th>
									<th>星期六</th>
									<th>星期日</th>
									
								</tr>
								<?php if(is_array($data) || $data instanceof \think\Collection): $i = 0; $__LIST__ = $data;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($i % 2 );++$i;?>
									<tr>
										
										<?php if(is_array($vo) || $vo instanceof \think\Collection): $i = 0; $__LIST__ = $vo;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo2): $mod = ($i % 2 );++$i;?>
											<td class='course <?php if($vo2['whether_course'] == 0): ?>white<?php endif; ?>' data-toggle="modal" data-target="#myModal" data-id=<?php echo $vo2['id']; ?>>
												<div>
													<span><?php echo $vo2['name']; ?></span>
													<br/>
													

													


													<span><?php echo $vo2['classroom']; ?></span>
												</div>
												<?php if($vo2['whether_course'] == 2): ?>
													<img src="<?php echo \think\Config::get('parse_str.__IMAGE__'); ?>haveclass.jpg">
												<?php else: ?>
													<img src="<?php echo \think\Config::get('parse_str.__IMAGE__'); ?>noclass.jpg">
												<?php endif; ?>				
											</td>
										<?php endforeach; endif; else: echo "" ;endif; ?>						
									</tr>
								<?php endforeach; endif; else: echo "" ;endif; ?>
				  			</table>
						</div>						
					</div>
					<div>
						<?php if(\think\Session::get('userid')!=''): ?>
							<button type="button" class="btn btn-success" id="input">导入他的课表</button>
						<?php endif; ?>
						<button type="button" data-toggle="modal" data-target="#myinfo" class="btn btn-danger" >他的信息</button>
					</div>
				</div>
			</div>
		

		<div class="modal fade" style="color: black;" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  			<div class="modal-dialog">
    			<div class="modal-content">
      				<div class="modal-header">
        				<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        				<h4 class="modal-title" id="myModalLabel">查看课表</h4>
      				</div>
      				<div class="modal-body">
        				<form action="" class="form-horizontal" role="form">
        					<div class="form-group">
    							<label for="" class="col-sm-2 control-label">名称</label>
    							<div class="col-sm-10 test">
      								<input type="text" class="form-control" id="name" placeholder="未填写" disabled="disabled">
									<div class="list-group hint">
											
									</div>
    							</div>
  							</div>
  							<div class="form-group">
    							<label for="" class="col-sm-2 control-label">地点</label>
    							<div class="col-sm-10">
      								<input type="text" class="form-control" id="classroom" placeholder="未填写" disabled="disabled">
    							</div>
  							</div>
  							<div class="form-group">
    							<label for="" class="col-sm-2 control-label">老师</label>
    							<div class="col-sm-10">
      								<input type="text" class="form-control" id="teacher" placeholder="未填写" disabled="disabled">
    							</div>
  							</div>
  							<div class="form-group">
    							<label for="" class="col-sm-2 control-label">节数</label>
    							<div class="col-sm-10">
      								<select class="form-control" style="width:40%;float:left;margin-right: 50px;" id="week"  disabled="disabled">
									
									</select>
      								<select class="form-control" style="width:40%;float:left;" id="section"  disabled="disabled">
	
									</select>
    							</div>
  							</div>
  							<div class="form-group">
    							<label for="" class="col-sm-2 control-label">周数</label>
    							<div class="col-sm-10">
									<table class="table-bordered week">

									</table>
    							</div>		
							</div>

        				</form>
      				</div>
    			</div>
  			</div>
		</div>
	</div>

        <div class="modal fade" id="myinfo" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                        <h4 class="modal-title" id="myModalLabel">个人信息</h4>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal" role="form">
                          <div class="form-group">
                            <label class="col-sm-2 control-label">学号：</label>
                            <div class="col-sm-10">
                              <p class="form-control-static"><?php echo $otheruser['user_id']; ?></p>
                            </div>
                          </div>
                          <div class="form-group">
                            <label class="col-sm-2 control-label">用户：</label>
                            <div class="col-sm-10">
                              <p class="form-control-static"><?php echo $otheruser['name']; ?></p>
                            </div>
                          </div>
                          <div class="form-group">
                            <label class="col-sm-2 control-label">组别：</label>
                            <div class="col-sm-10">
                              <p class="form-control-static"><?php echo $otheruser['group_name']; ?></p>
                            </div>
                          </div>
                          <div class="form-group">
                            <label class="col-sm-2 control-label">职务：</label>
                            <div class="col-sm-10">
                              <p class="form-control-static"><?php echo $otheruser['position_name']; ?></p>
                            </div>
                          </div>
                          <div class="form-group">
                            <label class="col-sm-2 control-label">性别：</label>
                            <div class="col-sm-10">
                              <p class="form-control-static"><?php if($otheruser['sex'] ==0): ?>男<?php else: ?>女<?php endif; ?></p>
                            </div>
                          </div>
                          <div class="form-group">
                            <label class="col-sm-2 control-label">班级：</label>
                            <div class="col-sm-10">
                              <p class="form-control-static"><?php echo $otheruser['class']; ?></p>
                            </div>
                          </div>
                          <div class="form-group">
                            <label class="col-sm-2 control-label">电话：</label>
                            <div class="col-sm-10">
                              <p class="form-control-static"><?php echo $otheruser['phone']; ?></p>
                            </div>
                          </div>
                        </form>                        
                    </div>
                </div>
            </div>
        </div>

	<script>
		$('.top>ul>li:eq(3)').addClass('nav_selected');

		var section = 0;
		var week = 0;
		var w = "<?php echo $week; ?>";
		$('.schedule-section ul>div').html(getWeekSelect(parseInt(w)));


		// $('#weeks').find("option[value=<?php echo $week; ?>]").attr("selected",true);
		$('.main').on('click', '.course',function() {
			section = $(this).parent().index();
			week = $(this).index()+1;
			$.get(
				"<?php echo url('Schedule/schedule'); ?>",
				{
					otheruser:"<?php echo $otheruser['user_id']; ?>",
					week: week,
					section: section,
				},
				function(data){
					$('.hint').html('');
					$('#name').val(data.name);
					$('#classroom').val(data.classroom);
					$('#teacher').val(data.teacher);
					$('#week').html(getWeek(week));
					$('#section').html(getSection(section));
					$('.week').html(getWeeks(data.weeks_number));
				}
			);
		});
		/**
		 * 单选按钮的单击事件
		 * @param  {String} event) {			var      weeks [description]
		 * @return {[type]}        [description]
		 */
		$('input[type="radio"]').on('click', function(event) {
			var weeks = "";
			if($(this).val() == "option1"){
				weeks = "1,3,5,7,9,11,13,15,17,19";
			}else if($(this).val() == "option2"){
				weeks = "2,4,6,8,10,12,14,16,18,20";
			}else if($(this).val() == "option3"){
				weeks = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20";
			}else{
				weeks = "0";
			}
			$('.week').html(getWeeks(weeks));		
		});
		$('#weeks').on('change', function(event) {
			var id=$("#weeks").find("option:selected").val();
			if(id == 0){
				window.location.href = "<?php echo url('Schedule/other','',''); ?>/"+"<?php echo $otheruser['user_id']; ?>";
			}else{
				$('#test').submit();
			}
		});

		<?php if(\think\Session::get('userid')!=''): ?>
		$('#input').on('click', function(event) {
			var account = "<?php echo $otheruser['user_id']; ?>";
			$.get(
	   			"<?php echo url('Schedule/inputSch'); ?>",
	   			{
	   				user_id: account,
	   			},
	   			function(data){
	   				if(data.code == 2){
	   					layer.msg(data.msg, {icon: 1}, function(){
	   							var $url = "<?php echo url('home/schedule/index'); ?>";
	 							window.location.href = $url;
	 						});
	   				}else{
	   					layer.msg(data.msg, {icon: 2});
	   				}
	   			}
			);
		});	
		<?php endif; ?>

		$('#lastWeek').on('click', function(){
			var nowWeek = $('#nowWeek').data('id');
			$('.schedule-section ul>div').html( getWeekSelect(nowWeek-1));
			
				$('#test').submit();
			
		});

		$('#nextWeek').on('click', function(){
			var nowWeek = $('#nowWeek').data('id');
			$('.schedule-section ul>div').html( getWeekSelect(nowWeek+1));
			
				$('#test').submit();
			
		});
		function getWeekSelect(week){
			var weeks = ["本周", "第1周", "第2周", "第3周", "第4周", "第5周", "第6周", "第7周", "第8周", "第9周", "第10周", "第11周", "第12周", "第13周", "第14周", "第15周", "第16周", "第17周", "第18周", "第19周", "第20周"];
			var lastid = 0,nowid =0 ,nextid = 0;
			if(week < 0){
				lastid =weeks.length-2;
				nowid = weeks.length-1;
				nextid = 0;
			}else if(week == 0){
				lastid = weeks.length-1;
				nowid = 0;
				nextid = 1;
			}else if(week > weeks.length-1){
				lastid =weeks.length-1;
				nowid = 0;
				nextid = 1;
			}else if(week == weeks.length-1){
				lastid =week-1;
				nowid = weeks.length-1;
				nextid = 0;
			}else{
				lastid =week-1;
				nowid = week;
				nextid = week+1;
			}
			var html ='<li class=""><span>'+weeks[lastid]+'</span></li><li><label id="nowWeek" data-id="'+nowid+'">'+'<input type="hidden" name="week" value="'+nowid+'">'+weeks[nowid]+'</label></li><li class=""><span>'+weeks[nextid]+'</span></li>';
			return html;
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