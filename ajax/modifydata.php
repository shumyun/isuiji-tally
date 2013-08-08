<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-02-17
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

if(!isset($_POST['richnum']) || !preg_match("/^\+?[0-9]+(.[0-9]{0,2})?$/", $_POST['richnum']) || $_POST['richnum'] <= 0 ) {
	$ac_response['state'] = 'err';
	$ac_response['curerr'] = 'richnum';
	//echo "请填写大于零且最多两位小数的金额";
	echo json_encode($ac_response);
	return;
}

if(!isset($_POST['richdate']) || !($timestamp = strtotime($_POST['richdate'])) ) {
	$ac_response['state'] = 'err';
	$ac_response['curerr'] = 'richdate';
	//echo "请选择正确的日期";
	echo json_encode($ac_response);
	return;
}

/**
 * 唯一标志
 * uid*(存储的行数*10+该数据所在的表的号码)
 */
$tmp = $_POST['onlyid']/$_G['uid'];
$tableID = $tmp%10;
$cid = ($tmp-$tableID)/10;
require_once DISCUZ_ROOT."/source/plugin/account/function/function_account.php";
switch ($tableID) {
	case AC_PAY:
		$arr = UserParam_strtoarr('pay');
		if( !$account->GetParam($_G['uid'], $arr) ||
			!ac_array_str_exists($_POST['richcategory'], $_POST['richname'], $account->account_config['paytype'])) {
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'richname';
			//echo "请选择已存在的账单名称";
			break;
		}
		if( !isset($_POST['richtype']) || $_POST['richtype'] >= count($account->account_config['catetype']) ){
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'richtype';
			//echo "请选择正确的归属";
			break;
		}
		$sqlstr = "SELECT datatime, amount FROM ".DB::table('account_paydata')." WHERE uid='$_G[uid]' AND cid='$cid' AND recordtime='$_POST[isort]'";
		$aUpdata = array(
			'amount' => $_POST['richnum'],
			'onelv' => $_POST['richcategory'],
			'seclv' => $_POST['richname'],
			'category' => $account->account_config['catetype'][$_POST['richtype']],
			'info' => $_POST['message'],
			'datatime' => $timestamp,
			'recordtime' => $_G['timestamp']
			);
		$aCond = array(
			'cid' => $cid,
			'uid' => $_G['uid'],
			'recordtime' => $_POST['isort']
			);
		if( !($data = DB::fetch_first($sqlstr)) || !DB::update('account_paydata', $aUpdata, $aCond)) {
			$ac_aresponse['state'] = 'err';
			$ac_aresponse['curerr'] = 'Dont';
			//echo "操作失败";
			break;
		}
		
		if($timestamp == $data[datatime]) {
			$sqlstr = "UPDATE ".DB::table('account_daytotal').
						" SET paymoney = paymoney - '$data[amount]' + '$_POST[richnum]' WHERE uid = '$_G[uid]' AND datadate = '$data[datatime]'";
		} else {
			DB::query("UPDATE ".DB::table('account_daytotal')." SET paymoney = paymoney + '$_POST[richnum]' WHERE uid = '$_G[uid]' AND datadate = '$timestamp'");
			if (!DB::affected_rows()) {
				$insarr = array(
						'uid' => $_G['uid'],
						'paymoney' => $_POST['richnum'],
						'earnmoney' => 0,
						'datadate' => $timestamp
						);
				DB::insert('account_daytotal', $insarr);
			}
			$sqlstr = "UPDATE ".DB::table('account_daytotal').
						" SET paymoney = paymoney - '$data[amount]' WHERE uid = '$_G[uid]' AND datadate = '$data[datatime]'";
		}
		if(!DB::query($sqlstr)
			|| !DB::query("UPDATE ".DB::table('account_profile')." SET totalpay = totalpay - '$data[amount]' + '$_POST[richnum]' WHERE uid = '$_G[uid]'")) {
			$ac_aresponse['state'] = 'err';
			$ac_aresponse['curerr'] = 'Dont';
			//echo "操作失败";
		}
		break;

	case AC_EARN:
		$arr = UserParam_strtoarr('earn');
		if( !$account->GetParam($_G['uid'], $arr) ||
			!ac_array_str_exists($_POST['richcategory'], $_POST['richname'], $account->account_config['earntype'])) {
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'richname';
			//echo "请选择已存在的账单名称";
			break;
		}
		if( !isset($_POST['richtype']) || $_POST['richtype'] >= count($account->account_config['catetype'])){
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'richtype';
			//echo "请选择正确的归属";
			break;
		}
		$sqlstr = "SELECT datatime, amount FROM ".DB::table('account_earndata')." WHERE uid='$_G[uid]' AND cid='$cid' AND recordtime='$_POST[isort]'";
		$aUpdata = array(
			'amount' => $_POST['richnum'],
			'onelv' => $_POST['richcategory'],
			'seclv' => $_POST['richname'],
			'category' => $account->account_config['catetype'][$_POST['richtype']],
			'info' => $_POST['message'],
			'datatime' => $timestamp,
			'recordtime' => $_G['timestamp']
			);
		$aCond = array(
			'cid' => $cid,
			'uid' => $_G['uid'],
			'recordtime' => $_POST['isort']
			);
		if( !($data = DB::fetch_first($sqlstr)) || !DB::update('account_earndata', $aUpdata, $aCond)) {
			$ac_aresponse['state'] = 'err';
			$ac_aresponse['curerr'] = 'Dont';
			//echo "操作失败";
			break;
		}
		
		if($timestamp == $data[datatime]) {
			$sqlstr = "UPDATE ".DB::table('account_daytotal').
						" SET earnmoney = earnmoney - '$data[amount]' + '$_POST[richnum]' WHERE uid = '$_G[uid]' AND datadate = '$data[datatime]'";
		} else {
			DB::query("UPDATE ".DB::table('account_daytotal')." SET earnmoney = earnmoney + '$_POST[richnum]' WHERE uid = '$_G[uid]' AND datadate = '$timestamp'");
			if (!DB::affected_rows()) {
				$insarr = array(
						'uid' => $_G['uid'],
						'paymoney' => 0,
						'earnmoney' => $_POST['richnum'],
						'datadate' => $timestamp
						);
				DB::insert('account_daytotal', $insarr);
			}
			$sqlstr = "UPDATE ".DB::table('account_daytotal').
						" SET earnmoney = earnmoney - '$data[amount]' WHERE uid = '$_G[uid]' AND datadate = '$data[datatime]'";
		}
		if(!DB::query($sqlstr)
			|| !DB::query("UPDATE ".DB::table('account_profile')." SET totalearn = totalearn - '$data[amount]' + '$_POST[richnum]' WHERE uid = '$_G[uid]'")) {
			$ac_aresponse['state'] = 'err';
			$ac_aresponse['curerr'] = 'Dont';
			//echo "操作失败";
		}
		break;

	case AC_TRANSFER:
		$arr = UserParam_strtoarr('transfer');
		if( !$account->GetParam($_G['uid'], $arr)) {
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'richtype';
			//echo "请选择已存在的账户名称";
			break;
		}
		if(!isset($_POST['richtype_out']) || $_POST['richtype_out'] >= count($account->account_config['catetype'])) {
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'richtype_out';
		} else if( !isset($_POST['richtype']) || $_POST['richtype'] >= count($account->account_config['catetype'])){
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'richtype';
		}  else if($_POST['richtype'] == $_POST['richtype_out']){
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'richtype_same';
		} else {
			$aUpdata = array(
				'amount' => $_POST['richnum'],
				'icategory' => $account->account_config['catetype'][$_POST['richtype']],
				'ocategory' => $account->account_config['catetype'][$_POST['richtype_out']],
				'info' => $_POST['message'],
				'datatime' => $timestamp,
				'recordtime' => $_G['timestamp']
			);
			$aCond = array(
				'cid' => $cid,
				'uid' => $_G['uid'],
				'recordtime' => $_POST['isort']
				);
			if( !DB::update('account_transfer', $aUpdata, $aCond)) {
				$ac_aresponse['state'] = 'err';
				$ac_aresponse['curerr'] = 'Dont';
				//echo "操作失败";
			}
		}
		break;

	case AC_LOANDEBT:
		break;

	default:
		$ac_aresponse['state'] = 'err';
		$ac_aresponse['curerr'] = 'Dont';
		//echo "无此表";
		break;
}

echo json_encode($ac_aresponse);

?>
