<?php
// +----------------------------------------------------------------------
// | snake
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2022 http://baiyf.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: NickBai <1902822973@qq.com>
// +----------------------------------------------------------------------
namespace app\admin\controller;

use think\Controller;

class Schedule extends Controller
{
    public function clear(){
    	$curriculums = db('schedule', [], false)->field('curriculum_id')->select();
    	$curriculum = array();
    	foreach ($curriculums as $key => $value) {
    		$curriculum[$key] = $value['curriculum_id'] ;
    	}
    	$where['id'] = array(array('NOT IN',array_unique($curriculum)),array('NEQ',1)) ;
    	$noncurriculum = db('curriculum')->field('*')->where($where)->order('name')->select();
    	$this->assign('noncurriculum', $noncurriculum);
    	return $this->fetch();
    }

    public function delete(){
        $curriculums  = array();
        input('post.curriculums/a') && $curriculums = input('post.curriculums/a');

        $result = db('curriculum', [], false)->delete($curriculums);
        if($result){
            return ['code' => 1, 'msg' => '成功删除'.$result.'个课程'];
        }
        return ['code' => 0, 'msg' => '删除失败'];
    }
}