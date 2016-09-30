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


use app\admin\Model\UserModel;
use app\admin\model\UserType;
use think\Controller;
use think\Db; 
class User extends Base
{
    //用户列表

	public function member()
	{   
		
		if(!empty($_POST['name'])){
				$data = Db::table('user') ->where('name',$_POST['name']) -> paginate(2);
				$merit = Db::table('user_group') -> select();
		}else if(!empty($_POST['group_id'])){
				$merit = Db::table('user_group') ->where('group_id',$_POST['group_id']) -> select();
				$map = Db::table('user_group') ->where('group_id',$_POST['group_id']) -> column('user_id');
				$data = db('user') -> where("user_id in(".$map.")") -> paginate(2);
				
		}else{
			$data = Db::name('user') -> paginate(2);
			$merit = Db::table('user_group') -> select();
		}
		$info = Db::table('group') ->select();
		$this -> assign('info',$info);
		$this -> assign('data',$data);
		$this -> assign('merit',$merit);
		return $this->fetch();
	}
	public function group()
	{
		if(!empty($_POST)){
			$data = [ 'group_name' => $_POST['group']];
			$result = Db::table('group')->insert($data);
			if ($result) {
				return '添加成功';
			}else{
				return '添加失败';
			}
		}
	}
	public function delete(){
		if(!empty($_POST)){
			Db::startTrans();
			try{
				$rlt_1 = Db::table('user')->where("user_id",$_POST['id'])->delete();
			 	if($rlt_1 === false) {
			 		Db::rollback();
			 		return '删除失败';
			 	}
			 	$rlt_2 = Db::table('user_group') -> where("user_id",$_POST['id'])->delete();
			 	if ($rlt_2 === false) {
			 		Db::rollback();
			 		return '删除失败';
			 	}
			 	Db::commit();    
			 	return '删除成功';
			}catch (\Exception $e) {
			    // 回滚事务
			    Db::rollback();
			}
		}
	}
	public function deletes()
	{
		if(!empty($_POST)){
			Db::startTrans();
			try{
			 	$rlt_1 = Db::table('user')->where("user_id in(".$_POST['invalue'].")")->delete();
			 	if($rlt_1 === false) {
			 		Db::rollback();
			 		return '删除失败';
			 	}
			 	$rlt_2 = Db::table('user_group')->where("user_id in(".$_POST['invalue'].")")->delete();
			 	if ($rlt_2 === false) {
			 		Db::rollback();
			 		return '删除失败';
			 	}
			 	Db::commit();    
			 	return '删除成功';
			}catch (\Exception $e) {
			    // 回滚事务
			    Db::rollback();
			}
		}
	}
}