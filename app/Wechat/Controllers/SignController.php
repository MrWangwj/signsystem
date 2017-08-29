<?php
/**
 * Created by PhpStorm.
 * User: Mr.Wang
 * Date: 2017/8/9
 * Time: 22:07
 */

namespace App\Wechat\Controllers;


use App\Approval;
use App\Seting;
use App\User;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\VarDumper\Dumper\DataDumperInterface;

class SignController extends Controller
{

    //补签渲染
    public function patch(){
        return view('wechat.sign.patch');
    }

    //补签
    public function patchSign(){
        $this->validate(request(), [
            'sign_start' => 'required|date|after:last MonDay',
            'sign_end' => 'required|date|after:sign_start|before_or_equal:now',
        ]);

        $openid = session('wechat_user')['id'];
        $user = User::user($openid);
        $time['sign_start'] = strtotime(request('sign_start'));
        $time['sign_end'] = strtotime(request('sign_end'));


        $signFirst = $user->attendances()->selfDate()->where('type','=', 0)->first();
        if($signFirst){
            if($time['sign_end'] > $signFirst->sign_start ){
                return ['code' => 0, 'msg' => '请先签退，在进行补签'];
            };
        }

        //获得用户的冲突记录
        $result = $user->patchClash($time['sign_start'], $time['sign_end']);
        if(count($result) > 0){
            $first = $result->first();
            switch ($first['type']){
                case 1:
                    return ['code' => 0, 'msg' => '考勤时间冲突：'.date('m-d H:i:s' ,$first['sign_start']).'~'.date('m-d H:i:s' ,$first['sign_end'])];
                    break;
                case 2:
                    return ['code' => 0, 'msg' => '审批时间冲突：'.date('m-d H:i:s' ,$first['sign_start']).'~'.date('m-d H:i:s' ,$first['sign_end'])];
                    break;
                case 3:
                    return ['code' => 0, 'msg' => '通过审批时间冲突：'.date('m-d H:i:s' ,$first['sign_start']).'~'.date('m-d H:i:s' ,$first['sign_end'])];
                    break;
                default:
                    return ['code' => 0, 'msg' => '时间冲突'.date('m-d H:i:s' ,$first['sign_start']).'~'.date('m-d H:i:s' ,$first['sign_end'])];
            }

        }


        $approval = new Approval();
        $approval->sign_start = $time['sign_start'];
        $approval->sign_end = $time['sign_end'];
        $approval->type = 2;
        if($user->setPatch($approval)){
            //TODO: 向组长发送模板消息，提示有新的审批

            return ['code' => 1, 'msg' => '提交成功，等待组长审批'];
        };
        return ['code' => 0, 'msg' => '保存失败，请重试'];
    }

    //考勤记录
    public function signRecode($week = null){
        if(!$week) $week = Seting::getNowWeek();
        $openid = session('wechat_user')['id'];
        $user = User::user($openid);
        $signs = $user->signs()->selfWeek($week)->effectiveSign()->get(['sign_start', 'sign_end']);

        $weekSigns = $signs->groupBy(function ($item, $key){
            $week = date('w', $item->sign_start);
            return $week == 0 ? 6:$week-1;
        })->toArray();
        $nosigns = $user->getNoSign($signs, $week);


        $restule = [];
        for($i = 0; $i < 7; $i++)
            $restule[$i] = collect();


        for($i = 0; $i < 7; $i++){
            if(isset($weekSigns[$i])){
                foreach ($weekSigns[$i] as $sign){
                    $tmp = [
                        'start' => $sign['sign_start'],
                        'end' => $sign['sign_end'],
                        'type' => 1,
                    ];
                    $restule[$i]->push($tmp);
                }
            }

            if(isset($nosigns[$i])){
                foreach ($nosigns[$i] as $nosign){
                    if($nosign['end_time'] <= time()) {
                        $tmp = [
                            'start' => $nosign['start_time'],
                            'end' => $nosign['end_time'],
                            'type' => 0,
                        ];
                        $restule[$i]->push($tmp);
                    }
                }
            }
        }


        foreach ($restule as $key => $value){
            $restule[$key] = $value->sortBy('start')->values();
        }


        for($i = 6; $i >= 0; $i--){
            if($restule[$i]->isEmpty()){
                unset($restule[$i]);
            }else{
                break;
            }
        }
        return view('wechat.sign.signRecode', compact('restule'));
    }

    //补签记录渲染
    public function patchrecode(){
        return view('wechat.sign.patchRecode');
    }

    //取消补签
    public function cancelPatch(){

    }

    //重新申请补签渲染
    public function repatch() {
        return view('wechat.sign.repatch');
    }

    //重新申请补签
    public function setRepatch() {

    }

}