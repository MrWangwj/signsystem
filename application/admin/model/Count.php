<?php
/**
 * Created by PhpStorm.
 * User: wang
 * Date: 2016/9/23
 * Time: 11:49
 */

namespace app\admin\model;

use think\Model;

class Count extends Model{

	public function getOnline(){
		$time = date('H:i:s', time());
		$date = date('Y-m-d', time());
		input('get.date') && $date = input('get.date');
		input('get.hour') && input('get.minute') && input('get.second') && $time = input('get.hour').":".input('get.minute').":".input('get.second');
		$haveclass = db('schedule', [], false) //查询有课人员
		->alias('a') 
		->field('a.user_id')
		->join('curriculum b', 'a.curriculum_id = b.id')
		->where(['b.week' => $this->getweek(strtotime($date." ".$time)), 'b.section' => $this->getSection($date, $time)])
		->select();

		//查询在线人员
		$nowtime = strtotime($date." ".$time);
		$sign = db('sign', [], false)
		->alias('a')
		->field('a.user_id,c.name, b.group_id')
		->join('user_group b', 'a.user_id = b.user_id')
		->join('user c', 'a.user_id = c.user_id')
		->where('(state=0 AND start_time<='.$nowtime.' AND start_time>'.($nowtime-21600).') OR (start_time<='.$nowtime.' AND over_time>='.$nowtime.')')
		->select();
		$userHS = array();
		foreach ($haveclass as $key => $value) {
			$userHS[count($userHS)] = $value['user_id'];
		}
		foreach ($sign as $key => $value) {
			$userHS[count($userHS)] = $value['user_id'];
		}
		if(empty($userHS)) $userHS=['0'];
		$lackuser = db('user')
		->alias('a')
		->field('a.name, b.group_id')
		->join('user_group b', 'a.user_id = b.user_id')
		->where('a.user_id', 'NOT IN', array_unique($userHS))
		->select();
		return [
			'lackuser' => $lackuser,
			'sign' => $sign,
			'date' => $nowtime,
			'signcount' => count($sign),
			'lackcount' => count($lackuser),
		];
	}

	public function getSection($date, $time){
		$section = 0;
		$nowtime = strtotime($date." ".$time);
		foreach (config('classtime') as $key => $value) {
			$starttime = strtotime($date." ".$value['start']);
			$endtime = strtotime($date." ".$value['end']);
			if($nowtime >= $starttime && $nowtime <= $endtime){
				$section = $key+1;
				break;
			}
		}
		return $section;
	}

	public function getweek($date){
		if(date('w', $date) == 0){
			return 7;
		}
		return date('w', $date);
	}
	/**
	 * 1.首先用户需要在线的时长
	 * 2.用户实际在线时长
	 * 3.用户缺勤时长
	 * @return 
	 */
	public function getCount(){
		$week = count(getNowWeek());
		$where = [];
		input('get.group') && $where['c.group_id'] = ['eq', input('get.group')];
		input('get.user') && $where['c.user_id'] = ['eq', input('get.user')];
		input('get.week') && $week = input('get.week');

		$weekMS = getWeekDate($week);  // 获得第 $week 周的所有日期
		//获得用户第几节有课信息
		$haveclass = db('schedule', [], false)
		->alias('a')
		->field('c.user_id, b.id, b.weeks_number, b.week, b.section')
		->join('curriculum b', 'a.curriculum_id = b.id')
		->join('user_group c', 'a.user_id = c.user_id')
		->where($where)
		->select();


		$userhaveclass = array();
		//循环得到用户有课的节数
		
		foreach ($haveclass as $key => $value) {
			if($this->whetherCourse($value['weeks_number'],$week)){
				$userhaveclass[$value['user_id']][$value['week']][$value['section']] = $value['id'];
			}
		}

		$userWhere = [];
		input('get.group') && $userWhere['b.group_id'] = ['eq', input('get.group')];
		input('get.user') && $userWhere['a.user_id'] = ['eq', input('get.user')];
		$user_id = db('user', [], false)
		->alias('a')
		->field('a.user_id')
		->join('user_group b', 'a.user_id = b.user_id')
		->where($userWhere)
		->select();
		//得到没课时的时间段
		$userNoClass = array();
		$online = $this->getOnlineTime($week);

		foreach ($user_id  as $key => $value) {
			for ($i=1; $i <=7 ; $i++) { 
				for ($j=1; $j <=5 ; $j++) { 
					if(!isset($userhaveclass[$value['user_id']][$i][$j])){
						$starttime = strtotime($weekMS[$i-1]." ".config('classtime')[$j-1]['start']);	
						$endtime = strtotime($weekMS[$i-1]." ".config('classtime')[$j-1]['end']);	
						if($starttime < time() && $endtime<time()){
							$userNoClass[$value['user_id']][$i][$j][0] = strtotime($weekMS[$i-1]." ".config('classtime')[$j-1]['start']);	
							$userNoClass[$value['user_id']][$i][$j][1] = strtotime($weekMS[$i-1]." ".config('classtime')[$j-1]['end']);	
						}
					}
				}
				if(strtotime('+10 minute', strtotime($weekMS[$i-1]." ".config('classtime')[4]['end'])) < time() && strtotime($weekMS[$i-1]." 22:30:00")<time()){
					$userNoClass[$value['user_id']][$i][6][0] = strtotime('+10 minute', strtotime($weekMS[$i-1]." ".config('classtime')[4]['end']));
					$userNoClass[$value['user_id']][$i][6][1] = strtotime($weekMS[$i-1]." 22:30:00");
				}else{
					$userNoClass[$value['user_id']][$i][6][0] = 0;
					$userNoClass[$value['user_id']][$i][6][1] = 0;
				}

			}
		}
		return [$this->getSignTime($userNoClass, $this->getOnlineTime($week)), $weekMS];
		// return $userNoClass;
		// return $this->getOnlineTime($week);
	}

