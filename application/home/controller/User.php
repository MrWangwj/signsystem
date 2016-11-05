<?php
namespace app\home\controller;
use think\Controller;
use think\Db; 
class User extends Base
{
	public function message(){
		$data = Db::table('user')-> join('user_group','user_group.user_id = user.user_id','LEFT')-> join('groups','groups.group_id = user_group.group_id','LEFT')-> join('positions','positions.position = user.position','LEFT')-> where('user.user_id',session('userid'))->find();		
		$this -> assign('data',$data);
		return $this->fetch();
	}
	public function useradd(){
		if(!empty($_POST)){
			$result = Db::table('user') -> where('user_id',session('userid')) -> update(['name'=>$_POST['Username'],'sex'=>$_POST['User_sex']]);
			if($result){
				return '修改成功';
			}else{
				return '修改失败';
			}	
		}
	}	


}