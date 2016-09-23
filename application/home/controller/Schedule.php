<?php
namespace app\home\controller;

use think\Controller;

/**
课表
*/
class Schedule extends Controller{
	
	public function index(){
		
		return $this->fetch();
	}

	public function add(){
		return "你好";
	}

}

?>