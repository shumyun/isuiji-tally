<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-12-12
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

$arr = array(
		0 => 'paytype',
		1 => 'earntype',
		2 => 'categorytype',
		3 => 'loandebt' 
		);

$account->run_radata($_G['uid'], $arr);

/*
 * 支出菜单
 */
$ac_pdiv = '<div id="ac_popp" ac_pop="pay" class="ac_pop">';
$div_i = 0;
$div_arr = array();
$type = $account->account_config['paytype'];
$ac_pdiv .= '<ul id="ul_pay" ul_aid="a_pay" class="ac_ul" sum="0" count="'.count($type).'">';
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
$ac_pdiv .= '<a id="a_pay" class="ac_h selimg_empty selimg_0" a_ulid="ul_pay" a_clsid="0">全部</a><br /><button class="pn pnc" style="margin: 0px 0px 6px 20px;"><strong>确定</strong></button></div>';
//支出子菜单
foreach($div_arr as $key => $data) {
	$ac_pdiv .= '<div id="pop_p'.$key.'" class="ac_pop" div_ulid="ul_p'.$key.'">';
	$ac_pdiv .= '<ul id="ul_p'.$key.'" popn="div_ul">';
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
$ac_ediv .= '<ul id="ul_earn" ul_aid="a_earn" class="ac_ul" sum="0" count="'.count($type).'">';
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
$ac_ediv .= '<a id="a_earn" class="ac_h selimg_empty selimg_0" a_ulid="ul_earn" a_clsid="0">全部</a><br /><button class="pn pnc" style="margin: 0px 0px 6px 20px;"><strong>确定</strong></button></div>';
//收入子菜单
foreach($div_arr as $key => $data) {
	$ac_ediv .= '<div id="pop_e'.$key.'" class="ac_pop" div_ulid="ul_e'.$key.'">';
	$ac_ediv .= '<ul id="ul_e'.$key.'" popn="div_ul">';
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

/*
 * 账单归属菜单
 */
$ac_bdiv = '<div id="ac_popb" ac_pop="belong" class="ac_pop">';
$div_i = 0;
unset($div_arr);
unset($type);
$type = $account->account_config['catetype'];
$ac_bdiv .= '<ul id="ul_belong" ul_aid="a_belong" class="ac_ul" sum="0" count="'.count($type).'">';
foreach($type as $data) {
	$ac_bdiv .= '<li sum="0" count="0" a_clsid="0"><a class="selimg_empty selimg_0">'.$data.'</a></li>';
}
$ac_bdiv .= '</ul>';
$ac_bdiv .= '<a id="a_belong" class="ac_h selimg_empty selimg_0" a_ulid="ul_belong" a_clsid="0">全部</a><br /><button class="pn pnc" style="margin: 0px 0px 6px 20px;"><strong>确定</strong></button></div>';

/*
 * 借贷归属菜单
*/
$ac_ldiv = '<div id="ac_popl" ac_pop="loandebt" class="ac_pop">';
$div_i = 0;
unset($div_arr);
unset($type);
$type = $account->account_config['loandebt'];
$ac_ldiv .= '<ul id="ul_loandebt" ul_aid="a_loandebt" class="ac_ul" sum="0" count="'.count($type).'">';
foreach($type as $data) {
	$ac_ldiv .= '<li sum="0" count="0" a_clsid="0"><a class="selimg_empty selimg_0">'.$data.'</a></li>';
}
$ac_ldiv .= '</ul>';
$ac_ldiv .= '<a id="a_loandebt" class="ac_h selimg_empty selimg_0" a_ulid="ul_loandebt" a_clsid="0">全部</a><br /><button class="pn pnc" style="margin: 0px 0px 6px 20px;"><strong>确定</strong></button></div>';

$richlist_y = date('Y', $_G['timestamp']);
$richlist_m = date('n', $_G['timestamp']);
$richlist_t = date('t', $_G['timestamp']);

?>
