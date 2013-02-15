<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-02-15
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

define('NOROBOT', TRUE);


$ac_aresponse = array(
		'state' => 'ok',
		'curerr' => '');

if(!isset($_POST['isort']) || !is_numeric($_POST['isort'])
	|| !isset($_POST['onlyid']) || !is_numeric($_POST['onlyid'])) {
	$ac_aresponse['state'] = 'err';
	$ac_aresponse['curerr'] = 'datetype';
	//echo "记录时间错误或者ID错误";
	echo json_encode($ac_aresponse);
	return;
}

/**
 * 唯一标志
 * uid*(存储的行数*10+该数据所在的表的号码)
 */
$tmp = $_POST['onlyid']/$_G['uid'];
$tableID = $tmp%10;
$cid = ($tmp-$tableID)/10;
switch ($tableID) {
	case AC_PAY:
		$insarr = array(
			'cid' => $cid,
			'uid' => $_G['uid'],
			'recordtime' => $_POST['isort']
			);
		$sqlstr = "SELECT datatime, amount FROM ".DB::table('account_paydata').
					" WHERE uid='$_G[uid]' AND cid='$cid' AND recordtime='$_POST[isort]'";
		if(!($data = DB::fetch_first($sqlstr)) || !DB::delete('account_paydata', $insarr)) {
			$ac_aresponse['state'] = 'err';
			$ac_aresponse['curerr'] = 'Dont';
			//echo "操作失败";
			break;
		}
		
		$sqlstr = "UPDATE ".DB::table('account_daytotal').
					" SET paymoney = paymoney - '$data[amount]' WHERE uid = '$_G[uid]' AND datadate = '$data[datatime]'";
		if(!DB::query($sqlstr)
		 || !DB::query("UPDATE ".DB::table('account_profile')." SET totalpay = totalpay - '$data[amount]' WHERE uid = '$_G[uid]'")) {
			$ac_aresponse['state'] = 'err';
			$ac_aresponse['curerr'] = 'Dont';
			//echo "操作失败";
		}
		break;
		
	case AC_EARN:
		$insarr = array(
			'cid' => $cid,
			'uid' => $_G['uid'],
			'recordtime' => $_POST['isort']
			);
		$sqlstr = "SELECT datatime, amount FROM ".DB::table('account_earndata').
					" WHERE uid='$_G[uid]' AND cid='$cid' AND recordtime='$_POST[isort]'";
		if(!($data = DB::fetch_first($sqlstr)) || !DB::delete('account_earndata', $insarr)) {
			$ac_aresponse['state'] = 'err';
			$ac_aresponse['curerr'] = 'Dont';
			//echo "操作失败";
			break;
		}
		
		$sqlstr = "UPDATE ".DB::table('account_daytotal').
					" SET earnmoney = earnmoney - '$data[amount]' WHERE uid = '$_G[uid]' AND datadate = '$data[datatime]'";
		if(!DB::query($sqlstr)
		 || !DB::query("UPDATE ".DB::table('account_profile')." SET totalearn = totalearn - '$data[amount]' WHERE uid = '$_G[uid]'")) {
			$ac_aresponse['state'] = 'err';
			$ac_aresponse['curerr'] = 'Dont';
			//echo "操作失败";
		}
		break;
		
	case AC_TRANSFER:
		$insarr = array(
			'cid' => $cid,
			'uid' => $_G['uid'],
			'recordtime' => $_POST['isort']
			);
		if(!DB::delete('account_transfer', $insarr)) {
			$ac_aresponse['state'] = 'err';
			$ac_aresponse['curerr'] = 'Dont';
			//echo "操作失败";
		}
		break;
		
	case AC_LOANDEBT:
		$insarr = array(
			'cid' => $cid,
			'uid' => $_G['uid'],
			'recordtime' => $_POST['isort']
			);
		if(!DB::delete('account_loandebt', $insarr)) {
			$ac_aresponse['state'] = 'err';
			$ac_aresponse['curerr'] = 'Dont';
			//echo "操作失败";
		}
		break;
		
	default:
		$ac_aresponse['state'] = 'err';
		$ac_aresponse['curerr'] = 'Dont';
		//echo "无此表";
		break;
}

echo json_encode($ac_aresponse);

?>