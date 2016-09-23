<?php
namespace app\admin\controller;
use think\Controller;
use think\Db; 
class Member extends Controller
{
	public function member()
	{
		return $this->fetch();
	}
}