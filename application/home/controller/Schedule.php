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
		if(!empty(session('userid'))){
			$schedule = model('Schedule');
			$data = $schedule->getCurriculum($schedule->getSchedules(session('userid')),count(getNowWeek()));
			$this->assign('data',$data[0]);
			$this->assign('week',$data[1]);
		}
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
		
		return dump(input('post.term/a'));;
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

		return dump(config('url_model'));
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
				//return ['q2' => $data];
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
			return ['code' => 1, 'msg' => '用户不存在或该用户没有录入课表！'];
		}
		return ['code' => 0, 'msg' => '无法导入自己的课表'];
	}

	public function otheruser(){
		$otheruser = input('get.user_id');
		$user = model('user');
		if($user->existUser($otheruser)){
			// $this->redirect(url('Schedule/other','','').'/'.$otheruser);
			return ['code' => 1, 'msg' => '用户存在', 'url' => url('home/schedule/other',['otheruser'=>$otheruser])];
		};
		return ['code' => 0, 'msg' => '用户不存在', 'url' => ""];
	}

	public function other($otheruser){
		$schedule = model('Schedule');
		$user = db('user', [], false)
        	->field("a.*,c.group_name,d.position_name")
			->alias("a")
        	->join('user_group b','a.user_id = b.user_id')
        	->join('groups c','b.group_id = c.group_id')
        	->join('positions d','a.position = d.position')
        	->where(['a.user_id' => $otheruser])
        	->find();
		if($user){
			if($user['user_id'] != session('userid')){
				$data = $schedule->getCurriculum($schedule->getSchedules($otheruser),count(getNowWeek()));
				$this->assign('data',$data[0]);
				$this->assign('week',$data[1]);
				$this->assign('otheruser',$user);
				return $this->fetch();		
			}
			$this->redirect(url("Schedule/index"));
		}
		$this->error('用户不存在');
		
	}

	public function getUser(){
		$user = model('user');
		$users = $user->getNameUser(input('get.name'));
		return $users;
	}

	public function getUsers(){
		$schedule = model('Schedule');
		return $schedule->getUsers();
	}

	public function count(){
		$schedule = model('Schedule');
		$group = db('groups',[], false)->select();
		$grade = model('User')->getgrade();
		$user = $schedule->getUsers();
		// $data = $schedule->getCount();
		$this->assign('grade',$grade);
		$this->assign('group',$group);
		$this->assign('users',$user);
		// $this->assign('term',$data[1]);
		// $this->assign('termtext',$data[2]);
		// $this->assign('termlength',count($data[1]));
		// $this->assign('empty',"<li class='term-label2 foucus'></li>");
		return $this->fetch();
		// return input('post.term/a');
		
	}

	public function getCount(){
		$schedule = model('Schedule');
		$data =  $schedule->getCount();
		return ['user' => $data[0], 'week' => $data[1]];
	}
	public function countterm(){
		$schedule = model('Schedule');
		$group = db('group',[], false)->select();
		$data = $schedule->getCount();
		return $data;
	}	

	public function getTermUser(){
		$where = [];
		input('get.user_id') && $where['a.user_id'] = input('get.user_id');
		input('get.position') && $where['a.position'] = input('get.position');
		input('get.group_id') && $where['b.group_id'] = input('get.group_id');
       	$user = db('user', [], false)
       	->field("a.name,a.user_id")
		->alias("a")
       	->join('user_group b','a.user_id = b.user_id')
       	->where($where)
       	->select();
       	return $user;
	}
}

?>