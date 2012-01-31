<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-01-31
 *    Author: shumyun
 *    Copyright (C) 2011 - forever jiashe.net Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

$defaultop = '';
$baseurl = 'plugin.php?id=account:index';
$basedir = 'source/plugin/account/';

//在IE会跳到论坛
if(empty($_G['uid'])) {
	if($_SERVER['REQUEST_METHOD'] == 'GET') {
		dsetcookie('_refer', rawurlencode($_SERVER['REQUEST_URI']));
	} else {
		dsetcookie('_refer', rawurlencode('plugin.php?id=account:index'));
	}
	showmessage('to_login', '', array(), array('showmsg' => true, 'login' => 1));
}

require_once 'class/class_account.php';
global $account;

$acc_date = dgmdate($_G['timestamp'], 'd');

$acc_mod = in_array($_GET['mod'], array('richadd', 'richlist', 'richbudget', 'richcount', 'richset')) ? trim($_GET['mod']) : $defaultop;

switch ($acc_mod) {
	case 'richlist':
		break;
		
	default:
		$acc_datetime = dmktime($acc_date);
		$isoWeekStartDate = strtotime(date('o-\\WW', $_G['timestamp'])); //{isoYear}-W{isoWeekNumber}
		$isoWeekEndDate = strtotime( "+6 days", $isoWeekStartDate);
		$MonthStartDate = strtotime(date('Y-m', $_G['timestamp']));
		$MonthEndDate = strtotime(date('Y-m-t', $_G['timestamp']));
		$acc_amount = array(
				'dpm' => '0.00',
				'dem' => '0.00',
				'wpm' => '0.00',
				'wem' => '0.00',
				'mpm' => '0.00',
				'mem' => '0.00'
				);
		$acc_tmp = DB::fetch_first("SELECT paymoney as dpm, earnmoney as dem FROM ".DB::table('account_daytotal')." WHERE uid = '$_G[uid]' AND datadate = '$acc_datetime'");
		if(!empty($acc_tmp)) {
			$acc_amount['dpm'] = $acc_tmp['dpm']; $acc_amount['dem'] = $acc_tmp['dem'];
		}
		$acc_tmp = DB::fetch_first("SELECT SUM(paymoney) as wpm, SUM(earnmoney) as wem FROM ".DB::table('account_daytotal')." WHERE uid = '$_G[uid]' AND datadate >= '$isoWeekStartDate' AND datadate <= '$isoWeekEndDate'");
		if( !(empty($acc_tmp['wpm'])||empty($acc_tmp['wem']))) {
			$acc_amount['wpm'] = $acc_tmp['wpm']; $acc_amount['wem'] = $acc_tmp['wem'];
		}
		$acc_tmp = DB::fetch_first("SELECT SUM(paymoney) as mpm, SUM(earnmoney) as mem FROM ".DB::table('account_daytotal')." WHERE uid = '$_G[uid]' AND datadate >= '$MonthStartDate' AND datadate <= '$MonthEndDate'");
		if( !(empty($acc_tmp['mpm'])||empty($acc_tmp['mem']))) {
			$acc_amount['mpm'] = $acc_tmp['mpm']; $acc_amount['mem'] = $acc_tmp['mem'];
		}
		require_once DISCUZ_ROOT.$basedir.'mod/mod_richadd.php';
		include template('account:index');
		break;
}

?>