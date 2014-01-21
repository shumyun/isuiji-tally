<?php

/**
 *    isuiji_tally v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-10-19
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
		
require_once DISCUZ_ROOT.$basedir."function/func_common.php";

if(!isset($_POST['richnum']) || !func_test_cash($_POST['richnum'])) {
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

$account_id = $tally->GetTypeID('account', $_POST['richtype']);
if(!$account_id){
	$ac_response['state'] = 'err';
	$ac_response['curerr'] = 'richtype';
	//echo "请选择正确的归属";
	echo json_encode($ac_response);
	return;
}

switch ( $_POST['curstatus'] ) {
	case 'pay':
		$sid = $tally->GetTypeID($_POST['curstatus'], $_POST['richcategory'], $_POST['richname']);
		if (!$sid) {
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'richname';
			//echo "请选择已存在的账单名称";
			break;
		}
		$aInsert = array(
			'uid' => $_G['uid'],
			'amount' => $_POST['richnum'],
			'typeid' => $sid,
			'accountid' => $account_id,
			'info' => $_POST['message'],
			'datatime' => $timestamp,
			'recordtime' => $_G['timestamp']
			);
		$tally->InsertData($_POST['curstatus'], $aInsert);
		break;
		
	case 'earn':
		$sid = $tally->GetTypeID($_POST['curstatus'], $_POST['richcategory'], $_POST['richname']);
		if (!$sid) {
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'richname';
			//echo "请选择已存在的账单名称";
			break;
		}
		
		$aInsert = array(
			'uid' => $_G['uid'],
			'amount' => $_POST['richnum'],
			'typeid' => $sid,
			'accountid' => $account_id,
			'info' => $_POST['message'],
			'datatime' => $timestamp,
			'recordtime' => $_G['timestamp']
			);
		$tally->InsertData($_POST['curstatus'], $aInsert);
		break;
		
	case 'transfer':
		$account_outid = $tally->GetTypeID('account', $_POST['richtype_out']);
		if(!$account_outid) {
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'richtype_out';
		} else if($_POST['richtype'] == $_POST['richtype_out']){
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'richtype_same';
		} else {
			$aInsert = array(
				'uid' => $_G['uid'],
				'amount' => $_POST['richnum'],
				'iaccount' => $account_id,
				'oaccount' => $account_outid,
				'info' => $_POST['message'],
				'datatime' => $timestamp,
				'recordtime' => $_G['timestamp']
			);
			$tally->InsertData($_POST['curstatus'], $aInsert);
		}
		break;

	case "borrow":
	case "loan":
	case "repay":
	case "debt":
		$loandebt_id = $tally->GetTypeID('loandebt', $_POST['loandebt']);
		if(!$loandebt_id) {
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = $_POST['curstatus'];
		} else {
			$aInsert = array(
				'uid' => $_G['uid'],
				'type' => $_POST['curstatus'][0],
				'amount' => $_POST['richnum'],
				'aid' => $account_id,
				'lid' => $loandebt_id,
				'info' => $_POST['message'],
				'datatime' => $timestamp,
				'recordtime' => $_G['timestamp']
			);
			$tally->InsertData($_POST['curstatus'], $aInsert);
		}
		break;
		
	default:
		$ac_response['state'] = 'err';
		$ac_response['curerr'] = 'no_type';
		//echo "未知类型增加";
		break;
}

echo json_encode($ac_response);

?>