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
        return $query->where('key', '=', 'schedule_id');
    }
}
