<?php if (!defined('THINK_PATH')) exit(); /*a:1:{s:75:"/var/www/html/SignSystem2/public/../application/admin/view/user/member.html";i:1475225584;}*/ ?>
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

		<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/css/ace-rtl.min.css" />
		<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/css/ace-skins.min.css" />
		<!-- <link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/css/ace.min.css" /> -->.
		
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
<body  class="gray-bg">
<div class="wrapper wrapper-content animated fadeInRight">
					<div class="page-content">
						
						<div class="row">
							<div class="col-xs-12">
								<!-- PAGE CONTENT BEGINS -->
								<div class="row" style="margin:0 0 10px 0;">
									 <form class="form-inline" style="width:500px;float:left;" role="form" method="post" action="javascript:;">
									 	<a class="btn btn-outline btn-primary" href="/houtai/public/index.php/admin/Manager/manager">新增</a>
									 	<label class="inline">用户搜索</label>
									 	<select name="field" class="control" id="group1">
                                    		<?php if(is_array($info) || $info instanceof \think\Collection): $i = 0; $__LIST__ = $info;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($i % 2 );++$i;?>
												<option  value="<?php echo $vo['group_id']; ?>"><?php echo $vo['group_name']; ?></option>
                                    		<?php endforeach; endif; else: echo "" ;endif; ?>	
                                		</select>
                                		<input type="text" id="field" name="keyword" class="control" value="" class="form-control">
                                		<!-- <input type="text" id="keywords" name="keywords" /> -->
                                		<button type="submit"  class="btn btn-purple btn-sm" onclick="search();" />
                                		<i class="icon-search icon-on-right bigger-110"></i>
											Search
										</button>
										</form>
									<form role="form" method="post" action="javascript:addgroup();" >
									 	<label class="inline">添加组别</label>
									 	<input type="text" name="keyword" id="group" class="control" value="" class="form-control" required >
									 	<button type="submit" class="btn btn-info">添加</button>
									</form>
								</div>
								<div class="row">
									<div class="col-xs-12">
										<div class="table-responsive">
											<table id="sample-table-1" class="table table-striped table-bordered table-hover">
												<thead>
													<tr>
														<th class="center">
															<label>
																<!-- <input type="checkbox"  class="ace" />
																<span class="lbl"></span> -->
															</label>
														</th>
														<th>用户名</th>
														<th>组  别</th>
														<th class="hidden-480">性  别</th>

														<th>
															<i class="icon-time bigger-110 hidden-480"></i>
															进入时间
														</th>
														<th class="hidden-480">电话</th>

														<th></th>
													</tr>
												</thead>

												<tbody>
													<?php if(is_array($data) || $data instanceof \think\Collection): $i = 0; $__LIST__ = $data;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($i % 2 );++$i;?>
													<tr>	
														<td class="center">
															<label>
																<input type="checkbox" name="chkid" class="ace" value="<?php echo $vo['user_id']; ?>" />
																<span class="lbl"></span>
															</label>
														</td>
														
														<td>
															<a href="#"><?php echo $vo['name']; ?></a>
														</td>
														<td><?php if(is_array($merit) || $merit instanceof \think\Collection): $i = 0; $__LIST__ = $merit;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vi): $mod = ($i % 2 );++$i;if($vi['user_id'] == $vo['user_id']): if(is_array($info) || $info instanceof \think\Collection): $i = 0; $__LIST__ = $info;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$v): $mod = ($i % 2 );++$i;if($v['group_id'] == $vi['group_id']): ?><?php echo $v['group_name']; endif; endforeach; endif; else: echo "" ;endif; endif; endforeach; endif; else: echo "" ;endif; ?></td>
														<td class="hidden-480">男</td>
														<td>2015-10-10</td>

														<td class="hidden-480">
															<!-- <span class="label label-sm label-warning">Expiring</span> -->
															18738519352
														</td>
														
														<td>
															<div class="visible-md visible-lg hidden-sm hidden-xs btn-group">
															
																<button class="btn btn-xs btn-info" type="submit" onclick="update();">
																	<a href="<?php echo url('Manager/remanager',['user_id' => $vo['user_id']],''); ?>"><i class="icon-edit bigger-120"></i></a>
																</button>
															
																<button class="btn btn-xs btn-danger group_id" value="<?php echo $vo['user_id']; ?>">
																	<i class="icon-trash bigger-120"></i>
																</button>
															</div>

															<div class="visible-xs visible-sm hidden-md hidden-lg">
																<div class="inline position-relative">
																	<button class="btn btn-minier btn-primary dropdown-toggle" data-toggle="dropdown">
																		<i class="icon-cog icon-only bigger-110"></i>
																	</button>

																	<ul class="dropdown-menu dropdown-only-icon dropdown-yellow pull-right dropdown-caret dropdown-close">
																		<li>
																			<a href="#" class="tooltip-success" data-rel="tooltip" title="Edit">
																				<span class="green">
																					<i class="icon-edit bigger-120"></i>
																				</span>
																			</a>
																		</li>

																		<li>
																			<a href="#" class="tooltip-error" data-rel="tooltip" title="Delete">
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
								<div style="float:right;margin-top:-25px;"><ul><?php echo $data->render(); ?></ul></div>	
								</div>				
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
		alert(group);
		$.ajax({
			type: 'POST', 
         	url: '<?php echo \think\Config::get('parse_str.__MODULE__'); ?>/User/group', 
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
	$("#submit").on('click',function(){
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
       if(confirm("确定删除吗？")){  
	        $.ajax({
	        	type:'POST',
	        	url: '<?php echo \think\Config::get('parse_str.__MODULE__'); ?>/User/deletes', 
	          	data:  datavalue, 
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
	function update($id){
		window.location.href ='<?php echo \think\Config::get('parse_str.__MODULE__'); ?>/Manager/remanager/user_id='+$id;
	}
	$('.group_id').on('click',function(){
		var id = $(this).attr("value");
		if(confirm("确定删除吗？")){  
			$.ajax({
				type: 'POST', 
	         	url: '<?php echo \think\Config::get('parse_str.__MODULE__'); ?>/User/delete', 
	          	data:  'id='+id,  
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
	//查询
	function search(){
	   if(!($.trim(field)=='')||$("#group1").val()!=''){
			var number = {
				group_id:$("#group1").val(),
				name: $('#field').val()
			}
			alert($("#group1").val());
			$.ajax({
				type: 'POST', 
	         	url: '<?php echo \think\Config::get('parse_str.__MODULE__'); ?>/User/member', 
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
	}
</script> 
</body>
</html>