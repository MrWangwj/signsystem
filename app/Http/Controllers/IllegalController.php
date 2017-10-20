<?php

namespace App\Http\Controllers;

use App\Illegal;
use App\Punish;
use App\User;
use App\UserIllegal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class IllegalController extends Controller
{

    //获取用户违规信息
    public function illegalInfo(){

        //获取有未结清违规记录的人员信息和违规记录
        $userIllegals = UserIllegal::getIllegalUserInfo();

        //违规信息
        $illegals = Illegal::get(['id', 'name']);

        //所有人员信息
        $users = User::get(['id','name']);
        return compact(['userIllegals', 'illegals', 'users']);
    }

    //添加用户违规
    public function setIllegal(){
        $this->validate(\request(),[
            'ids' => 'required|array',
            'ids.*' => 'exists:users,id',
            'illegal_id' => 'required|exists:illegals,id',
            'time' => 'required|before:now',
        ]);

        $request = request(['ids', 'illegal_id', 'cause', 'time']);
        $data =  [];

        //构造用户记录
        foreach ($request['ids'] as $id){
            $data[] = [
                'user_id'=> $id,
                'illegal_id' => $request['illegal_id'],
                'cause' => $request['cause'],
                'time' => strtotime($request['time']),
                'updated_at' => date('Y-m-d H:i:s',time()),
                'created_at' => date('Y-m-d H:i:s',time()),
            ];
        }

        //批量插入违规表
        $result = DB::table('user_illegals')->insert($data);
        if($result){
            return ['code' => 1, 'msg' => '添加成功'];
        }else{
            return ['code' => 0, 'msg' => '添加失败'];
        }

    }


    //用户违规惩罚
    public function setPunish(){
        $this->validate(\request(),[
            'user_id' => 'required|exists:users,id',
            'illegal_id'  =>'required|exists:illegals,id',
            'count' => 'required|numeric',
            'content' => 'required',
            'time' => 'required|before:now'
        ]);

        //获取要消除的违规
        $illegals = UserIllegal::where('user_id','=', \request('user_id'))
            ->where('punish_id', '=', 0)
            ->where('illegal_id', '=',\request('illegal_id'))
            ->orderBy('time')
            ->take(\request('count'))
            ->get();
        $illegals_id =  $illegals->pluck('id');

        if(count($illegals_id) < \request('count'))
            return ['code' => 0, 'msg' => '消除的的次数多于'.count($illegals_id).'条'];

        DB::beginTransation();

        //添加用户的惩罚
        $punish = Punish::create(\request(['user_id', 'content', 'time']));
        if(!$punish) return ['code' => 0, 'msg' => '添加失败'];


        //更新用户违规记录的惩罚字段
        $r = UserIllegal::whereIn('id',$illegals_id)->update(['punish_id' => $punish->id]);
        if(!$r){
            DB::rollback();
            return ['code' => 0,'msg' => '添加失败'];
        }

        DB::commit();
        return ['code' => 1, 'msg' => '添加成功'];
    }

}
