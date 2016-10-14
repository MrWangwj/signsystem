<?php
namespace app\home\controller;
use think\Controller;
use think\Db; 
class User extends Base
{
	public function message(){
		$data = Db::table('user')->where('user_id',session('userid'))->find();
		$info = Db::table('group')->select();
		$this -> assign('info',$info);
		$this -> assign('data',$data);
		return $this->fetch();
	}
	public function useradd(){
		if(!empty($_POST)){
			Db::startTrans();
			try{
				$rlt_1 = Db::table('user') -> where('user_id',session('userid')) -> update(['name'=>$_POST['Username'],'sex'=>$_POST['User_sex']]);
				if ($rlt_1 === false) {
					Db::rollback();
					return '修改失败';
				}
				$rlt_2 = Db::table('user_group') -> where('user_id',session('userid')) ->update(['group_id'=>$_POST['group_id']]);
				if ($rlt_2 === false) {
					Db::rollback();
					return '修改失败';
				}
				Db::commit();
				return '修改成功';
			}catch (\Exception $e) {
				//回滚事务
				Db::rollback();
				  return '修改失败';
			}
		}
	}
}