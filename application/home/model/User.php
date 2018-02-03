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

	public function getNameUser($name){
        	$user = db('user', [], false)
        	->field("a.*,c.group_name,d.position_name")
			->alias("a")
        	->join('user_group b','a.user_id = b.user_id')
        	->join('groups c','b.group_id = c.group_id')
        	->join('positions d','a.position = d.position')
        	->where('a.name', 'like', getLike($name))
        	->select();
        	return $user;
	}

	public function getgrade(){
		    $grade = db('user', [], false)
        	->field("grade,count('grade') AS sum")
        	->group('grade')
        	->select();
        	return $grade;
	}
}