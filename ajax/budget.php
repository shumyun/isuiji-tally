<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-09-29
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

define('NOROBOT', TRUE);

if(!isset($_POST['curstatus'])){
	$ac_response['state'] = 'err';
	$ac_response['curerr'] = 'no_type';
	//echo "未知类型增加";
	echo json_encode($ac_response);
}

$curstatus = strtolower($_POST['curstatus']);
if($curstatus == "get") {
	$uidtime = $_G['uid'].$_POST['year'].str_pad($_POST['month'], 2, '0', STR_PAD_LEFT);
	
	$arr = Array("earntype", "paytype");
	$account->GetParam($_G['uid'], $arr);
	
	$apayshow  = title_tobudget($account->account_config['paytype'],  false);
	$aearnshow = title_tobudget($account->account_config['earntype'], false);
	
	/* 获取该月预算数据 */
	$query = DB::query("SELECT * FROM ".DB::table('account_budget').
			" WHERE uidtime='$uidtime'");
	$apay  = array();
	$aearn = array();
	while($bdata = DB::fetch($query)) {
		$fbudget   = floatval($bdata['budget']);
		$frealcash = floatval($bdata['realcash']);
		if($bdata['category'] == '支出') {
			if($bdata['seclv'] == '') {
				$apay[$bdata['onelv']]['budget']   = $fbudget;
				$apay[$bdata['onelv']]['realcash'] = $frealcash;
				$apay[$bdata['onelv']]['state']    = $apayshow[$bdata['onelv']]['state'];

				$res = budget_color($frealcash, $fbudget);
				if(!$res) {
					$apay[$bdata['onelv']]['color'] = '#0';
					$apay[$bdata['onelv']]['percent'] = '-';
				} else {
					$apay[$bdata['onelv']]['color'] = '#'.$res;
					$apay[$bdata['onelv']]['percent'] = round($frealcash*100/$fbudget, 1).'%';
				}
			} else {
				$apay[$bdata['onelv']]['children'][$bdata['seclv']]['budget']   = $fbudget;
				$apay[$bdata['onelv']]['children'][$bdata['seclv']]['realcash'] = $frealcash;
				$apay[$bdata['onelv']]['children'][$bdata['seclv']]['state']    = $apayshow[$bdata['onelv']]['children'][$bdata['seclv']]['state'];
				
				$res = budget_color($frealcash, $fbudget);
				if(!$res) {
					$apay[$bdata['onelv']]['children'][$bdata['seclv']]['color'] = '#0';
					$apay[$bdata['onelv']]['children'][$bdata['seclv']]['percent'] = '-';
				} else {
					$apay[$bdata['onelv']]['children'][$bdata['seclv']]['color'] = '#'.$res;
					$apay[$bdata['onelv']]['children'][$bdata['seclv']]['percent'] = round($fealcash*100/$fbudget, 1).'%';
				}
			}
		} else if($bdata['category'] == '收入') {
			if($bdata['seclv'] == '') {
				$aearn[$bdata['onelv']]['budget']   = $fbudget;
				$aearn[$bdata['onelv']]['realcash'] = $frealcash;
				$aearn[$bdata['onelv']]['state']    = $aearnshow[$bdata['onelv']]['state'];

				$res = budget_color($frealcash, $fbudget);
				if(!$res) {
					$aearn[$bdata['onelv']]['color'] = '#0';
					$aearn[$bdata['onelv']]['percent'] = '-';
				} else {
					$aearn[$bdata['onelv']]['color'] = '#'.$res;
					$aearn[$bdata['onelv']]['percent'] = round($frealcash*100/$fbudget, 1).'%';
				}
			} else {
				$aearn[$bdata['onelv']]['children'][$bdata['seclv']]['budget']   = floatval($fbudget);
				$aearn[$bdata['onelv']]['children'][$bdata['seclv']]['realcash'] = floatval($frealcash);
				$aearn[$bdata['onelv']]['children'][$bdata['seclv']]['state']    = $aearnshow[$bdata['onelv']]['children'][$bdata['seclv']]['state'];
				
				$res = budget_color($frealcash, $fbudget);
				if(!$res) {
					$aearn[$bdata['onelv']]['children'][$bdata['seclv']]['color'] = '#0';
					$aearn[$bdata['onelv']]['children'][$bdata['seclv']]['percent'] = '-';
				} else {
					$aearn[$bdata['onelv']]['children'][$bdata['seclv']]['color'] = '#'.$res;
					$aearn[$bdata['onelv']]['children'][$bdata['seclv']]['percent'] = round($frealcash*100/$fbudget, 1).'%';
				}
			}
		}
	}
	
	$str = '{"支出":';
	if(empty($apay)) $str .= '{},"收入":';
	else $str .= json_encode($apay).',"收入":';
	if(empty($aearn)) $str .= '{}}';
	else $str .= json_encode($aearn).'}';
	echo $str;
	
} else if($curstatus) {
	;
}

?>