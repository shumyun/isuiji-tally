<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-02-12
 *    Author: shumyun
 *    Copyright (C) 2011 - forever jiashe.net Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

define('NOROBOT', TRUE);


$arr = '';
$i = 0;
foreach($_POST as $key => $data) {
	switch($key) {
		case 'catcomplete':
			if($data == 'pay') {
				$arr[$i++] = 'paytype';
			}else if($data == 'earn') {
				$arr[$i++] = 'earntype';
			}
			break;
			
		case 'select':
			if($data == 'richtype') {
				$arr[$i++] = 'categorytype';
			}
			break;
			
		default:
			echo 'err';
			return ;
	}
}

if(!$account->run_radata($_G['uid'], $arr)) {
	echo 'err';
	return;
}

$titledata = '[';

foreach($arr as $data) {
	switch($data) {
		case 'paytype':
			$titledata .= '{"pay":'.title_arrtojs($account->account_config['paytype']).'},';
			break;
				
		case 'earntype':
			$titledata .= '{"earn":'.title_arrtojs($account->account_config['earntype']).'},';
			break;
			
		case 'categorytype':
			$titledata .= '{"richtype":'.catetype_arrtojs($account->account_config['catetype']).'},';
			break;
			
		default:
			echo 'err';
			return ;
	}
}

$titledata = substr_replace($titledata, "]", -1);
echo $titledata;

?>