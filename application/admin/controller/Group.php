<?php
namespace app\admin\controller;
use think\Controller;
use think\Db; 
class Group extends Controller
{
	public function group()
	{	 
		$info = Db::table('groups') -> select();	
		$data = Db::table('user') -> join('user_group','user_group.user_id=user.user_id','LEFT') -> select();
		$this -> assign('data',$data);
		$this -> assign('info',$info);
		return $this->fetch();
	}
	public function upgroup()
	{
		if (!empty($_POST)) {
			$result = Db::table('groups') -> where('group_id',$_POST['id']) -> update(['group_name'=>$_POST['group_name']]);
  			$res1 = Db::table('user_group') -> where('group_id',$_POST['id']) -> find();
  			if($res1){
  				$res2 = Db::table('user_group') -> where('group_id',$_POST['id']) -> update(['group_id' => 1]);
	  			if ($res2) {
					return '修改成功';
				}else{
					return '修改失败';
				}
			}else if($result){
				return '修改成功';
			}else{
				return '修改失败';
			}
		}
	}
	public function delgroup(){
		if(!empty($_POST)){
			Db::startTrans();
			try{
			 	$rlt_1 = Db::table('groups')->where("group_id", $_POST['group_id'])->delete();
			 	if($rlt_1 === false) {
			 		Db::rollback();
			 		return '删除失败';
			 	}
			 	$rlt_2 = Db::table('user_group') -> where("group_id",$_POST['group_id']) -> update(['group_id' => 1]);
			 	if ($rlt_2 === false) {
			 		Db::rollback();
			 		return '删除失败';
			 	}
			 	Db::commit();    
			 	return '删除成功';
			}catch (\Exception $e) {
			    // 回滚事务
			    Db::rollback();
			    return '删除失败';
			}
		}
	}
	public function deletegroup(){
		if(!empty($_POST)){
			Db::startTrans();
			try{
			 	$rlt_1 = Db::table('groups')->where("group_id in(".$_POST['invalue'].")")->delete();
			 	if($rlt_1 === false) {
			 		Db::rollback();
			 		return '删除失败';
			 	}
			 	$rlt_2 = Db::table('user_group') -> where("group_id in(".$_POST['invalue'].")") -> update(['group_id' => 1]);
			 	if ($rlt_2 === false) {
			 		Db::rollback();
			 		return '删除失败';
			 	}
			 	Db::commit();    
			 	return '删除成功';
			}catch (\Exception $e) {
			    // 回滚事务
			    Db::rollback();
			    return '删除失败';
			}
		}
	}
	public function groupadd()
	{
		if(!empty($_POST)){
			$data = [ 'group_name' => $_POST['group']];
			$result = Db::table('groups')->insert($data);
			if ($result) {
				return '添加成功';
			}else{
				return '添加失败';
			}
		}
	}
	public function change()
	{
		if(!empty($_POST)){
			$data =Db::table('user')-> join('user_group','user_group.user_id=user.user_id')->where("user_group.group_id not in(" .$_POST['group_id'].")")->select();
			if($data){
				return json_encode($data);
			}else{
				$ret = array('flag' => "获取数据失败");
				return json_encode($ret) ;
			}
		}
	}
	public function changeuser(){
		if(!empty($_POST)){
			$var = substr($_POST['user_id'],0,strlen($_POST['user_id'])-1);
			$user_id=explode(",",$var);
			$where['user_id']=array('in',$user_id);
			$data = Db::table('user_group')->where($where)->update(['group_id'=>$_POST['group_id']]);
			if ($data) {
				return '修改成功';
			}else{
				return '修改失败';
			}
		}
	}
}
