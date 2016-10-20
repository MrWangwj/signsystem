<?php if (!defined('THINK_PATH')) exit(); /*a:1:{s:76:"/var/www/html/SignSystem2/public/../application/admin/view/user/useradd.html";i:1476692609;}*/ ?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>审批列表</title>
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

		<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/css/ace-rtl.min.css" />
		<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/css/ace-skins.min.css" />
		<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/css/ace.min.css" />
		<link href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>style.min.css?v=4.1.0" rel="stylesheet">
		<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/css/ace-rtl.min.css" />
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
<body  class="gray-bg">
<div class="wrapper wrapper-content animated fadeInRight">
					<div class="page-content">
						<div class="page-header">
							<h1>
								分组管理
								<small>
									<i class="icon-double-angle-right"></i>
									审批信息
								</small>
							</h1>
						</div>
						<div class="row">
							<div class="col-xs-12">			
								<div class="row">
									<div class="col-xs-12">
										<div class="table-responsive">
											<table id="sample-table-1" class="table table-striped table-bordered table-hover">
												<thead>
													<tr>
														<th class="center">
															<label>
																
															</label>
														</th>
														<th>学  号</th>
														<th>用户名</th>
														<th>组  别</th>
														<th class="hidden-480">性  别</th>

														<th class="hidden-480">电话</th>

														<th></th>
													</tr>
												</thead>

												<tbody>
												<?php if(is_array($data) || $data instanceof \think\Collection): $i = 0; $__LIST__ = $data;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($i % 2 );++$i;?>
													<tr>	
														<td class="center">
															<label>
																<input type="checkbox" name="chkid" class="ace" value="" />
																<span class="lbl"></span>
															</label>
														</td>
														<td>
															<?php echo $vo['id']; ?>
														</td>
														<td>
															<?php echo $vo['name']; ?>
														</td>
														<td>
															开发一组
														</td>
														<td class="hidden-480">男</td>

														<td class="hidden-480">
															18738519352
														</td>
														
														<td>
															<div class="visible-md visible-lg hidden-sm hidden-xs btn-group">
															
																<button class="btn btn-xs btn-info  check" type="submit" value="<?php echo $vo['id']; ?>">
																	同意
																</button>
															
																<button class="btn btn-xs btn-danger refuse" value="<?php echo $vo['id']; ?>">
																	拒绝
																</button>
															</div>

															<div class="visible-xs visible-sm hidden-md hidden-lg">
																<div class="inline position-relative">
																	<button class="btn btn-minier btn-primary dropdown-toggle" data-toggle="dropdown">
																		<i class="icon-cog icon-only bigger-110"></i>
																	</button>

																	<ul class="dropdown-menu dropdown-only-icon dropdown-yellow pull-right dropdown-caret dropdown-close">
																		<li>
																			<a href="<?php echo \think\Config::get('parse_str.__MODULE__'); ?>/Manager/remanager/" class="tooltip-success" data-rel="tooltip" title="Edit" onclick="update();">
																				<span class="green">
																					<i class="icon-edit bigger-120"></i>
																				</span>
																			</a>
																		</li>

																		<li>
																			<a href="#" class="tooltip-error group_id" value="" data-rel="tooltip" title="Delete">
																				<span class="red">
																					<i class="icon-trash bigger-120"></i>
																				</span>
																			</a>
																		</li>
																	</ul>
																</div>
															</div>
														</td>
													</tr>
												<?php endforeach; endif; else: echo "" ;endif; ?>
												</tbody>
											</table>
										</div><!-- /.table-responsive -->
									</div><!-- /span -->
								</div><!-- /row -->
								<div style="float:right;">	
								

								</div>				
								<div class="cf" style="folat:right;width:100px;">
                               		 <input id="submit" class="btn btn-outline " type="button" value="同意">                              		 
                            	</div>
								
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
		<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/js/jquery.dataTables.min.js"></script>
		<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/js/jquery.dataTables.bootstrap.js"></script>
<script type="text/javascript">
	$(function(){
		if(<?php echo $info; ?>==0){
			$("#submit").css('display','none');
		}
	});
	$('.check').on('click',function(){
		var user_id = $(this).attr("value");
		$.ajax({
				type: 'POST', 
	         	url: '<?php echo \think\Config::get('parse_str.__MODULE__'); ?>/User/aduser', 
	          	data:  'id='+user_id,  
	          	async: false,  
				cache: false, 
	          	success: function (returndata) {
	          		alert(returndata);
	          		window.location.reload();
	          	},
	          	error:function(){
	          		alert("数据加载失败"); 
	          	},
			});
	});
	$('.refuse').on('click',function(){
		var user_id = $(this).attr("value");
		$.ajax({
				type: 'POST', 
	         	url: '<?php echo \think\Config::get('parse_str.__MODULE__'); ?>/User/refuse_user', 
	          	data:  'id='+user_id,  
	          	async: false,  
				cache: false, 
	          	success: function (returndata) {
	          		alert(returndata);
	          		window.location.reload();
	          	},
	          	error:function(){
	          		alert("数据加载失败"); 
	          	},
			});
	});
</script> 
</body>
</html>