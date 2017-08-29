<?php

namespace App;


class Schedule extends Model
{
//    //访问器
//    public function getStartTimeAttribute($value){
//        return strtotime(date('Y-m-d', time()).' '.date('H:i:s', $value));
//    }
//
//    //访问器
//    public function getEndTimeAttribute($value){
//        return strtotime(date('Y-m-d', time()).' '.date('H:i:s', $value));
//    }

    //返回作息时间的主要数据
    public function getSection(){
        $start_time = $this->start_time;
        $end_time = $this->end_time;
        $section = $this->section;
        return compact(['start_time', 'end_time', 'section']);
    }

}
