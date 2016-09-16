<?php
namespace app\admin\controller;
use think\Controller;
use think\Db;

class Base extends Controller
{
	public function base()
	{
		 return $this->fetch();
	}
}
