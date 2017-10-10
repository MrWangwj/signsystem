<?php

namespace App\Http\Controllers;

use App\Grouping;
use App\Position;
use App\User;
use App\Vender\UserInput;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;


class UserController extends Controller
{
    public function index(){
        
    }


    //获取用户的基本信息
    public function user(){
        $nowUser = Auth::user();
        $user   = array_only($nowUser->toArray(), ['id', 'name',  'sex', 'email', 'tel']);
        $user = array_add($user, 'group',($nowUser->grouping)->name);
        //获取用户职务
        $positions = array_pluck($nowUser->positions->toArray(), 'name');
        $user = array_add($user, 'positions',$positions);
        return compact('user');
    }

    //获取用户列表信息
    public function users(){
        $users = User::with('grouping')->get(['id', 'name', 'email', 'grouping_id', 'sex', 'tel']);
        return compact('users');
    }


    //获得添加用户是需要的信息
    public function getAddData(){
        $groups = Grouping::all()->toArray();
        $positions = Position::all()->toArray();

        return compact(['groups', 'positions']);
    }


    //添加用户
    public function addUser(){
        $this->validate(\request(),[
            'id' => 'required|numeric',
            'name' => 'required|min:2|max:5',
            'sex' => [
                'required',
                Rule::in(0,1),
            ],
            'grouping_id' => 'required|numeric|exists:groupings,id',
            'email' => 'required|email',
            'tel' =>[
                'regex:/^1[34578]{1}\d{9}$/',
            ],
            'position' => 'array',
            'position.*' => 'exists:positions,id',
        ]);


        if(User::find(\request('id')))
            return ['code' => 0, 'msg' => '该用户已存在'];

        if(User::where('email', \request('email'))->first())
            return ['code' => 0, 'msg' => '该邮箱已绑定其他账号'.\request('email')];


        DB::beginTransaction();

        $userData = \request(['id', 'name', 'sex', 'grouping_id', 'email', 'tel']);
        $userData['openid'] = \request('id');
        $userData['password'] = bcrypt(substr(\request('id'),-6));


        $user = User::create($userData);

        if($user){
            $userNow = User::find(\request('id'));
            $userNow->positions()->attach(\request('positions'));
            DB::commit();
        }else{
            DB::rollback();
            return ['code' => 0, 'msg' => '添加失败，请重试'];
        }

        return ['code' => 1, 'msg' => 'success'];
    }


    //Excel 导入用户
    public function inputExcel(Request $request) {

        $file = $request->file('users');
        $fileType =  $file->getClientOriginalExtension();

        if(!in_array($fileType,['xlsx', 'xls'])){
            return ['code' => 0, 'msg' => [['请上传Excel文件']]];
        }


        $path = $request->file('users')->storeAs(
            'users', Auth::id().'_'.time().'.'.$fileType
        );

        $addUsers = new UserInput('public/storage/'.$path);

        if($addUsers->checkEmpty()){
            Storage::delete($path);
            return ['code' => 0, 'msg' => [['上传文件为空']]];
        }

        if($addUsers->checkTitle(['学号','姓名','性别','分组','电话', '邮箱'])){
            Storage::delete($path);
            return ['code' => 0, 'msg' => [['上传文件标题错误']]];
        }

        $groupings = Grouping::all();
        $groupingNames = Grouping::all()->pluck('name')->toArray();


        $msg = $addUsers->checkUsers($groupingNames);

        if(count($msg) == 0){

            $count = 0;
            Storage::setVisibility($path, 'private');

            $users =  collect(User::get(['id', 'email'])->toArray());

            foreach ($addUsers->getUsers() as $key => $user){
                if($users->contains('id', intval($user['学号']))){
                    $msg[$key][] = '学号重复，添加失败';
                }

                if($users->contains('email', $user['邮箱'])){
                    $msg[$key][] = '邮箱重复，添加失败';
                }


                if(!isset($msg[$key])){
                    DB::beginTransaction();
                    $newUser = new User();
                    $newUser->id    = intval($user['学号']);
                    $newUser->name  = $user['姓名'];
                    $newUser->sex   = $user['性别'] == '男' ? 0:1;
                    $newUser->grouping_id = $groupings->where('name', $user['分组'])->first()->id;
                    $newUser->tel   = intval($user['电话']);
                    $newUser->email = $user['邮箱'];
                    $newUser->openid = $user['学号'];
                    $newUser->password  = bcrypt(substr($user['学号'], -6));

                    $result = $newUser->save();
                    if($result){
//                        $newUser->positions()->attach(0);
                        $nowUser = User::find(intval($user['学号']));
                        $nowUser->positions()->attach(1);
                        $count++;
                        $users->push(['id' => $newUser->id, 'email' => $newUser->email]);
                        DB::commit();
                    }else{
                        DB::rollback();
                        $msg[$key][] = '添加失败，请重试';
                    }
                }
            }
            return ['code' => 1, 'msg' => $msg, 'msg2' => '成功导入 '.$count.' 人, 失败 '.(count($addUsers->getUsers()) - $count).' 人'];
        }else{
            Storage::delete($path);
            return ['code' => 0, 'msg' => $msg];
        }


//        dd(Storage::url('users/20151515105_users.xlsx'));
    }

    //编辑用户时获取用户信息
    public function getEditUserInfo(){
        $groups = Grouping::all()->toArray();
        $positions = Position::all()->toArray();
        $user = User::with('positions')->where('id' ,'=', \request('id'))->first(['id','name', 'sex', 'grouping_id', 'tel', 'email']);
        return compact(['groups', 'positions', 'user']);
    }


    //编辑用户
    public function editUser(){

        //用户信息格式验证
        $this->validate(\request(), [
            'id' => 'required|numeric',
            'name' => 'required|min:2|max:5',
            'sex' => [
                'required',
                Rule::in(0,1),
            ],
            'grouping_id' => 'required|numeric|exists:groupings,id',
            'email' => 'required|email',
            'tel' =>[
                'regex:/^1[34578]{1}\d{9}$/',
            ],
            'position' => 'array',
            'position.*' => 'exists:positions,id',
        ]);

        //判断用户信息是否存在
        $userInfo = \request();
        $user = User::find($userInfo['id']);
        if(!$user){
            return ['code' => 0, 'msg' => '用户不存在'];
        }


        //判断邮箱是否唯一
        $usersInfo = collect(User::where('id','<>', $userInfo['id'])->get(['email'])->toArray());
        if($usersInfo->contains('email', $userInfo['email'])){
            return ['code' => 0, 'msg' => '保存失败，邮箱重复'];
        }

        //保存用户

        DB::beginTransaction();
        $user->name = $userInfo['name'];
        $user->sex = $userInfo['sex'];
        $user->grouping_id = $userInfo['grouping_id'];
        $user->tel = $userInfo['tel'];
        $user->email = $userInfo['email'];
        $result =  $user->save();
        if($result){
            $user->positions()->sync($userInfo['positions']);
            DB::commit();
            return ['code' => 1, 'msg' => '保存成功'];
        }else{
            DB::rollback();
            return ['code' => 0, 'msg' => '保存失败，请重试'];
        }
    }

    public function userDelete(){
        $user = User::find(\request('id'));
        if($user){
            $user->delete();
            return ['code' => 1, 'msg' => '删除成功'];
        }else{
            return ['code' => 0, 'msg' => '删除失败'];
        }
    }

    public function test(){
        echo Storage::url('users/users.xlsx');
    }



}
