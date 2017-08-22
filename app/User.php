<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public static function user($openid){
        return User::all()->where('openid', $openid)->first();
    }


    //关联课表
    public function courses(){
        return $this->belongsToMany('\App\Course','user_courses', 'user_id','course_id');
    }

    //关联签到表
    public function attendances(){
        return $this->hasMany('\App\Attendance', 'user_id', 'id');
    }

    //关联审批表
    public function approvals(){
        return $this->hasMany('\App\Approval', 'user_id', 'id');
    }

    //关联考勤表
    public function signs(){
        return $this->hasMany('\App\Sign', 'user_id', 'id');
    }


    //返回用户当前签到的记录
    public function getSign(){
        return $this->attendances()->where('type', '=', 0);
    }

    //返回用户当前签退的记录
    public function getCheckout(){
        return $this->attendances()->where('type', '=', 1);
    }



    //用户签到
    public function setSign(){

        //TODO: 判断用户签到地点


        if(time() < strtotime('06:00:00'))
            return ['status' => false, 'msg' => "非考勤时间"];

        $text = ""; //签到提示
        //获得最近签到记录
        $first = $this->attendances()->selfWeek()->orderBy('created_at', 'desc')->first();
        if($first && $first->type == 0)
            $text = "上次签到未签退\n"."您可以在考勤记录中查看\n"."----------------------\n";
        $sign = new \App\Attendance();
        $sign->sign_start = time();
        $sign->sign_end = time();
        $r = $this->attendances()->save($sign);
        if($r){
            $text = $text."签到成功\n".date('Y-m-d H:i:s' , $r->sign_start);
            return ['status' => true, 'msg' => $text];
        }
        return ['status' => false, 'msg' => "操作失败，请重试"];
    }

    //用户签退
    public function setCheckout(){
        if(time() < strtotime('06:00:00'))
            return ['status' => false, 'msg' => "非考勤时间"];
        $attendance = $this->attendances()->selfWeek()->orderBy('created_at', 'desc')->first();
        if($attendance && $attendance->type == 0 &&(time()-$attendance->sign_start<86400)){
            $attendance->sign_end = time();
            $attendance->type = 1;
            $r = $attendance->save();
            if($r){
                $text = "签退成功\n".date('Y-m-d H:i:s' , $attendance->sign_end);
                return ['status' => true, 'msg' => $text];
            }else{
                return ['status' => false, 'msg' => "操作失败，请重试"];
            }
        }
        return ['status' => false, 'msg' => "未签到"];
    }

    //判断用户补签是否有冲突,并返回冲突记录
    public function patchClash($sign_start, $sign_end){
        $sign = $this->signs;
        $filtered = $sign->filter(function ($value, $key) use($sign_start, $sign_end){
            return max($sign_start, $value->sign_start) < min($sign_end, $value->sign_end);
        });
       return  $filtered;
    }



    public function setPatch($approval){
        return $this->approvals()->save($approval);
    }


}
