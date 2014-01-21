<?php

/**
 *    isuiji_tally v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2014-01-15
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

define('NOROBOT', TRUE);

$ac_aresponse = array(
		'state' => 'ok',
		'curerr' => $_G['timestamp']);

if(!isset($_POST['isort']) || !is_numeric($_POST['isort'])
	|| !isset($_POST['onlyid']) || !is_numeric($_POST['onlyid'])) {
	$ac_aresponse['state'] = 'err';
	$ac_aresponse['curerr'] = 'datetype';
	//echo "记录时间错误或者ID错误";
	echo json_encode($ac_aresponse);
	return;
}

require_once DISCUZ_ROOT."/source/plugin/tally/function/func_common.php";
if(!isset($_POST['richnum']) || !func_test_cash($_POST['richnum'])) {
	$ac_aresponse['state'] = 'err';
	$ac_aresponse['curerr'] = 'richnum';
	//echo "请填写大于零且最多两位小数的金额";
	echo json_encode($ac_aresponse);
	return;
}

if(!isset($_POST['richdate']) || !($timestamp = strtotime($_POST['richdate'])) ) {
	$ac_aresponse['state'] = 'err';
	$ac_aresponse['curerr'] = 'richdate';
	//echo "请选择正确的日期";
	echo json_encode($ac_aresponse);
	return;
}

$account_id = $tally->GetTypeID('account', $_POST['richtype']);
if(!$account_id){
	$ac_response['state'] = 'err';
	$ac_response['curerr'] = 'richtype';
	//echo "请选择正确的归属";
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
switch ($tableID) {
	case ISUIJI_PAY:
		$ptypeid = $tally->GetTypeID('pay', $_POST['richcategory'], $_POST['richname']);
		if(!$ptypeid) {
			$ac_aresponse['state'] = 'err';
			$ac_aresponse['curerr'] = 'richname';
			//echo "请选择已存在的账单名称";
			break;
		}
		$aUpdata = array(
			'amount' => $_POST['richnum'],
			'typeid' => $ptypeid,
			'accountid' => $account_id,
			'info' => $_POST['message'],
			'datatime' => $timestamp,
			'recordtime' => $ac_aresponse['curerr']
			);
		
		if(!$tally->ModifyPayData($aUpdata, $cid, $_POST['isort'])) {
			$ac_aresponse['state'] = 'err';
			$ac_aresponse['curerr'] = 'Dont';
			//echo "操作失败";
		}
		break;

	case ISUIJI_EARN:
		$etypeid = $tally->GetTypeID('earn', $_POST['richcategory'], $_POST['richname']);
		if(!$etypeid) {
			$ac_aresponse['state'] = 'err';
			$ac_aresponse['curerr'] = 'richname';
			//echo "请选择已存在的账单名称";
			break;
		}
		
		$aUpdata = array(
			'amount' => $_POST['richnum'],
			'typeid' => $etypeid,
			'accountid' => $account_id,
			'info' => $_POST['message'],
			'datatime' => $timestamp,
			'recordtime' => $ac_aresponse['curerr']
			);
		
		if(!$tally->ModifyEarnData($aUpdata, $cid, $_POST['isort'])) {
			$ac_aresponse['state'] = 'err';
			$ac_aresponse['curerr'] = 'Dont';
			//echo "操作失败";
		}
		break;
		
	case ISUIJI_TRANSFER:
		$account_outid = $tally->GetTypeID('account', $_POST['richtype_out']);
		if(!$account_outid) {
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'richtype_out';
			//echo "请选择正确的转出归属";
			break;
		} else if ($account_id == $account_outid) {
			$ac_aresponse['state'] = 'err';
			$ac_aresponse['curerr'] = 'richtype_same';
			break;
		}
		
		$aUpdata = array(
			'amount' => $_POST['richnum'],
			'iaccount' => $account_id,
			'oaccount' => $account_outid,
			'info' => $_POST['message'],
			'datatime' => $timestamp,
			'recordtime' => $ac_aresponse['curerr']
		);
		
		if(!$tally->ModifyTransData($aUpdata, $cid, $_POST['isort'])) {
			$ac_aresponse['state'] = 'err';
			$ac_aresponse['curerr'] = 'Dont';
			//echo "操作失败";
		}
		break;

	case ISUIJI_LOANDEBT:
		$loandebtid = $tally->GetTypeID('loandebt', $_POST['richtype_out']);
		if(!$loandebtid) {
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'richtype_out';
			//echo "请选择正确的归属";
			break;
		}
		
		$aUpdata = array(
			'amount' => $_POST['richnum'],
			'aid' => $account_id,
			'lid' => $loandebtid,
			'info' => $_POST['message'],
			'datatime' => $timestamp,
			'recordtime' => $ac_aresponse['curerr']
		);
		
		if(!$tally->ModifyLoandebtData($aUpdata, $cid, $_POST['isort'])) {
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
