<?php
namespace app\admin\controller;
use think\Controller;
use think\Db;

class Manager extends Controller
{
	public function manager()
	{
		return $this->fetch();
	}
}