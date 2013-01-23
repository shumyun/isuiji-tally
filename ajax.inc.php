<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-01-23
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}
define('NOROBOT', TRUE);

$basedir = 'source/plugin/account/';

if(empty($_G['uid'])) {
	echo '{"state":"err", "curerr":"no_login"}';
	return ;
}

require_once 'class/class_account.php';
global $account;

if(in_array($_GET['func'], array('adddata', 'chart', 'ra_data', 'aj_richlist', "deldata"))) {
	require_once DISCUZ_ROOT.$basedir.'ajax/'.trim($_GET['func']).'.php';
}

?>