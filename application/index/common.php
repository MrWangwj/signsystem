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