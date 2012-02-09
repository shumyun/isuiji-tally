<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-02-09
 *    Author: shumyun
 *    Copyright (C) 2011 - forever jiashe.net Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

/////////////////////////////////////////////////////////////////////////////
// 全局变量(供index.inc.php 和 ajax.inc.php 调用)
$account = new class_account;
/////////////////////////////////////////////////////////////////////////////

class class_account {
	public $account_config = array(
			'earntype'    => '',
			'paytype'     => '',
			'cattype'     => '',
			'totalamount' => 0);
	
	public function run_modrichadd($ac_uid) {
		$ac_profile = DB::fetch_first("SELECT categorytype, totalearn, totalpay FROM ".DB::table('account_profile')." WHERE uid ='$ac_uid'");
		
		if (empty($ac_profile)) {
			$handle = @fopen(DISCUZ_ROOT."/source/plugin/account/prestore.data", "r");
			if ($handle) {
				$ac_profile = array();
				$ac_profile['uid'] = $ac_uid;
	        	$ac_profile['earntype'] = rtrim(fgets($handle, 4096));
	        	$ac_profile['paytype'] = rtrim(fgets($handle, 4096));
	        	$ac_profile['categorytype'] = rtrim(fgets($handle, 4096));
	        	$ac_profile['loantype'] = rtrim(fgets($handle, 4096));
	        	$ac_profile['firstdate'] = 0;
	        	$ac_profile['totalearn'] = 0;
	        	$ac_profile['totalpay'] = 0;
	        	DB::insert('account_profile', $ac_profile);
	    		fclose($handle);
			}
		}
		
		require_once DISCUZ_ROOT."/source/plugin/account/function/function_account.php";
		if (!categorytype_strtoarr($ac_profile['categorytype'], $this->account_config['cattype'])) return false;
		$this->account_config['totalamount'] = $ac_profile['totalearn'] - $ac_profile['totalpay'];
		return true;
	}
	
	public function run_ajaxcomplete($ac_uid, $type) {
		require_once DISCUZ_ROOT."/source/plugin/account/function/function_account.php";
		if ( $type == 'pay' ) {
			$ac_profile = DB::fetch_first("SELECT paytype FROM ".DB::table('account_profile')." WHERE uid ='$ac_uid'");
			if (empty($ac_profile))	return false;
			if (!title_strtoarr($ac_profile['paytype'], $this->account_config['paytype'])) return false;
		} else if( $type == 'earn' ) {
			$ac_profile = DB::fetch_first("SELECT earntype FROM ".DB::table('account_profile')." WHERE uid ='$ac_uid'");
			if (empty($ac_profile))	return false;
			if (!title_strtoarr($ac_profile['earntype'], $this->account_config['earntype'])) return false;
		} else
			return false;
		return true;
	}
	
	public function run_ajaxadd($ac_uid, $type) {
		require_once DISCUZ_ROOT."/source/plugin/account/function/function_account.php";
		switch ( $type ) {
			case 'pay':
				$ac_profile = DB::fetch_first("SELECT paytype, categorytype FROM ".DB::table('account_profile')." WHERE uid ='$ac_uid'");
				if (empty($ac_profile))	return false;
				if (!title_strtoarr($ac_profile['paytype'], $this->account_config['paytype'])) return false;
				if (!categorytype_strtoarr($ac_profile['categorytype'], $this->account_config['cattype'])) return false;
				break;
				
			case 'earn':
				$ac_profile = DB::fetch_first("SELECT earntype, categorytype FROM ".DB::table('account_profile')." WHERE uid ='$ac_uid'");
				if (empty($ac_profile))	return false;
				if (!title_strtoarr($ac_profile['earntype'], $this->account_config['earntype'])) return false;
				if (!categorytype_strtoarr($ac_profile['categorytype'], $this->account_config['cattype'])) return false;
				break;
				
			case 'transfer':
				$ac_profile = DB::fetch_first("SELECT categorytype FROM ".DB::table('account_profile')." WHERE uid ='$ac_uid'");
				if (empty($ac_profile))	return false;
				if (!categorytype_strtoarr($ac_profile['categorytype'], $this->account_config['cattype'])) return false;
				break;
				
			default:
				return false;
		}
		return true;
	}
}

?>