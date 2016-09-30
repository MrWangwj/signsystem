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
use app\admin\model\UserType;

class Sign extends Base
{
    //角色列表
    public function index()
    {
        return $this->fetch();
    }
    public function roleadd()
    {
        return $this->fetch();
    }
    public function roleadit()
    {
        return $this->fetch();
    }

}