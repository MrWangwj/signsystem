<?php
// +----------------------------------------------------------------------
// | snake
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2022 http://baiyf.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: NickBai <1902822973@qq.com>
// +----------------------------------------------------------------------
namespace app\admin\controller;

use app\admin\model\UserType;
use think\Controller;
use org\Verify;
//session_start();
class Login extends Controller
{
    //登录页面
    public function index()
    {
        return $this->fetch('/login');
    }

    //登录操作
    public function doLogin()
    {
        $username = input("param.username");
        $password = input("param.password");
        $code = input("param.code");

        $result = $this->validate(compact('username', 'password', "code"), 'AdminValidate');
        if(true !== $result){
            return json(['code' => -5, 'data' => '', 'msg' => $result]);
        }

        if (!captcha_check($code)) {
            return json(['code' => -4, 'data' => '', 'msg' => '验证码错误']);
        }

        $hasUser = db('admin')->where('admin_id', $username)->find();
//        echo dump($hasUser);
        if(empty($hasUser)){
            return json(['code' => -1, 'data' => '', 'msg' => '管理员不存在']);
        }

        if($password != $hasUser['password']){
            return json(['code' => -2, 'data' => '', 'msg' => '密码错误']);
        }
        session('adminid', $username);
        return json(['code' => 1, 'data' => url('index/index'), 'msg' => '登录成功']);
    }

    //退出操作
    public function loginOut()
    {
        session('adminid', null);
        $this->redirect(url('index'));
    }
}