<?php if (!defined('THINK_PATH')) exit(); /*a:1:{s:84:"D:\MyDrivers\htdocs\SignSystem2\public/../application/admin\view\manager\notice.html";i:1478317869;}*/ ?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>公告</title>
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

		<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>assets/css/ace.min.css" />
		<link href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>style.min.css?v=4.1.0" rel="stylesheet">
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
	<div class="wrapper wrapper-content animated fadeInRight">
		<div class="page-content">
			<div class="page-header">
				<h1>
					分组管理
					<small>
						<i class="icon-double-angle-right"></i>
						发布公告
					</small>
				</h1>
			</div>
			<div class="row">
				<div class="col-xs-12">
					<!-- PAGE CONTENT BEGINS -->
					<div class="table-responsive">
								<table id="sample-table-1" class="table table-striped table-bordered table-hover">
									<thead>
										<tr>
											<th class="center">
												<label>
													
												</label>
											</th>
											<th>管理员姓名</th>
											<th>公告标题</th>
											<th class="hidden-480">发布时间</th>
											<th></th>
										</tr>
									</thead>

									<tbody>
										<?php if(is_array($data) || $data instanceof \think\Collection): $i = 0; $__LIST__ = $data;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($i % 2 );++$i;?>
										<tr>	
											<td class="center" style="width:100px;">
												<label>
													<input type="checkbox" name="chkid" class="ace" value="<?php echo $vo['notice_id']; ?>" />
													<span class="lbl"></span>
												</label>
											</td>
											
											<td style="width:150px;">
												<a href="#"><?php echo $vo['name']; ?></a>
											</td>
											<td><?php echo $vo['notice_title']; ?></td>
											<td style="width:150px;"><?php echo date('Y-m-d H:i:s',$vo['create_time']); ?></td>														
											<td style="width:150px;">
												<div class="visible-md visible-lg hidden-sm hidden-xs btn-group">
												
													<button class="btn btn-xs btn-info" type="submit" onclick="update();">
														<a href="<?php echo \think\Config::get('parse_str.__MODULE__'); ?>/Manager/renotice/<?php echo $vo['notice_id']; ?>"><i class="icon-edit bigger-120"></i></a>
													</button>
												
													<button class="btn btn-xs btn-danger group_id" value="<?php echo $vo['notice_id']; ?>">
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
					<div class="cf" style="margin-bottom:40px;">
                   		 <input id="submit" class="btn " type="button" value="删除"> 	 
                	</div>
					<form class="form-horizontal" role="form" method="post" action="javascript:alter();">
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1" style="width:100px;"> 公告标题 </label>

							<div class="col-sm-9">
								<input type="text" id="form-field-1"  placeholder="title" class="col-xs-10 col-sm-5" required value="" >
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1" style="width:100px;"> 公告内容 </label>

							<div class="col-sm-9" >
								<textarea name="editor"  id="editor" style="height:300px;"></textarea>
							</div>
						</div>		
						<div class="clearfix form-actions">
							<div class="col-md-offset-3 col-md-9" style="margin-left:4%;">
								<button class="btn " type="submit" id="user" value="">
									<i class="icon-ok bigger-110"></i>
									提交
								</button>
								<a  href="/SignSystem2/public/index.php/admin/user/member">
								<button class="btn "  type="button">
									<i class="icon-undo bigger-110"></i> 
									放弃		
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
		//发表公告
		 function alter(){
		 	var content=UE.getEditor('editor').getContent();
		 	if(content == ""){
		 		return;
		 	}
		 	var number = {
		 		notice_title:$("#form-field-1").val(),
		 		notice:content,
		 	}
			$.ajax({
				type: 'POST', 
		     	url: '<?php echo \think\Config::get('parse_str.__MODULE__'); ?>/Manager/addnotice', 
		      	data: number,  
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
		 };
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
	        	url: '<?php echo \think\Config::get('parse_str.__MODULE__'); ?>/Manager/deletes_notice', 
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
		$('.group_id').on('click',function(){
		var id = $(this).attr("value");
		if(confirm("确定删除吗？")){ 
			$.ajax({
				type: 'POST', 
	         	url: '<?php echo \think\Config::get('parse_str.__MODULE__'); ?>/Manager/delete_notice', 
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
		function update($notice_id){
			window.location.href='<?php echo \think\Config::get('parse_str.__MODULE__'); ?>/Manager/renotice/notice_id='+$notice_id;
		}
	</script>
</body>
</html>