<?php if (!defined('THINK_PATH')) exit(); /*a:1:{s:77:"/var/www/html/SignSystem2/public/../application/home/view/schedule/index.html";i:1475717030;}*/ ?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>css/bootstrap.min.css">
	<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>js/jquery-3.0.0.min.js"></script>
	<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>js/bootstrap.min.js"></script>
	<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>js/layer/layer.js"></script>
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
	.schedule td{
		background: #91D447;
		color: white;
		height: 100px;
		cursor: pointer;
		width: 14.4%
	}
	.schedule th{
		text-align: center;
	}
	.color{
		background: #B0AEB2 !important ;
	}
	.week td{
		width: 35px;
		height: 35px;
		text-align: center;
		cursor: pointer;
		border: 1px solid #ddd;
	}
	.haveClass{
		background-color: #d9edf7;
	}
	.hint{
		position: absolute;
		z-index: 10;
		width: 94%;
		height: 200px;
		overflow: overlay;
		display: none;
	}
	.hint div div{
		float: left;
		font-size: 12px;
	}
	.hint button{
		float: right;
	}


</style>

<body>
	<div class="main">
		<div>
			<select class="form-control">
				<option>本周</option>
				<option>第1周</option>
				<option>第2周</option>
				<option>第3周</option>
				<option>第4周</option>
				<option>第5周</option>
				<option>第6周</option>
				<option>第7周</option>
				<option>第8周</option>
				<option>第9周</option>
				<option>第10周</option>
				<option>第11周</option>
				<option>第12周</option>
				<option>第13周</option>
				<option>第14周</option>
				<option>第15周</option>
				<option>第16周</option>
				<option>第17周</option>
				<option>第18周</option>
				<option>第19周</option>
				<option>第20周</option>
			</select>
		</div>
		<div class="table-responsive curriculum">
  			<table class="table table-bordered schedule">
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
		<div class="modal fade " id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  			<div class="modal-dialog">
    			<div class="modal-content">
      				<div class="modal-header">
        				<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        				<h4 class="modal-title" id="myModalLabel">查看课表</h4>
      				</div>
      				<div class="modal-body">
        				<form action="" class="form-horizontal" role="form">
        					<div class="form-group">
    							<label for="" class="col-sm-2 control-label">名称</label>
    							<div class="col-sm-10 test">
      								<input type="text" class="form-control" id="name" placeholder="未填写">
									<div class="list-group hint">
											
									</div>
    							</div>
  							</div>
  							<div class="form-group">
    							<label for="" class="col-sm-2 control-label">地点</label>
    							<div class="col-sm-10">
      								<input type="text" class="form-control" id="classroom" placeholder="未填写">
    							</div>
  							</div>
  							<div class="form-group">
    							<label for="" class="col-sm-2 control-label">老师</label>
    							<div class="col-sm-10">
      								<input type="text" class="form-control" id="teacher" placeholder="未填写">
    							</div>
  							</div>
  							<div class="form-group">
    							<label for="" class="col-sm-2 control-label">节数</label>
    							<div class="col-sm-10">
      								<select class="form-control" style="width:40%;float:left;margin-right: 50px;" id="week"  disabled="disabled">
									
									</select>
      								<select class="form-control" style="width:40%;float:left;" id="section"  disabled="disabled">
	
									</select>
    							</div>
  							</div>
  							<div class="form-group">
    							<label for="" class="col-sm-2 control-label">周数</label>
    							<div class="col-sm-10">
									<label class="radio-inline">
										<input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1"> 单周
									</label>
									<label class="radio-inline">
										<input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2"> 双周
									</label>
									<label class="radio-inline">
										<input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3"> 全部
									</label>
									<label class="radio-inline">
										<input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option4"> 其他
									</label>
									<table class="table-bordered week">

									</table>
    							</div>		
							</div>

        				</form>
      				</div>
      				<div class="modal-footer">
        				<button type="button" class="btn btn-primary" id="save" >保存</button>
        				<button type="button" class="btn btn-warning" id="nothing">无课</button>
        				<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
      				</div>
    			</div>
  			</div>
		</div>
	</div>
	<script>
		/**
		 * 表格的单机事件
		 */
		var section = 0;
		var week = 0;
		$('.course').on('click', function() {
			section = $(this).parent().index();
			week = $(this).index()+1;
			$.get(
				"<?php echo url('Schedule/schedule'); ?>",
				{
					week: week,
					section: section,
				},
				function(data){
					$('.hint').html('');
					$('#name').val(data.name);
					$('#classroom').val(data.classroom);
					$('#teacher').val(data.teacher);
					$('#week').html(getWeek(week));
					$('#section').html(getSection(section));
					$('.week').html(getWeeks(data.weeks_number));
				}
			);
		});
		/**
		 * 单选按钮的单击事件
		 * @param  {String} event) {			var      weeks [description]
		 * @return {[type]}        [description]
		 */
		$('input[type="radio"]').on('click', function(event) {
			var weeks = "";
			if($(this).val() == "option1"){
				weeks = "1,3,5,7,9,11,13,15,17,19";
			}else if($(this).val() == "option2"){
				weeks = "2,4,6,8,10,12,14,16,18,20";
			}else if($(this).val() == "option3"){
				weeks = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20";
			}else{
				weeks = "0";
			}
			$('.week').html(getWeeks(weeks));		
		});

		$('.week').on('click', 'td', function(event) {
			if($(this).hasClass('haveClass')){
				$(this).removeClass('haveClass');
			}else{
				$(this).addClass('haveClass');
			}
		});


		$('#save').on('click', function(event) {
			var id = $(this).data('id');
			$.post(
				"<?php echo url('Schedule/save'); ?>",
				{	
					name: $('#name').val(),
					classroom: $('#classroom').val(),
					teacher: $('#teacher').val(),
					week: week,
					section: section,
					weeks_number: Weeks(),
				},
				function(data){
					if(data.code == 0){
						layer.msg(data.msg, {icon: 2});
					}else{
						$('#myModal').modal('hide');
						var icon = 1;
						if(data.code != 2){
							icon = 2;
						}
						layer.msg(data.msg, {icon: icon}, function(){
							window.location.reload();
						});						
					}	
							
				}
			);
		});

		$('#nothing').on('click', function(event) {
    		layer.confirm('选择无课将删除当前课程，确定要这样做吗？', {
  				btn: ['确定','取消'], //按钮
  				icon : 0,
			}, function(){
  				$.post(
  					"<?php echo url('Schedule:nothing'); ?>", 
  					{
  						week:week,
  						section:section,
  					}, function(data, textStatus, xhr){
  						$('#myModal').modal('hide');
  						layer.msg(data.msg, {icon: data.code}, function(){
  							window.location.reload();
  						});
  					}
  				);
			});
		});

		$('#name').on('keyup', function(event) {
			$('.hint').show();
			var name = $(this).val();
			$.get("<?php echo url('Schedule:curriculum'); ?>", {
				name: name,
				week: week,
				section: section,
			}, function(data) {
				$('.hint').html(getHint(data));
			});

		});

		$('.test').on('blur', function(event) {
			$('.hint').hide();
		});

		$('.hint').on('click', '.addschedu', function(event) {
			var id = $(this).data('id');
			$.get(
				"<?php echo url('Schedule/schedule'); ?>",
				{
					id: id,
				},
				function(data){
					alert(data.id);
				}
			);
		});


		/**
		 * 获得当前课程是周几
		 * @param  {[type]} week 课程周
		 * @return {[type]}      [description]
		 */
		function getWeek(week){
			var weektext = "";
			var term = "";
			var weeks = ["星期一","星期二","星期三","星期四","星期五","星期六","星期日"];
			for (var i = 1; i <= 7; i++) {
				if(i != week){
					term = "";
				}else{
					term = "selected='selected'";
				}
				weektext += "<option value='"+i+"' "+term+">"+weeks[i-1]+"</option>";
			}
			return weektext;
		}

		/**
		 * 获得当前课程是第几节
		 * @param  {[type]} section 节数id
		 * 
		 * @return {[type]}         [description]
		 */
		function getSection(section){
			var sectiontext = "";
			var term = "";
			var sections = ["1节 ~ 2节","3节 ~ 4节","5节 ~ 6节","7节 ~ 8节","9节 ~ 10节"];
			for (var i = 1; i <= 5; i++) {
				if(i != section){
					term = "";
				}else{
					term = "selected='selected'";
				}	
				sectiontext += "<option value='"+i+"' "+term+">"+sections[i-1]+"</option>";			
			}
			return sectiontext;
		}
		/**
		 * 得到课程的上课周
		 * @param  {[type]} weeks [description]
		 * @return {[type]}       [description]
		 */
		function getWeeks(weeks){
			var term = "";
			var weekstext = "<tr>";
			var weeksarray = weeks.split(",");
			for (var i = 1; i <= 20; i++) {
				for (var j = 0; j <= weeksarray.length; j++) {
					if(weeksarray[j] == i){
						term = "class='haveClass";
						break;
					}
				}
				weekstext +="<td "+term+" data-index='"+i+"'>"+i+"</td>";
				term = "";
				if(i%5 == 0){
					weekstext +="</tr><tr>";
				}
			}
			weekstext += "</tr>";
			return weekstext;
		}

		/**
		 * 得到选择课程的周数
		 */
		function Weeks(){
			var weeks = "";
			var length = $('.haveClass').length;
			$('.haveClass').each(function(index, el) {
				weeks += $(this).text();
				if(index != length-1)
					weeks += ",";
			});
			return weeks;			
		}

		function getHint(data){
			var html  = '';
			for (var i = 0; i < data.length; i++) {
				html += '<div class="list-group-item clearfix">';
				html += '<h5>'+data[i].name+'</h5>';
				html += '<div>';
				html += '<span>老师: '+data[i].teacher+'</span><br/>';
				html += '<span>教室: '+data[i].classroom+'</span><br/>';
				html += '<span>时间: '+data[i].weeks_number+'</span>';
				html += '</div>';
				html += '<button type="button" class="btn btn-success addschedu" data-id="'+data[i].id+'">＋添加到课表</button>';
				html += '</div>';
			}
			return html;																	
		}
	</script>
</body>
</html>