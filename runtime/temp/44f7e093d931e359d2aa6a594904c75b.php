<?php if (!defined('THINK_PATH')) exit(); /*a:1:{s:81:"D:\MyDrivers\htdocs\SignSystem2\public/../application/admin\view\group\group.html";i:1478409512;}*/ ?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>角色列表</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<!-- basic styles -->
		<link href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/css/bootstrap.min.css" rel="stylesheet" />
		<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/css/font-awesome.min.css" />
		
		<!--[if IE 7]>
		  <link rel="stylesheet" href="assets/css/font-awesome-ie7.min.css" />
		<![endif]-->

		<!-- page specific plugin styles -->

		<!-- fonts -->

		<!-- ace styles -->
		<link href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>style.min.css?v=4.1.0" rel="stylesheet">
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
	<div class="wrapper wrapper-content animated fadeInRight">
					<div class="page-content">
					<div class="page-header">
							<h1>
								分组管理
								<small>
									<i class="icon-double-angle-right"></i>
									分组信息
								</small>
							</h1>
						</div>
						<div class="row">
							<div class="col-xs-12">
							<form role="form" method="post" action="javascript:addgroup();" type="float:left;">
							 	<label class="inline">添加组别</label>
							 	<input type="text" name="keyword" id="group" class="control" value="" class="form-control" required >
							 	<button type="submit" class="btn  btn-sm " style="border-radius:5px;margin-bottom:5px;" >添&nbsp;加</button>
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
														
														<td >
														<?php if(is_array($data) || $data instanceof \think\Collection): $i = 0; $__LIST__ = $data;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vi): $mod = ($i % 2 );++$i;if($vo['group_id'] == $vi['group_id']): ?><?php echo $vi['name']; ?>&nbsp<?php endif; endforeach; endif; else: echo "" ;endif; ?>	
														</td>
														
														<td style="width:150px;margin:auto;">
															<div class="visible-md visible-lg hidden-sm hidden-xs btn-group">
																<button class="btn btn-xs btn-info updgroup" type="submit"  value="<?php echo $vo['group_id']; ?>">
																	<i class="icon-edit bigger-120"></i>
																</button>

																<button class="btn btn-xs btn-danger deluser" type="submit"  value="<?php echo $vo['group_id']; ?>">
																	<i class="icon-trash bigger-120"></i>
																</button>
																<button class="btn btn-xs btn-info  changeuser" data-toggle="modal" data-target="#myModal" value="<?php echo $vo['group_id']; ?>">
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
																			<a href="#" class="tooltip-error deluser" data-rel="tooltip" title="Delete" value="<?php echo $vo['group_id']; ?>">
																				<span class="red">
																					<i class="icon-trash bigger-120"></i>
																				</span>
																			</a>
																		</li>

																		<li>
																			<a href="#" class="tooltip-error changeuser"  title="Delete" data-toggle="modal" data-target="#myModal" value="<?php echo $vo['group_id']; ?>">
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
				<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal" aria-hidden="true">
									&times;
								</button>
								<h4 class="modal-title" id="myModalLabel">
									更改分组
								</h4>
							</div>
							<div class="modal-body">
							
							</div>
							<div class="modal-footer">
								<button type="button" style="border-radius:5px;" class="btn " data-dismiss="modal">关闭
								</button>
								<button type="button"  style="border-radius:5px;" class="btn " value="" onclick="change();">
									修改
								</button>
							</div>
						</div><!-- /.modal-content -->
					</div><!-- /.modal -->
				</div>					
								<div class="cf" style="folat:right;width:100px;">
                               		 <input id="submit" class="btn " type="button" style="border-radius:5px;" value="删除"> 	 
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
		<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>js/layer/layer.js"></script>

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
          		 layer.msg(returndata,{time:1000},function(){
                  	window.location.reload();
                  });
          	},
          	error:function(){
          		layer.msg("数据加载失败"); 
          	},
		});
	}



$('.updgroup').on('click',function(){
	var group_id = $(this).attr("value");
	var operate_watch;
    layer.prompt({
        title:'输入修改后组名:',
        formtype:0,
        },function(res){
            operate_watch=res;
		var number = {
			group_name:operate_watch,
			id:group_id
		}
		$.ajax({
			type: 'POST', 
         	url: '<?php echo \think\Config::get('parse_str.__MODULE__'); ?>/Group/upgroup', 
          	data:  number,  
          	async: false,  
			cache: false, 
          	success: function (returndata) {
          		 layer.msg(returndata,{time:1000},function(){
                  	window.location.reload();
                  });
          	},
          	error:function(){
          		layer.msg("数据加载失败"); 
          	},
         });
	});	
});



$('.deluser').on('click',function(){
	var group_id = $(this).attr("value");
	layer.msg('你确定删除？', {
		  time: 0 //不自动关闭
		  ,btn: ['确定', '算了']
		  ,yes: function(index){
		    layer.close(index);
		   		$.ajax({
		          type: 'POST', 
		          url: '<?php echo \think\Config::get('parse_str.__MODULE__'); ?>/Group/delgroup', 
		          data:  'group_id='+group_id,  
		          async: false,  
		          cache: false, 
		            success: function (returndata) {
		                  layer.msg(returndata,{time:1000},function(){
		                  	window.location.reload();
		                  });
		                },
		            erro: function(){
		              layer.msg("数据加载失败"); 
		            },
		      	});
		  	}	
	});
});
$('.changeuser').on('click',function(){
	group_id = $(this).attr("value");
	$.ajax({
          type: 'POST', 
          url: '<?php echo \think\Config::get('parse_str.__MODULE__'); ?>/Group/change', 
          data:  'group_id='+group_id,  
          async: false,  
          cache: false, 
            success: function (returndata) {
                  var json = JSON.parse(returndata);
                  	var html='';
                  	for (var i = 0; i < json.length; i++) {
                  		html += '<button type="submit" style="border-radius:5px; margin-bottom:5px;" class="btn  btn-sm button" user_id='+json[i].user_id+'>'+json[i].name+'</button>&nbsp';
                  	}              
                  	$('.modal-body').html(html);
                  	$('.button').on('click',function(){
                  		$(this).toggleClass("btn-primary");
					});
                },
            erro: function(){
              layer.msg("数据加载失败"); 
            },
      	});
});

function change(){
	var user= $(".modal-body button.btn-primary");
	var user_id = "";
	user.each(function(){
		user_id += $(this).attr("user_id")+",";
	})
	var data = {
			user_id:user_id,
			group_id:group_id,
		}
	console.log(data);
	$.ajax({
          type: 'POST', 
          url: '<?php echo \think\Config::get('parse_str.__MODULE__'); ?>/Group/changeuser', 
          data:  data,  
          async: false,  
          cache: false, 
            success: function (returndata) {
                  layer.msg(returndata,{time:1000},function(){
                  	window.location.reload();
                  });
                },
            erro: function(){
              layer.msg("数据加载失败"); 
            },
      	});
}

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
		layer.msg('你确定删除？', {
		  time: 0 //不自动关闭
		  ,btn: ['确定', '算了']
		  ,yes: function(index){
		    layer.close(index);
		   		$.ajax({
		          type: 'POST', 
		          url: '<?php echo \think\Config::get('parse_str.__MODULE__'); ?>/Group/deletegroup', 
		          data:  datavalue,  
		          async: false,  
		          cache: false, 
		            success: function (returndata) {
		                   layer.msg(returndata,{time:1000},function(){
		                  	window.location.reload();
		                  });
		                },
		            erro: function(){
		              layer.msg("数据加载失败"); 
		            },
		      });
		  }
	});
});

</script>
</body>
</html>


 