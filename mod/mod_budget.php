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

$richbudget_y = date('Y', $_G['timestamp']);
$richbudget_m = date('n', $_G['timestamp']);

$uidtime = $_G['uid'].date('Ym', $_G['timestamp']);

$query = DB::query("SELECT * FROM ".DB::table('account_budget').
		" WHERE uidtime='$uidtime' AND category = ");

?>