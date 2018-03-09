<?php
/**
 * Created by PhpStorm.
 * User: Mr.Wang
 * Date: 2017/8/9
 * Time: 22:12
 */

namespace App\Wechat\Controllers;

use App\Course;
use App\Grouping;
use App\Location;
use App\Position;
use App\Seting;
use App\User;
use GuzzleHttp\Client;
use GuzzleHttp\Cookie\CookieJar;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Overtrue\LaravelPinyin\Facades\Pinyin;
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
        $userId = Cache::get(session('wechat_user')['id']);
        return view('wechat.course.input',compact('userId'));
    }

    //导入课表
    public function setInput(){

        $this->validate(request(), [
            'password' => 'required',
            'validate' =>'required',
        ]);
        $openid =session('wechat_user')['id'];

        if(Cache::has($openid)){
            $userId = Cache::get($openid);
        }else{
            $userId = User::user($openid)->id;
        }


        if($userId < 10000000000) $school = 'xinke';
        else $school = 'hist';


        $data = request(['password', 'validate']);
        $data['user_id'] = $userId;

        //登录，获取登录状态
        $text = Course::login($data, $school);

        if($text != '正在加载权限数据...') return ['code' => 0, 'msg' => $text];
        else{
            Course::getCourse($openid, $school);
            return ['code' => 1, 'msg' => '登录成功'];
        }

    }

    //登录验证码
    public function getValidate($t = 0){
        $openid = session('wechat_user')['id'];
        if(Cache::has($openid)){
            $userId = Cache::get($openid);
        }else{
            $userId = User::user($openid)->id;
        }
        if($userId<10000000000){
            return Course::validate($t, 'xinke');
        }else{
            return Course::validate($t, 'hist');
        }


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
        $result = Course::getFrmateCourse(Cache::get($openid.'_course'));

        if(count($result['error']) > 0){
            return ['code' => 0, 'msg' => $result['error'][0]];
        }


        $courses = $result['data'];
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

    //获取课表统计信息
    public function getCount(){
        $nowWeek    = Seting::getNowWeek();  //获得当前周
        $groups     = Grouping::all(['id', 'name'])->toArray(); //获得分组
        $positions  = Position::all(['id', 'name'])->toArray(); //获得职务
        $locations  = Location::all(['id', 'name'])->toArray(); //地址


        $allStudents   = User::with('grouping', 'positions', 'courses')->orderBy('name_py')->get(['id', 'name', 'grouping_id','sex', 'location_id']);  //获得学生的信息


        // 以id为键排列
        $students = [];
        $grades = [];
        foreach ($allStudents->toArray() as $student){
            //获取年级
            $tmpGrade = intval(substr($student['id'], 2,2));
            if($tmpGrade != 0 && !in_array($tmpGrade,$grades)) $grades[] = $tmpGrade;

            $students['s'.$student['id']] = $student;
        }

        return compact(['nowWeek', 'groups', 'positions', 'grades', 'students', 'locations']);
    }


    public function test(){

//        data = {
//            nowWeek:
//            groups:{},
//            positions:{},
//            grades:{},
//            students:{
//                id:...,
//                name:...,
//                sex:...,
//                group_id:...,
//                position_id:...,
//                courses:{
//                    ...
//                }
//            }
//        }

        $users = User::all();

        foreach ($users as $user) {
            $name_pys = Pinyin::convert($user->name);
            $name_py = "";
            foreach ( $name_pys as $value){
                $name_py .= $value." ";
            }
            echo $name_py;
            $user->name_py = $name_py;
            $user->save();
            echo $user->name;
        }


//        $nowWeek    = Seting::getNowWeek();  //获得当前周
//        $groups     = Grouping::all(['id', 'name'])->toArray();  //获得分组
//        $positions  = Position::all(['id', 'name'])->toArray(); //获得职务
//
//        $allStudents   = User::with('grouping', 'positions', 'courses')->orderBy('name_py')->get(['id', 'name', 'grouping_id','sex']);  //获得学生的信息
//
//        // 以id为键排列
//        $students = [];
//        $grades = [];
//
//        foreach ($allStudents->toArray() as $student){
//            //获取年级
//            $tmpGrade = intval(substr($student['id'], 2,2));
//            if(!in_array($tmpGrade,$grades)) $grades[] = $tmpGrade;
//
//            $students[$student['id'].'s'] = $student;
//        }
//
//
//
//        return compact(['nowWeek', 'groups', 'positions', 'grades', 'students']);
    }
}