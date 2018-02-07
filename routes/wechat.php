<?php
/**
 * Created by PhpStorm.
 * User: wangweijin
 * Date: 2018/1/30
 * Time: 上午8:43
 */
//

use \Illuminate\Support\Facades\Route;


Route::prefix('wechat')->namespace('Wechat')->group(function (){



    //微信公众号用户绑定
    Route::prefix('bind')->group(function (){

        //页面渲染
        Route::get('/', function (){
            return view('wechat.bind');
        });

        //获取验证码
        Route::get('/validate','UserController@bindValidate');

        //绑定事件
        Route::post('/set', 'UserController@bind');
    });


    Route::get('/', function (){
       return view('wechat.index');
    });
});