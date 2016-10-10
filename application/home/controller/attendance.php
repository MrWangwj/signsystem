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

class Attendance extends Base
{
    public function index(){
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
        $number_wk=date("w",time())+1;
        $number_wOk = 7-date("w",time());
        $weekStart = strtotime(date('Y-m-d',strtotime("-$number_wk day")));//周一日期时间戳
        $weekOver = strtotime(date('Y-m-d',strtotime("+$number_wOk day")));//周日日期时间戳

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
}