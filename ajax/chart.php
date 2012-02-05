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

$data = array(''); 
$curtime = $_G['timestamp'];


switch($_POST['chart']) {
	
	case 'SimpleCurY':
		$data['earn'] = array('');
		$data['pay'] = array('');
		$daycount = date('t', $curtime);
		$datastr = '"date":["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28"';
		switch ($daycount) {
			case 28: $datastr .=']'; break;
			case 29: $datastr .= ',"29"]'; break;
			case 30: $datastr .= ',"29","30"]'; break;
			case 31: $datastr .= ',"29","30","31"]'; break;
			default:break;
		}
		set_defaultdata($data, $daycount);
		
		$query = DB::query("SELECT * FROM ".DB::table('account_daytotal').
							" WHERE uid='$_G[uid]' AND datadate >= ".mktime(0,0,0,date('n', $curtime),1,date('Y', $curtime)).
							" AND datadate <= ".mktime(0,0,0,date('n', $curtime),date('t', $curtime),date('Y', $curtime)));
		
		while($daydata = DB::fetch($query)) {
			$data['earn'][date('j', $daydata['datadate'])-1] = $daydata['earnmoney'];
			$data['pay'][date('j', $daydata['datadate'])-1] = $daydata['paymoney'];
		}
		
		echo '{"state":"ok", "data":{"detail":"'.date("Y", $curtime).'年'.date("m", $curtime).'月 (单位:元)", '.$datastr.', "earn":['.implode(',', $data['earn']).'], "pay":['.implode(',', $data['pay']).']}}';
		break;
		
	default:
		break;
}

function set_defaultdata(&$data, $daycount) {
	foreach ($data as $k => $v) {
		$i = 0;
		while($i < $daycount) {
			$data[$k][$i] = 0;
			$i++;
		}
	}
}

?>