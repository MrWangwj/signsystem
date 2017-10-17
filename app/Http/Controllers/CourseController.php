<?php

namespace App\Http\Controllers;

use App\Course;
use App\User;

use Illuminate\Validation\Rule;

class CourseController extends Controller
{

    //获取用户的课表信息
    public function getUserCourse(){
        $this->validate(\request(), [
            'user-id' => 'required|numeric',
        ]);

        $user = User::where('id',\request(['user-id']))->first();

        if(!$user){
            return ['code' => 0, 'msg' => '用户不存在'];
        }
        $courses = $user->courses()->orderBy('name')->get()->toArray();
        return ['code' => 1, 'msg' => '', 'courses' => $courses]   ;
    }

    //添加用户课程
    public function addUserCourse(){
        //验证
        $this->validate(\request(), [
            'user-id' => 'required|numeric|exists:users,id',
            'name' => 'required|max:150',
            'teacher' => 'required|max:45',
            'location' => 'required|max:150',
            'start_week' => 'required|Integer|between:1,20',
            'end_week' => 'required|Integer|between:1,20',
            'start_section' => [
                'required',
                Rule::in([1, 3, 5, 6, 8, 10, 12]),
            ],
            'end_section' => [
                'required',
                Rule::in([2, 4, 5, 7, 9, 11, 12]),
            ],
            'week_day' => 'required|Integer|between:1,7',
            'status' => [
                'required',
                Rule::in([0, 1, 2]),
            ]
        ]);
        $request = request();
        if($request['start_week'] > $request['start_week'] || $request['start_section'] > $request['end_section']){
            return ['code' => 0, 'msg' => '错误操作'];
        }



        $user = User::with('courses')->find($request['user-id']);
        $week_day_course = $user->courses->where('week_day', $request['week_day']);

        $result = $week_day_course->filter(function ($value, $key) use($request){
            if($value->status ==0 || $value->status = $request['status']){
                if(max($request['start_section'], $value->start_section)
                    < min($request['end_section'], $value->end_section)){

                    if(max($request['start_week'], $value->start_week)
                        < min($request['end_week'], $value->end_week)){
                        return true;
                    }

                }
            }
        });


        if($result->count() > 0){
            return ['code' => 0, 'msg' => '课程冲突'.$result->first()->name];
        }

        //存储

        $course = (Course::firstOrCreate(request([
            'name',
            'teacher',
            'location',
            'start_week',
            'end_week',
            'start_section',
            'end_section',
            'week_day',
            'status'
        ])));
        if(!$course){
            return ['code' => 1, 'msg' => '添加失败'];
        }
        $user->courses()->attach($course->id);


        return ['code' => 1, 'msg' => '添加成功'];
        //返回

    }

    //修改用户课程
    public function editUserCourse(){
        //验证
        $this->validate(\request(), [
            'user-id' => 'required|numeric|exists:users,id',
            'id' => 'required|numeric|exists:courses,id',
            'name' => 'required|max:150',
            'teacher' => 'required|max:45',
            'location' => 'required|max:150',
            'start_week' => 'required|Integer|between:1,20',
            'end_week' => 'required|Integer|between:1,20',
            'start_section' => [
                'required',
                Rule::in([1, 3, 5, 6, 8, 0, 12]),
            ],
            'end_section' => [
                'required',
                Rule::in([2, 4, 5, 7, 9, 11, 12]),
            ],
            'week_day' => 'required|Integer|between:1,7',
            'status' => [
                'required',
                Rule::in([0, 1, 2]),
            ]
        ]);
        $request = request();
        if($request['start_week'] > $request['start_week'] || $request['start_section'] > $request['end_section']){
            return ['code' => 0, 'msg' => '错误操作'];
        }


        $user = User::with('courses')->find($request['user-id']);
        $week_day_course = $user->courses->where('week_day', $request['week_day']);

        $result = $week_day_course->filter(function ($value, $key) use($request){
            if($value->id == $request['id'])
                return false;

            if($value->status ==0 || $value->status == $request['status']){
                if(max($request['start_section'], $value->start_section)
                    <= min($request['end_section'], $value->end_section)){

                    if(max($request['start_week'], $value->start_week)
                        <= min($request['end_week'], $value->end_week)){
                        return true;
                    }

                }
            }
        });

        if(!$result->isEmpty()){
            return ['code' => 0, 'msg' => '课程冲突,'.$result->first()->name];
        }


        //存储
        $course = (Course::firstOrCreate(request([
            'name',
            'teacher',
            'location',
            'start_week',
            'end_week',
            'start_section',
            'end_section',
            'week_day',
            'status'
        ])));
        if(!$course){
            return ['code' => 0, 'msg' => ' 修改失败'];
        }

        if($course->id != $request['id']){
            $user->courses()->detach($request['id']);
            $user->courses()->attach($course->id);
        }

        $lCourse = Course::where('id', $request['id'])->first();
        if($lCourse->users->isEmpty()){
            $lCourse->delete();
        }
        return ['code' => 1, 'msg' => '修改成功'];
        //返回
    }

    //删除用户课程
    public function deleteUserCourse(){
        $this->validate(request(),[
            'user-id' => 'required|numeric|exists:users,id',
            'id' => 'required|numeric|exists:courses,id',
        ]);

        $user = User::where('id', request('user-id'))->first();
        $user->courses()->detach(request('id'));
        return ['code' => 1, 'msg' => '删除成功'];
    }

    //清除此用户的所有信息
    public function clearUserAllCourse(){
        $this->validate(request(),[
            'user-id' => 'required|numeric|exists:users,id',
        ]);

        $user = User::where('id', request('user-id'))->first();
        $user->courses()->detach();
        return ['code' => 1, 'msg' => '清除成功'];

    }

    //导入用户的课表
    public function inputUserAllCourse(){
        $this->validate(request(),[
            'user-id' => 'required|numeric|exists:users,id',
            'input-user-id' => 'required|numeric',
        ]);

        if(request('user-id') == request('input-user-id')){
            return ['code' => 0, 'msg' => '未知错误'];
        }

        $inputUser = User::with('courses')->where('id', request('input-user-id'))->first();
        if(!$inputUser){
            return ['code' => 0, 'msg' => '用户不存在'];
        }
        $user = User::where('id', request('user-id'))->first();



        $inputCourseId = $inputUser->courses->pluck('id')->toArray();

        $user->courses()->sync($inputCourseId);
        return ['code' => 1, 'msg' => '成功导入'.count($inputCourseId).'记录'];
    }

}
