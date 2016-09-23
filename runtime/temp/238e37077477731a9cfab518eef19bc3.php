<?php if (!defined('THINK_PATH')) exit(); /*a:1:{s:67:"/var/www/html/SignSystem2/application/home/view/schedule/index.html";i:1474554073;}*/ ?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>css/bootstrap.min.css">
	<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>js/jquery-3.0.0.min.js"></script>
	<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>js/bootstrap.min.js"></script>
</head>
<style >
	.main{
		width: 1024px;
		margin: 0 auto;
	}
	.curriculum{
		width: 800px;
		margin: 0 auto;
	}
	.main table td{
		background: #91D447;
		color: white;
		height: 100px;
		cursor: pointer;
	}
	.main table th{
		text-align: center;
	}
</style>
<body>
	<div class="main">
		<div>
			<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">编辑课表</button>
		</div>
		<div class="table-responsive curriculum">
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
				<tr>
					<td>
						<div>
							<span>大学物理</span>
							<br/>
							<span>@6205</span>
						</div>
					</td>
					<td>
						<div>
							<span>大学物理</span>
							<br/>
							<span>@6205</span>
						</div>
					</td>
					<td>
						<div>
							<span>大学物理</span>
							<br/>
							<span>@6205</span>
						</div>
					</td>
					<td>
						<div>
							<span>大学物理</span>
							<br/>
							<span>@6205</span>
						</div>
					</td>
					<td>
						<div>
							<span>大学物理</span>
							<br/>
							<span>@6205</span>
						</div>
					</td>
					<td>
						<div>
							<span>大学物理</span>
							<br/>
							<span>@6205</span>
						</div>
					</td>
					<td>
						<div>
							<span>大学物理</span>
							<br/>
							<span>@6205</span>
						</div>
					</td>
				</tr>   			
  			</table>
		</div>
		<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  			<div class="modal-dialog">
    			<div class="modal-content">
      				<div class="modal-header">
        				<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        				<h4 class="modal-title" id="myModalLabel">编辑课表</h4>
      				</div>
      				<div class="modal-body">
        				<form action="">
        					
        				</form>
      				</div>
      				<div class="modal-footer">
        				<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
        				<button type="button" class="btn btn-primary">提交</button>
      				</div>
    			</div>
  			</div>
		</div>
	</div>

	<script>
		
	</script>
</body>
</html>