<?php
// +----------------------------------------------------------------------
// | snake
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2022 http://baiyf.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: NickBai <1902822973@qq.com>
// +----------------------------------------------------------------------
namespace app\admin\controller;

use app\admin\model\Node;
use think\Controller;

class Base extends Controller
{
    public function _initialize()
    {
        if(empty(session('adminid'))){
            $this->redirect(url('login/index'));
        }else{
        	$admin =  db('user')->field('name')-> join('admin','admin.user_id = user.user_id','LEFT') -> where('admin.admin_id',session('adminid')) ->find();
        	$this->assign("admin", $admin);
        }

    }
}