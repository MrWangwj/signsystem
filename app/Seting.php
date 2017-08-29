<?php

namespace App;

use Illuminate\Database\Eloquent\Model as baseModel;
use Illuminate\Database\Query\Builder;

class Seting extends baseModel
{
    //
    //返回开学时间设置
    public function scopeStartschool($query){
        return $query->where('key', '=', 'start_school');
    }

    //返回当前设置的作息时间
    public function scopeScheduleId ($query){
        return $query->where('key', '=', 'scedule_id');
    }


    //获得当前周
    public static function getNowWeek(){
        $startSchoolTime  = Seting::startschool()->first()['value'];
        $nowTime = time();
        $week = ($nowTime - $startSchoolTime) / (86400*7);
        return ceil($week) < 1 ? 1 : ceil($week);
    }


    //获取指定周的所有开始时间(时间戳)
    public static function getNowWeeks($week = null){
        if(!$week) $week = Seting::getNowWeek();
        $startSchooleTime = Seting::startschool()->first()['value'];
        $startTime = $startSchooleTime + ($week - 1) * (86400*7);
        $nowWeeks = [];
        for ($i = 0; $i < 7; $i++){
            $nowWeeks[] = $startTime + ($i * 86400);
        }
        return $nowWeeks;
    }

    //获取指定周的所有开始时间(文本)
    public static function getNowWeeksStr($week = null){
        if(!$week) $week = Seting::getNowWeek();
        $nowWeeks = Seting::getNowWeeks($week);
        $nowWeeksStr = [];
        for ($i = 0; $i < 7; $i++) {
            $nowWeeksStr[] = date('Y-m-d', $nowWeeks[$i]);
        }
        return $nowWeeksStr;
    }
}
