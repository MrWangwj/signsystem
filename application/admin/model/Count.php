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
		->where('(state=0 AND start_time<='.$nowtime.') OR (start_time<='.$nowtime.' AND over_time>='.$nowtime.')')
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
		return date('w', $date)+1;
	}
	/**
	 * 1.首先用户需要在线的时长
	 * 2.用户实际在线时长
	 * 3.用户缺勤时长
	 * 4.[
	 * 		0 => [
	 * 			'user_id' => 123,
	 * 			...
	 * 		]
	 * 		1 => [
	 * 			'19日' => [
	 * 				1 => [
	 * 					在线和缺勤时段
	 * 				],
	 * 				2 => [
	 * 					
	 * 				],
	 * 				3 => [
	 * 					
	 * 				],
	 * 			]
	 * 		]
	 *   ]
	 * @return 
	 */
	public function getCount(){
		$week = count(getNowWeek());
		$where = [];
		// $where['c.user_id'] = ['eq', 20151515105];
		input('get.group') && $where['c.group'] = ['eq', input('get.group')];
		input('get.user') && $where['c.user_id'] = ['eq', input('get.user')];
		input('get.week') && $week = input('get.week');

		$weekMS = getWeekDate($week);  // 获得第 $week 周的所有日期
		//获得用户第几节有课信息
		$haveclass = db('schedule', [], false)
		->alias('a')
		->field('a.user_id, b.id, b.weeks_number, b.week, b.section')
		->join('curriculum b', 'a.curriculum_id = b.id')
		->join('user_group c', 'a.user_id = c.user_id')
		->where($where)
		->select();


		$userhaveclass = array();
		//
		foreach ($haveclass as $key => $value) {
			if($this->whetherCourse($value['weeks_number'],$week)){
				$userhaveclass[$value['user_id']][$value['week']][$value['section']] = $value['id'];
			}
		}

		$userNoClass = array();
		foreach ($userhaveclass as $key => $value) {
			for ($i=1; $i <=7 ; $i++) { 
				for ($j=1; $j <=5 ; $j++) { 
					if(!isset($userhaveclass[$key][$i][$j])){
						$userNoClass[$key][$i][$j][0] = strtotime($weekMS[$i-1]." ".config('classtime')[$j-1]['start']);	
						$userNoClass[$key][$i][$j][1] = strtotime($weekMS[$i-1]." ".config('classtime')[$j-1]['end']);
					}	
				}
			}
		}


		return [getWeekDate(7), $userNoClass];
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


}