	/**
	 * 判断 指定周是否有课  0：没有课程  1:本周不用上课 2：有课 
	 * @param  [type] $data    课程数组 
	 * @param  [type] $nowWeek 指定周
	 * @return [type]          [description]
	 */
	public function whetherCourse($weeks,$week){
		$whetherCourse = 0;
		$weeks = explode(",", $weeks);
		foreach ($weeks as $key => $value) {
			if($value == $week){
				$whetherCourse = 1;
				break;
			}
		}
		return $whetherCourse;	
	}

	/**
	 * 除去有课时间
	 * @param  [type] $date     [description]
	 * @param  [type] $timeslot [description]
	 * @return [type]           [description]
	 */
	public function getSignTime($userNoClass, $online){
		$where = [];
		input('get.group') && $where['b.group_id'] = ['eq', input('get.group')];
		input('get.user') && $where['a.user_id'] = ['eq', input('get.user')];
		$result = db('user', [], false)
			->alias('a')
			->join('user_group b','a.user_id = b.user_id')
			->where($where)
			->select();
		$users = [];
		foreach ($result as $key => $value) {
			$users[$value['user_id']] = $value;
		}

		$sign = array();
		//$key 用户 ,$key2 星期， 
		foreach ($userNoClass as $key => $value) {
			$signTime = 0; $noSignTime = 0;
			foreach ($value as $key2 => $value2) {
				if (isset($online[$key][$key2])) {
					foreach ($online[$key][$key2] as $k => $v) {
						$signTime += ($v[1]-$v[0]);
					}	
					$sign[$key]['data'][$key2]['online'] = $online[$key][$key2];				
				}

				foreach ($value2 as $sectionkey => $sectionvalue) {
					$noSign = [$sectionvalue]; // 默认整节课缺勤
					if(isset($online[$key][$key2])){
						$noSign = $this->getNoSign($noSign,$online[$key][$key2]);
					}else{
						$sign[$key]['data'][$key2]['online'][0][0] = 0;
						$sign[$key]['data'][$key2]['online'][0][1] = 0;	
					}	
					foreach ($noSign as $noSignkey => $noSignalue) {
						!isset($sign[$key]['data'][$key2]['noSign'])?$count=0:$count = count($sign[$key]['data'][$key2]['noSign']);
						$sign[$key]['data'][$key2]['noSign'][$count] =  $noSignalue;
						$noSignTime += $noSignalue[1] - $noSignalue[0];
					}
				}

				if(!isset($sign[$key]['data'][$key2]['noSign'])){
					$sign[$key]['data'][$key2]['noSign'][0][0] = 0;
					$sign[$key]['data'][$key2]['noSign'][0][1] = 0;	
				}
			}
			$sign[$key]['user'] = $users[$key];
			$sign[$key]['user']['signtime'] = $signTime;
			$sign[$key]['user']['nosigntime'] = $noSignTime;
		}
		return $sign;
	}

	public function getNoClassTime(){}


