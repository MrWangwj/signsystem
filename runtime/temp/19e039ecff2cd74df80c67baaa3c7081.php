<?php if (!defined('THINK_PATH')) exit(); /*a:1:{s:81:"D:\MyDrivers\htdocs\SignSystem2\public/../application/home\view\user\message.html";i:1476344172;}*/ ?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>角色列表</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<!-- basic styles -->
		<link href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/css/bootstrap.min.css" rel="stylesheet" />
		<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/css/font-awesome.min.css" />
		<link href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>style.min.css?v=4.1.0" rel="stylesheet">
		<!--[if IE 7]>
		  <link rel="stylesheet" href="assets/css/font-awesome-ie7.min.css" />
		<![endif]-->

		<!-- page specific plugin styles -->

		<!-- fonts -->

		<!-- ace styles -->

		<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/css/ace.min.css" />
		<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/css/ace-rtl.min.css" />
		<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/css/ace-skins.min.css" />
		<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/css/jquery-ui-1.10.3.full.min.css" />

		<!--[if lte IE 8]>
		  <link rel="stylesheet" href="assets/css/ace-ie.min.css" />
		<![endif]-->

		<!-- inline styles related to this page -->

		<!-- ace settings handler -->

		<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/js/ace-extra.min.js"></script>

		<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->

		<!--[if lt IE 9]>
		<script src="assets/js/html5shiv.js"></script>
		<script src="assets/js/respond.min.js"></script>
		<![endif]-->
</head>
<body class="gray-bg">
	<div>
		<div class="page-content">
			<div class="row" style="border:4px solid green;width: 800px;margin: auto;">
			<div style="margin-left:45%;"><h3>个人信息</h3></div>
				<div class="col-xs-12">
					<!-- PAGE CONTENT BEGINS -->

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
								<input type="text" id="form-field-0"  placeholder="UserID" class="col-xs-10 col-sm-5" required >
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 用户名 </label>

							<div class="col-sm-9">
								<input type="text" id="form-field-1"  placeholder="Username" class="col-xs-10 col-sm-5" required >
							</div>
						</div>

						<div class="space-4"></div>

						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-2"> 组&nbsp别 </label>
							
							<div class="col-sm-9">
								<input type="text"  id="form-field-2" placeholder="GroupID" class="col-xs-10 col-sm-5" required>	
							</div>
						</div>

						<div class="space-4"></div>

						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-4">性&nbsp别</label>
							<div class="col-sm-9" style="margin-top:3px;">
								<input name="user_sex" type="radio" id="sex-1"  value="0">
								<label for="sex-1">男</label>
									<input name="user_sex" type="radio" id="sex-2"  value="1">
									<label for="sex-2">女</label></br>
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
								<a href="">
								<button class="btn" type="button">
									<i class="icon-undo bigger-110" ></i>
									退出
								</button>
								</a>			
							</div>
						</div>		
					</form>
					<div class="hr hr-18 dotted hr-double"></div>
				</div><!-- /.col -->
			</div><!-- /.row -->
		</div><!-- /.page-content -->
	</div><!-- /.main-content -->			
<!-- basic scripts -->

		<!--[if !IE]> -->

		<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/js/jquery.min.js"></script>

		<!-- <![endif]-->

		<!--[if IE]>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<![endif]-->

		<!--[if !IE]> -->

		<script type="text/javascript">
			window.jQuery || document.write("<script src='<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/jsassets/js/jquery-2.0.3.min.js'>"+"<"+"script>");
		</script>

		<!-- <![endif]-->

		<!--[if IE]>
<script type="text/javascript">
 window.jQuery || document.write("<script src='assets/js/jquery-1.10.2.min.js'>"+"<"+"script>");
</script>
<![endif]-->

		<script type="text/javascript">
			if("ontouchend" in document) document.write("<script src='<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/js/jquery.mobile.custom.min.js'>"+"<"+"script>");
		</script>
		<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/js/bootstrap.min.js"></script>
		<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/js/typeahead-bs2.min.js"></script>

		<!-- page specific plugin scripts -->

		<!--[if lte IE 8]>
		  <script src="assets/js/excanvas.min.js"></script>
		<![endif]-->
		<!-- ace scripts -->

		<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/js/ace-elements.min.js"></script>
		<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/js/ace.min.js"></script>

		<!-- inline scripts related to this page -->
<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/js/jquery-ui-1.10.3.full.min.js"></script>
	<script type="text/javascript">
		function adduser(){
			alert("ksgsjdk");
			var number = {
				User_id:$("#form-field-0").val(),
				Username:$("#form-field-1").val(),
				group_id:$("#form-field-2").val(),
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
</body>		
</html>