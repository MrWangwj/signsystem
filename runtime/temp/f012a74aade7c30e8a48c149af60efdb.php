<?php if (!defined('THINK_PATH')) exit(); /*a:2:{s:77:"/var/www/html/SignSystem2/public/../application/home/view/schedule/count.html";i:1478325677;s:74:"/var/www/html/SignSystem2/public/../application/home/view/public/base.html";i:1478260979;}*/ ?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>三月软件小组签到系统</title>
	<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>css/bootstrap.min.css">
	<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>public-base.css">
	<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>js/jquery-3.0.0.min.js"></script>
	<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>js/bootstrap.min.js"></script>
	<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>js/layer/layer.js"></script>
	<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>js/public-base.js"></script>	
	
	<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>schedule-count.css">

</head>
<body>
	<div class="backgd">
		<div class="title">
			<nav>
				<label class="logo"> 
					
				</label>
				<div class="right-menu">
					<ul class="menu">
						<a href="<?php echo url('Homepage/index'); ?>"><li>首页</li></a>
						<a href="<?php echo url('Schedule/count'); ?>"><li>课表统计</li></a>
						<a href="<?php echo url('Schedule/index'); ?>"><li>查看课表</li></a>
						<a href="<?php echo url('attendance/test'); ?>"><li>本周考勤统计</li></a>
						
					</ul>
					<div class="exit">
						<a href="<?php echo url('Index/exitlogin'); ?>">退出</a>	
					</div>					
				</div>
			</nav>
		</div>
		<div class="main">
			
<div>
	<form action="<?php echo url('Schedule/count'); ?>" method="post" id="test">
		<div class="setup clearfix">
			<span>当前周：</span>
			<select class="form-control" name="week" id="weeks">
				<option value='0'>本周</option>
				<option value='1'>第1周</option>
				<option value='2'>第2周</option>
				<option value='3'>第3周</option>
				<option value='4'>第4周</option>
				<option value='5'>第5周</option>
				<option value='6'>第6周</option>
				<option value='7'>第7周</option>
				<option value='8'>第8周</option>
				<option value='9'>第9周</option>
				<option value='10'>第10周</option>
				<option value='11'>第11周</option>
				<option value='12'>第12周</option>
				<option value='13'>第13周</option>
				<option value='14'>第14周</option>
				<option value='15'>第15周</option>
				<option value='16'>第16周</option>
				<option value='17'>第17周</option>
				<option value='18'>第18周</option>
				<option value='19'>第19周</option>
				<option value='20'>第20周</option>
			</select>	
			<div class="seeStatus">
				<span>
					查看：
				</span>
				<select class="form-control" name="status" id="seestatus">
					<option value='1'>有课人员表</option>
					<option value='2'>无课人员表</option>
				</select>
			</div>			
		</div>	
		<ul class="term-input">
			<li>
				<label>选择组别:</label>
				<div id="term-group">
					<span data-id="0">全部</span>
					<?php if(is_array($group) || $group instanceof \think\Collection): $i = 0; $__LIST__ = $group;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($i % 2 );++$i;?>
						<span data-id="<?php echo $vo['group_id']; ?>"><?php echo $vo['group_name']; ?></span>
					<?php endforeach; endif; else: echo "" ;endif; ?>
				</div>
			</li>
			<li>
				<label>职务筛选:</label>
				<div id="term-post">
					<span data-id='0'>全部</span>
					<span data-id='1'>成员</span>
					<span data-id='2'>组长</span>
					<span data-id='3'>事物负责人</span>
				</div>
			</li>
			<li>
				<label>选择人员:</label>
				<div>
					<select class="form-control" id="term-personnel">
						<!-- <option value="0">全部</option> -->
		  				
					</select>
				</div>
			</li>
		</ul>

		<div class="term">
			<div class="term-result clearfix">
				<label for="">筛选条件：</label>
				<div class="term-label">
					<ul>
						<?php if(is_array($term) || $term instanceof \think\Collection): $i = 0; $__LIST__ = $term;if( count($__LIST__)==0 ) : echo "$empty" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($i % 2 );++$i;?>
							<li class='term-label2 <?php if($i ==$_POST['foucus']): ?>foucus<?php endif; ?>'>
								<?php if(is_array($vo) || $vo instanceof \think\Collection): $j = 0; $__LIST__ = $vo;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo2): $mod = ($j % 2 );++$j;?>
									<label>
										<input type='hidden' name='term[<?php echo $i-1; ?>][<?php echo $j-1; ?>][0]' value='<?php echo $vo2[0]; ?>'>
										<input type='hidden' name='term[<?php echo $i-1; ?>][<?php echo $j-1; ?>][1]' value='<?php echo $vo2[1]; ?>'>
										<input type='hidden' name='term[<?php echo $i-1; ?>][<?php echo $j-1; ?>][2]' value='<?php echo $vo2[2]; ?>'>
										<?php echo $vo2[2]; ?>
										<span class='term-close'>X</span>
									</label>						
								<?php endforeach; endif; else: echo "" ;endif; ?>
							</li>
						<?php endforeach; endif; else: echo "$empty" ;endif; ?>						
					</ul>
				</div>
				<input type="hidden" name="foucus" value="<?php echo (isset($_POST['foucus']) && ($_POST['foucus'] !== '')?$_POST['foucus']:1); ?>" id="term-foucus">
				<div class="term-but">
					<span id="addterm">+</span>
				</div>
			</div>
		</div>

	</form>

	<div class="table-responsive personnel">
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
							<td >
								<?php if(is_array($vo2) || $vo2 instanceof \think\Collection): $i = 0; $__LIST__ = $vo2;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo3): $mod = ($i % 2 );++$i;?>	
									<?php echo $vo3['name']; ?>,
								<?php endforeach; endif; else: echo "" ;endif; ?>							
							</td>
						<?php endforeach; endif; else: echo "" ;endif; ?>						
					</tr>
				<?php endforeach; endif; else: echo "" ;endif; ?>
 			</table>
	</div>
