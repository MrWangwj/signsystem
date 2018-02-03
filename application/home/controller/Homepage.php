<?php
/**
 * Created by PhpStorm.
 * User: wang
 * Date: 2016/10/4
 * Time: 12:30
 */
namespace app\home\controller;

use app\home\model\User;
use think\Controller;

class Homepage extends Base
{
    public function index(){
        $notice = db('notice', [], false)
            ->limit(3)
            ->order('create_time desc')
            ->select();
        $this->assign('notice',$notice);
        return $this->fetch();
    }
    //签到
    public function sign(){
        if(empty(session('userid'))) 
            return ['code' => -1,'msg'=>'请登陆后在进行操作！'];
        $prohibittime1 = strtotime(date('Y-m-d',time())." 07:00:00");
        $prohibittime2 = strtotime(date('Y-m-d',time())." 23:00:00");
        if(time()<$prohibittime1 || time()>=$prohibittime2){
            return json(['code' => -1,'msg'=>'考勤时间为07:00:00~23:00:00']);
        }
        $userid = session('userid');
        $count = db('sign')
            ->where('user_id',$userid)
            ->where('state',0)
            ->count();
        if($count!=0){
            return json(['code' => -1,'msg'=>'重复签到']);
        }
        $nowtime = strtotime(date('Y-m-d H:i:s',time()));
        $data = ([
            'user_id'  =>  $userid,
            'start_time' =>$nowtime ,
        ]);

        db('sign')->insert($data);
        $datainfo = ([
            'user_id'  =>  $userid,
            'star' => $nowtime,
            'now'=> strtotime(date('Y-m-d H:i:s',time())),
            'sign_state'=> 0
        ]);

        db('sign_info')->insert($datainfo);
        return json(['code' => 1,'msg'=>"签到成功"]);
    }

    public function signoff(){
        if(empty(session('userid'))) 
            return ['code' => -1,'msg'=>'请登陆后在进行操作！'];
        $userid = session('userid');
        //某人没有签退的记录数
        $count = db('sign')
            ->where('user_id',$userid)
            ->where('state',0)
            ->count();
        if($count == 0){
            return json(['code' => -1,'msg'=>'你还没有签到哦']);
        }
        //判断是否超时
        $startime = db('sign')
            ->field("start_time")
            ->where('user_id',$userid)
            ->where('state','0')
            ->select();
        $time =strtotime(date('Y-m-d H:i:s')) - $startime[0]["start_time"];
        if($time>=28800){
            return json(['code' =>-2,'msg'=>"超过8小时时,请补签"]);
        }
        //签退成功
        $prohibittime = strtotime(date('Y-m-d',time())." 23:00:00");
        $msg = "签退成功";
        $nowtime =strtotime(date('Y-m-d H:i:s'));
        if($prohibittime <=time()){
            $msg = "考勤时间为07:00:00~23:00:00,默认以23:00:00签退";
            $nowtime = $prohibittime;
        }
        db('sign')
            ->where('user_id',$userid)
            ->where("state",0)
            ->update(['over_time' => $nowtime,
                    'state'=>1]);
        $datainfo = ([
            'user_id'  =>  $userid,
            'over' => $nowtime,
            'now'=> strtotime(date('Y-m-d H:i:s')),
            'sign_state'=> 1
        ]);
        db('sign_info')->insert($datainfo);
        return json(['code' =>1,'msg'=>$msg]);
    }




    public function reSign(){
        if(empty(session('userid'))) 
            return ['code' => -1,'msg'=>'请登陆后在进行操作！'];
        $userid = session('userid');
        $count = db('sign')
            ->where('user_id',$userid)
            ->where('state',0)
            ->count();
        if($count == 0){
            $todyWeek = $this->getWeek();
            return json([
                'code' => -2,
                'msg'=>'请补签~',
                'week'=>$todyWeek
            ]);
        }

        $startime = db('sign')
            ->field("start_time")
            ->where('user_id',$userid)
            ->where('state','0')
            ->select();
        $date = $startime[0]["start_time"];
        $time =strtotime(date('Y-m-d H:i:s')) - $date;
        if($time<28800){
            return json(['code' =>-1,'msg'=>"不需要补签哦~"]);
        }
        $year = date("Y",$date);
        $month = date("m",$date);
        $day = date("d",$date);
        $h = date("H",$date);
        $minute = date("i",$date);
        $s = date("s",$date);
        return json(['code' =>1,
            'msg'=>"请补签",
            'year'=>$year,
            'month'=>$month,
            'day'=>$day,
            'hour'=>$h,
            'minute'=>$minute,
            'sec'=>$s,
        ]);
    }

