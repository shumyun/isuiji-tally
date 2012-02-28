<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-02-27
 *    Author: shumyun
 *    Copyright (C) 2011 - forever jiashe.net Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

$arr = array(
		0 => 'paytype',
		1 => 'earntype'
		);

$account->run_radata($_G['uid'], $arr);

$div_i = 0;
$div_arr = array();
$ac_ndiv = '<div id="ac_popn" class="ac_pop">';

/*
 * 一级菜单
 */
$type = $account->account_config['paytype'];
$ac_ndiv .= '<ul ulstyle="ul_popn" class="ac_ul">';
foreach($type as $data) {
	foreach($data as $key => $val) {
		if($val == '.'){
			$ac_ndiv .= '<li sum="0" count="0" a_clsid="0"><a class="selimg_empty selimg_0">'.$key.'</a></li>';
		} else if(is_array($val)) {
			$div_arr[$div_i] = $val;
			$ac_ndiv .= '<li class="selimg_arrow" a_clsid="0" sum="0" count="'.count($val).'" div_id="popn_'.$div_i.'"><a class="selimg_empty selimg_0">'.$key.'</a></li>';
			$div_i++;
		}
	}
}
$ac_ndiv .= '</ul>';
$type = $account->account_config['earntype'];
$ac_ndiv .= '<ul ulstyle="ul_popn">';
foreach($type as $data) {
	foreach($data as $key => $val) {
		if($val == '.'){
			$ac_ndiv .= '<li sum="0" count="0" a_clsid="0"><a class="selimg_empty selimg_0">'.$key.'</a></li>';
		} else if(is_array($val)) {
			$div_arr[$div_i] = $val;
			$ac_ndiv .= '<li class="selimg_arrow" a_clsid="0" sum="0" count="'.count($val).'" div_id="popn_'.$div_i.'"><a class="selimg_empty selimg_0">'.$key.'</a></li>';
			$div_i++;
		}
	}
}
$ac_ndiv .= '</ul>';
$ac_ndiv .= '</div>';

/*
 * 子菜单
 */
foreach($div_arr as $key => $data) {
	$ac_ndiv .= '<div id="popn_'.$key.'" class="ac_pop" popn="div">';
	$ac_ndiv .= '<ul popn="div_ul">';
	foreach($data as $val) {
		foreach($val as $name => $data1){
			if($data1 == '.') {
				$ac_ndiv .= '<li a_clsid="0"><a class="selimg_empty selimg_0">'.$name.'</a></li>';
			}
		}
	}
	$ac_ndiv .= '</ul>';
	$ac_ndiv .= '</div>';
}

?>
