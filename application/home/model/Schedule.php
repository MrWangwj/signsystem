<?php
namespace app\home\model;

use think\Model;
use think\Validate;

class Schedule extends Model{

    protected $rule =   [
        'name'  => 'require|max:20',
        'classroom'   => 'require|max:8',
        'teacher'   => 'require|max:10',
        'weeks_number' => 'require',    
    ];

    protected $msg  =   [
        'name.require' => '名称不能为空',
        'name.max'     => '名称最多不能超过20个字符',
        'classroom.require' => '教室不能为空',
        'classroom.max'     => '名称最多不能超过8个字符',
        'teacher.require' => '老师不能为空',
        'teacher.max'     => '名称最多不能超过10个字符',
        'weeks_number.require'   => '周数不能为空',
    ]; 	



	/**
	 * [用户课程]
	 * @param  [type] $user_id 用户id
	 * @return [type]          [description]
	 */
	public function getSchedules($user_id){
		$data = db('schedule')
					->field("b.*")
					->alias("a")
					->join("curriculum AS b "," a.curriculum_id=b.id")
					->where('user_id',$user_id)
					->order('section,week')
					->select();
		return $data;
	}
	/**
	 * 用户课程表
	 * @param  [type] $data 用户课程
	 * @return [type]       [description]
	 */
	public function getCurriculum($data, $week){
		input('get.week') && $week = input('get.week');
		$nothing = db('curriculum')->where('id',1)->find();
		$n = 0;
		//循环创建课表数组
		for ($i=0; $i < 5; $i++) { 
			for ($j=0; $j < 7; $j++) {
				// 循环用户课程，添加无课 
				foreach ($data as $key => $value) {   
 					if($value['week'] == ($j+1) && $value['section'] == ($i+1)){
						$schedule[$i][$j]=$value;
						break;
					}				
				}
				if(!isset($schedule[$i][$j])) {
					$nothing['week'] = $j+1;
					$nothing['section'] = $i+1;
					$schedule[$i][$j]=$nothing;
				}
				$schedule[$i][$j]['whether_course'] = $this->whetherCourse($schedule[$i][$j],$week);
			}
		}
		return [$schedule,$week];
	}
	/**
	 * 判断 指定周是否有课  0：没有课程  1:本周不用上课 2：有课 
	 * @param  [type] $data    课程数组 
	 * @param  [type] $nowWeek 指定周
	 * @return [type]          [description]
	 */
	public function whetherCourse($schedule,$Week){
		$whetherCourse = 0;
		if($schedule['id'] != 1){
			$whetherCourse = 1;
			$weeks = explode(",", $schedule['weeks_number']);
			foreach ($weeks as $key => $value) {
				if($value == $Week){
					$whetherCourse = 2;
					break;
				}
			}
		}
		return $whetherCourse;	
	}


	/**
	 * 获得课程信息
	 * @param  [type] $id [description]
	 * @return [type]     [description]
	 */
	public function getSchedule($id){
		input('get.id') && $id  = input('get.id');
		$schedule = db('curriculum')->where('id',$id)->find();
		return $schedule;
	}

	/**
	 * 判断课程信息是否正确
	 * @return [type] [description]
	 */
	public function judge(){
		$validate = new Validate($this->rule, $this->msg);
		return $validate;
	}
	/**
	 * 判断课程是否存在
	 * @param  [type] $data [description]
	 * @return [type]       [description]
	 */
	public function judgeRepeat($data){
		$curriculums = db('curriculum',[],false)->select();
		foreach ($curriculums as $key => $value) {
			$status = false;
			foreach ($value as $key2 => $value2) {
				if($key2 != 'id') {
					if($value2 != $data[$key2]){
						$status = false;
						break;
					}
					$status = true;
				}
			}
			if($status) return $value['id'];
		}
		return false;




		// $curriculums = db('curriculum',[],false)->select();
		// foreach ($curriculums as $key => $value) {
		// 	foreach ($value as $key2 => $value2) {
		// 		if($key2 != 'id') $curriculum2[$key2] = $value2;
		// 	}
		// 	$curriculum = array_intersect($curriculum2, $data);
		// 	if(count($curriculum) == count($data)){
		// 		return $value['id'];
		// 	}
		// }
		// return false;
	}    

	/**
	 * 判断用户课表信息是否存在
	 * 存在修改 
	 * 不存在增加
	 * @param  [type] $user  [description]
	 * @param  [type] $id    [description]
	 * @param  [type] $newId [description]
	 * @return [type]        [description]
	 */
	public function upSchedule($user, $id, $newId){
		$schedule = db('schedule', [], false)->where(['curriculum_id'=>$id, 'user_id' => $user])->find();
		if($schedule != false){
			if($id == $newId){
				$result = true;
			}else{
				$result = db('schedule')->where(['curriculum_id'=>$id, 'user_id' => $user])->update(['curriculum_id' => $newId]);
			}
		}else{
			$result = db('schedule', [], false)->insert(['curriculum_id'=>$newId, 'user_id' => $user]);
		}
		if($result != false) return true;
		return false;
	}

	/**
	 * 待解决问题
	 * 1.一节课中有两个课程
	 * @param  [type] $userid [description]
	 * @param  [type] $data   [description]
	 * @return [type]         [description]
	 */
	public function judgeClash($userid, $data){
		$weeks = db('curriculum', [], false)
		->alias('a')
		->field('a.weeks_number')
		->join('schedule b', 'a.id = b.curriculum_id')
		->where(['week' => $data['week'], 'section' => $data['section']])
		->select();
	}

