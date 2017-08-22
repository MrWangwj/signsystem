<?php

namespace App;


class Sign extends Model
{
    //返回本周考勤
    public function scopeSelfWeek ($query){
        $monday = strtotime('last Monday');
        $sunday = strtotime('next Sunday')+86399;
        return $query->whereBetween('sign_start', [$monday, $sunday])->whereBetween('sign_end', [$monday, $sunday]);
    }

    //返回除拒绝外的考勤记录
    public function scopeValid($query){
        return $query->whereBetween('type', [1, 3]);
    }

    //获取今日考勤
    public function scopeSelfDate($query){
        $nowadays = strtotime(date('Y-m-d'));
        return $query->whereBetween('sign_start', [$nowadays, $nowadays+86400])->whereBetween('sign_end', [$nowadays, $nowadays+86400]);
    }
}
