<?php

use think\Route;

return[
	'/' => 'home/homepage/index',
	'count/' => 'home/schedule/count',
	'schedule/' => 'home/schedule/index',
	'schedule/:otheruser' => ['home/schedule/other',['method' => 'get'], ['otheruser' => '\d{1,11}']],
	'admin' => 'admin/login/index',
	'attendance' => 'home/attendance/test',
	'login' => 'home/index/index',
];
