<?php
/**
 * Created by PhpStorm.
 * User: Mr.Wang
 * Date: 2017/8/9
 * Time: 22:01
 */

namespace App\Wechat\Controllers;


use EasyWeChat\Foundation\Application;

class WechatController extends Controller
{

    //微信连接
    public function server(Application $wechat){
        $wechat->server->setMessageHandler(function($message){
            //
            return "欢迎关注 overtrue！";
        });
        return $wechat->server->serve();
    }

    //设置菜单
    public function setMenu(){
        $app = app('wechat');
        $menu = $app->menu;
        $buttons = [
            [
                "name"       => "考勤",
                "sub_button" => [
                    [
                        "type" => "click",
                        "name" => "签到",
                        "key"  => "SIGN_SIGN"
                    ],
                    [
                        "type" => "click",
                        "name" => "签退",
                        "key"  => "SIGN_CHECKOUT"
                    ],
                    [
                        "type" => "view",
                        "name" => "补签",
                        "url" => url('/wechat/sign/patch'),
                    ],

                ],
            ],
            [
                "name"       => "个人",
                "sub_button" => [
                    [
                        "type" => "view",
                        "name" => "个人信息",
                        "url"  => url('/wechat/user'),
                    ],
                    [
                        "type" => "view",
                        "name" => "绑定账号",
                        "url"  => url('/wechat/user/bind'),
                    ],
                    [
                        "type" => "view",
                        "name" => "考勤记录",
                        "url" => url('/wechat/sign/signrecode'),
                    ],
                    [
                        "type" => "view",
                        "name" => "补签记录",
                        "url" => url('/wechat/sign/patchrecode'),
                    ],
                ],
            ],

            [
                "name"       => "课表",
                "sub_button" => [
                    [
                        "type" => "view",
                        "name" => "我的课表",
                        "url"  => url('/wechat/course/my'),
                    ],
                    [
                        "type" => "view",
                        "name" => "导入课表",
                        "url"  => url('/wechat/course/input'),
                    ],
                ],
            ],
        ];
        $menu->add($buttons);
    }

    //微信授权回调函数
    public function oauth_callback(){

        $app = app('wechat');
        $oauth = $app->oauth;
        // 获取 OAuth 授权结果用户信息
        $user = $oauth->user();
        session(['wechat_user' => $user->toArray()]);
        $targetUrl = session()->has('target_url') ? session('target_url') : '/';
//        header('location:'.url($targetUrl));
        return redirect(url($targetUrl));
    }
}