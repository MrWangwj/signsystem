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
        }else{
        	$user = db('user', [], false)
        	->field("a.*,c.group_name,d.position_name")
			->alias("a")
        	->join('user_group b','a.user_id = b.user_id')
        	->join('groups c','b.group_id = c.group_id')
        	->join('positions d','a.position = d.position')
        	->where(['a.user_id' => session('userid')])
        	->find();
        	$this->assign('user',$user);
        }
    }
}