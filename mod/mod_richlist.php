<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-02-28
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

/*
 * 支出菜单
 */
$ac_pdiv = '<div id="ac_popp" ac_pop="pay" class="ac_pop">';
$div_i = 0;
$div_arr = array();
$type = $account->account_config['paytype'];
$ac_pdiv .= '<ul ulstyle="ul_pay" class="ac_ul">';
foreach($type as $data) {
	foreach($data as $key => $val) {
		if($val == '.'){
			$ac_pdiv .= '<li sum="0" count="0" a_clsid="0"><a class="selimg_empty selimg_0">'.$key.'</a></li>';
		} else if(is_array($val)) {
			$div_arr[$div_i] = $val;
			$ac_pdiv .= '<li class="selimg_arrow" a_clsid="0" sum="0" count="'.count($val).'" div_id="pop_p'.$div_i.'"><a class="selimg_empty selimg_0">'.$key.'</a></li>';
			$div_i++;
		}
	}
}
$ac_pdiv .= '</ul>';
$ac_pdiv .= '<a class="ac_h selimg_empty selimg_0" a_ulid="ul_pay" a_clsid="0">全部</a><br /><button class="pn pnc" style="margin: 0px 0px 6px 20px; height: 21px;"><strong>确定</strong></button></div>';
//支出子菜单
foreach($div_arr as $key => $data) {
	$ac_pdiv .= '<div id="pop_p'.$key.'" class="ac_pop" popn="div">';
	$ac_pdiv .= '<ul popn="div_ul">';
	foreach($data as $val) {
		foreach($val as $name => $data1){
			if($data1 == '.') {
				$ac_pdiv .= '<li a_clsid="0"><a class="selimg_empty selimg_0">'.$name.'</a></li>';
			}
		}
	}
	$ac_pdiv .= '</ul>';
	$ac_pdiv .= '</div>';
}

/*
 * 收入菜单
 */
$ac_ediv = '<div id="ac_pope" ac_pop="earn" class="ac_pop">';
$div_i = 0;
unset($div_arr);
unset($type);
$div_arr = array();
$type = $account->account_config['earntype'];
$ac_ediv .= '<ul ulstyle="ul_earn" class="ac_ul">';
foreach($type as $data) {
	foreach($data as $key => $val) {
		if($val == '.'){
			$ac_ediv .= '<li sum="0" count="0" a_clsid="0"><a class="selimg_empty selimg_0">'.$key.'</a></li>';
		} else if(is_array($val)) {
			$div_arr[$div_i] = $val;
			$ac_ediv .= '<li class="selimg_arrow" a_clsid="0" sum="0" count="'.count($val).'" div_id="pop_e'.$div_i.'"><a class="selimg_empty selimg_0">'.$key.'</a></li>';
			$div_i++;
		}
	}
}
$ac_ediv .= '</ul>';
$ac_ediv .= '<a class="ac_h selimg_empty selimg_0" a_ulid="ul_earn" a_clsid="0">全部</a><br /><button class="pn pnc" style="margin: 0px 0px 6px 20px; height: 21px;"><strong>确定</strong></button></div>';
//收入子菜单
foreach($div_arr as $key => $data) {
	$ac_ediv .= '<div id="pop_e'.$key.'" class="ac_pop" popn="div">';
	$ac_ediv .= '<ul popn="div_ul">';
	foreach($data as $val) {
		foreach($val as $name => $data1){
			if($data1 == '.') {
				$ac_ediv .= '<li a_clsid="0"><a class="selimg_empty selimg_0">'.$name.'</a></li>';
			}
		}
	}
	$ac_ediv .= '</ul>';
	$ac_ediv .= '</div>';
}

?>