    public function reSignOk(){
        $userid = session('userid');
        $overdate = $_POST['overdate'];
        $hour = $_POST['hour'];
        $minute = $_POST['minute'];
        $overtime = strtotime($overdate)+$minute*60+$hour*60*60;
        $startime = db('sign')
            ->field("start_time")
            ->where('user_id',$userid)
            ->where('state','0')
            ->select();
        $date = $startime[0]["start_time"];
        if($overtime<$date){
            return json(['code' =>-1,'msg'=>"补签错误，签退时间小于签到时间~"]);
        }
        if(($overtime-$date)>=28800){
            return json(['code' =>-1,'msg'=>"最多只能补签8个小时哦~"]);
        }
        db('sign')
            ->where('user_id',$userid)
            ->where('state',0)
            ->update(['over_time' => $overtime,'state' =>2]);

        $nowtime = strtotime(date('Y-m-d H:i:s'));
        $datainfo = ([
            'user_id'  =>  $userid,
            'star' => $date,
            'over' => $overtime,
            'now' => $nowtime,
            'sign_state'=> 2
        ]);
        db('sign_info')->insert($datainfo);
        return json(['code' =>1,'msg'=>"补签成功~"]);
    }
    //补签整个时段
    public function reSignAll(){
        $userid = session('userid');
        $ymd = $_POST['ymd'];
        $startime = $_POST['startTime'];
        $overtime = $_POST['overTime'];
        $star = strtotime($ymd)+$startime;
        $over = strtotime($ymd)+$overtime;
        $now = strtotime(date('Y-m-d H:i:s',time()));
        if($star>=$now||$over>=$now){
            return json(['code' =>-1,'msg'=>"您的签到太超前了~"]);
        }
        if($over<=$star){
            return json(['code' =>-1,'msg'=>"结束时间大于等于开始时间~"]);
        }
        $alltime = db('sign_info')
            ->field('star,over')
            ->where('user_id',$userid)
            ->where('star|over', 'between',[$star, $over])
            ->select();
            if($alltime != false) 
                return json(['code' =>-1,'msg'=>"补签时间段有冲突~"]);
        
//        $data = [
//            'user_id' => $userid,F
//            'start_time' => $star,
//            'over_time' => $over,
//            'state' => 3,
//        ];
//        db('sign')->insert($data);

        $nowtime = strtotime(date('Y-m-d H:i:s'));
        $datainfo = ([
            'user_id'  =>  $userid,
            'star' => $star,
            'over' => $over,
            'now' => $nowtime,
            'sign_state'=> 3
        ]);
        db('sign_info')->insert($datainfo);
        return json(['code' =>1,'msg'=>"申请补签成功"]);
    }











   // 签到版
    public function signInEdition(){
        $todytime = strtotime(date('Y-m-d'));
        $list = db('sign_info')
            ->join('user','user.user_id = sign_info.user_id')
            ->where('now','>',$todytime)
            ->order(['id'=>'desc'])
            ->select();
//        foreach ($list){
//
//        }
        return json(['code' =>1,'list'=>$list]);
    }
    //获取本周的年月日
    public function getWeek(){
        $number_wk=date("w",time());
        $date = [];
        if($number_wk==1){
            $date=[
                "1"=>date('Y-m-d'),
                'size'=>1
            ];
        }else if($number_wk==2){
            $date=[
                "1"=>date('Y-m-d',strtotime("-1 day")),
                "2"=>date('Y-m-d'),
                'size'=>2
            ];
        }else if($number_wk==3){
            $date=[
                "1"=>date('Y-m-d',strtotime("-2 day")),
                "2"=>date('Y-m-d',strtotime("-1 day")),
                "3"=>date('Y-m-d'),
                'size'=>3
            ];
        }else if($number_wk==4){
            $date=[
                "1"=>date('Y-m-d',strtotime("-3 day")),
                "2"=>date('Y-m-d',strtotime("-2 day")),
                "3"=>date('Y-m-d',strtotime("-1 day")),
                "4"=>date('Y-m-d'),
                'size'=>4
            ];
        }else if($number_wk==5){
            $date=[
                "1"=>date('Y-m-d',strtotime("-4 day")),
                "2"=>date('Y-m-d',strtotime("-3 day")),
                "3"=>date('Y-m-d',strtotime("-2 day")),
                "4"=>date('Y-m-d',strtotime("-1 day")),
                "5"=>date('Y-m-d'),
                'size'=>5
            ];
        }else if($number_wk==6){
            $date=[
                "1"=>date('Y-m-d',strtotime("-5 day")),
                "2"=>date('Y-m-d',strtotime("-4 day")),
                "3"=>date('Y-m-d',strtotime("-3 day")),
                "4"=>date('Y-m-d',strtotime("-2 day")),
                "5"=>date('Y-m-d',strtotime("-1 day")),
                "6"=>date('Y-m-d'),
                'size'=>6
            ];
        }else if($number_wk==0){
            $date=[
                "1"=>date('Y-m-d',strtotime("-6 day")),
                "2"=>date('Y-m-d',strtotime("-5 day")),
                "3"=>date('Y-m-d',strtotime("-4 day")),
                "4"=>date('Y-m-d',strtotime("-3 day")),
                "5"=>date('Y-m-d',strtotime("-2 day")),
                "6"=>date('Y-m-d',strtotime("-1 day")),
                "7"=>date('Y-m-d'),
                'size'=>7
            ];
        }
        return $date;
    }
}