	/**
	 * 获得课程的id
	 * @param  [type] $user    用户id
	 * @param  [type] $week    周数
	 * @param  [type] $section 节数
	 * @return [type]          [description]
	 */
	public function getId($user, $week, $section){
		input('get.otheruser') && $user = input('get.otheruser');
		$id = db('curriculum', [], false)
		->alias('a')
		->field('a.id')
		->join('schedule b', 'a.id = b.curriculum_id')
		->where(['a.week' => $week, 'a.section' => $section, 'b.user_id' => $user])
		->find();
		return $id['id'];		
	}


	public function cpSchedule($user, $schedule){
		$count = 0;
		db('schedule', [], false)
		->where(['user_id' => $user])
		->delete();
		foreach ($schedule as $key => $value) {
			$schedule[$key]['user_id'] = $user;
		}
		$count =db('schedule', [], false)->insertAll($schedule);
	 	return $count;
	}

	public function getScheduleId($user){
		$schedule = db('schedule', [], false)
					->field('curriculum_id')
					->where(['user_id' => $user])
					->select();
		return $schedule;
	}



	public function getCount(){
		$week = count(getNowWeek());
		$status = 1;
		input('post.week') && $week = input('post.week');
		input('post.status') && $status = input('post.status');
		$where = [];
		input('post.term/a') && $where = input('post.term/a');
		$fun = 'getHaveClass';
		if($status == 2) $fun = 'getNoClass';
		$data = $this->$fun($week, $where); 
		return [$data[0], $where,$data[1]];
	}

	public function getHaveClass($weekNum, $where=[]){
		$term = "";
		$i = 0;
		$j = 0;
		foreach ($where as $key => $value) {
			if($i != 0) $term .= " OR ";
			$i++;
			$term .="(";
			foreach ($value as $key2 => $value2) {
				$as = "";
				$mark = "=";
				if($value2[0] == 'user_id' || $value2[0] == 'position'){
					$as = "b.";
					if($value2[1] != 1 && $value2[0] == 'position'){
						$mark = "=";
						// $where[$key][$key2][1] = 1;		
					}
				}else if($value2[0] == 'group_id'){
					$as = "d.";
				}
				$where[$key][$key2][0] = $as.$where[$key][$key2][0];
				$term .=$where[$key][$key2][0].$mark.$where[$key][$key2][1];
				if($j < count($value)-1) $term.=" AND ";
				$j++;
			}
			$j=0;
			$term .= ")";
		}
		$data = db('schedule', [], false)
				->alias('a')
				->field('b.name,c.id,c.weeks_number,c.week,c.section,d.group_id')
				->join('user AS b', 'a.user_id = b.user_id')
				->join('user_group AS d', 'a.user_id = d.user_id')
				->join('curriculum AS c', 'a.curriculum_id = c.id')
				->where($term)
				->order('c.section,c.week')
				->select();
		$names = array();



		/**
		 * 待优化 合并循环
		 * @var [type]
		 */
		foreach ($data as $key => $value) {
			if($this->whetherCourse($value, $weekNum) == 2){
				$leng = 0;
				if(isset($names[$value['section']-1][$value['week']-1])){
					$leng = count($names[$value['section']-1][$value['week']-1]);
				}
				$names[$value['section']-1][$value['week']-1][$leng]= $value;
			}
		}
		$tables = array();
		for ($i=0; $i <5 ; $i++) { 
			for ($j=0; $j <7 ; $j++) { 
				$tables[$i][$j]=array();
				if(isset($names[$i][$j])) $tables[$i][$j]=$names[$i][$j]; 
			}
		}
		return [$tables,$term];
	}

	public function getNoClass($weekNum,$where = []){
		$haveclass = $this->getHaveClass($weekNum, [])[0];
		$term = "";
		$i = 0;
		$j = 0;
		foreach ($where as $key => $value) {
			if($i != 0) $term .= " OR ";
			$i++;
			$term .="(";
			foreach ($value as $key2 => $value2) {
				$as = "";
				$mark = "=";
				if($value2[0] == 'user_id' || $value2[0] == 'position'){
					$as = "a.";
					if($value2[1] != 1 && $value2[0] == 'position'){
						$mark = "=";
						// $where[$key][$key2][1] = 1;		
					}
				}else if($value2[0] == 'group_id'){
					$as = "b.";
				}
				$where[$key][$key2][0] = $as.$where[$key][$key2][0];
				$term .=$where[$key][$key2][0].$mark.$where[$key][$key2][1];
				if($j < count($value)-1) $term.=" AND ";
				$j++;
			}
			$j=0;
			$term .= ")";
		}
		$names = db('user', [], false)
		->alias('a')
		->field('a.name')
		->join('user_group AS b', 'a.user_id = b.user_id')
		->where($term)
		->select();
		$data = array();
		for ($i=0; $i <5 ; $i++) { 
			for ($j=0; $j <7 ; $j++) { 
				$data[$i][$j] = $names;
				if(isset($haveclass[$i][$j])){
					foreach ($data[$i][$j] as $namekey => $namevalue) {
						foreach ($haveclass[$i][$j] as $key => $value) {
							if($value['name'] == $namevalue['name'] ){
								unset($data[$i][$j][$namekey]);
								break;
							}
						}
					}
				}
			}
		}
		return [$data,$term];
	}

	public function getWhere($where){
		foreach ($where as $key => $value) {
			
		}
	}
}

