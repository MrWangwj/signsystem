<?php

namespace App;


class Sign extends Model
{
    //返回指定周的考勤
    public function scopeSelfWeek ($query, $week = 0){
        if($week == 0){
            $monday = strtotime('last Monday');
            $sunday = strtotime('next Sunday')+86399;
        }else{
            $startSchool = (Seting::startschool()->first())['value'];
            $monday = $startSchool+($week-1)*86400*7;
            $sunday = $startSchool+$week*86400*7-1;
        }

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


    //获取用户有效的考勤记录
    public function scopeEffective($query){
        return $query->whereIn('type', [1, 3]);
    }

    //获取用户包括只签过到的有效的考勤记录
    public function scopeEffectiveSign($query){
        return $query->whereIn('type', [0, 1, 3]);
    }
}
