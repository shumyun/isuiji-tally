<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2011-11-03
 *    Author: shumyun
 *    Copyright (C) 2011 - forever jiashe.net Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

$operation = in_array($_GET['op'], array('earning', 'transfer', 'lending')) ? trim($_GET['op']) : $defaultop;

if ($operation == 'earning') {
	$titledata = title_arrtojs($account->account_config['income']);
} else{
	$titledata = title_arrtojs($account->account_config['pay']);
}
$titledata = htmlentities($titledata, ENT_QUOTES | ENT_IGNORE, "UTF-8");

$richtype = $account->account_config['cattype'];

?>