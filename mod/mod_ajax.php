<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-01-09
 *    Author: shumyun
 *    Copyright (C) 2011 - forever jiashe.net Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

define('NOROBOT', TRUE);


$ac_response = array(
		'state' => 'ok',
		'curerr' => '');

switch ( $_POST['curstatus'] ) {
	case 'pay':
		if( !preg_match("/^\+?[0-9]+(.[0-9]{0,2})?$/", $_POST['richnum']) || $_POST['richnum'] <= 0 ) {
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'richnum';
			//echo "请填写大于零的金额";
			break;
		}
		if ( !ac_array_str_exists($_POST['richcategory'], $_POST['richname'], $account->account_config['pay'])) {
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'richname';
			//echo "请选择已存在的账单名称";
			break;
		}
		if( !($timestamp = strtotime($_POST['richdate'])) ) {
			$ac_response['state'] = 'err';
			$ac_response['curerr'] = 'richdate';
			//echo "请选择正确的日期";
			break;
		}
		
		$insarr = array(
			'uid' => $_G['uid'],
			'amount' => $_POST['richnum'],
			'title' => $_POST['richname'].'【'.$_POST['richcategory'].'】',
			'category' => $account->account_config['cattype'][$_POST['richtype']],
			'info' => $_POST['message'],
			'datatime' => $timestamp,
			'recordtime' => $_G['timestamp'],
			'datatype' => 1
			);
		DB::insert('account_data', $insarr);
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