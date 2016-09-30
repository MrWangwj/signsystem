<?php
namespace app\admin\controller;
use think\Controller;
use think\Db; 
class Group extends Controller
{
	public function group()
	{
		return $this->fetch();
	}
	public function addgroup()
	{
		if (!empty($_POST)) {
			
		}
	}
}