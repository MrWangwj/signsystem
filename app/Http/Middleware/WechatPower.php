<?php

namespace App\Http\Middleware;

use App\User;
use Closure;
use Illuminate\Support\Facades\Cache;

class WechatPower
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */

    //排除不需要绑定用户的路由
    protected $except = [
        '/wechat/user/bind',
        '/wechat'
    ];

    //TODO:: 不用微信授权的界面， 上线时删除

    protected $test = [
        '/wechat',
        '/wechat/course/count'
    ];

    public function handle($request, Closure $next)
    {
        //判断session 是否有openid
        $target_url = $request->server()['REQUEST_URI'];

        //TODO:: 直接进入
        if(in_array($target_url, $this->test)){
            return $next($request);
        }

        $app = app('wechat');
        $oauth = $app->oauth;


        if (!session()->has('wechat_user')) {
            session(['target_url' => $target_url]);
            return $oauth->redirect();
        }

        //微信用户id
        $openid = session('wechat_user')['id'];
        if(in_array($target_url, $this->except) || Cache::has($openid))
            return $next($request);

        //用户信息
        $user = User::user($openid);

        if($user){
            Cache::forever($openid, $user->id);  //设置缓存
            return $next($request);
        }else{
            return redirect('/wechat/noPermissions');
        }

    }
}
