<?php
/**
 * Created by PhpStorm.
 * User: wang
 * Date: 2016/10/4
 * Time: 12:30
 */
namespace app\home\controller;

use app\home\model\User;
use think\Controller;

class Homepage extends Base
{
    public function index()
    {
        return $this->fetch();
    }
}