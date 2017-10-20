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
//    Route::post('/user/add', 'UserController@addUser');
//    //导入用户
//    Route::post('/user/input', 'UserController@inputExcel');
//
//    //编辑用户页获取数据
//    Route::get('/user/edit/info', 'UserController@getEditUserInfo');
//
//    //更新用户信息
//    Route::post('/user/edit', 'UserController@editUser');
//
//    //删除用户信息
//    Route::post('/user/delete', 'UserController@userDelete');


    //获取用户的课表信息
    Route::get('/user/course/get', 'CourseController@getUserCourse');
    //添加用户课程
    Route::post('/user/course/add', 'CourseController@addUserCourse');
    //修改用户课程
    Route::post('/user/course/edit', 'CourseController@editUserCourse');
    //删除用户课程
    Route::post('/user/course/delete', 'CourseController@deleteUserCourse');
    //清除此用户的所有信息
    Route::post('/user/course/clear', 'CourseController@clearUserAllCourse');
    //导入用户课表
    Route::post('/user/course/input', 'CourseController@inputUserAllCourse');




    //获取用户违规信息
    Route::get('/user/get/illegal', 'IllegalController@illegalInfo');

    //添加用户违规
    Route::post('/user/set/illegal', 'IllegalController@setIllegal');

    //用户违规惩罚
    Route::post('/user/set/punish', 'IllegalController@setPunish');

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
