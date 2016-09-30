<?php
namespace app\admin\controller;
use think\Controller;
use think\Db; 
class Group extends Controller
{
	public function group()
	{	 
		$info = Db::table('group') -> select();
		$merit = Db::table('user_group') ->	select();
		$data = Db::table('user') -> select();
		$this -> assign('data',$data);
		$this -> assign('merit',$merit);
		$this -> assign('info',$info);
		return $this->fetch();
	}
	public function upgroup()
	{
		if (!empty($_POST)) {
			$result = Db::table('group') -> where('group_id',$_POST['id']) -> update(['group_name'=>$_POST['group_name']]);
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
	public function deletegroup(){
		if(!empty($_POST)){
			Db::startTrans();
			try{
			 	$rlt_1 = Db::table('group')->where('group_id',$_POST['group_id'])->delete();
			 	if($rlt_1 === false) {
			 		Db::rollback();
			 		return '删除失败';
			 	}
			 	$rlt_2 = Db::table('user_group') -> where('group_id',$_POST['group_id']) -> update(['group_id' => 1]);
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

 // $group_size = db('user')->join('user_group','user_group.user_id=user.user_id','LEFT')->
 // join('groups','groups.group_id=user_group.group_id','LEFT')->where('user_group.group_id',$group_id)->select();
