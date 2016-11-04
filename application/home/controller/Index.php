<?php
namespace app\home\controller;

use app\home\model\User;
use Org\Util\Date;
use think\Controller;
use Think\Model;
use think\Db;

session_start();
class Index extends Controller
{
    public function index()
    {
        return $this->fetch();
    }
    //登陆检测
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
            if($userid== $check["id"]){
                    return json(['code' => -1, 'msg' => "（注意：管理员正在审核，请稍后）"]);
            }
        }
        $data = ['id' => $userid, 'name' => $username, 'note' => $note];
        db('check')->insert($data);
        return json(['code' => 1]);
    }


    public function exitlogin(){
        session('userid',null);
        $this->redirect(url('index/index'));
    }

    public function test()
    {
        $j=0;
        $listNull = null;
        $list = Db::query("SELECT user.`user_id`,user.`name`,sign.`start_time`,sign.`over_time`,groups.`group_name`,SUM(sign.`over_time`-sign.`start_time`)AS times FROM user LEFT JOIN sign ON(user.`user_id`=sign.`user_id`) LEFT JOIN user_group ON(user.`user_id`=user_group.`user_id`) LEFT JOIN groups ON(user_group.`group_id` = groups.`group_id`)  
GROUP BY user.`user_id` HAVING SUM(sign.`over_time`-sign.`start_time`) ORDER BY times DESC");

        echo dump($list);
    }


}
