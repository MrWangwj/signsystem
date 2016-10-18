<?php
/**
 * Created by PhpStorm.
 * User: wang
 * Date: 2016/10/18
 * Time: 8:33
 */
namespace app\admin\controller;

use app\admin\model\Node;
use app\admin\model\UserType;
class Statistics extends Base{
    public function index(){
        return $this->fetch();
    }
    public function getAllTime(){
       $list =  Db::query("SELECT * 
              FROM SIGN,user_group,groups 
              WHERE sign.user_id = user_group.user_id AND user_group.group_id=groups.group_id");
    }
}