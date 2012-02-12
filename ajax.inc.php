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

$basedir = 'source/plugin/account/';

if(empty($_G['uid'])) {
	echo '{"state":"err", "curerr":"no_login"}';
	return ;
}

require_once 'class/class_account.php';
global $account;

if(in_array($_GET['func'], array('adddata', 'chart', 'ra_data'))) {
	require_once DISCUZ_ROOT.$basedir.'ajax/'.trim($_GET['func']).'.php';
}

?>