<?php
/**
 * Created by PhpStorm.
 * User: Mr.Wang
 * Date: 2017/8/9
 * Time: 22:07
 */

namespace App\Wechat\Controllers;


class SignController extends Controller
{

    //补签渲染
    public function patch(){
        return view('wechat.sign.patch');
    }

    //补签
    public function patchSign(){

    }

    //考勤记录
    public function signRecode(){
        return view('wechat.sign.signRecode');
    }

    //补签记录渲染
    public function patchrecode(){
        return view('wechat.sign.patchRecode');
    }

    //取消补签
    public function cancelPatch(){

    }

    //重新申请补签渲染
    public function repatch(){
        return view('wechat.sign.repatch');
    }

    //重新申请补签
    public function setRepatch(){

    }

}