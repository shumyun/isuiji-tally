<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-08-07
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}
define('NOROBOT', TRUE);

/**
 * 数据所在的表的宏
 */
define('AC_PAY',  1);
define('AC_EARN', 2);
define('AC_TRANSFER', 3);
define('AC_LOANDEBT', 4);

$basedir = 'source/plugin/account/';

if(empty($_G['uid'])) {
	echo '{"state":"err", "curerr":"no_login"}'; //出错端要提示“刷新页面，重新登录”
	return ;
}

require_once 'class/class_account.php';
global $account;


if(in_array($_GET['func'], array('adddata', 'chart', 'getparam', 'aj_richlist', 'deldata', 'modifydata', 'budget'))) {
	require_once DISCUZ_ROOT.$basedir.'ajax/'.trim($_GET['func']).'.php';
}

?>