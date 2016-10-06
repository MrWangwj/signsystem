<?php
function getLike($text){
	$data = '%';
	foreach (preg_split('/(?<!^)(?!$)/u', $text) as $key => $value) {
		$data .= $value.'%';
	}
	return $data;
}