<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-12-12
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

define('NOROBOT', TRUE);

if (!isset($_POST['bTime']) || !($bTime = strtotime($_POST['bTime'])))
	$bTime = 0;

if (!isset($_POST['eTime']) || !($eTime = strtotime($_POST['eTime'])))
	$eTime = 0;

if ($eTime < $bTime) {
	echo '开始时间应该大于结束时间';
	return ;
}

$query = DB::query("SELECT * FROM ".DB::table('account_paydata').
     " WHERE uid='$_G[uid]' AND datatime >= ".$bTime." AND datatime <= ".$eTime);

while($daydata = DB::fetch($query)) {
 $data['earn'] .= "{".date('Y/m/d', $daydata['datatime']).", ".$daydata['seclv'].
      ($daydata['onelv'] ? "<<".$daydata['onelv'] : '').", ".
      $daydata['amount'].", ".
      $daydata['category'].
      ($daydata['info'] ? ", ".$daydata['info'] : '')."}";
}

echo $data['earn'];

?>