<?php

namespace App\Http\Middleware;

use App\Teacher;
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
    ];


    public function handle($request, Closure $next)
    {


        $app = app('wechat');
        $oauth = $app->oauth;

        //判断session 是否有openid
        $target_url = $request->server()['REQUEST_URI'];
        if (!session()->has('wechat_user')) {
            //TODO:: 后期若做纯Vue的话需修改
            if($target_url == '/wechat') session(['target_url' => $target_url.'#/course/count']);
            else session(['target_url' => $target_url]);
            return $oauth->redirect();
        }

        //微信用户id
        $openid = session('wechat_user')['id'];
        if(in_array($target_url, $this->except) || Cache::has($openid))
            return $next($request);

        //判断若为教师访问统计界面，则进入
        if($target_url == '/wechat' && Cache::has($openid.'_teacher')){
            return $next($request);
        }

        //用户信息
        $user = User::user($openid);

        if($user){
            Cache::forever($openid, $user->id);  //设置缓存
            return $next($request);
        }else{

            // 判断是否是教师。
            $teacher = Teacher::where('openid', $openid)->first();
            if($target_url == '/wechat' && $teacher){
                Cache::forever($openid.'_teacher', $teacher->id);  //设置缓存
                return $next($request);
            }else{
                return redirect('/wechat/noPermissions');
            }

        }

    }
}
