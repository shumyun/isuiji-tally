<?php

/**
 *    isuiji_tally v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-10-20
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

$totalamount = $tally->getTotalmoney();

$acc_datetime = dmktime($acc_date);

$acc_amount = array(
		'dpm' => '0.00',
		'dem' => '0.00',
		'wpm' => '0.00',
		'wem' => '0.00',
		'mpm' => '0.00',
		'mem' => '0.00',
		'mpd' => '-',
		'rempd' => '-',
		'totalamount' => $totalamount
);
$curtime = $_G['timestamp'];
$acc_tmp = $tally->getDaymoney($curtime);
if(!empty($acc_tmp)) {
	$acc_amount['dpm'] = $acc_tmp['dpm'];
	$acc_amount['dem'] = $acc_tmp['dem'];
}
$acc_tmp = $tally->getWeekmoney($curtime);
if( !(empty($acc_tmp['wpm'])||empty($acc_tmp['wem']))) {
	$acc_amount['wpm'] = $acc_tmp['wpm'];
	$acc_amount['wem'] = $acc_tmp['wem'];
}
$acc_tmp = $tally->getMonthmoney($curtime);
if( !(empty($acc_tmp['mpm'])||empty($acc_tmp['mem']))) {
	$acc_amount['mpm'] = $acc_tmp['mpm'];
	$acc_amount['mem'] = $acc_tmp['mem'];
}

$acc_tmp = $tally->getMonthbudget($curtime);
if( !empty($acc_tmp['mpd'])) {
	$acc_amount['mpd'] = $acc_tmp['mpd']; $acc_amount['rempd'] = $acc_amount['mpd'] - $acc_amount['mpm'];
}

?>
