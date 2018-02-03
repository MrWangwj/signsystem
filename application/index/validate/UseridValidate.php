<?php
/**
 * Created by PhpStorm.
 * User: wang
 * Date: 2016/10/2
 * Time: 17:14
 */
namespace app\home\validate;

use think\Validate;

class UseridValidate extends Validate
{
    protected $rule = [
        ['userid', 'require', '（注意：学号不能为空）'],
        ['userid', '^\d{11}$', '（注意：请输入正确的学号）'],
    ];
}