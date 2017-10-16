<?php

namespace App;


class ScheduleTime extends Model
{
    //

    //返回当前的作息时间
    public function schedules(){
        return $this->hasMany('App\Schedule', 'schedule_times_id', 'id');
    }

    //返回当一周的作息时间
    public function getWeekSchedule($week = null){
        if(!$week) $week = Seting::getNowWeek();  //如果没有传递周数，则默认为当前周

        $schedules = $this->schedules; // 返回当前的作息时间
        $schedulesWeek = [];
        $nowWeeksStr = Seting::getNowWeeksStr($week); // 返回字符形式的一周

        for ($i = 0; $i < 7; $i++){
            $schedulesArr = collect();
            foreach ($schedules as $schedule) {
                $tmp = $schedule->getSection();
                $tmp['start_time'] = strtotime($nowWeeksStr[$i].' '.$tmp['start_time']);
                $tmp['end_time'] = strtotime($nowWeeksStr[$i].' '.$tmp['end_time']);
                $schedulesArr->push($tmp);
            }

            $schedulesWeek[$i] = $schedulesArr;
        }
        return $schedulesWeek;
    }
}
