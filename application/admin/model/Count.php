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
		$time = time();
		input('get.date') && input('get.hour') && input('get.minute') && input('get.second') && $time = strtotime(input('get.date')." ".input('get.hour').":".input('get.minute').":".input('get.second'));
		$data = db('schedule')
		->alias('a')
		->field('a.user_id')
		->join('curriculum b', 'a.curriculum_id = b.id')
		->where(['b.week' => date("w",$time), 'b.section' => $this->getSection(input('get.date'), input('get.hour').":".input('get.minute').":".input('get.second'))])
		->select();

		return $data;
		// return input('get.');
	}

	public function getSection($date, $time){
		$section = 0;
		foreach (config('classtime') as $key => $value) {
			$starttime = strtotime($date." ".$value['start']);
			$endtime = strtotime($date." ".$value['end']);
			$nowtime = strtotime($date." ".$time);
			if($nowtime >= $starttime && $nowtime <= $endtime){
				$section = $key+1;
			}
		}
		return $section;
	}
}