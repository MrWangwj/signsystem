<?php
/**
 * Created by PhpStorm.
 * User: wang
 * Date: 2016/9/29
 * Time: 17:22
 */
namespace app\home\validate;

use think\Validate;

class HomeValidate extends Validate
{
    protected $rule = [
        ['userid', 'require', '（注意：学号不能为空）'],
        ['username', 'require', '（注意：姓名不能为空）'],
        ['note', 'require', '（注意：备注信息不能为空）'],
        ['userid', '^\d{1,11}$', '（注意：请输入正确的学号）'],
//        ['username', '[x{4e00}-x{9fa5}]+/u', '（注意：你是外星人吗？）'],
    ];
}