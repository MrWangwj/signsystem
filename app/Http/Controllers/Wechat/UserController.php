<?php

namespace App\Http\Controllers\Wechat;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Overtrue\EasySms\EasySms;


class UserController extends Controller
{
    //发送短信验证码
    function bindValidate(){


        $config = [
            // HTTP 请求的超时时间（秒）
            'timeout' => 5.0,

            // 默认发送配置
            'default' => [
                // 网关调用策略，默认：顺序调用
                'strategy' => \Overtrue\EasySms\Strategies\OrderStrategy::class,

                // 默认可用的发送网关
                'gateways' => [
                    'yunpian', 'aliyun', 'alidayu', 'qcloud'
                ],
            ],
            // 可用的网关配置
            'gateways' => [
                'errorlog' => [
                    'file' => public_path().'/easy-sms.log',
                ],
                'yunpian' => [
                    'api_key' => '824f0ff2f71cab52936axxxxxxxxxx',
                ],
                'aliyun' => [
                    'access_key_id' => 'LTAI6yWmXCOjpft4',
                    'access_key_secret' => '9pJQjXA0mCJ1AqbkP9JIvbpULZ0LSq',
                    'sign_name' => 'wangweijin',
                ],
                'alidayu' => [
                    'app_key' => 'LTAI6yWmXCOjpft4',
                    'app_secret' => '9pJQjXA0mCJ1AqbkP9JIvbpULZ0LSq',
                    'sign_name' => 'wangweijin',
                ],
                'qcloud' => [
                    'sdk_app_id' => '1400068619', // SDK APP ID
                    'app_key' => 'e7c275fdb56a0526bafcc6991d8f5671', // APP KEY
                ],
            ],
        ];


        $easySms = new EasySms($config);

        $easySms->send(15670557736,[
            'content'  => '您的验证码为: 6379',
            'template' => 'SMS_125020107',
            'data' => [
                'code' => 6379
            ],
        ],['alidayu']);


        echo 1111;
    }

    //绑定微信
    function bind(){

    }
}
