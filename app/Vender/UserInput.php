<?php
/**
 * Created by PhpStorm.
 * User: Mr.Wang
 * Date: 2017/9/23
 * Time: 22:37
 */

namespace App\Vender;


use Maatwebsite\Excel\Facades\Excel;

class UserInput
{
    private $users = [];

    public function __construct($excelFilePath)
    {
        $this->users = $users = Excel::load($excelFilePath, function($reader){})->get()->toArray();
    }


    //检查表单中是否有数据
    public function checkEmpty(){
        if(count($this->users) == 0){
            return true;
        }
        return false;
    }


    //判断表单的列标题是否合法
    public function checkTitle($titles){
        $userTitle = $this->users[0];
        foreach ($titles as $k => $v){
            if(!in_array($v, $userTitle)){
                return false;
            }
        }
        return true;
    }


    //判断用数据是否正确
    public function checkUsers($groupings = []){
        $id = '/^\d{10,11}$/';
        $name = '/^([\xe4-\xe9][\x80-\xbf]{2}){2,4}$/';
        $sex = '/^(男|女)$/';
        $tel = '/^1[34578]\d{9}$/';
        $email = '/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/';

        $msg = [];
        foreach ($this->users as $key => $value){
            if(!preg_match($id, $value['学号'])){
                $msg[$key][] = '学号格式错误';
            }

            if(!preg_match($name, $value['姓名'])){
                $msg[$key][] = '姓名格式错误';
            }

            if(!preg_match($sex, $value['性别'])){
                $msg[$key][] = '性别格式错误';
            }

            if(!in_array($value['分组'], $groupings)){
                $msg[$key][] = '分组不存在';
            }

            if(!preg_match($tel, $value['电话'])){
                $msg[$key][] = '电话格式错误';
            }

            if(!preg_match($email, $value['邮箱'])){
                $msg[$key][] = '邮箱格式错误';
            }
        }


        return $msg;

    }

    public function getUsers(){
        return $this->users;
    }
}