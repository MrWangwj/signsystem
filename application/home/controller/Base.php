<?php
/**
 * Created by PhpStorm.
 * User: wang
 * Date: 2016/10/4
 * Time: 13:58
 */
namespace app\home\controller;

use app\home\model\User;
use think\Controller;

class Base extends Controller
{
    public function _initialize(){
        if(empty(session('userid'))){
            $this->redirect(url('index/index'));
        }
    }
}