<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    //等录方法
    public function login(Request $request){
        //验证
        $this->validate($request,[
            'id' => 'required',
            'password' => 'required',
            'captcha' => 'required|captcha'
        ]);
        //判断
        if (Auth::attempt(['id' => request('id'), 'password' => request('password')])) {
            return ['code' => 0,'msg' => 'ok'];  
        }else{
            return ['code' => 1,'msg' => 'no'];  
        }
    }
    //登出方法
    public function logout(){
        Auth::logout();
        return redirect('/');
    }
    //生成验证码
    public function captcha(){
        return captcha_src();
    }
 
}
