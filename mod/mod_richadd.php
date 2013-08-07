<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-08-07
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

/*
$operation = in_array($_GET['op'], array('earning', 'transfer', 'lending')) ? trim($_GET['op']) : $defaultop;

if ($operation == 'earning') {
	$titledata = title_arrtojs($account->account_config['income']);
} else{
	$titledata = title_arrtojs($account->account_config['pay']);
}
$titledata = htmlentities($titledata, ENT_QUOTES | ENT_IGNORE, "UTF-8");
*/

$ac_profile = DB::fetch_first("SELECT totalearn, totalpay FROM ".DB::table('account_profile')." WHERE uid ='$_G[uid]'");
if (empty($ac_profile)) {
	$account->Init($_GET['uid']);
	$totalamount = 0;
} else 
	$totalamount = $ac_profile['totalearn'] - $ac_profile['totalpay'];

$acc_datetime = dmktime($acc_date);
$isoWeekStartDate = strtotime(date('o-\\WW', $_G['timestamp'])); //{isoYear}-W{isoWeekNumber}
$isoWeekEndDate = strtotime( "+6 days", $isoWeekStartDate);
$MonthStartDate = strtotime(date('Y-m-1', $_G['timestamp']));
$MonthEndDate = strtotime(date('Y-m-t', strtotime(date('Y-m', $_G['timestamp']))));

$acc_amount = array(
		'dpm' => '0.00',
		'dem' => '0.00',
		'wpm' => '0.00',
		'wem' => '0.00',
		'mpm' => '0.00',
		'mem' => '0.00',
		'mdm' => '-',
		'remdm' => '-',
		'totalamount' => $totalamount,
		'cattype' => $account->account_config['cattype']
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
$acc_tmp = DB::fetch_first("SELECT SUM(budget) as mdm FROM ".DB::table('account_budget')." WHERE uid = '$_G[uid]' AND datatime >= '$MonthStartDate' AND datatime <= '$MonthEndDate'");
if( !empty($acc_tmp['mdm'])) {
	$acc_amount['mdm'] = $acc_tmp['mdm']; $acc_amount['remdm'] = $acc_amount['mdm'] - $acc_amount['mpm'];
}

?>