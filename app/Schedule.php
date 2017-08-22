<?php

namespace App;


class Schedule extends Model
{
    //访问器
    public function getStartTimeAttribute($value){
        return strtotime(date('Y-m-d', time()).' '.date('H:i:s', $value));
    }

    //访问器
    public function getEndTimeAttribute($value){
        return strtotime(date('Y-m-d', time()).' '.date('H:i:s', $value));
    }
}
