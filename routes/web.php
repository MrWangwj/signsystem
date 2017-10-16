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


Route::get('/test', 'UserController@test');


//后台界面
Route::group(['middleware' => 'checklogin', 'prefix' => 'admin'], function () {
    //后台总页
    Route::get('/',function(){
        return view('admin.index');
    });

    //获取登录用户的信息
    Route::get('/user', 'UserController@user');
    //获取用户信息
    Route::get('/user/list', 'UserController@users');
    //获取添加页中的组别职务信息
    Route::get('/user/add/info', 'UserController@getAddData');
    //添加用户
    Route::post('/user/add', 'UserController@addUser');
    //导入用户
    Route::post('/user/input', 'UserController@inputExcel');

    //编辑用户页获取数据
    Route::get('/user/edit/info', 'UserController@getEditUserInfo');

    //更新用户信息
    Route::post('/user/edit', 'UserController@editUser');

    //删除用户信息
    Route::post('/user/delete', 'UserController@userDelete');
});




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
