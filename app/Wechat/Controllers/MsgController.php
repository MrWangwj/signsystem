<?php
/**
 * Created by PhpStorm.
 * User: Mr.Wang
 * Date: 2017/8/11
 * Time: 11:10
 */

namespace App\Wechat\Controllers;


use App\User;

class MsgController
{
    public function noPermissions(){
        return view('wechat.msg.noPermissions');
    }

    public function bindSuccess(User $user){
        return view('wechat.msg.bindSuccess', compact('user'));
    }

    public function noCourseLogin(){
        return view('wechat.msg.noCourseLogin');
    }
}