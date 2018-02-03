<?php
/**
 * Created by PhpStorm.
 * User: wang
 * Date: 2016/10/18
 * Time: 8:33
 */
namespace app\admin\controller;

use app\admin\model\Node;
use app\admin\model\UserType;
use think\Db;
use think\Controller;
use Think\Model;
class Statistics extends Base{
    public function index(){
        return $this->fetch();
    }
    public function getAllTime(){
        $number_wk=date("w",time())-1;
        if($number_wk==-1){
            $number_wk=6;
        }
        $number_wOk = 7-$number_wk;
        $weekStart = strtotime(date('Y-m-d',strtotime("-$number_wk day")));//周一日期时间戳
        $weekOver = strtotime(date('Y-m-d',strtotime("+$number_wOk day")));//下周一日期时间戳

        $list = Db::query("SELECT user.`user_id`,user.`name`,sign.`start_time`,sign.`over_time`,groups.`group_name`,SUM(sign.`over_time`-sign.`start_time`)AS times FROM user LEFT JOIN sign ON(user.`user_id`=sign.`user_id`) LEFT JOIN user_group ON(user.`user_id`=user_group.`user_id`) LEFT JOIN groups ON(user_group.`group_id` = groups.`group_id`) 
 where sign.`start_time`>=$weekStart and sign.`over_time`<$weekOver
GROUP BY user.`user_id` HAVING SUM(sign.`over_time`-sign.`start_time`) ORDER BY times DESC");
        return $list;
    }
    public function getNo(){
        $j=0;
        $listNull = null;
        $list = Db::query("SELECT user.`user_id`,user.`name`,sign.`start_time`,sign.`over_time`,groups.`group_name` FROM user LEFT JOIN sign ON(user.`user_id`=sign.`user_id`) LEFT JOIN user_group ON(user.`user_id`=user_group.`user_id`) LEFT JOIN groups ON(user_group.`group_id` = groups.`group_id`)  
GROUP BY user.`user_id`   ORDER BY user.`user_id` ");
        for ($i=0;$i<count($list);$i++){
            if(empty($list[$i]['start_time'])){
                $listNull[$j]['user_id']=$list[$i]['user_id'];
                $listNull[$j]['name']=$list[$i]['name'];
                $listNull[$j]['group_name']=$list[$i]['group_name'];
                $listNull[$j]['time'] = "--";
                $j++;
            }
        }
//        return $listNull;
        return json(['list' => $listNull, 'count' => count($listNull)]);
    }
}