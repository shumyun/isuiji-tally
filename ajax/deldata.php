<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-01-24
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

define('NOROBOT', TRUE);


$ac_response = array(
		'state' => 'ok',
		'curerr' => '');

if(!isset($_POST['sort'])) {
	$ac_response['state'] = 'err';
	$ac_response['curerr'] = 'datetype';
	//echo "��¼��ʱ�����";
	echo json_encode($ac_response);
	return;
}

if(!isset($_POST['id'])) {
	$ac_response['state'] = 'err';
	$ac_response['curerr'] = 'datetype';
	//echo "ID����";
	echo json_encode($ac_response);
	return;
}


/**
 * ���Ψһ��־
 * uid*(�洢������*10+���������ڵı�ĺ���)
 */
$tmp = $_POST['id']/$_G['uid'];
$tableID = $tmp%10;
$cid = $tmp/10;
switch ($tableID) {
	case AC_PAY:
		$insarr = array(
			'cid' => $cid,
			'uid' => $_G['uid'],
			'recordtime' => $_G['sort']
			);
		$sqlstr = "SELECT datatime, amount FROM ".DB::table('account_paydata')
							." WHERE uid='$_G[uid]' AND cid='$cid' AND recordtime='$_G['sort']'";
		if(!($data = DB::fetch_first($sqlstr)) || !DB::delete('account_paydata', $insarr)) {
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'Dont';
			//echo "��������";
			echo json_encode($ac_response);
			return;
		}
		
		$sqlstr = "UPDATE ".DB::table('account_daytotal')." SET paymoney = paymoney - '$data[amount]' WHERE uid = '$_G[uid]' AND datadate = '$data[datatime]'";
		if(!DB::query($sqlstr)
		 || !DB::query("UPDATE ".DB::table('account_profile')." SET totalpay = totalpay - '$data[amount]' WHERE uid = '$_G[uid]'")) {
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'Dont';
			//echo "��������";
			echo json_encode($ac_response);
			return;
		}
		break;
		
	case AC_EARN:
		break;
		
	case AC_TRANSFER:
		break;
		
	case AC_LOANDEBT:
		break;
		
	default:
		break;
}

echo json_encode($ac_response);

?>
