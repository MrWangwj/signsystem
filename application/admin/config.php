<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------
// $Id$
return [

    //模板参数替换
    'parse_str'=>[
        '__PUBLIC__'=>'/SignSystem2/public/',
        '__ROOT__' => '/',
        '__CSS__'     =>  '/SignSystem2/public/static/admin/css/',
        '__JS__'     =>  '/SignSystem2/public/static/admin/js/',
        '__IMAGE__'     =>  '/SignSystem2/public/static/admin/images/',
        '__MODULE__'=>'/SignSystem2/public/index.php/admin',
    ],

    //管理员状态
    'user_status' => [
        '1' => '正常',
        '2' => '禁止登录'
    ],
    //角色状态
    'role_status' => [
        '1' => '启用',
        '2' => '禁用'
    ]
];
