<?php
namespace app\home\model;

use think\Model;
use think\Validate;

class Schedule extends Model{

    protected $rule =   [
        'name'  => 'require|max:20',
        'classroom'   => 'require|max:8',
        'teacher'   => 'require|max:10',
        'weeks' => 'require',    
    ];

    protected $msg  =   [
        'name.require' => '名称不能为空',
        'name.max'     => '名称最多不能超过20个字符',
        'classroom.require' => '教室不能为空',
        'classroom.max'     => '名称最多不能超过8个字符',
        'teacher.require' => '老师不能为空',
        'teacher.max'     => '名称最多不能超过10个字符',
        'weeks.require'   => '周数不能为空',
    ]; 	



	/**
	 * [用户课程]
	 * @param  [type] $user_id 用户id
	 * @return [type]          [description]
	 */
	public function getSchedules($user_id){
		$data = db('schedule')->field("b.*")
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
		return $schedule;
	}
	/**
	 * 判断 指定周是否有课
	 * @param  [type] $data    课程数组 
	 * @param  [type] $nowWeek 指定周
	 * @return [type]          [description]
	 */
	public function whetherCourse($schedule,$Week){
		$whetherCourse = 0;
		$weeks = explode(",", $schedule['weeks_number']);
		foreach ($weeks as $key => $value) {
			if($value == $Week){
				$whetherCourse = 1;
				break;
			}
		}
		return $whetherCourse;	
	}

	/**
	 * 获得是周
	 * @return [type] [description]
	 */
	public function getNowWeek(){ 
		$startdate = strtotime('2016-9-6');
		$enddate = strtotime(Date('Y-m-d',time()));
		if($startdate<=$enddate){ 
            $end_date=strtotime("next monday",$enddate); 
            if(date("w",$startdate)==1){ 
                $start_date=$startdate; 
            }else{ 
                $start_date=strtotime("last monday",$startdate); 
            } 
            //计算时间差多少周 
            $countweek=($end_date-$start_date)/(7*24*3600); 
            for($i=0;$i<$countweek;$i++){ 
                $sd=date("Y-m-d",$start_date); 
                $ed=strtotime("+ 6 days",$start_date); 
                $eed=date("Y-m-d",$ed); 
                $arr[]=array($sd,$eed); 
                $start_date=strtotime("+ 1 day",$ed); 
            } 
            return $arr;     
        } 
	}

	public function getSchedule($id){
		$schedule = db('curriculum')->where('id',$id)->find();
		return $schedule;
	}

	public function judge($data){
		$validate = new Validate($this->rule, $this->msg);
		return $validate->check($data) ? true : $validate->getError();
	}
}