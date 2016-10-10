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
        $userid = session('userid');
        $list  = db('sign_info')
            -> where('user_id','20151515111')
            ->group('now desc')
            ->limit(1)
            ->select();
            echo $list[0]['now'];
//            echo strtotime($list[0]['now']);
        $time = $list[0]['now'];
            echo date("Y-m-d H:i:s",$time);
//        if(empty($list)){
////            return json(['code' => -1, 'time' => "暂无记录"]);
//            echo 1;
//        }else{
//            echo 2;
////            return json(['code' => 1,'name'=>$list[0]['name'], 'time' =>date('Y-m-d H:i:s',strtotime("$list[0]['now']"))]);
//        }
    }
}
