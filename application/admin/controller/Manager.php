<?php
namespace app\admin\controller;
use think\Controller;
use think\Db;

class Manager extends Controller
{
	public function manager()
	{	
		$data = Db::table('group') ->select();
		$this -> assign('data',$data);
		return $this->fetch();
	}
	public function remanager($user_id = '')
	{
		
		$data = Db::table('user') ->where('user_id',$user_id)->find();
		$info = Db::table('group') ->select();
		$this -> assign('info',$info);
		$this -> assign('data',$data);
		return $this->fetch();
		//return $user_id."12312312";
	}
	public function User(){
		if(!empty($_POST)){
			 Db::startTrans();
			 try{
				$rlt_1 = Db::table('user')->insert([ 'name' => $_POST['Username'],'user_id'=>$_POST['User_id']]);
				if($rlt_1 === false){
					Db::rollback();
					return '添加失败';
				}
				$rlt_2 = Db::table('user_group') -> insert(['group_id' => $_POST['group_id'],'user_id' => $_POST['User_id']]);
				if($rlt_2 === false){
					Db::rollback();
					return '添加失败';
				}
				Db::commit();
				return '添加成功';  
			 }catch (\Exception $e) {
    			//回滚事务
    			Db::rollback();
			}
		}
	}
	public function alertuser(){
		if (!empty($_POST)) {
			Db::startTrans();
			try{
				$rlt_1 = Db::table('user') -> where('user_id',$_POST['id']) -> update(['name'=>$_POST['name']]);
				if ($rlt_1 === false) {
					Db::rollback();
					return '修改失败';
				}
				$rlt_2 = Db::table('user_group') -> where('user_id',$_POST['id']) ->update(['group_id'=>$_POST['group_id']]);
				if ($rlt_2 === false) {
					Db::rollback();
					return '修改失败';
				}
				Db::commit();
				return '修改成功';
			}catch (\Exception $e) {
				//回滚事务
				Db::rollback();
			}
		}
	}
}