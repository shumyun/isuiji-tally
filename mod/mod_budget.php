<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-09-15
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

$richbudget_y = date('Y', $_G['timestamp']);
$richbudget_m = date('n', $_G['timestamp']);

$uidtime = $_G['uid'].date('Ym', $_G['timestamp']);

$arr = Array("earntype", "paytype");
$account->GetParam($_G['uid'], $arr);

$apay = title_tobudget($account->account_config['paytype']);
$aearn = title_tobudget($account->account_config['earntype']);

/* 获取预算数据 */
$query = DB::query("SELECT * FROM ".DB::table('account_budget').
		" WHERE uidtime='$uidtime'");
while($paydata = DB::fetch($query)) {
	if($paydata['category'] == '支出') {
		if($paydata['seclv'] == '') {
			$apay[$paydata['onelv']]['budget']   = $paydata['budget'];
			$apay[$paydata['onelv']]['realcash'] = $paydata['realcash'];
		} else {
			$apay[$paydata['onelv']][$paydata['seclv']]['budget']   = $paydata['budget'];
			$apay[$paydata['onelv']][$paydata['seclv']]['realcash'] = $paydata['realcash'];
		}
	} else if($paydata['category'] == '收入') {
		if($paydata['seclv'] == '') {
			$aearn[$paydata['onelv']]['budget']   = $paydata['budget'];
			$aearn[$paydata['onelv']]['realcash'] = $paydata['realcash'];
		} else {
			$aearn[$paydata['onelv']][$paydata['seclv']]['budget']   = $paydata['budget'];
			$aearn[$paydata['onelv']][$paydata['seclv']]['realcash'] = $paydata['realcash'];
		}
	}
}

?>