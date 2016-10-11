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

	