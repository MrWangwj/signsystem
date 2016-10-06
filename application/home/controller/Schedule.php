<?php
namespace app\home\controller;

use think\Controller;
use think\Config;
use think\Request;
/**
课表
*/
class Schedule extends Controller{
	protected $user = 3;

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
		$id = $schedule->getId($this->user, input('get.week'), input('get.section'));
		if($id){
			$curriculum = $schedule->getSchedule($id);
		}else{
			$curriculum = $schedule->getSchedule(1);
		}
		return $curriculum;
	} 

	public function test(){
		$curriculums = db('curriculum')
					->where('name', 'like', getLike(input('get.name')))
					->where(['week' => input('get.week'), 'section' => input('get.section')])
					->select();
		return dump($curriculums);
	} 

	/**
	 * 标识 ： 0 => 信息格式错误, 0 => 信息格式错误, 
	 * @return [type] [description]
	 */
	public function save(){
		$schedule = model('Schedule');
		$validate  = $schedule->judge(); //验证对象
		if($validate->check(input('post.'))){ //判断信息 是否正确
			$data = input('post.');
			$id = $schedule->getId($this->user, $data['week'], $data['section']);
			$newId = $result = $schedule->judgeRepeat($data);
			if($result == false){      //判断信息是否重复
				$newId = db('curriculum', [], false)->insertGetId($data);
			}
			if($schedule->upSchedule(3, $id, $newId)){ //判断信息是否更新成功
				return ['code' => 2, 'msg' => '保存成功'];
			}
			return ['code' => 1, 'msg' => '修改失败!']; 
		}
		return ['code' => 0, 'msg' => $validate->getError()];
	} 


	public function nothing(){
		$schedule = model('Schedule');
		$id = $schedule->getId($this->user,input('post.week'),input('post.section'));
		$result = db('schedule', [], false)
				->where(['user_id' => $this->user, 'curriculum_id' => $id])
				->delete();
		if($result != false){
			return ['code' => 1, 'msg' => '删除成功！'];
		}
		return ['code' => 2, 'msg' => '删除失败！'];
	}

	public function curriculum(){
		$curriculums = db('curriculum')
					->where('name', 'like', getLike(input('get.name')))
					->where(['week' => input('get.week'), 'section' => input('get.section')])
					->select();
		return $curriculums;
	}
}

?>