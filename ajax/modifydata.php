<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-02-05
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

define('NOROBOT', TRUE);

$ac_aresponse = array(
		'state' => 'ok',
		'curerr' => '');

if(!isset($_POST['isort'] || !isset($_POST['onlyid'])) {
	$ac_aresponse['state'] = 'err';
	$ac_aresponse['curerr'] = 'datetype';
	//echo "��¼ʱ��������ID����";
	echo json_encode($ac_aresponse);
	return;
}

/**
 * Ψһ��־
 * uid*(�洢������*10+���������ڵı�ĺ���)
 */
$tmp = $_POST['onlyid']/$_G['uid'];
$tableID = $tmp%10;
$cid = ($tmp-$tableID)/10;

if($_GET['way'] == 'g')
	echo "hello";
else if ($_GET['way'] == 's')
	echo "olleh";

?>
