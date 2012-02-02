<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-02-02
 *    Author: shumyun
 *    Copyright (C) 2011 - forever jiashe.net Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

/////////////////////////////////////////////////////////////////////////////
// 全局变量(供index.inc.php 和 ajax.inc.php 调用)
$account = new class_account;
$account->run($_G['uid']);
/////////////////////////////////////////////////////////////////////////////

class class_account {
	public $account_config = array(
			'income' => '',
			'pay'	 => '',
			'cattype'=> '',
			'totalamount' => 0);
	public function run($ac_uid) {
		$ac_profile = DB::fetch_first("SELECT * FROM ".DB::table('account_profile')." WHERE uid ='$ac_uid'");
		
		if (empty($ac_profile)) {
			$handle = @fopen(DISCUZ_ROOT."/source/plugin/account/prestore.data", "r");
			if ($handle) {
				$ac_profile = array();
				$ac_profile['uid'] = $ac_uid;
	        	$ac_profile['titleincome'] = rtrim(fgets($handle, 4096));
	        	$ac_profile['titlepay'] = rtrim(fgets($handle, 4096));
	        	$ac_profile['categorytype'] = rtrim(fgets($handle, 4096));
	        	$ac_profile['firstdate'] = 0;
	        	$ac_profile['totalearn'] = 0;
	        	$ac_profile['totalpay'] = 0;
	        	echo DB::implode_field_value($ac_profile);
	        	DB::insert('account_profile', $ac_profile);
	    		fclose($handle);
			}
		}
		
		require_once DISCUZ_ROOT."/source/plugin/account/function/function_account.php";
		if (!title_strtoarr($ac_profile['titleincome'], $this->account_config['income'])) return false;
		if (!title_strtoarr($ac_profile['titlepay'], $this->account_config['pay'])) return false;
		if (!categorytype_strtoarr($ac_profile['categorytype'], $this->account_config['cattype'])) return false;
		$this->account_config['totalamount'] = $ac_profile['totalearn'] - $ac_profile['totalpay'];
	}
}

?>