</div>
<script>
	$('.menu li:eq(1)').css('background','black');

	$('#seestatus').find("option[value=<?php echo (isset($_POST['status']) && ($_POST['status'] !== '')?$_POST['status']:1); ?>]").attr("selected",true);
	$('#weeks').find("option[value=<?php echo (isset($_POST['week']) && ($_POST['week'] !== '')?$_POST['week']:0); ?>]").attr("selected",true);
	$('#weeks').on('change', function(event) {
		$('#test').submit();
	});
	$('#seestatus').on('change', function(event) {
		$('#test').submit();
	});



	$('.term-label').on('click', '.term-label2', function(event) {
		if(!$(this).hasClass('foucus')){
			$('.term-label2').each(function(index, el) {
				if($(this).hasClass('foucus')){
					$(this).removeClass('foucus');
				}
			});
			$(this).addClass('foucus');
			$('#term-foucus').val($(this).index()+1);
			getUser();	
		}
	});

	/**
	 * 去除条件
	 * @param  {[type]} event) {		$(this).parent().remove();	} [description]
	 * @return {[type]}        [description]
	 */
	$('.term-label').on('click', '.term-close', function(event) {
		$(this).parent().remove();
		$('#test').submit();
	});

	$('#addterm').on('click', function(event) {
		var a =$('.term-label2:last-child').find("label");
		if(a.length != 0 ){
			$('.term-label2').each(function(index, el) {
				if($(this).hasClass('foucus')){
					$(this).removeClass('foucus');
				}
			});
			$('.term-label>ul').append("<li class='term-label2 foucus'></li>");
			$('#term-foucus').val($('.foucus').index()+1);	
			getUser();		
		}

	});

	$('#term-group').on('click', 'span', function(event) {
		var text = $(this).text();
		var val = $(this).data('id');
		clearTerm("group_id");
		if(val != 0)
			$('.foucus').append(getLabel(text, val, "group_id"));
			
		$('#test').submit();
	});
	$('#term-post').on('click', 'span', function(event) {
		var text = $(this).text();
		var val = $(this).data('id');
		clearTerm("position");		
		if(val != 0)
			$('.foucus').append(getLabel(text, val, "position"));
		$('#test').submit();
	});


	$('#term-personnel').on('change', function(event) {
		var text = $(this).find('option:selected').text();
		var val = $(this).val()
		if(val != 0){
			clearTerm("user_id");
			$('.foucus').append(getLabel(text, val, "user_id"));
			$('#test').submit();
		}
	});

    function getLabel(text, val, clum){
   		var labindex = $('.foucus').find('label:last-child').index();
		var foucusindex = $('.foucus').index();
		
		var datatext = "<input type='hidden' name='term["+foucusindex+"]["+(labindex+1)+"][0]' value='"+clum+"'><input type='hidden' name='term["+foucusindex+"]["+(labindex+1)+"][1]' value='"+val+"'><input type='hidden' name='term["+foucusindex+"]["+(labindex+1)+"][2]' value='"+text+"'>";
		var htmltext = "<label>"+datatext+text+"<span class='term-close'>X</span></label>";
		return htmltext;
    }
    function clearTerm(label){
		 $('.foucus>label').each(function(index, el) {
			if($(this).find('input:eq(0)').val() == label){
				$(this).remove();
			}
		});
	}
	getUser();
	function getUser(){
		var term = {};
		$('.foucus>label').each(function(index, el) {
			var val = $(this).find('input:eq(1)').val();
			if($(this).find('input:eq(0)').val() == 'position'){
				term.position = val; 
			}else if($(this).find('input:eq(0)').val() == 'group_id'){
				term.group_id = val;
			}else if($(this).find('input:eq(0)').val() == 'user_id'){
				term.user_id = val;
			}
		});

		$.get("<?php echo url('schedule/getTermUser'); ?>",term,function (data) {
			var html = "<option value='0'>全部</option>";
			if(data.length ==1 ) html = "";
			for (var i = 0; i < data.length; i++) {
				html += "<option value='"+data[i].user_id+"'>"+data[i].name+"</option>";
			}
			$('#term-personnel').html(html);
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