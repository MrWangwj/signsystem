<?php
function getLike($text){
	$data = '%';
	foreach (preg_split('/(?<!^)(?!$)/u', $text) as $key => $value) {
		$data .= $value.'%';
	}
	return $data;
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
    if( $seconds >= 3600 ){    // 如果超过一个小时
        // $time = explode(':', gmstrftime('%H:%M', $seconds));
        $format_time = ((int)($seconds/3600)).'小时'.((int)($seconds%3600/60)).'分钟';
    }else{
        
        $format_time =((int)($seconds/60)).'分钟';
    }
    return $format_time;
}