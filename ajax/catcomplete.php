<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-02-05
 *    Author: shumyun
 *    Copyright (C) 2011 - forever jiashe.net Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

define('NOROBOT', TRUE);

if(!$account->run_ajaxcomplete($_G['uid'], $_POST['type'])) {
	return;
}

$titledata = '';
switch($_POST['type']) {
	case 'pay':
		$titledata = title_arrtojs($account->account_config['paytype']);
		break;
		
	case 'earn':
		$titledata = title_arrtojs($account->account_config['earntype']);
		break;
		
	default:
		break;
}

echo $titledata;

?>