	public function test(){
		$online  = [[1477267900, 1477273900]];
		$sign = [[1477267200, 1477273800]];
		$time = [];
		foreach ($this->getNoSign($sign, $online) as $key => $value) {
			$time[$key][0] = date('Y-m-d H:i:s',$value[0]);
			$time[$key][1] = date('Y-m-d H:i:s',$value[1]);
		}
		return $time ;
	}
	/**
	 * 得到缺勤
	 * @param  [type] $Sign   没有课的节数
	 * @param  [type] $online 在线时长
	 * @return [type]         [description]
	 */
	public function getNoSign($Sign, $online){
		foreach ($online as $onlinekey => $onlinevalue) {
			foreach ($Sign as $key => $value) {
				if($this->isMixTime($value[0],$value[1],$onlinevalue[0],$onlinevalue[1])){
					$count = count($Sign); 
					if($onlinevalue[0] <= $value[0] && $onlinevalue[1] <= $value[1]){
						$Sign[$key][0] = $onlinevalue[1];
						$Sign[$key][1] = $value[1];   
					}else if($onlinevalue[0] >= $value[0] && $onlinevalue[1] >= $value[1]){
						$Sign[$key][0] = $value[0];
						$Sign[$key][1] = $onlinevalue[0]; 
					}else if($onlinevalue[0] >= $value[0] && $onlinevalue[1] <= $value[1]){
						$Sign[$key][0] = $value[0];
						$Sign[$key][1] = $onlinevalue[0];
						$Sign[$count][0] = $onlinevalue[1];
						$Sign[$count][1] = $value[1]; 
					}else if($onlinevalue[0] <= $value[0] && $onlinevalue[1] >= $value[1]){
						unset($Sign[$key]);
					}
				}									
			}
		}
		return $Sign;
	}
	public function getOnlineTime($week){
		//得到用户指定周的签到记录
		$mon = strtotime(getWeekDate($week)[0]);  //一周的开始时间
		$sun = strtotime(getWeekDate($week)[6].' '.'23:59:59');  //一周的结束的时间

		$signwhere['a.start_time|a.over_time'] = ['between',[$mon, $sun]];
		input('get.group') && $signwhere['b.group_id'] = ['eq', input('get.group')];
		input('get.user') && $signwhere['b.user_id'] = ['eq', input('get.user')];

		//得到用户的在线时长
		$sign = db('sign', [], false)
		->alias('a')
		->join('user_group b', 'a.user_id = b.user_id')
		->where($signwhere)
		->order('a.user_id, a.start_time')
		->select();

		$online = array();

		foreach ($sign as $key => $value) {
			if(!empty($value['start_time']) && !empty($value['over_time'])){
				if($value['start_time'] < $mon){
					!isset($online[$value['user_id']][1])?$count = 0:$count = count($online[$value['user_id']][1]);
					$online[$value['user_id']][1][$count][0] = $mon;
					$online[$value['user_id']][1][$count][1] = (int)$value['over_time'];
				}else if ($value['over_time'] > $sun) {
					!isset($online[$value['user_id']][7])?$count = 0:$count = count($online[$value['user_id']][7]);
					$online[$value['user_id']][7][$count][0] = (int)$value['start_time'];
					$online[$value['user_id']][7][$count][1] = $sun;
				}else{
					$week1 = $this->getweek($value['start_time']);
					$week2 = $this->getweek($value['over_time']);
					if($week1 != $week2){	

						!isset($online[$value['user_id']][$week1])?$count = 0:$count = count($online[$value['user_id']][$week1]);
						$online[$value['user_id']][$week1][$count][0] = (int)$value['start_time'];
						$online[$value['user_id']][$week1][$count][1] = strtotime($weekMS[$week1-1].' '.'23:59:59');	

						!isset($online[$value['user_id']][$week2])?$count = 0:$count = count($online[$value['user_id']][$week2]);
						$online[$value['user_id']][$week2][$count][0] = strtotime($weekMS[$week2-1].' '.'00:00:00');
						$online[$value['user_id']][$week2][$count][1] = (int)$value['over_time'];	

					}else{
						!isset($online[$value['user_id']][$week1])?$count = 0:$count = count($online[$value['user_id']][$week1]);
						$online[$value['user_id']][$week1][$count][0] = (int)$value['start_time'];
						$online[$value['user_id']][$week1][$count][1] = (int)$value['over_time'];
					}
				}
			}
		}

		return $online;	
	}

	public function isMixTime($begintime1, $endtime1, $begintime2, $endtime2) {
	    $status = $begintime2 - $begintime1;
	    if ($status > 0) {
	        $status2 = $begintime2 - $endtime1;
	        if ($status2 > 0) {
	            return false;
	        } else {
	            return true;
	        }
	    } else {
	        $status2 = $begintime1 - $endtime2;
	        if ($status2 > 0) {
	            return false;
	        } else {
	            return true;
	        }
	    }
	}
}