<?php

namespace App;


class ScheduleTime extends Model
{
    //

    //返回当前的作息时间
    public function schedules(){
        return $this->hasMany('App\Schedule', 'schedule_times_id', 'id');
    }
}
