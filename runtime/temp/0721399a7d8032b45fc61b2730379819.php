<?php if (!defined('THINK_PATH')) exit(); /*a:1:{s:86:"D:\MyDrivers\htdocs\SignSystem2\public/../application/admin\view\manager\renotice.html";i:1476371744;}*/ ?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>公告</title>
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
		<script type="text/javascript" charset="utf-8" src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>editor/ueditor.config.js"></script>
		<script type="text/javascript" charset="utf-8" src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>editor/ueditor.all.min.js"></script>
		<script type="text/javascript" charset="gbk" src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>editor/lang/zh-cn/zh-cn.js"></script>

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
			<div class="row">
				<div class="col-xs-12">
				<form action="javascript:alter();" class="form-horizontal" role="form" method="post">
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1" style="width:100px;"> 公告标题 </label>

							<div class="col-sm-9">
								<input type="text" id="form-field-1"  placeholder="Username" class="col-xs-10 col-sm-5" required value="<?php echo $data['notice_title']; ?>" >
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1" style="width:100px;"> 公告内容 </label>

							<div class="col-sm-9" >
								<textarea name="editor"  id="editor" style="height:300px;"><?php echo $data['notice']; ?></textarea>
							</div>
						</div>		
						<div class="clearfix form-actions">
							<div class="col-md-offset-3 col-md-9" >
								<button class="btn btn-info" type="button" id="notice" value="<?php echo $data['notice_id']; ?>">
									<i class="icon-ok bigger-110"></i>
									Submit
								</button>
								<a  href="/SignSystem2/public/index.php/admin/Manager/notice">
								<button class="btn "  type="button">
									<i class="icon-undo bigger-110"></i> 
									Reset		
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
		<script type="text/javascript"> var ue = UE.getEditor('editor')</script>
		<script type="text/javascript">
		 $("#notice").on('click',function(){
		 	var content = UE.getEditor('editor').getContent();
			 	if(content == ""){
			 		return;
			 	}
			 	var number = {
			 		id:$("#notice").val(),
			 		notice:content
				}
				$.ajax({
					type: 'POST', 
			     	url: '<?php echo \think\Config::get('parse_str.__MODULE__'); ?>/Manager/updatenotice', 
			      	data: number,  
			      	async: false,  
					cache: false, 
			      	success: function (returndata) {
			      		alert(returndata);
			      		window.location.href = '/SignSystem2/public/index.php/admin/Manager/notice';
			      	},
			      	error:function(){
			      		alert("数据加载失败"); 
			      	},
				});
			});
		</script>
</body>
</html>