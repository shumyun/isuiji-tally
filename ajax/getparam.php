<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2014-01-25
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
			$sprint .= '{"pay":['.$tally->getPaytypeToJs().']},';
			break;
			
		case 'earn':
			$sprint .= '{"earn":['.$tally->getEarntypeToJs().']},';
			break;
			
		case 'richtype':
		case 'richtype_out':
			$sprint .= '{"'.$data.'":'.$tally->getAccount().'},';
			break;
			
		case "loan":
		case "debt":
			$sprint .= '{"'.$data.'":'.$tally->getLoandebt().'},';
			break;
			
		default:
			echo 'err';
			return ;
	}
}

$sprint = substr_replace($sprint, "]", -1);
echo $sprint;

?>