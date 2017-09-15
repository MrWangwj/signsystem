<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
include_once ('wechat.php');

<<<<<<< HEAD
//登录验证
Route::get('/',function(){
    return view('admin.index');
})->middleware('checklogin');

//登出验证
Route::get('/login', function () {
    return view('admin.login');
})->middleware('checkLogout');
=======
Route::get('/', function () {
    return view('welcome');
});

Route::get('/count', '\App\Wechat\Controllers\CourseController@test');
>>>>>>> 2ea40ac03372867e33afbf1040dfe1118495e6be

//后台登陆模块
Route::group(['prefix' => 'sign'], function(){
    Route::post('/login', 'LoginController@login');
    Route::post('/logout', 'LoginController@logout');
    Route::post('/check', 'LoginController@check');
    Route::post('/captcha','LoginController@captcha');
});
    
Route::group(['prefix' => 'user'],function(){
    Route::post('/list','LoginController@index');
});
