<?php
/**
 * Created by PhpStorm.
 * User: wang
 * Date: 2016/10/6
 * Time: 21:54
 */
namespace app\home\controller;

use app\home\model\User;
use think\Controller;
use think\Db;

class Attendance extends Base
{
    public function index(){
        return $this->fetch();
    }
    public function test(){
        $group = db('groups', [], false)
                ->select();
        $this->assign('group',$group);
        return $this->fetch();
    }
    //获取某人最后在线的时间
    public function lastOnline(){
        $userid = session('userid');
        $list  = db('sign_info')
            -> where('user_id',$userid)
            ->group('now desc')
            ->limit(1)
            ->select();
        if(empty($list)){
            return json(['code' =>-1, 'time' => "暂无记录"]);
        }else{
            $time = $list[0]['now'];
            return json(['code' =>1,'time' =>date("Y-m-d H:i:s",$time)]);
        }
    }
    //把某人当前周的在线时长返回到前台页面
    public function getWeekSum(){
        $userid = session('userid');
        $sumtime  = 0;
        $number_wk=date("w",time())-1;
        if($number_wk==-1){
            $number_wk=6;
        }
        $number_wOk = 7-$number_wk;

        $weekStart = strtotime(date('Y-m-d',strtotime("-$number_wk day")));//周一日期时间戳
        $weekOver = strtotime(date('Y-m-d',strtotime("+$number_wOk day")));//下周一日期时间戳

        $list = db('sign')
            -> join('user','user.user_id = sign.user_id')
            -> where('state','<>',0)
            ->where("sign.user_id",$userid)
            ->where("start_time","between","$weekStart,$weekOver")
            ->select();
        if(empty($list)){
            return json(['code' => -1, 'time' => "暂无记录"]);
        }else{
            foreach ($list as $v){
                $time = $v['over_time'] - $v['start_time'];
                $sumtime = $sumtime+$time;
            }
            return json(['code' => 1,'name'=>$list[0]['name'], 'time' => $this->getTime($sumtime)]);
        }
    }

    //把某人的总在线时长返回到前台页面
    public function getSum(){
        $userid = session('userid');
        $sumtime= 0;
        $list = db('sign')
            -> join('user','user.user_id = sign.user_id')
            -> where('state','<>',0)
            ->where("sign.user_id",$userid)
            ->select();
        if(empty($list)){
            return json(['code' => -1, 'time' => "暂无记录"]);
        }else{
            foreach ($list as $v){
                $time = $v['over_time'] - $v['start_time'];
                $sumtime = $sumtime+$time;
            }
            return json(['code' => 1,'name'=>$list[0]['name'], 'time' => $this->getTime($sumtime)]);
        }
    }

    //用于计算某人的总在线时长
    function getTime($time) {
        $int = (int) substr($time, 0, 10);
        if ($int>=86400){
            $time = sprintf('%d天%d小时%d分钟', floor($int/86400),floor(($int%86400)/3600),floor(($int%86400)%3600)/60);
            return $time;
        }
        if ($int>=3600&&$int<86400){
            $time = sprintf('%d小时%d分钟', floor(($int/3600)),floor(($int%3600)/60));
            return $time;
        }
        if($int>0&&$int<3600){
            $time = sprintf('%d分钟', floor(($int/60)));
            return $time;
        }
    }
    
//    返回某人本周和上周在线时长
    function getSbTime(){
        $number_wk=date("w",time())-1;
        if($number_wk==-1){
            $number_wk=6;
        }
        $nowWeek = null;
        $lastWeek = null;
//        $number_wOk = 7-$number_wk;
        $number_last = $number_wk+7;
        $weekStart = strtotime(date('Y-m-d',strtotime("-$number_wk day")));//本周一日期时间戳
        $weekLast = strtotime(date('Y-m-d',strtotime("-$number_last day")));//上周一日期时间戳
        for($i=0;$i<7;$i++){
            $weekStart = $weekStart + $i*86400;
            $nowWeek[$i] =  $this->getDayTime($weekStart);
        }
        for($i=0;$i<7;$i++){
            $weekLast = $weekLast + $i*86400;
            $lastWeek[$i] =  $this->getDayTime($weekLast);
        }
//        return $lastWeek;
        return json(['now'=>$nowWeek, 'last' => $lastWeek]);
    }

    //获取某人某天在线时长(分钟)
    public function getDayTime($nowday){
        $userid = session('userid');
        $sumtime = 0;
        //某人某天记录
        $dayover = 1476633600+86400;
        $list = db('sign')
            -> join('user','user.user_id = sign.user_id')
            -> where('state','<>',0)
            ->where("sign.user_id",$userid)
            ->where("start_time","between","$nowday,$dayover")
            ->select();
        if(empty($list)){
            return 0;
        }else{
            foreach ($list as $v){
                $time = $v['over_time'] - $v['start_time'];
                $sumtime = $sumtime+$time;
            }
            return round($sumtime/60);
        }
    }



    public function getThisTime(){
        $where =[];
        $week = count(getNowWeek());
        input('post.group') && $where['groups.group_id']= ['EQ', input('post.group')]; 
        input('post.week') && $week = input('post.week');   

        
        $weekStart = strtotime(getWeekDate($week)[0]." 00:00:00");//周一日期时间戳
        $weekOver = strtotime(getWeekDate($week)[6]." 23:59:59");//下周一日期时间戳

        $where['sign.start_time'] = ['EGT', $weekStart];
        $where['sign.over_time'] = ['LT', $weekOver];
        $where['sign.state'] = ['NEQ', 0];

        // $list = db('user', [], false)
        //         ->field('user.user_id,user.name,sign.start_time,sign.over_time,groups.group_name,SUM(sign.over_time-sign.start_time)AS times')
        //         ->join('sign', 'user.user_id=sign.user_id', 'LEFT')
        //         ->join('user_group', 'user.user_id=user_group.user_id', 'LEFT')
        //         ->join('groups', 'user_group.group_id = groups.group_id', 'LEFT')
        //         ->where($where)
        //         ->group('user.user_id')
        //         // ->having('SUM(sign.over_time-sign.start_time)')
        //         ->order('times desc')
        //         ->select();

            $list = db('sign',[], false)
                ->field('user.user_id,user.name,sign.start_time,sign.over_time,groups.group_name,SUM(sign.over_time-sign.start_time)AS times')
                ->join('user', 'sign.user_id=user.user_id')
                ->join('user_group', 'user.user_id=user_group.user_id')
                ->join('groups', 'user_group.group_id = groups.group_id')
                ->where($where)
                ->group('user.user_id')
                // ->having('SUM(sign.over_time-sign.start_time)')
                ->order('times desc')
                ->select();
        return $list;
    }
    public function getNo(){
        $list = $this->getThisTime();
        $where=[];
        input('post.group') && $where['groups.group_id']= ['EQ', input('post.group')];

        $list2 = db('user', [], false)
                ->field('user.user_id,user.name,groups.group_name')
                ->join('user_group', 'user.user_id=user_group.user_id', 'INNER')
                ->join('groups', 'user_group.group_id = groups.group_id', 'INNER')
                ->where($where)
                ->order('groups.group_name')
                ->select();
        $listNull = [];
        $j = 0;

        foreach ($list2 as $key => $value) {
            $status = false;
            foreach ($list as $key2 => $value2) {

                if($value2['user_id'] == $value['user_id']){
                    $status = true;
                    break;
                }

            }

            if(!$status) {
                $listNull[$j] = $value; 
                $j++;  
            }
        }
        return json(['list' => $listNull, 'count' => count($listNull)]);
    }
}