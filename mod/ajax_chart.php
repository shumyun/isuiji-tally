<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-01-18
 *    Author: shumyun
 *    Copyright (C) 2011 - forever jiashe.net Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

$data = array(''); 
$curtime = time();


echo 'switch';
switch($_POST['chart']) {
	
	case 'SimpleCurY':
		$data['earn'] = array('');
		$data['pay'] = array('');
		set_defaultdata($data, date('t', $curtime));
		
		$query = DB::query("SELECT * FROM ".DB::table('account_daytotal').
							" WHERE uid='$_G[uid]' AND datadate >= ".mktime(0,0,0,date('n', $curtime),1,date('Y', $curtime)).
							" AND datadate <= ".mktime(0,0,0,date('n', $curtime),date('t', $curtime),date('Y', $curtime)));
		
		while($daydata = DB::fetch($query)) {
			$data['earn'][date('j', $curtime)] = $daydata['earnmoney'];
			$data['pay'][date('j', $curtime)] = $daydata['paymoney'];
		}
		echo '{"earn":['.implode(',', $data['earn']).'], "pay":['.implode(',', $data['pay']).']}';
		break;
		
	default:
		echo 'default';
		break;
}

function set_defaultdata($data, $daycount) {
	foreach ($data as $k => $v) {
		$i = 1;
		while($i <= $daycount) {
			$data[$k][$i] = 0;
		}
	}
}

?>