<?php
/**
 * Created by PhpStorm.
 * User: Mr.Wang
 * Date: 2017/8/9
 * Time: 22:12
 */

namespace App\Wechat\Controllers;

use App\Course;
use App\Seting;
use App\User;
use GuzzleHttp\Client;
use GuzzleHttp\Cookie\CookieJar;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\DomCrawler\Crawler;
use Illuminate\Support\Facades\Cache;

class CourseController extends Controller
{
    //我的课表
    public function course(User $user = null){
        if(!$user->exists){
            $openid = session('wechat_user')['id'];
            $user = User::user($openid);
        }
        $user->load('courses');
        $startSchool = Seting::startSchool()->first();
        return view('wechat.course.course', compact(['user','startSchool']));
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
        $this->validate(request(), [
            'user_id' => 'required|numeric',
            'password' => 'required',
            'validate' =>'required',
        ]);
        $openid =session('wechat_user')['id'];
        //登录，获取登录状态
        $text = Course::login(request(['user_id','password', 'validate']));

        if($text != '正在加载权限数据...') return ['code' => '0', 'msg' => $text];
        else{
            Course::getCourse($openid);
            return ['code' => '1', 'msg' => '登录成功'];
        }

    }

    //登录验证码
    public function getValidate($t = 0){
        return Course::validate($t);
    }


    //显示导入信息
    public function show(){
        $openid =session('wechat_user')['id'];
        //判断是否有缓存
        if(!Cache::has($openid.'_course'))
            return redirect('/wechat/noCourseLogin');
        $courses = Cache::get($openid.'_course');
        return view('wechat.course.show', compact('courses'));
    }

    //导入课表
    public function inputShow(){
        //判断是否有课表导入
        $openid =session('wechat_user')['id'];
        if(!Cache::has($openid.'_course'))
            return redirect('/wechat/noCourseLogin');

        //分割字符串成为课表数据
        $courses = Course::getFrmateCourse(Cache::get($openid.'_course'));

        //创建课表信息
        $course_id = [];
        foreach ($courses as $course) {
            $course_id[] = (Course::firstOrCreate($course))->id;
        }

        //保存用户的课表
        $user = User::user($openid);
        $user->courses()->sync($course_id);


        //TODO: 上线时清除缓存
        Cache::forget($openid.'_course');
        return ['code' => '1', 'msg' => '导入成功'];
    }
}