<?php if (!defined('THINK_PATH')) exit(); /*a:1:{s:81:"D:\MyDrivers\htdocs\SignSystem2\public/../application/admin\view\group\group.html";i:1476022694;}*/ ?>
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
		<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/css/ace.min.css" />
		<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/css/ace-rtl.min.css" />
		<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/css/ace-skins.min.css" />

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
							<form role="form" method="post" action="javascript:addgroup();" type="float:left;">
							 	<label class="inline">添加组别</label>
							 	<input type="text" name="keyword" id="group" class="control" value="" class="form-control" required >
							 	<button type="submit" class="btn btn-info">添加</button>
							</form>
								<div class="row">
									<div class="col-xs-12">
										<div class="table-responsive">
											<table id="sample-table-1" class="table table-striped table-bordered table-hover">
												<thead>
													<tr>
														<th class="center">
															<label>
																<input type="checkbox" class="ace" />
																<span class="lbl"></span>
															</label>
														</th>
														<th>分组</th>
														<th>人员</th>
														<th></th>
													</tr>
												</thead>

												<tbody>
												<?php if(is_array($info) || $info instanceof \think\Collection): if( count($info)==0 ) : echo "" ;else: foreach($info as $key=>$vo): ?>
												 
													<tr>
														<td class="center" style="width:50px;">
															<label>
																<input type="checkbox" name="chkid" class="ace" value="<?php echo $vo['group_id']; ?>" />
																<span class="lbl"></span>
															</label>
														</td>

														<td style="width:200px;">
															<a   href="#"><?php echo $vo['group_name']; ?></a>
														</td>
														
														<td>
														<?php if(is_array($data) || $data instanceof \think\Collection): $i = 0; $__LIST__ = $data;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vi): $mod = ($i % 2 );++$i;if($vo['group_id'] == $vi['group_id']): ?><?php echo $vi['name']; ?>&nbsp<?php endif; endforeach; endif; else: echo "" ;endif; ?>	
														</td>
														
														<td style="width:150px;">
															<div class="visible-md visible-lg hidden-sm hidden-xs btn-group">
																<button class="btn btn-xs btn-info updgroup" type="submit"  value="<?php echo $vo['group_id']; ?>">
																	<i class="icon-edit bigger-120"></i>
																</button>

																<button class="btn btn-xs btn-danger delgroup" type="submit" value="<?php echo $vo['group_id']; ?>">
																	<i class="icon-trash bigger-120"></i>
																</button>
																<button class="btn btn-xs btn-info " value="">
																	<i class="icon-zoom-in bigger-130"></i>
																</button>
															</div>

															<div class="visible-xs visible-sm hidden-md hidden-lg">
																<div class="inline position-relative">
																	<button class="btn btn-minier btn-primary dropdown-toggle " data-toggle="dropdown">
																		<i class="icon-cog icon-only bigger-110"></i>
																	</button>

																	<ul class="dropdown-menu dropdown-only-icon dropdown-yellow pull-right dropdown-caret dropdown-close">
																		<li>
																			<a href="#" class="tooltip-success updgroup" data-rel="tooltip" title="Edit" value="<?php echo $vo['group_id']; ?>">
																				<span class="green">
																					<i class="icon-edit bigger-120"></i>
																				</span>
																			</a>
																		</li>

																		<li>
																			<a href="#" class="tooltip-error delgroup" data-rel="tooltip" title="Delete" value="<?php echo $vo['group_id']; ?>">
																				<span class="red">
																					<i class="icon-trash bigger-120"></i>
																				</span>
																			</a>
																		</li>

																		<li>
																			<a href="#" class="tooltip-error delgroup" data-rel="tooltip" title="Delete" value="<?php echo $vo['group_id']; ?>">
																				<span class="red">
																					<i class="icon-zoom-in bigger-130"></i>
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
								<div class="cf" style="folat:right;width:100px;">
                               		 <input id="submit" class="btn btn-outline btn-primary" type="button" value="删除">                              		 
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
function addgroup(){
		var group = $("#group").val();
		$.ajax({
			type: 'POST', 
         	url: '<?php echo \think\Config::get('parse_str.__MODULE__'); ?>/Group/groupadd', 
          	data:  'group='+group,  
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
	}
$('.updgroup').on('click',function(){
	var group_name = prompt("组名:", ""); //将输入的内容赋给变量 name ，
	if(group_name){
		var group_id = $(this).attr("value");
		var number = {
			group_name:group_name,
			id:group_id
		}
		$.ajax({
			type: 'POST', 
         	url: '<?php echo \think\Config::get('parse_str.__MODULE__'); ?>/Group/upgroup', 
          	data:  number,  
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
	}	
});
//删除
$('#submit').on('click',function(){
	 var chks = $("input:checked");
        var data = [];
        for (var i = 0;i< chks.length;i++){
          var checkbox = chks[i];
          if(checkbox.name ==="chkid" && checkbox.type==="checkbox" && checkbox.checked === true){
            data.push(checkbox.value);
          }
        }
        var str = data.toString();
        var datavalue = {
          invalue:str,
        }
        alert(str);
	if(confirm("确定删除吗？")){  
     
      	$.ajax({
          type: 'POST', 
          url: '<?php echo \think\Config::get('parse_str.__MODULE__'); ?>/Group/deletegroup', 
          data:  datavalue,  
          async: false,  
          cache: false, 
            success: function (returndata) {
                  alert(returndata);
                  window.location.reload();
                },
            erro: function(){
              alert("数据加载失败"); 
            },
      	});
    }
});
</script>
</body>
</html>