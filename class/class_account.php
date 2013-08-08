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

/////////////////////////////////////////////////////////////////////////////
// 全局变量(供index.inc.php 和 ajax.inc.php 调用)
$account = new class_account;
/////////////////////////////////////////////////////////////////////////////

class class_account {
	public $account_config = array(
			'earntype'    => '',
			'paytype'     => '',
			'catetype'    => '',
			'loandebt'    => '',
			'seldata'     => '');
	
	/**
	 * 初始化用户理财属性
	 * @param  $ac_uid 用户ID
	 * @param  $force  强制清空数据
	 */
	public function Init($ac_uid, $force=false) {
		$handle = @fopen(DISCUZ_ROOT."/source/plugin/account/prestore.data", "r");
		if ($handle) {
			$ac_profile = array();
			$ac_profile['uid'] = $ac_uid;
			$ac_profile['earntype'] = rtrim(fgets($handle, 4096));
			$ac_profile['paytype'] = rtrim(fgets($handle, 4096));
			$ac_profile['categorytype'] = rtrim(fgets($handle, 4096));
			$ac_profile['loandebt'] = rtrim(fgets($handle, 4096));
			$ac_profile['firstdate'] = 0;
			$ac_profile['totalearn'] = 0;
			$ac_profile['totalpay'] = 0;
			DB::insert('account_profile', $ac_profile);
			fclose($handle);
		}
		if($force) {
			;
		}
	}
	
	/**
	 * 获取用户类别信息
	 * @param  $ac_uid 用户ID
	 * @param  $arr    需要获取的类别名称
	 */
	public function GetParam($ac_uid, $arr) {
		require_once DISCUZ_ROOT."/source/plugin/account/function/function_account.php";
		$str = implode(',', array_unique($arr));
		
		$ac_profile = DB::fetch_first("SELECT ".$str." FROM ".DB::table('account_profile')." WHERE uid ='$ac_uid'");
		
		if (empty($ac_profile))	return false;
		
		foreach($arr as $data) {
			switch($data) {
				case 'paytype':
					if (!title_strtoarr($ac_profile['paytype'], $this->account_config['paytype'])) return false;
					break;
				case 'earntype':
					if (!title_strtoarr($ac_profile['earntype'], $this->account_config['earntype'])) return false;
					break;
				case 'categorytype':
					if (!catetype_strtoarr($ac_profile['categorytype'], $this->account_config['catetype'])) return false;
					break;
				case 'loandebt':
					if (!catetype_strtoarr($ac_profile['loandebt'], $this->account_config['loandebt'])) return false;
					break;
				default:
					return false;
			}
		}
		return true;
	}
	
	public function run_ajaxadd($ac_uid, $type) {
		require_once DISCUZ_ROOT."/source/plugin/account/function/function_account.php";
		switch ( $type ) {
			case 'pay':
				$ac_profile = DB::fetch_first("SELECT paytype, categorytype FROM ".DB::table('account_profile')." WHERE uid ='$ac_uid'");
				if (empty($ac_profile))	return false;
				if (!title_strtoarr($ac_profile['paytype'], $this->account_config['paytype'])) return false;
				if (!catetype_strtoarr($ac_profile['categorytype'], $this->account_config['catetype'])) return false;
				break;
				
			case 'earn':
				$ac_profile = DB::fetch_first("SELECT earntype, categorytype FROM ".DB::table('account_profile')." WHERE uid ='$ac_uid'");
				if (empty($ac_profile))	return false;
				if (!title_strtoarr($ac_profile['earntype'], $this->account_config['earntype'])) return false;
				if (!catetype_strtoarr($ac_profile['categorytype'], $this->account_config['catetype'])) return false;
				break;
				
			case 'transfer':
				$ac_profile = DB::fetch_first("SELECT categorytype FROM ".DB::table('account_profile')." WHERE uid ='$ac_uid'");
				if (empty($ac_profile))	return false;
				if (!catetype_strtoarr($ac_profile['categorytype'], $this->account_config['catetype'])) return false;
				break;
				
			case "borrow":
			case "loan":
			case "repay":
			case "debt":
				$ac_profile = DB::fetch_first("SELECT categorytype, loandebt FROM ".DB::table('account_profile')." WHERE uid ='$ac_uid'");
				if (empty($ac_profile))	return false;
				if (!catetype_strtoarr($ac_profile['categorytype'], $this->account_config['catetype'])) return false;
				if (!catetype_strtoarr($ac_profile['loandebt'], $this->account_config['loandebt'])) return false;
				break;
				
			default:
				return false;
		}
		return true;
	}
	
	public function run_ajaxsel($ac_uid, $tables, $condition, $dur = "") {
		$ac_seldata = DB::fetch("");
		
		$this->account_config['seldata'] = $ac_seldata;
		
		return true;
	}

}

?>        