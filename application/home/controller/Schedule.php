<?php
namespace app\home\controller;

use think\Controller;
use think\Config;
use think\Request;
/**
课表
*/
class Schedule extends Base{
	
	public function index(){
		$schedule = model('Schedule');
		
		$data = $schedule->getCurriculum($schedule->getSchedules(session('userid')),count($schedule->getNowWeek()));
		$this->assign('data',$data[0]);
		$this->assign('week',$data[1]);
		return $this->fetch();
	}

	public function add(){
		// $schedule = model('Schedule');
		// $data = $schedule->getSchedules(session('userid'));
		// $w = "";
		// for ($i=0; $i < count($data,0); $i++) { 
		// for ($j=0; $j <= 20; $j++) { 
		// 	if( $j >= $data[$i]['start_week'] && $j <= $data[$i]['end_week'] && ($data[$i]['single_and_double'] == 0 || $data[$i]['single_and_double']%2 == $j%2)){
		// 		$w .= $j;
		// 		if($j != $data[$i]['end_week']) $w.=",";
		// 	}
			
		// }
		// Db::table('curriculum')->where('id',$data[$i]['id'])->update(['weeks_number' => $w,]);
		// $w="";
		// }
		db('schedule')->where(['user_id' => '2147483647'])->update(['user_id' => '20151515105']);
		return "";
	}

	public function schedule(){
		$schedule = model('Schedule');
		$id = $schedule->getId(session('userid'), input('get.week'), input('get.section'));
		if($id){
			$curriculum = $schedule->getSchedule($id);
		}else{
			$curriculum = $schedule->getSchedule(1);
		}
		return $curriculum;
	} 

	public function test($week=''){
		
		return date("w",strtotime('2016-10-10'));
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
			$id = $schedule->getId(session('userid'), $data['week'], $data['section']);
			$newId = $result = $schedule->judgeRepeat($data);
			if($result == false){      //判断信息是否重复
				$newId = db('curriculum', [], false)->insertGetId($data);
			}
			if($schedule->upSchedule(session('userid'), $id, $newId)){ //判断信息是否更新成功
				return ['code' => 2, 'msg' => '保存成功'];
			}
			return ['code' => 1, 'msg' => '修改失败!']; 
		}
		return ['code' => 0, 'msg' => $validate->getError()];
	} 


	public function nothing(){
		$schedule = model('Schedule');
		$id = $schedule->getId(session('userid'),input('post.week'),input('post.section'));
		$result = db('schedule', [], false)
				->where(['user_id' => session('userid'), 'curriculum_id' => $id])
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

	public function inputSch(){
		$schedule = model('Schedule');
		$user = input('get.user_id');
		if($user != session('userid')){
			$scheduleId = $schedule->getScheduleId($user);
			if($scheduleId){
				$result = $schedule->cpSchedule(session('userid'), $scheduleId);
				return ['code' => 2, 'msg' => '成功导入'.$result.'条'];
				// return dump($result);
			}
			return ['code' => 1, 'msg' => '用户存在或该用户没有录入课表！'];
		}
		return ['code' => 0, 'msg' => '无法导入自己的课表'];
	}

	public function otheruser(){
		$otheruser = input('get.user_id');
		$user = model('user');
		if($user->existUser($otheruser)){
			// $this->redirect(url('Schedule/other','','').'/'.$otheruser);
			return ['code' => 1, 'msg' => '用户存在', 'url' => url('Schedule/other','','').'/'.$otheruser];
		};
		return ['code' => 0, 'msg' => '用户不存在', 'url' => ""];
	}

	public function other($otheruser){
		$schedule = model('Schedule');
		$user = db('user', [], false)->where(['user_id' => $otheruser])->find();
		if($user){
			if($user['user_id'] != session('userid')){
				$data = $schedule->getCurriculum($schedule->getSchedules($otheruser),count($schedule->getNowWeek()));
				$this->assign('data',$data[0]);
				$this->assign('week',$data[1]);
				$this->assign('otheruser',$user);
				return $this->fetch();		
			}
			$this->redirect(url("Schedule/index"));
		}
		$this->error('用户不存在');
		
	}

	public function count(){
		$schedule = model('Schedule');
		$group = db('groups',[], false)->select();
		$user = db('user', [], false)->field('user_id,name')->order('name')->select();
		$data = $schedule->getCount();
		$this->assign('data',$data[0]);
		$this->assign('group',$group);
		$this->assign('users',$user);
		$this->assign('term',$data[1]);$this->assign('termtext',$data[2]);
		$this->assign('termlength',count($data[1]));
		$this->assign('empty',"<div class='term-label2 foucus'></div>");
		return $this->fetch();
	}

	public function countterm(){
		$schedule = model('Schedule');
		$group = db('group',[], false)->select();
		$data = $schedule->getCount();
		return $data;
	}	
}

?>