<?php if (!defined('THINK_PATH')) exit(); /*a:2:{s:77:"/var/www/html/SignSystem2/public/../application/home/view/schedule/index.html";i:1476087363;s:74:"/var/www/html/SignSystem2/public/../application/home/view/public/base.html";i:1476444477;}*/ ?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>标题</title>
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
		<div class="title">
			<nav>
				<div class="title-left">
						<label class="logo"></label>
						<span>三月软件</span>
				</div>
				<div class="title-right">
					<ul>
						<li class="notice">
							<label >
								<label>1</label>
							</label>
							<div class="notice-text">
								<div class="notice-option">
									<div class="clearfix">	
										<div>
											<img src="" alt="">
											<div>
												<div>
													<span>王佳发布的公告</span>
													<span>2016.10.01</span>
												</div>
												<div class="notice-content">
													<div>
														1ewqrwwefwefwefwefwefwefeffefeefefwefefs
													</div>
													<span>...</span>
												</div>
											</div>
										</div>

									</div>
									<div>	
										<div>
											<img src="" alt="">
											<div>
												<div>
													<span>王佳发布的公告</span>
													<span>2016.10.01</span>
												</div>
												<div class="notice-content">
													<div>
														1ewqrwwefwefwefwefwefwefeffefeefefwefefs
													</div>
													<span>...</span>
												</div>
											</div>
										</div>

									</div>
									<div>	
										<div>
											<img src="" alt="">
											<div>
												<div>
													<span>王佳发布的公告</span>
													<span>2016.10.01</span>
												</div>
												<div class="notice-content">
													<div>
														1ewqrwwefwefwefwefwefwefeffefeefefwefefs
													</div>
													<span>...</span>
												</div>
											</div>
										</div>

									</div>
								</div>
								<div>
									<span><a href="">查看全部</a></span>
								</div>
							</div>
						</li>
						<li class="picture">
							<div>
								<img src="<?php echo \think\Config::get('parse_str.__IMAGE__'); ?>picture1.jpg" alt="">
								<span></span>
							</div>
							<div class="menu">
								<ul>
									<a href=""><li>个人信息</li></a>
									<a href=""><li>查看课表</li></a>
									<a href=""><li>退出</li></a>
								</ul>
							</div>
						</li>
						<li class="user">
							<div>
								<p>
									欢迎
									<a href="">李雪冰</a>
									登陆
								</p>
							</div>
						</li>
					</ul>
				</div>				
			</nav>
		</div>
		<div class="main">
			
	<div class="text">
		<div class="text-week clearfix">
			<form action="<?php echo url('Schedule/index'); ?>" method="get" id="test">
				<span>当前周：</span>
				<select class="form-control" id="weeks" name="week">
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
			</form>
			<div>
				<button type="button" class="btn btn-success"  data-toggle="modal" data-target=".bs-example-modal-sm">导入</button>
				<button type="button" class="btn btn-success">导出</button>
				<button type="button" class="btn btn-success" data-toggle="modal" data-target=".other">查看他人课表</button>
			</div>
		</div>
		<div class="table-responsive curriculum">
  			<table class="table table-bordered schedule">
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
							<td class='<?php if($vo2['whether_course'] == 0): ?>color0<?php elseif($vo2['whether_course'] == 1): ?>color1<?php endif; ?> course' data-toggle="modal" data-target="#myModal" data-id=<?php echo $vo2['id']; ?>>
								<div >
									<span><?php echo $vo2['name']; ?></span>
									<br/>
									<span><?php echo $vo2['classroom']; ?></span>
								</div>								
							</td>
						<?php endforeach; endif; else: echo "" ;endif; ?>						
					</tr>
				<?php endforeach; endif; else: echo "" ;endif; ?>
  			</table>
		</div>
		<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
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
      								<input type="text" class="form-control" id="name" placeholder="未填写">
									<div class="list-group hint">
											
									</div>
    							</div>
  							</div>
  							<div class="form-group">
    							<label for="" class="col-sm-2 control-label">地点</label>
    							<div class="col-sm-10">
      								<input type="text" class="form-control" id="classroom" placeholder="未填写">
    							</div>
  							</div>
  							<div class="form-group">
    							<label for="" class="col-sm-2 control-label">老师</label>
    							<div class="col-sm-10">
      								<input type="text" class="form-control" id="teacher" placeholder="未填写">
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
									<label class="radio-inline">
										<input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1"> 单周
									</label>
									<label class="radio-inline">
										<input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2"> 双周
									</label>
									<label class="radio-inline">
										<input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3"> 全部
									</label>
									<label class="radio-inline">
										<input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option4"> 其他
									</label>
									<table class="table-bordered week">

									</table>
    							</div>		
							</div>

        				</form>
      				</div>
      				<div class="modal-footer">
        				<button type="button" class="btn btn-primary" id="save" >保存</button>
        				<button type="button" class="btn btn-warning" id="nothing">无课</button>
        				<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
      				</div>
    			</div>
  			</div>
		</div>
		
		<!-- 查看他人课表弹框 -->
		<div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
  			<div class="modal-dialog modal-sm">
    			<div class="modal-content">
      				<div class="modal-header">
        				<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        				<h4 class="modal-title" id="myModalLabel">导入课表</h4>
      				</div>
      				<div class="modal-body">
        				<form action="" class="form-horizontal" role="form">
        					<div class="form-group">
    							<label for="" class="col-sm-2 control-label" style="width: 20%;">学号</label>
    							<div class="col-sm-10 test" style="width: 80%;">
      								<input type="number" class="form-control" id="account" placeholder="填写学号">
    							</div>
  							</div>
        				</form>
      				</div>
      				<div class="modal-footer">
        				<button type="button" class="btn btn-success" id="input">导入</button>
        				<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
      				</div>
    			</div>
  			</div>
		</div>


		<div class="modal fade other" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
  			<div class="modal-dialog modal-sm">
    			<div class="modal-content">
      				<div class="modal-header">
        				<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        				<h4 class="modal-title" id="myModalLabel">查看他人课表</h4>
      				</div>
      				<div class="modal-body">
        				<form action="" class="form-horizontal" role="form">
        					<div class="form-group">
    							<label for="" class="col-sm-2 control-label" style="width: 20%;">学号</label>
    							<div class="col-sm-10 test" style="width: 80%;">
      								<input type="number" class="form-control" id="account2" placeholder="填写学号">
    							</div>
  							</div>
        				</form>
      				</div>
      				<div class="modal-footer">
        				<button type="button" class="btn btn-success" id="seeother">查看</button>
        				<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
      				</div>
    			</div>
  			</div>
		</div>





	</div>
	<script>
		var section = 0;
		var week = 0;
		$('#weeks').find("option[value=<?php echo $week; ?>]").attr("selected",true);
		$('.main').on('click', '.course',function() {
			section = $(this).parent().index();
			week = $(this).index()+1;
			$.get(
				"<?php echo url('Schedule/schedule'); ?>",
				{
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
		$('.week').on('click', 'td', function(event) {
			if($(this).hasClass('haveClass')){
				$(this).removeClass('haveClass');
			}else{
				$(this).addClass('haveClass');
			}
		});
		$('#save').on('click', function(event) {
			var id = $(this).data('id');
			$.post(
				"<?php echo url('Schedule/save'); ?>",
				{	
					name: $('#name').val(),
					classroom: $('#classroom').val(),
					teacher: $('#teacher').val(),
					week: week,
					section: section,
					weeks_number: Weeks(),
				},
				function(data){
					if(data.code == 0){
						layer.msg(data.msg, {icon: 2});
					}else{
						$('#myModal').modal('hide');
						var icon = 1;
						if(data.code != 2){
							icon = 2;
						}
						layer.msg(data.msg, {icon: icon}, function(){
							window.location.reload();
						});						
					}	
							
				}
			);
		});
		$('#nothing').on('click', function(event) {
	   		layer.confirm('选择无课将删除当前课程，确定要这样做吗？', {
	 				btn: ['确定','取消'], //按钮
	 				icon : 0,
			}, function(){
	 				$.post(
	 					"<?php echo url('Schedule:nothing'); ?>", 
	 					{
	 						week:week,
	 						section:section,
	 					}, function(data, textStatus, xhr){
	 						$('#myModal').modal('hide');
	 						layer.msg(data.msg, {icon: data.code}, function(){
	 							window.location.reload();
	 						});
	 					}
	 				);
			});
		});
		$('#name').on('keyup blur', function(event) {
			$('.hint').show();
			var name = $(this).val();
			$.get("<?php echo url('Schedule:curriculum'); ?>", {
				name: name,
				week: week,
				section: section,
			}, function(data) {
				$('.hint').html(getHint(data));
			});
		});
		//待解决问题，提示版隐藏问题
		$('.hint').on('click', function(event) {
			$('#name').focus();
			event.stopPropagation();
		});
		$('#name').on('click', function(event) {
			event.stopPropagation();
		});
		$('#myModal').on('click', function(event) {
			$('.hint').hide();
		});	
	

		
		$('.hint').on('click', '.addschedu', function(event) {
			var id = $(this).data('id');
			$.get(
				"<?php echo url('Schedule/schedule'); ?>",
				{
					id: id,
				},
				function(data){
					$('.hint').html('');
					$('#name').val(data.name);
					$('#classroom').val(data.classroom);
					$('#teacher').val(data.teacher);
					$('#week').html(getWeek(data.week));
					$('#section').html(getSection(data.section));
					$('.week').html(getWeeks(data.weeks_number));
				}
			);
		});
		$('#weeks').on('change', function(event) {
			var id=$("#weeks").find("option:selected").val();
			if(id == 0){
				window.location.href = "<?php echo url('Schedule/index','',''); ?>";
			}else{
				$('#test').submit();
			}
		});
		$('#input').on('click', function(event) {
			var account = $('#account').val();
			$.get(
	   			"<?php echo url('Schedule/inputSch'); ?>",
	   			{
	   				user_id: account,
	   			},
	   			function(data){
	   				if(data.code == 2){
	   					layer.msg(data.msg, {icon: 1}, function(){
	 							window.location.reload();
	 						});
	   				}else{
	   					layer.msg(data.msg, {icon: 2});
	   				}
	   			}
			);
		});	
		$('#seeother').on('click', function(event) {
			var account = $('#account2').val();
			$.get(
	   			"<?php echo url('Schedule/otheruser'); ?>",
	   			{
	   				user_id: account,
	   			},
	   			function(data){
	   				if(data.code == 1){
	   					window.location.href = data.url;
	   				}else{
	   					layer.msg(data.msg, {icon: 2});
	   				}
	   			}
			);
		});

	</script>

		</div>
		<div class="footer">
			<span>三月软件@版权所有</span>
		</div>
	</div>
	
</body>
</html>