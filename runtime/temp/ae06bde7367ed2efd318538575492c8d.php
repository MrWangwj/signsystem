<?php if (!defined('THINK_PATH')) exit(); /*a:2:{s:83:"D:\MyDrivers\htdocs\SignSystem2\public/../application/home\view\schedule\count.html";i:1476191613;s:80:"D:\MyDrivers\htdocs\SignSystem2\public/../application/home\view\public\base.html";i:1476191613;}*/ ?>
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
	
	<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>schedule-count.css">

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
			
<div>
	<div class="setup clearfix">
		<form action="<?php echo url('Schedule/count'); ?>" method="get" id="test">
			<span>当前周：</span>
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
			<div class="seeStatus">
				<span>
					查看：
				</span>
				<select class="form-control" name="status" id="seestatus">
					<option value='1'>有课人员表</option>
					<option value='2'>无课人员表</option>
				</select>
			</div>			
		</form>
	</div>
	<div class="term">
		<div class="term-result clearfix">
			<label for="">筛选条件：</label>
			<div class="term-label">
				
			</div>
			<div class="term-but">
				<button  class="btn btn-primary">+添加新的条件</button>
			</div>
		</div>
		<div class="term-input clearfix">
			<span>组别：</span>
			<select name="1" id="term-group" class="form-control">
				<option value="">全部</option>
				<option value="">开发一组</option>
				<option value="">开发二组</option>
				<option value="">开发三组</option>
				<option value="">开发四组</option>
				<option value="">开发五组</option>
				<option value="">开发六组</option>
				<option value="">开发七组</option>
				<option value="">开发八组</option>
			</select>
			<span>职务：</span>
			<select class="form-control" id="term-post">
  				<option>全部</option>
  				<option>事务负责人</option>
  				<option>成员</option>
			</select>
			<span>人员：</span>
			<select class="form-control" id="term-personnel">
				<option value="">全部</option>
  				<option>王巍瑾</option>
  				<option>刘海洋</option>
  				<option>刘海洋</option>
  				<option>刘海洋</option>
  				<option>刘海洋</option>
  				<option>刘海洋</option>
  				<option>刘海洋</option>
  				<option>刘海洋</option>
  				<option>刘海洋</option>
  				<option>刘海洋</option>
  				<option>刘海洋</option>
  				<option>刘海洋</option>
  				<option>刘海洋</option>
  				<option>刘海洋</option>
  				<option>刘海洋</option>
			</select>
		</div>
	</div>
	<div class="table-responsive personnel">
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
							<td >
								<?php if(is_array($vo2) || $vo2 instanceof \think\Collection): $i = 0; $__LIST__ = $vo2;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo3): $mod = ($i % 2 );++$i;?>	
									<?php echo $vo3['name']; ?>,
								<?php endforeach; endif; else: echo "" ;endif; ?>							
							</td>
						<?php endforeach; endif; else: echo "" ;endif; ?>						
					</tr>
				<?php endforeach; endif; else: echo "" ;endif; ?>
 			</table>
	</div>
</div>
<script>
	$('#seestatus').find("option[value=<?php echo (isset($_GET['status']) && ($_GET['status'] !== '')?$_GET['status']:1); ?>]").attr("selected",true);
	$('#weeks').find("option[value=<?php echo (isset($_GET['week']) && ($_GET['week'] !== '')?$_GET['week']:1); ?>]").attr("selected",true);
	$('#weeks').on('change', function(event) {
			$('#test').submit();
	});
	$('#seestatus').on('change', function(event) {
		$('#test').submit();
	});
</script>

		</div>
		<div class="footer">
			<span>三月软件@版权所有</span>
		</div>
	</div>




</body>
</html>