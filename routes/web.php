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

Route::get('/admin',function(){
    return view('admin.index');
})->middleware('checklogin');

//登出验证
Route::get('/login', function () {
    return view('admin.login');
})->middleware('checklogout');

Route::get('/', function () {
    return view('welcome');
});

Route::get('/count', '\App\Wechat\Controllers\CourseController@test');

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
