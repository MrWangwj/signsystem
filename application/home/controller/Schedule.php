<?php
namespace app\home\controller;

use think\Controller;
use think\Config;

/**
课表
*/
class Schedule extends Controller{
	
	public function index(){
		$schedule = model('Schedule');
		$data = $schedule->whetherCourse($schedule->getSchedules(3),count($schedule->getNowWeek()));
		$this->assign('data',$schedule->getCurriculum($data));
		return $this->fetch();
	}

	public function add(){
		$schedule = model('Schedule');
		return count($schedule->getNowWeek());
	}

	public function schedule(){
		$schedule = model('Schedule');
		return $schedule->getSchedule(input('get.id'));
	} 

}

?>