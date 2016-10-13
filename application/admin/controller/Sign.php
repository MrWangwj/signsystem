<?php
// +----------------------------------------------------------------------
// | snake
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2022 http://baiyf.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: NickBai <1902822973@qq.com>
// +----------------------------------------------------------------------
namespace app\admin\controller;

use app\admin\model\Node;
use app\admin\model\UserType;

class Sign extends Base
{
    //角色列表
    public function index()
    {
        return $this->fetch();
    }
    public function roleadd()
    {
        return $this->fetch();
    }
    public function roleadit()
    {
        return $this->fetch();
    }
    public function log()
    {
        return $this->fetch();
    }
    public function attendance()
    {
        return $this->fetch();
    }
    public function attendance_check(){
        $list = db('sign_info')
            ->join('user','user.user_id = sign_info.user_id')
            ->field('id,name,user.user_id,star,over,now,style')
            ->where('sign_state',3)
            ->order(['now'=>'desc'])
            ->select();
        for($i=0;$i<count($list);$i++){
            $timeA = $list[$i]['star'];
            $timeB = $list[$i]['over'];
            $timeC = $list[$i]['now'];
            $list[$i]['star']  = date('Y-m-d H:i:s',$timeA);
            $list[$i]['over'] =date('Y-m-d H:i:s',$timeB);
            $list[$i]['now'] =date('Y-m-d H:i:s',$timeC);
        }
        echo json_encode($list);
    }

    public function log_check(){
        $list = db('sign_info')
            ->join('user','user.user_id = sign_info.user_id')
            ->field('name,user.user_id,star,over,now,sign_state')
//            ->where('sign_state',3)
            ->order(['now'=>'desc'])
            ->select();
        for($i=0;$i<count($list);$i++){
            $timeA = $list[$i]['star'];
            $timeB = $list[$i]['over'];
            $timeC = $list[$i]['now'];
            $list[$i]['star']  = date('Y-m-d H:i:s',$timeA);
            $list[$i]['over'] =date('Y-m-d H:i:s',$timeB);
            $list[$i]['now'] =date('Y-m-d H:i:s',$timeC);
        }
//        $list2[][''] = null;
//        for($i=0;$i<count($list);$i++){
//
//        }
        echo json_encode($list);
    }
    //同意补签时段申请
    public function check_sign(){
        $id = $_POST['id'];
        $user_id = $_POST['userid'];
        $start = $_POST['starTime'];
        $over = $_POST['overTime'];
        $data = [
            'user_id' => $user_id,
            'start_time' => strtotime($start),
            'over_time' => strtotime($over),
            'state' => 2,
        ];
        db('sign')->insert($data);

        db('sign_info')
            ->where('id',$id)
            ->update(['sign_state'=>2,'now'=>strtotime(date('Y-m-d H:i:s',time()))]);
        return json(['code'=>1,'msg'=>"审批通过"]);
    }
    //拒绝补签时段申请
    public function reject_sign(){
        $id = $_POST['id'];
        db('sign_info')
            ->where('id',$id)
            ->update([
                'now'=>strtotime(date('Y-m-d H:i:s',time())),
                'sign_state'=>4,
            ]);
        return json(['code'=>1,'msg'=>"拒绝此补签记录"]);
    }
}