<?php if (!defined('THINK_PATH')) exit(); /*a:1:{s:67:"/var/www/html/SignSystem2/application/home/view/schedule/index.html";i:1475069659;}*/ ?>
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
	.schedule td{
		background: #91D447;
		color: white;
		height: 100px;
		cursor: pointer;
	}
	.schedule th{
		text-align: center;
	}
	.color{
		background: #A6A6A6 !important ;
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
</style>

<body>
	<div class="main">
		<div>
			<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">编辑课表</button>
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
    							<div class="col-sm-10">
      								<input type="text" class="form-control" id="name" placeholder="未填写">
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
      							<select class="form-control" style="width:40%;float: left;margin-right: 50px;" id="week">
									
									</select>
      							<select class="form-control" style="width:40%;float:left;" id="section">
	
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
										<input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option4" checked> 其他
									</label>
									<table class="table-bordered week">

									</table>
    							</div>		
							</div>
        				</form>
      				</div>
      				<div class="modal-footer">
        				<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
        				<button type="button" class="btn btn-default" data-dismiss="modal">无课</button>
        				<button type="button" class="btn btn-primary" id="save">保存</button>
      				</div>
    			</div>
  			</div>
		</div>
	</div>

	<script>
		/**
		 * 表格的单机事件
		 */
		$('.course').on('click', function() {
			var section = $(this).parent().index();
			var week = $(this).index()+1;
			$.get(
				"<?php echo url('Schedule/schedule'); ?>",
				{
					id:$(this).data('id'),
				},
				function(data){
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
			$.post(
				"<?php echo url('Schedule/save'); ?>",
				{
					name: $('#name').val(),
					classroom: $('#classroom').val(),
					teacher: $('#teacher').val(),
					week: $('#week').val(),
					section: $('#section').val(),
					weeks: Weeks(),
				},
				function(data){
					alert(data);
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
	</script>
</body>
</html>