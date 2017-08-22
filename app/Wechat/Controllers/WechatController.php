<?php
/**
 * Created by PhpStorm.
 * User: Mr.Wang
 * Date: 2017/8/9
 * Time: 22:01
 */

namespace App\Wechat\Controllers;


use App\User;
use EasyWeChat\Foundation\Application;
use Illuminate\Support\Facades\Cache;

class WechatController extends Controller
{

    //微信连接
    public function server(Application $wechat){
        $wechat->server->setMessageHandler(function($message) {
            $openId = $message->FromUserName;

            //关注时的提示
            if(strtolower($message->Type) == 'event' && strtolower($message->Event) == 'subscribe') return '欢迎关注三月考勤';

            $user = User::user($openId);
            //判断用户是否有权限
            if(!$user) return '没有操作权限';

            switch (strtolower($message->MsgType)){
                case 'event':{
                    switch (strtolower($message->Event)){
                        case 'click': {
                            switch ($message->EventKey){
                                case 'SIGN_SIGN': {
                                    $r = $user->setSign();
                                    return $r['msg'];
                                    break;
                                }
                                case 'SIGN_CHECKOUT': {
                                    $r = $user->setCheckout();
                                    return $r['msg'];
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    break;
                }
                default:
                    return '待开发';
            }


//            return $messageId;
        });
        return $wechat->server->serve();
    }

    //设置菜单
    public function setMenu(){
        if(!env('WECHAT_SET_MENU',true))
            return redirect('/wechat/noInterface');
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
                        "url"  => url('/wechat/course/show'),
                    ],
                    [
                        "type" => "view",
                        "name" => "导入课表",
                        "url"  => url('/wechat/course/input'),
                    ],
                    [
                        "type" => "view",
                        "name" => "课表统计",
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
//        header('location:'.$targetUrl);
        return redirect($targetUrl);
    }
}





/*$notice = $wechat->notice;
$userOpenId = $message->FromUserName;
$templateId = 'S-5Ed_iN7nhmcvw10lK9Qld1z4zSWLwEe7OVc-viuC0';
$url = url('/wechat/sign/signrecode');
$data = [
    'time' => date('Y-m-d H:i:s', time()),
];
$messageId = $notice->to($userOpenId)->uses($templateId)->andUrl($url)->data($data)->send();*/