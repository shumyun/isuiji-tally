<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-02-13
 *    Author: shumyun
 *    Copyright (C) 2011 - forever jiashe.net Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

define('NOROBOT', TRUE);

if(!$account->run_ajaxadd($_G['uid'], $_POST['curstatus'])) {
	return;
}

$ac_response = array(
		'state' => 'ok',
		'curerr' => '');

if( !preg_match("/^\+?[0-9]+(.[0-9]{0,2})?$/", $_POST['richnum']) || $_POST['richnum'] <= 0 ) {
	$ac_response['state'] = 'err';
	$ac_response['curerr'] = 'richnum';
	//echo "请填写大于零的金额";
	echo json_encode($ac_response);
	return;
}

if( !($timestamp = strtotime($_POST['richdate'])) ) {
	$ac_response['state'] = 'err';
	$ac_response['curerr'] = 'richdate';
	//echo "请选择正确的日期";
	echo json_encode($ac_response);
	return;
}

if( !isset($_POST['richtype']) || $_POST['richtype'] >= count($account->account_config['catetype']) ){
	$ac_response['state'] = 'err';
	$ac_response['curerr'] = 'richtype';
	//echo "请选择正确的归属";
	echo json_encode($ac_response);
	return;
}

switch ( $_POST['curstatus'] ) {
	case 'pay':
		if ( !ac_array_str_exists($_POST['richcategory'], $_POST['richname'], $account->account_config['paytype'])) {
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'richname';
			//echo "请选择已存在的账单名称";
			break;
		}
		
		$insarr = array(
			'uid' => $_G['uid'],
			'amount' => $_POST['richnum'],
			'title' => $_POST['richname'].'【'.$_POST['richcategory'].'】',
			'category' => $account->account_config['catetype'][$_POST['richtype']],
			'info' => $_POST['message'],
			'datatime' => $timestamp,
			'recordtime' => $_G['timestamp']
			);
		DB::insert('account_paydata', $insarr);
		DB::query("UPDATE ".DB::table('account_daytotal')." SET paymoney = paymoney + '$_POST[richnum]' WHERE uid = '$_G[uid]' AND datadate = '$timestamp'");
		if (!DB::affected_rows()) {
			unset($insarr);
			$insarr = array(
					'uid' => $_G['uid'],
					'paymoney' => $_POST['richnum'],
					'earnmoney' => 0,
					'datadate' => $timestamp
			);
			DB::insert('account_daytotal', $insarr);
		}
		DB::query("UPDATE ".DB::table('account_profile')." SET totalpay = totalpay + '$_POST[richnum]' WHERE uid = '$_G[uid]'");
		break;
		
	case 'earn':
		if ( !ac_array_str_exists($_POST['richcategory'], $_POST['richname'], $account->account_config['earntype'])) {
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'richname';
			//echo "请选择已存在的账单名称";
			break;
		}
		
		$insarr = array(
			'uid' => $_G['uid'],
			'amount' => $_POST['richnum'],
			'title' => $_POST['richname'].'【'.$_POST['richcategory'].'】',
			'category' => $account->account_config['catetype'][$_POST['richtype']],
			'info' => $_POST['message'],
			'datatime' => $timestamp,
			'recordtime' => $_G['timestamp']
			);
		DB::insert('account_earndata', $insarr);
		DB::query("UPDATE ".DB::table('account_daytotal')." SET earnmoney = earnmoney + '$_POST[richnum]' WHERE uid = '$_G[uid]' AND datadate = '$timestamp'");
		if (!DB::affected_rows()) {
			unset($insarr);
			$insarr = array(
					'uid' => $_G['uid'],
					'paymoney' => 0,
					'earnmoney' => $_POST['richnum'],
					'datadate' => $timestamp
			);
			DB::insert('account_daytotal', $insarr);
		}
		DB::query("UPDATE ".DB::table('account_profile')." SET totalearn = totalearn + '$_POST[richnum]' WHERE uid = '$_G[uid]'");
		break;
		
	case 'transfer':
		if(!isset($_POST['richtype_out']) || $_POST['richtype_out'] >= count($account->account_config['catetype'])) {
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'richtype_out';
		} else if($_POST['richtype'] == $_POST['richtype_out']){
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'richtype_same';
		} else {
			$insarr = array(
				'uid' => $_G['uid'],
				'amount' => $_POST['richnum'],
				'icategory' => $account->account_config['catetype'][$_POST['richtype']],
				'ocategory' => $account->account_config['catetype'][$_POST['loandebt']],
				'info' => $_POST['message'],
				'datatime' => $timestamp,
				'recordtime' => $_G['timestamp']
			);
			DB::insert('account_transfer', $insarr);
		}
		break;

	case "borrow":
		if(!isset($_POST['loandebt']) || $_POST['loandebt'] >= count($account->account_config['loandebt'])) {
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'borrow';
		} else {
			$insarr = array(
				'uid' => $_G['uid'],
				'type' => 1,
				'amount' => $_POST['richnum'],
				'category' => $account->account_config['catetype'][$_POST['richtype']],
				'loandebt' => $account->account_config['loandebt'][$_POST['loandebt']],
				'info' => $_POST['message'],
				'datatime' => $timestamp,
				'recordtime' => $_G['timestamp']
			);
			DB::insert('account_loandebt', $insarr);
		}
		break;
		
	case "loan":
		if(!isset($_POST['loandebt']) || $_POST['loandebt'] >= count($account->account_config['loandebt'])) {
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'loan';
		} else {
			$insarr = array(
				'uid' => $_G['uid'],
				'type' => 2,
				'amount' => $_POST['richnum'],
				'category' => $account->account_config['catetype'][$_POST['richtype']],
				'loandebt' => $account->account_config['loandebt'][$_POST['loandebt']],
				'info' => $_POST['message'],
				'datatime' => $timestamp,
				'recordtime' => $_G['timestamp']
			);
			DB::insert('account_loandebt', $insarr);
		}
		break;
		
	case "repay":
		if(!isset($_POST['loandebt']) || $_POST['loandebt'] >= count($account->account_config['loandebt'])) {
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'repay';
		} else {
			$insarr = array(
				'uid' => $_G['uid'],
				'type' => 3,
				'amount' => $_POST['richnum'],
				'category' => $account->account_config['catetype'][$_POST['richtype']],
				'loandebt' => $account->account_config['loandebt'][$_POST['loandebt']],
				'info' => $_POST['message'],
				'datatime' => $timestamp,
				'recordtime' => $_G['timestamp']
			);
			DB::insert('account_loandebt', $insarr);
		}
		break;
		
	case "debt":
		if(!isset($_POST['loandebt']) || $_POST['loandebt'] >= count($account->account_config['loandebt'])) {
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'repay';
		} else {
			$insarr = array(
				'uid' => $_G['uid'],
				'type' => 4,
				'amount' => $_POST['richnum'],
				'category' => $account->account_config['catetype'][$_POST['richtype']],
				'loandebt' => $account->account_config['loandebt'][$_POST['loandebt']],
				'info' => $_POST['message'],
				'datatime' => $timestamp,
				'recordtime' => $_G['timestamp']
			);
			DB::insert('account_loandebt', $insarr);
		}
		break;
		
	default:
		break;
}

echo json_encode($ac_response);

/**
 * 检查账单名称
 */
function ac_array_str_exists($richcategory, $richname, $typearr) {
	if($richname === "")
		return false;
	if($richcategory === "") {
		foreach($typearr as $category) {
			if(array_key_exists($richname, $category)) {
				return true;
			}
		}
	} else {
		foreach($typearr as $category) {
			if(array_key_exists($richcategory, $category)) {
				if(is_array($category[$richcategory])){
					foreach($category[$richcategory] as $label) {
						if(array_key_exists($richname, $label))
							return true;
					}
				}
			}
		}
	}
	return false;
}

?>