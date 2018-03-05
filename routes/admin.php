<?php
/**
 * Created by PhpStorm.
 * User: wangweijin
 * Date: 2018/1/30
 * Time: 上午8:43
 */

Route::prefix('admin')->group(function (){
    //用户登录
    Route::get('/login',function (){
        return view('admin.login');
    });
    Route::get('/login/validate', function () {
        return captcha_src();
    });

    Route::post('/login', 'Admin\LoginController@login');

    //页面渲染
    Route::get('/', function (){
        return view('admin.index');
    });
});