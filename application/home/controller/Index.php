<?php
namespace app\home\controller;

use app\home\model\User;
use Org\Util\Date;
use think\Controller;
session_start();
class Index extends Controller
{
    public function index()
    {
        return $this->fetch();
    }
    //签到检测
    public function docheck(){
        $userid = $_POST['userid'];
        $result = $this->validate(compact( 'userid'), 'UseridValidate');
        if(true !== $result){
            return json(['code' => -1, 'msg' => $result]);
        }
        $result_user = db('user')
            ->field("user_id")
            ->select();
        foreach($result_user as $user){
            if($userid == $user["user_id"]){
                session('userid', $userid);
                return json(['code' => 1, 'msg' => "成功"]);
            }
        }
        return json(['code' => -1, 'msg' => "（注意：你来自外星吗？）"]);

    }
    //申请加入
    public function doLogin()
    {
        $userid = $_POST['userid'];
        $username = $_POST['username'];
        $note = $_POST["note"];
        $result = $this->validate(compact('username', 'userid', "note"), 'HomeValidate');
        if(true !== $result){
            return json(['code' => -1, 'msg' => $result]);
        }
        $result_user = db('user')
            ->field("user_id,name")
            ->select();
        foreach($result_user as $user){
            if($userid == $user["user_id"]){
                if($username==$user["name"]){
                    return json(['code' => -1, 'msg' => "（注意：该用户已经存在）"]);
                }else{
                    return json(['code' => -1, 'msg' => "（注意：该学号已注册，用户名个学号不匹配）"]);
                }

            }
        }
        $check = db('check')
            ->field("id,name")
            ->select();
        foreach($check as $check){
            if($userid== $check["id"]&&$username==$check["name"]){
                    return json(['code' => -1, 'msg' => "（注意：管理员正在审核，请稍后）"]);
            }
        }
        $data = ['id' => $userid, 'name' => $username, 'note' => $note];
        db('check')->insert($data);
        return json(['code' => 1]);
    }

    public function test(){
        $nowday = strtotime(date('Y-m-d',time()));
        $sum = $this->getDayTime($nowday);
        echo dump($sum);
//        $number_wk=date("w",time())-1;
//        if($number_wk==-1){
//            $number_wk=6;
//        }
//        $number_wOk = 7-$number_wk;
//        $number_last = $number_wk+7;
//        $weekStart = strtotime(date('Y-m-d',strtotime("-$number_wk day")));//本周一日期时间戳
//        $weekOver = strtotime(date('Y-m-d',strtotime("+$number_wOk day")));//下周一日期时间戳
//        $weekLast = strtotime(date('Y-m-d',strtotime("-$number_last day")));//上周一日期时间戳
//        //某人本周在线时长
//        $list = db('sign')
//            -> join('user','user.user_id = sign.user_id')
//            -> where('state','<>',0)
//            ->where("sign.user_id",'20151515135')
//            ->where("start_time","between","$weekLast,$weekStart")
//            ->select();
//        echo dump($list);
    }

}
