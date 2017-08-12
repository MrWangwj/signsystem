<?php
/**
 * Created by PhpStorm.
 * User: Mr.Wang
 * Date: 2017/8/9
 * Time: 22:12
 */

namespace App\Wechat\Controllers;


class CourseController extends Controller
{
    //我的课表
    public function course(){
        return view('wechat.course.course');
    }

    //课表统计
    public function  count(){
        return view('wechat.course.count');
    }

    //导入课表渲染
    public function input(){
        return view('wechat.course.input');
    }

    //导入课表
    public function setInput(){

    }

}