<?php
namespace app\home\model;

use think\Model;
use think\Db;

class Schedule extends Model{
	/**
	 * [用户课程]
	 * @param  [type] $user_id 用户id
	 * @return [type]          [description]
	 */
	public function getSchedules($user_id){
		$data = Db::table('schedule')->field("b.*")
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
	public function getCurriculum($data){
		$nothing = Db::table('curriculum')->where('id',1)->select();
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
				if(!isset($schedule[$i][$j])) 
					$schedule[$i][$j]=$this->whetherCourse($nothing,count($this->getNowWeek()),0)[0];
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
	public function whetherCourse($data,$nowWeek){
		foreach ($data as $key => $value) {
			if(($nowWeek >=$value['start_week']) && ($nowWeek <=$value['end_week'])){
				if($value['single_and_double'] == 0 || ($nowWeek % 2 == $value['single_and_double'] % 2)){
					$data[$key]['whether_course'] = 1;
					continue;
				}
			}
			$data[$key]['whether_course'] = 0;
		}
		return $data;
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
		$schedule = Db::table('schedule')->where('id',$id)->find();
		return $schedule;
	}
}