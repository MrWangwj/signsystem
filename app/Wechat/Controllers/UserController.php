<?php
/**
 * Created by PhpStorm.
 * User: Mr.Wang
 * Date: 2017/8/9
 * Time: 22:04
 */

namespace App\Wechat\Controllers;


use App\Mail\ValidateCode;
use App\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{

    //个人信息
    public function info(User $user = null){
        if(!Cache::has($user->openid)){
            $openid = session('wechat_user')['id'];
            $user = User::user($openid);
        }
        return view('wechat.user.info', compact('user'));
    }

    //绑定账号界面
    public function bind(){
        $wechatUser = session('wechat_user');  //获取微信用户
        $openid = $wechatUser['id'];
        $user = User::user($openid);
        if($user) return redirect('/wechat/bindSuccess/'.$user->id);
        return view('wechat.user.bind');
    }

    //绑定账号
    public function setBind(){
        $this->validate(request(), [
            'id' => 'required|numeric',
            'validate' =>'required|size:6',
        ]);

        $wechatUser = session('wechat_user');  //获取微信用户
        if(request('validate') != session('bind_validate'))
            return ['code' => 0, 'msg' => '验证码错误'];
        $user = User::find(request('id')); //获取用户
        if(!$user)
            return ['code' => 0, 'msg' => '用户不存在'];
        if($user->id != $user->openid)
            return ['code' => 0, 'msg' => '该用户已绑定其他微信号'];



        $user->openid = $wechatUser['id'];  //赋值
        if(!$user->save())
            return ['code' => 0, 'msg' => '绑定失败，请重试'];
        return ['code' => 1, 'msg' => '绑定成功'];
    }

    //验证码
    public function bindValidate(){
        $this->validate(request(), [
            'id' => 'required|numeric',
        ]);
        $user = User::find(request('id')); //获取用户
        if(!$user)
            return ['code' => 0, 'msg' => '用户不存在'];

        $validate =  $text = str_random(6);
        session(['bind_validate' => $validate]);


        $set = [
            'subject' => '三月小组考勤系统微信认证',
            'view' => 'wechat.email.bindvalidate',
        ];
        $data = [
            'validate' => $validate,
        ];
        Mail::to($user->email)->send(new ValidateCode($set, $data));

        return ['code' => 1, 'msg' => 'success'];
    }

}