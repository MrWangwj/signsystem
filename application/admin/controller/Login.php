<?php
namespace app\admin\controller;
use think\Controller;
use think\Db;

class Login extends Controller
{
	
	public function login()
	{
		return $this->fetch();
	}
	public function test() {
		if(!empty($_POST)) {
			$admin_id = $_POST['id'];
			$password = $_POST['password'];
			$code = $_POST['code'];
			if(captcha_check($code)){
				$result = Db::table('admin')->where('admin_id',$admin_id)->value('password');
				if($result) {
					if($result == $password) {
						$dress = '/Sign/index.php/admin/Base/base';
						$ret = array('flag' => "success",'dress' => $dress);
						return json_encode($ret) ; 
					}else{
					 	$ret = array('flag' => "账号或密码错误");
					 	return json_encode($ret) ;
					}
				}
			}else{
				 $ret = array('flag' => "验证码错误");
                  return(json_encode($ret));
			}
		}	
	}
}
?>