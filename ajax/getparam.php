<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-08-08
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

define('NOROBOT', TRUE);


$arr_post = '';
foreach($_POST as $data) {
	switch($data) {
		case 'pay':
			$arr_post['paytype'] = $data;
			break;
			
		case 'earn':
			$arr_post['earntype'] = $data;
			break;
			
		case 'richtype':
		case 'richtype_out':
			$arr_post['categorytype'] = $data;
			break;
			
		case "loan":
		case "debt":
			$arr_post['loandebt'] = $data;
			break;
			
		default:
			echo 'err';
			return ;
	}
}

$arr = array_keys($arr_post);

if($arr == '' || !$account->GetParam($_G['uid'], $arr)) {
	echo 'err';
	return;
}

$titledata = '[';

foreach($arr as $data) {
	switch($data) {
		case 'paytype':
			$titledata .= '{"'.$arr_post[$data].'":'.title_arrtojs($account->account_config['paytype']).'},';
			break;
				
		case 'earntype':
			$titledata .= '{"'.$arr_post[$data].'":'.title_arrtojs($account->account_config['earntype']).'},';
			break;
			
		case 'categorytype':
			$titledata .= '{"'.$arr_post[$data].'":'.catetype_arrtojs($account->account_config['catetype']).'},';
			break;
			
		case 'loandebt':
			$titledata .= '{"'.$arr_post[$data].'":'.catetype_arrtojs($account->account_config['loandebt']).'},';
			break;
			
		default:
			echo 'err';
			return ;
	}
}

$titledata = substr_replace($titledata, "]", -1);
echo $titledata;

?>