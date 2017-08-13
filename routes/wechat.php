<?php

Route::group(['prefix' => 'wechat'], function(){



    /**
     *微信模块
     */

    //微信连接
    Route::any('/', '\App\Wechat\Controllers\WechatController@server');
    //设置菜单
    Route::any('/menu', '\App\Wechat\Controllers\WechatController@setMenu');
    //微信授权回调函数
    Route::any('/oauth_callback', '\App\Wechat\Controllers\WechatController@oauth_callback');


    /**
     *用户模块
     */

    //个人信息

    //绑定账号界面

    //绑定账号
    Route::post('/user/bind', '\App\Wechat\Controllers\UserController@setBind');
    //验证码
    Route::post('/user/bindValidate', '\App\Wechat\Controllers\UserController@bindValidate');


    /**
     * 考勤模块
     */

    //补签渲染

    //补签
    Route::post('/sign/patch', '\App\Wechat\Controllers\SignController@patchSign');
    //考勤记录

    //补签记录渲染

    //取消补签
    Route::post('/sign/cancelpatch', '\App\Wechat\Controllers\SignController@cancelPatch');
    //重新申请补签渲染

    //重新申请补签
    Route::post('/sign/repatch', '\App\Wechat\Controllers\SignController@setRepatch');


    /**
     * 我的课表
     */

    //我的课表

    //课表统计

    //导入课表渲染

    //导入课表
    Route::post('/course/input', '\App\Wechat\Controllers\CourseController@setInput');

    //导入课表验证码
    Route::get('/course/input/validate/{t?}', '\App\Wechat\Controllers\CourseController@getValidate');

    /**
     * 消息界面
     */
    Route::get('/noPermissions', '\App\Wechat\Controllers\MsgController@noPermissions');
    Route::get('/bindSuccess/{user}', '\App\Wechat\Controllers\MsgController@bindSuccess');


    /**
     * 微信授权界面
     */
    Route::group(['middleware' => ['wechat.power']], function (){
        //绑定账号界面
        Route::get('/user/bind', '\App\Wechat\Controllers\UserController@bind');
        //个人信息
        Route::get('/user/{user?}', '\App\Wechat\Controllers\UserController@info');


        //补签渲染
        Route::get('/sign/patch', '\App\Wechat\Controllers\SignController@patch');
        //考勤记录
        Route::get('/sign/signrecode', '\App\Wechat\Controllers\SignController@signRecode');
        //补签记录渲染
        Route::get('/sign/patchrecode', '\App\Wechat\Controllers\SignController@patchrecode');
        //重新申请补签渲染
        Route::get('/sign/repatch', '\App\Wechat\Controllers\SignController@repatch');


        //我的课表
        Route::get('/course/my', '\App\Wechat\Controllers\CourseController@course');
        //课表统计
        Route::get('/course/count', '\App\Wechat\Controllers\CourseController@count');
        //导入课表渲染
        Route::get('/course/input', '\App\Wechat\Controllers\CourseController@input');

    });
});