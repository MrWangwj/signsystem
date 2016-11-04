<?php
/**
 * 生成操作按钮
 * @param array $operate 操作按钮数组
 */
function showOperate($operate = [])
{
    if(empty($operate)){
        return '';
    }
    $option = <<<EOT
<div class="btn-group">
    <button class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
        操作 <span class="caret"></span>
    </button>
    <ul class="dropdown-menu">
EOT;

    foreach($operate as $key=>$vo){

        $option .= '<li><a href="'.$vo.'">'.$key.'</a></li>';
    }
    $option .= '</ul></div>';

    return $option;
}

/**
 * 将字符解析成数组
 * @param $str
 */
function parseParams($str)
{
    $arrParams = [];
    parse_str(html_entity_decode(urldecode($str)), $arrParams);
    return $arrParams;
}

/**
 * 子孙树 用于菜单整理
 * @param $param
 * @param int $pid
 */
function subTree($param, $pid = 0)
{
    static $res = [];
    foreach($param as $key=>$vo){

        if( $pid == $vo['pid'] ){
            $res[] = $vo;
            subTree($param, $vo['id']);
        }
    }

    return $res;
}

/**
 * 整理菜单住方法
 * @param $param
 * @return array
 */
function prepareMenu($param)
{
    $parent = []; //父类
    $child = [];  //子类

    foreach($param as $key=>$vo){

        if($vo['typeid'] == 0){
            $vo['href'] = '#';
            $parent[] = $vo;
        }else{
            $vo['href'] = url($vo['control_name'] .'/'. $vo['action_name']); //跳转地址
            $child[] = $vo;
        }
    }

    foreach($parent as $key=>$vo){
        foreach($child as $k=>$v){

            if($v['typeid'] == $vo['id']){
                $parent[$key]['child'][] = $v;
            }
        }
    }
    unset($child);

    return $parent;
}

/**
 * 解析备份sql文件
 * @param $file
 */
function analysisSql($file)
{
    // sql文件包含的sql语句数组
    $sqls = array ();
    $f = fopen ( $file, "rb" );
    // 创建表缓冲变量
    $create = '';
    while ( ! feof ( $f ) ) {
        // 读取每一行sql
        $line = fgets ( $f );
        // 如果包含空白行，则跳过
        if (trim ( $line ) == '') {
            continue;
        }
        // 如果结尾包含';'(即为一个完整的sql语句，这里是插入语句)，并且不包含'ENGINE='(即创建表的最后一句)，
        if (! preg_match ( '/;/', $line, $match ) || preg_match ( '/ENGINE=/', $line, $match )) {
            // 将本次sql语句与创建表sql连接存起来
            $create .= $line;
            // 如果包含了创建表的最后一句
            if (preg_match ( '/ENGINE=/', $create, $match )) {
                // 则将其合并到sql数组
                $sqls [] = $create;
                // 清空当前，准备下一个表的创建
                $create = '';
            }
            // 跳过本次
            continue;
        }

        $sqls [] = $line;
    }
    fclose ( $f );

    return $sqls;
}

/**
 * 获得星期几方法
 * @param  [type] $date [description]
 * @return [type]       [description]
 */
function get(){
    
}
/**
 * 获得是周
 * @return [type] [description]
 */
function getNowWeek(){ 
    $startdate = strtotime(config('SCHOOLTIME'));
    $enddate = strtotime(Date('Y-m-d',time()));
    if($startdate<=$enddate){ 
       $end_date=strtotime("next monday",$enddate); 
       if(date("w",$startdate)==1){ 
           $start_date=$startdate; 
       }else{ 
           $start_date=strtotime("last monday",$startdate); 
       } 
       //计算时间差多少周 
       $countweek=($end_date-$start_date)/(7*24*3600); 
       for($i=0;$i<$countweek;$i++){ 
           $sd=date("Y-m-d",$start_date); 
           $ed=strtotime("+ 6 days",$start_date); 
           $eed=date("Y-m-d",$ed); 
           $arr[]=array($sd,$eed); 
           $start_date=strtotime("+ 1 day",$ed); 
       } 
       return $arr;     
    } 
}
/**
 * 获得是周一和周日
 * @return [type] [description]
 */
function getWeekDate($week){ 
    $startdate = strtotime(config('SCHOOLTIME'));
    $date =strtotime("+".($week-1)." week", $startdate);
    $nowweek = date('w',$date);
    $mon  =  date("Y-m-d", strtotime("+".(1-$nowweek)." days", $date));
    $tues =  date("Y-m-d", strtotime("+".(2-$nowweek)." days", $date));
    $wed  =  date("Y-m-d", strtotime("+".(3-$nowweek)." days", $date));
    $thur =  date("Y-m-d", strtotime("+".(4-$nowweek)." days", $date));
    $fir  =  date("Y-m-d", strtotime("+".(5-$nowweek)." days", $date));
    $sat  =  date("Y-m-d", strtotime("+".(6-$nowweek)." days", $date));
    $sun  =  date("Y-m-d", strtotime("+".(7-$nowweek)." days", $date));
    return [$mon, $tues, $wed, $thur, $fir, $sat, $sun];     
}

/**
 * 将具体的秒数转换为几天几小时几分钟
 * @param number $seconds  秒数
 * @return string
 */
function second2time($seconds=0){
    $seconds = (int)$seconds;
    if( $seconds >= 86400/24 ){    // 如果超过一个小时
        $time = explode(':', gmstrftime('%H:%M', $seconds));
        $format_time = $time[0].'小时'.$time[1].'分钟';
    }else{
        $time = gmstrftime('%M', $seconds);
        $format_time = $time.'分钟';
    }
    return $format_time;
}
