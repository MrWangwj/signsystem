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
        '__PUBLIC__' => '/SignSystem2/public/',
<<<<<<< HEAD
        '__ROOT__' => '/',
=======
        '__ROOT__' => '/SignSystem2/public/',
>>>>>>> d2b1ecea4297440ca601012c7072d3ddc7a76541
        '__CSS__' => '/SignSystem2/public/static/admin/css/',
        '__JS__' => '/SignSystem2/public/static/admin/js/',
        '__IMAGE__' => '/SignSystem2/public/static/admin/images/',
        '__MODULE__' => '/SignSystem2/public/index.php/admin',
    ],
    'classtime' =>[
    	[
    		'start' => '08:00:00',
    		'end' => '10:00:00'
    	],
    	[
    		'start' => '10:00:00',
    		'end' => '12:00:00'
    	],
    	[
    		'start' => '14:30:00',
    		'end' => '16:30:00'
    	],
    	[
    		'start' => '16:30:00',
    		'end' => '18:30:00'
    	],
    	[
    		'start' => '19:30:00',
    		'end' => '21:30:00'
    	],
    ],


];
