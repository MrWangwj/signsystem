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
}