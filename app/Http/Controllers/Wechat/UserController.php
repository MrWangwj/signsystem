<?php

namespace App\Http\Controllers\Wechat;

use Cmzz\LaravelAliyunSms\AliyunSms;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\App;
use Overtrue\EasySms\EasySms;


class UserController extends Controller
{
    //发送短信验证码
    function bindValidate(){
        $smsService = App::make(AliyunSms::class);
        $smsService->send(strval(15670557736), 'SMS_125020107', ['code' => strval(1234)]);
        echo 1111;
    }

    //绑定微信
    function bind(){

    }
}
