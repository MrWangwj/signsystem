<?php

namespace App\Http\Controllers\Admin;

use App\Model\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    //人员登录
    function login(){
        $this->validate(\request(), [
            'account' => 'required',
            'password' => 'required',
            'validate' => 'required|captcha',
        ]);

        $user = User::where('account', \request('account'))->where('password', md5(md5(\request('password'))))->first();

        if($user){
            session(['user' => $user]);
            return $this->returnJSON(1, 'success');
        }

        return $this->returnJSON(0, '账号或密码错误');
    }

    function logout(Request $request){
        $request->session()->forget('user');
        return redirect('/admin/login');
    }
}
