<?php
namespace app\home\controller;

use think\Controller;
use think\Config;
use think\Db;
/**
课表
*/
class Schedule extends Controller{
	
	public function index(){
		$schedule = model('Schedule');
		$data = $schedule->getCurriculum($schedule->getSchedules(3),count($schedule->getNowWeek()));
		$this->assign('data',$data);
		return $this->fetch();
	}

	public function add(){
		$schedule = model('Schedule');
		$data = $schedule->getSchedules(3);
		$w = "";
		for ($i=0; $i < count($data,0); $i++) { 
		for ($j=0; $j <= 20; $j++) { 
			if( $j >= $data[$i]['start_week'] && $j <= $data[$i]['end_week'] && ($data[$i]['single_and_double'] == 0 || $data[$i]['single_and_double']%2 == $j%2)){
				$w .= $j;
				if($j != $data[$i]['end_week']) $w.=",";
			}
			
		}
		Db::table('curriculum')->where('id',$data[$i]['id'])->update(['weeks_number' => $w,]);
		$w="";
		}
		return $w;

	}

	public function schedule(){
		$schedule = model('Schedule');
		$curriculum = $schedule->getSchedule(input('get.id'));
		return $schedule->getSchedule(input('get.id'));
	} 

	public function test(){
		return phpinfo();
	} 

	/**
	 * 
	 * @return [type] [description]
	 */
	public function save(){
		$schedule = model('Schedule');
		$r  = $schedule->judge(input('post.'));
		
		return $r;
	} 
}

?>