<?php
namespace app\index\controller;

use think\Controller;

class Index extends Controller{
    public function index(){
        $this->redirect('/SignSystem2/public/index.php/home/index/index');  
    }

}
