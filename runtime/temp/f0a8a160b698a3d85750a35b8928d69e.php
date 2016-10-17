<?php if (!defined('THINK_PATH')) exit(); /*a:2:{s:75:"/var/www/html/SignSystem2/public/../application/home/view/user/message.html";i:1476455993;s:74:"/var/www/html/SignSystem2/public/../application/home/view/public/base.html";i:1476690990;}*/ ?>
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
	
    	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	
	
		<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/css/font-awesome.min.css" />
	

		<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/css/ace.min.css" />
		<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/css/ace-rtl.min.css" />
		<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/css/ace-skins.min.css" />
		<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/css/jquery-ui-1.10.3.full.min.css" />



		<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/js/ace-extra.min.js"></script>

	
	

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
						<li class="picture">
							<div class="dropdown">
   								<img src="<?php echo \think\Config::get('parse_str.__IMAGE__'); ?>menu.png" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
  								<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">
    								<a href="<?php echo url('User/message'); ?>"><li>个人信息</li></a>
    								<a href=""><li>考勤信息</li></a>
									<a href="<?php echo url('Schedule/index'); ?>"><li>查看课表</li></a>
									<a href="<?php echo url('Schedule/count'); ?>"><li>课表统计</li></a>
									<a href="<?php echo url('Homepage/index'); ?>"><li>返回首页</li></a>
									<a href="<?php echo url('Index/exit'); ?>"><li>退出</li></a>
  								</ul>
							</div>	
						</li>
						<li class="user">
							<div>
								<p>
									欢迎
									<a href="<?php echo url('User/message'); ?>"><?php echo $user['name']; ?></a>
									登陆
								</p>
							</div>
						</li>
					</ul>
				</div>				
			</nav>
		</div>
		<div class="main">
			
	<div style="margin-top:10px;">
		<div style="margin: 0;padding: 8px 20px 24px;">
			<div class="row" style="border:4px solid green;width:100%;margin: auto;">
			<div style="margin-left:45%;"><h3>个人信息</h3></div>
				<div class="col-xs-12">
					

					<form class="form-horizontal" role="form" method="post" action="javascript:adduser();">
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 头&nbsp像</label>

							<div class="col-sm-9">
								<img src="" style="border:2px solid green;width:100px;height:100px;">
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 学&nbsp号</label>

							<div class="col-sm-9">
								<input type="text" id="form-field-0"  class="col-xs-10 col-sm-5" value="<?php echo $data['user_id']; ?>" readonly="readonly"  required >
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 用户名 </label>

							<div class="col-sm-9">
								<input type="text" id="form-field-1"  class="col-xs-10 col-sm-5" value="<?php echo $data['name']; ?>" required >
							</div>
						</div>

						<div class="space-4"></div>

						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-2"> 组&nbsp别 </label>
							
							<div class="col-sm-9">
								<input type="text" id="form-field-2" class="col-xs-10 col-sm-5" value="<?php echo $data['group_name']; ?>" readonly="readonly" required>					
							</div>
						</div>

						<div class="space-4"></div>

						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-4">性&nbsp别</label>
							<div class="col-sm-9" style="margin-top:3px;">
								<input name="user_sex" type="radio" id="sex-1"  value="0">
								<label for="sex-1">男</label>
								<input name="user_sex" type="radio" id="sex-2"  value="1">
								<label for="sex-2">女</label>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 班&nbsp级 </label>

							<div class="col-sm-9">
								<input type="text" id="form-field-3" placeholder="计科161" class="col-xs-10 col-sm-5">
							</div>
						</div>
						
						<div class="space-4"></div>

						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-6">电&nbsp话</label>

							<div class="col-sm-9" >
								<input type="text" id="form-field-4"  placeholder="Tel-phone" class="col-xs-10 col-sm-5">
							</div>
						</div>

						<div class="clearfix form-actions" >
							<div class="col-md-offset-3 col-md-9">
								<button  style="width:87px;height:45px;color:#fff; background-color: green;" type="submit">
									<i class="icon-ok bigger-110" ></i>
									提交
								</button>

								&nbsp; &nbsp; &nbsp;
								<a href="/SignSystem2/public/index.php/home/schedule/count">
								<button class="btn" type="button">
									<i class="icon-undo bigger-110" ></i>
									退出
								</button>
								</a>			
							</div>
						</div>		
					</form>
					<div class="hr hr-18 dotted hr-double"></div>
				</div>
			</div>
		</div>
	</div>		


	

		
	

	


		<script type="text/javascript">
			if("ontouchend" in document) document.write("<script src='<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/js/jquery.mobile.custom.min.js'>"+"<"+"script>");
		</script>
		
		<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/js/typeahead-bs2.min.js"></script>

		

		<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/js/ace-elements.min.js"></script>
		<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/js/ace.min.js"></script>

<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/js/jquery-ui-1.10.3.full.min.js"></script>
	<script type="text/javascript">
	$(function(){
    		$("input[name='user_sex'][value='<?php echo $data['sex']; ?>']").attr('checked',true);
  		});
		function adduser(){
			var user_sex = $("input[name='user_sex']:checked").val();
			var number = {
				Username:$("#form-field-1").val(),
				group_id:$("#group_id").val(),
				User_sex:user_sex
			}
				$.ajax({
					type: 'POST', 
		         	url: '<?php echo \think\Config::get('parse_str.__MODULE__'); ?>/User/useradd', 
		          	data: number,  
		          	async: false,  
					cache: false, 
		          	success: function (returndata) {
		          		alert(returndata);
		          	},
		          	error:function(){
		          		alert("数据加载失败"); 
		          	},
				});
			}
	</script>

		</div>
		<div class="footer">
			<span>三月软件@版权所有</span>
		</div>
	</div>
	
</body>
</html>