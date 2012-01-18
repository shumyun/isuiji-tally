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

switch($_GET['chart']) {
	
	case 'SimpleCurY':
		
		switch(date('t')) {
			case '28':
				
				break;
			case '29':
			case '30':
			case '31':
			default:
				break;
		}
		break;
		
	default:
		break;
}

?>