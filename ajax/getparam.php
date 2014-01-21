<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-10-17
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

define('NOROBOT', TRUE);


$sprint = '[';
foreach($_POST as $data) {
	switch($data) {
		case 'pay':
			$sprint .= '{"pay":['.$tally->GetpaytypeToJs().']},';
			break;
			
		case 'earn':
			$sprint .= '{"earn":['.$tally->GetearntypeToJs().']},';
			break;
			
		case 'richtype':
		case 'richtype_out':
			$sprint .= '{"'.$data.'":'.$tally->Getaccount().'},';
			break;
			
		case "loan":
		case "debt":
			$sprint .= '{"'.$data.'":'.$tally->Getloandebt().'},';
			break;
			
		default:
			echo 'err';
			return ;
	}
}

$sprint = substr_replace($sprint, "]", -1);
echo $sprint;

?>