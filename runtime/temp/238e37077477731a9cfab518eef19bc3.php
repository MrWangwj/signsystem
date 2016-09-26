<?php if (!defined('THINK_PATH')) exit(); /*a:1:{s:67:"/var/www/html/SignSystem2/application/home/view/schedule/index.html";i:1474878931;}*/ ?>
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
	.color{
		background: #A6A6A6 !important ;
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
				<?php if(is_array($data) || $data instanceof \think\Collection): $i = 0; $__LIST__ = $data;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($i % 2 );++$i;?>
					<tr>
						<?php if(is_array($vo) || $vo instanceof \think\Collection): $i = 0; $__LIST__ = $vo;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo2): $mod = ($i % 2 );++$i;?>
							<td class='<?php if($vo2['whether_course'] == '0'): ?>color<?php endif; ?> course' data-toggle="modal" data-target="#myModal" data-id=<?php echo $vo2['id']; ?>>
								<div >
									<span><?php echo $vo2['name']; ?></span>
									<br/>
									<span><?php echo $vo2['classroom']; ?></span>
								</div>								
							</td>
						<?php endforeach; endif; else: echo "" ;endif; ?>						
					</tr>
				<?php endforeach; endif; else: echo "" ;endif; ?>
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
		$('.course').on('click', function() {
			$.get(
				"<?php echo url('Schedule/schedule'); ?>",
				{
					id:$(this).data('id'),
				},
				function(data){
					alert(data);	
				}
			);
		});
	</script>
</body>
</html>