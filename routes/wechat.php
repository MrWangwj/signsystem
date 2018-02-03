<?php
/**
 * Created by PhpStorm.
 * User: wangweijin
 * Date: 2018/1/30
 * Time: 上午8:43
 */

Route::prefix('wechat')->group(function (){
    Route::get('/', function (){
       return view('wechat.index');
    });
});