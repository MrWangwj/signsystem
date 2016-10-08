<?php
/**
 * Created by PhpStorm.
 * User: wang
 * Date: 2016/10/6
 * Time: 21:54
 */
namespace app\home\controller;

use app\home\model\User;
use think\Controller;

class Attendance extends Base
{
    public function index(){
        return $this->fetch();
    }
}