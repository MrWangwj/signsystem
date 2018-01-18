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

    ];

    protected $guarded = [];

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


    //关联组别
    public function grouping(){
        return $this->belongsTo('\App\Grouping','grouping_id','id');
    }

    //关联职务
    public function positions(){
        return $this->belongsToMany('\App\Position','position_users','user_id','position_id');
    }


    //关联违规表
    public function illegals(){
        return $this->hasMany('\App\UserIllegal', 'user_id', 'id');
    }

    //关联地点表
    public function location(){
        return $this->belongsTo(Location::class, 'location_id', 'id');
    }




    //判断用户是否有某种权限
    public function isPower($powerName){
        foreach ($this->positions as $position){
            foreach ($position->powers as $power){
                if($power->name == $powerName){
                    return true;
                }
            }
        }
        return false;
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
        if($first && $first->type == 0){
            if($first->sign_start - time() < 3600)
                return ['status' => false, 'msg' => "重复签到"];
            $text = "上次签到未签退\n"."您可以在考勤记录中查看\n"."----------------------\n";
        }

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
        if($attendance && $attendance->type == 0 &&(date('d', time()) == date('d', $attendance->sign_start))){
            if(time() - $attendance->sign_start < 1)
                return ['status' => false, 'msg' => "操作过于频繁"];
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

    //保存审批
    public function setPatch($approval){
        return $this->approvals()->save($approval);
    }


    /**
     * 返回用户指定周的有课信息
     */
    public function getWeekCourses($week = null) {
        if(!$week) $week = Seting::getNowWeek();
        $status = $week % 2;
        $courses = $this->courses;
        $filtered = $courses->filter(function ($value, $key) use($week, $status) {
            return ($value->start_week <= $week &&  $week <= $value->end_week) && ($value->status == 0 || $value->status%2 == $status);
        });
        return $filtered;
    }

    //返回用户无课的时间段
    public function getNoCourse($week = null){
        if(!$week) $week = Seting::getNowWeek();
        $scheduleTime = ScheduleTime::all()->find(Seting::scheduleId()->first()['value']);
        $weekSchedules = $scheduleTime->getWeekSchedule($week);  // 得到一周的上课信息

        $courses = $this->getWeekCourses($week);  //获取用户指定周的课程信息

        //去除有课的时间段，返回无课时间段
        foreach ($courses as $key => $course) {
            $courseWeek = $course->week_day;
            $weekSchedules[$courseWeek-1] = $weekSchedules[$courseWeek-1]->reject(function ($value, $key2) use($course){
                return $course->start_section <= $value['section'] && $value['section'] <= $course->end_section;
            });
        }
        return $weekSchedules;
    }

    /** 返回用户的缺勤记录
     * @param null $week 指定的周
     * @param null $signs 用户的有效考勤
     * @return array
     */
    public function getNoSign($userSigns, $week){

        $noCourse = $this->getNoCourse($week); // 用户的无课时间

        $noSign = $noCourse;

        //用户每天的考勤记录
        $weekSigns = $userSigns->groupBy(function ($item, $key){
            $week = date('w', $item->sign_start);
            return $week == 0 ? 6:$week-1;
        })->toArray();



        foreach ($weekSigns as $weekKey => $signs){
            foreach ($signs as $signKey => $sign){
                $noCourse[$weekKey]->each(function ($item, $key) use($sign, $noSign, $weekKey) {
                    if(max($item['start_time'], $sign['sign_start']) < min($item['end_time'], $sign['sign_end'])){
                        $tmpNoCourse = $this->getTimeDifference($item['start_time'], $item['end_time'], $sign['sign_start'], $sign['sign_end']);  //排除考勤后的缺勤记录

                        foreach ($tmpNoCourse as $valueCourse){
                            $tmp['start_time'] = $valueCourse[0];
                            $tmp['end_time'] = $valueCourse[1];
                            $tmp['section'] = $item['section'];
                            $noSign[$weekKey]->push($tmp);
                        }
                        $noSign[$weekKey]->forget($key);  //移除有冲突的考勤

                    }
                });
                $noCourse[$weekKey] = $noSign[$weekKey];
//
            }
        }

        return $noSign;
    }

    //获取从时间1中去除时间2的时间段
    public function getTimeDifference($a1, $b1, $a2, $b2){
        if($a1 < $a2 && $b1 < $b2){
            return [[$a1, $a2]];
        }else if($a1 > $a2 && $b1 > $b2){
            return [[$b2, $b1]];
        }else if($a1 < $a2 && $b1 > $b2){
            return [[$a1, $a2],[$b2, $b1]];
        }else{
            return [];
        }
    }




}
