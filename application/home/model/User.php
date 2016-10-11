<?php
namespace app\home\model;

use think\Model;

class User extends Model{

	public function existUser($user){
		$user = db('user', [], false)->where(['user_id' => $user])->find();
		if($user){
			return true;
		}
		return false;
	}
}