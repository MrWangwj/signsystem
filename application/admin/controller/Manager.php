<?php
namespace app\admin\controller;
use think\Controller;
use think\Db;

class Manager extends Controller
{
	public function manager()
	{	
		$data = Db::table('groups') ->select();
		$merit = Db::table('positions') ->select();
		$this -> assign('merit',$merit);
		$this -> assign('data',$data);
		return $this->fetch();
	}
	public function remanager($user_id)
	{
		$data = Db::table('user') ->where('user_id',$user_id)->find();
		$info = Db::table('groups') ->select();
		$merit = Db::table('positions') ->select();
		$this -> assign('merit',$merit);
		$this -> assign('info',$info);
		$this -> assign('data',$data);
		return $this->fetch();
	}
	public function notice(){
		$data = Db::table('user') -> join('admin','admin.user_id=user.user_id','LEFT')-> join('notice','notice.admin_id=admin.admin_id')->select();
		$this -> assign('data',$data);
		return $this ->fetch();
	}
	public function renotice($notice_id){
		$data = Db::table('notice')->where('notice_id',$notice_id)->find();
		$this -> assign('data',$data);
		return $this ->fetch();
	}
	public function User(){
		if(!empty($_POST)){
			 Db::startTrans();    
			try{		
				$rlt_1 = Db::table('user')->insert([ 'name' => $_POST['Username'],'user_id'=>$_POST['User_id'],'sex'=>$_POST['User_sex'],'position'=>$_POST['position'], 'class' => $_POST['class'], 'phone' => $_POST['phone']]);
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
    			  return '添加失败';
			}
		}
	}
	public function alertuser(){
		if (!empty($_POST)) {
			Db::startTrans();
			try{
				$rlt_1 = Db::table('user') -> where('user_id',$_POST['id']) -> update(['name'=>$_POST['name'],'sex'=>$_POST['User_sex'],"position"=>$_POST['position'],'class' => $_POST['Class'], 'phone' => $_POST['phone']]);
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
				  return '修改失败';
			}
		}
	}
	public function addnotice(){
		if(!empty($_POST)){
			$result = Db::table('notice') -> insert(['notice'=>$_POST['notice'],'admin_id'=>123456,'notice_title'=>$_POST['notice_title'],'create_time'=> time()]);
			if($result){
				return '添加成功';
			}else{
				return '添加失败';
			}
		}
	}
	public function updatenotice(){
		if(!empty($_POST)){
			$result = Db::table('notice')->where('notice_id',$_POST['id'])->update(['notice'=>$_POST['notice']]);
			if($result){
				return '修改成功';
			}else{
				return '修改失败';
			}
		}
	}
	public function delete_notice(){
		if(!empty($_POST)){
			$result = Db::table('notice') ->where('notice_id',$_POST['id'])->delete();
			if($result){
				return '删除成功';
			}else{
				return '删除失败';
			}
		}
	}
	public function deletes_notice(){
		if(!empty($_POST)){
			$result = Db::table('notice') ->where("notice_id in(".$_POST['invalue'].")")->delete();
			if($result){
				return '删除成功';
			}else{
				return '删除失败';
			}
		}
	}
}