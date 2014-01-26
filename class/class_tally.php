<?php

/**
 *    isuiji_tally v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2014-01-26
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

/////////////////////////////////////////////////////////////////////////////
// 全局变量(供index.inc.php 和 ajax.inc.php 调用)
$tally = new class_tally($_G['uid']);
/////////////////////////////////////////////////////////////////////////////

class class_tally {
	private $uid = null;
	
	
	public function __construct($uid) {
		$this->uid = $uid;
		$profile = DB::fetch_first("SELECT * FROM "
				.DB::table('tally_profile')." WHERE uid ='$this->uid'");
		if(empty($profile)) $this->Init();
	}
	
	/**
	 * 初始化用户理财属性
	 * @param  $ac_uid 用户ID
	 * @param  $force  强制清空数据
	 */
	private function Init($force=false) {
		$handle = @fopen(DISCUZ_ROOT."/source/plugin/tally/prestore.data", "r");
		if ($handle) {
			$profile = array(
				'uid'       => $this->uid,
				'firstdate' => 0,
				'totalearn' => 0,
				'totalpay'  => 0);
			DB::insert('tally_profile', $profile);
			
			$account = json_decode(fgets($handle, 4096), true);
			$ac_insert = array();
			foreach($account as $data) {
				$ac_insert['uid'] = $this->uid;
				$ac_insert['account'] = $data;
				$ac_insert['type'] = 'a';
				$ac_insert['status'] = 'y';
				DB::insert('tally_account', $ac_insert);
			}
			$loandebt = json_decode(fgets($handle, 4096), true);
			foreach($loandebt as $data) {
				$ac_insert['uid'] = $this->uid;
				$ac_insert['account'] = $data;
				$ac_insert['type'] = 'l';
				$ac_insert['status'] = 'y';
				DB::insert('tally_account', $ac_insert);
			}
			
			$paytype = json_decode(fgets($handle, 4096), true);	//加了true 将对象数据变成数组访问
			$pe_insert = array();
			foreach($paytype as $onelv => $data) {
				if($data[1]) {
					$objtmp = $data[1];
					foreach($objtmp as $seclv => $abbr) {
						$pe_insert['uid']    = $this->uid;
						$pe_insert['onelv']  = $onelv;
						$pe_insert['seclv']  = $seclv;
						$pe_insert['abbr']   = $abbr;
						$pe_insert['status'] = 'y';
						DB::insert('tally_paytype', $pe_insert);
					}
				} else if($data[0]) {
					$pe_insert['uid']    = $this->uid;
					$pe_insert['onelv']  = $onelv;
					$pe_insert['seclv']  = '';
					$pe_insert['abbr']   = $data[0];
					$pe_insert['status'] = 'y';
					DB::insert('tally_paytype', $pe_insert);
				}
			}
			
			$earntype = json_decode(fgets($handle, 4096), true);
			foreach($earntype as $onelv => $data) {
				if($data[1]) {
					$objtmp = $data[1];
					foreach($objtmp as $seclv => $abbr) {
						$pe_insert['uid']    = $this->uid;
						$pe_insert['onelv']  = $onelv;
						$pe_insert['seclv']  = $seclv;
						$pe_insert['abbr']   = $abbr;
						$pe_insert['status'] = 'y';
						DB::insert('tally_earntype', $pe_insert);
					}
				} else if($data[0]) {
					$pe_insert['uid']    = $this->uid;
					$pe_insert['onelv']  = $onelv;
					$pe_insert['seclv']  = '';
					$pe_insert['abbr']   = $data[0];
					$pe_insert['status'] = 'y';
					DB::insert('tally_earntype', $pe_insert);
				}
			}
			fclose($handle);
		}
		if($force) {
			;
		}
	}
	
	/**
	 * 获取总金额
	 */
	public function getTotalmoney() {
		$profile = DB::fetch_first("SELECT totalearn, totalpay FROM "
				.DB::table('tally_profile')." WHERE uid ='$this->uid'");
		return $profile['totalearn'] - $profile['totalpay'];
	}
	
	/**
	 * 获取当天金额
	 */
	public function getDaymoney($curtime) {
		$datadate = dmktime(dgmdate($curtime, 'd'));
		$tmp = DB::fetch_first("SELECT paymoney as dpm, earnmoney as dem FROM "
				.DB::table('tally_daytotal')." WHERE uid = '$this->uid' AND datadate = '$datadate'");
		if(empty($tmp))	$tmp = array('dpm'=>'0.00', 'dem'=>'0.00');
		return $tmp;
	}
	
	/**
	 * 获取当周金额
	 */
	public function getWeekmoney($curtime) {
		$isoWeekStartDate = strtotime(date('o-\\WW', $curtime)); //{isoYear}-W{isoWeekNumber}
		$isoWeekEndDate = strtotime( "+6 days", $isoWeekStartDate);
		$tmp = DB::fetch_first("SELECT SUM(paymoney) as wpm, SUM(earnmoney) as wem FROM ".DB::table('tally_daytotal')
				." WHERE uid = '$this->uid' AND datadate >= '$isoWeekStartDate' AND datadate <= '$isoWeekEndDate'");
		if(empty($tmp))	$tmp = array('wpm'=>'0.00', 'wem'=>'0.00');
		return $tmp;
	}
	
	/**
	 * 获取当月金额
	 */
	public function getMonthmoney($curtime) {
		$MonthStartDate = strtotime(date('Y-m-1', $curtime));
		$MonthEndDate = strtotime(date('Y-m-t', strtotime(date('Y-m', $curtime))));
		$tmp = DB::fetch_first("SELECT SUM(paymoney) as mpm, SUM(earnmoney) as mem FROM ".DB::table('tally_daytotal')
				." WHERE uid = '$this->uid' AND datadate >= '$MonthStartDate' AND datadate <= '$MonthEndDate'");
		if(empty($tmp))	$tmp = array('mpm'=>'0.00', 'mem'=>'0.00');
		return $tmp;
	}
	
	/**
	 * 获取当月预算
	 */
	public function getMonthbudget($curtime) {
		$uidtime = $this->uid.date('Ym', $curtime);
		$ptmp = DB::fetch_first("SELECT SUM(budget) as mpd FROM ".DB::table('tally_budget')
				." WHERE uidtime = '$uidtime' AND category='pay'");
		$etmp = DB::fetch_first("SELECT SUM(budget) as med FROM ".DB::table('tally_budget')
				." WHERE uidtime = '$uidtime' AND category='earn'");
		
		return array_merge($ptmp, $etmp);
	}
	
	/**
	 *  获取支出菜单项目
	 */
	public function getPaytypeToJs() {
		$query = DB::query("SELECT * FROM ".DB::table('tally_paytype')." WHERE uid='$this->uid'");
		$str = '';
		while($paydata = DB::fetch($query)) {
			if($str) $str .= ',';
			if($paydata['seclv'])
				$str .= '{label:"'.$paydata['seclv'].' '.$paydata['abbr'].'",category:"'.$paydata['onelv'].'"}';
		}
		return $str;
	}
	
	/**
	 *  获取收入菜单项目
	 */
	public function getEarntypeToJs() {
		$query = DB::query("SELECT * FROM ".DB::table('tally_earntype')." WHERE uid='$this->uid'");
		$str = '';
		while($earndata = DB::fetch($query)) {
			if($str) $str .= ',';
			if($earndata['seclv'])
				$str .= '{label:"'.$earndata['seclv'].' '.$earndata['abbr'].'",category:"'.$earndata['onelv'].'"}';
		}
		return $str;
	}
	
	/**
	 *  获取账户信息
	 */
	public function getAccount() {
		$query = DB::query("SELECT account FROM ".DB::table('tally_account')
				." WHERE uid='$this->uid' AND type='a'");
		$result = array();
		while($account = DB::fetch($query)) {
			array_push($result, $account['account']);
		}
		return json_encode($result);
	}
	
	/**
	 *  获取借贷项目
	 */
	public function getLoandebt() {
		$query = DB::query("SELECT account FROM ".DB::table('tally_account')
				." WHERE uid='$this->uid' AND type='l'");
		$result = array();
		while($loandebt = DB::fetch($query)) {
			array_push($result, $loandebt['account']);
		}
		return json_encode($result);
	}

	/**
	 * 获取帐目类型的数据{ string(key):id(val) }
	 * @param string_type $type
	 * @return boolean
	 */
	public function getTypeForStringkeys($type) {
		switch($type) {
			case 'pay':
				$apaytype = array();
				$query = DB::query("SELECT cid, onelv, seclv FROM ".DB::table('tally_paytype')
						." WHERE uid='$this->uid'");
				while($qtype = DB::fetch($query)) {
					if(array_key_exists($qtype['onelv'], $apaytype)) {
						if(!$qtype['seclv'] || !is_array($apaytype[$qtype['onelv']]))
							return false; //出现一级菜单项目是可选项或者出现重复的一级菜单项目
						$apaytype[$qtype['onelv']][$qtype['seclv']] = $qtype['cid'];
					} else {
						if($qtype['seclv']) {
							$apaytype[$qtype['onelv']] = array();
							$apaytype[$qtype['onelv']][$qtype['seclv']] = $qtype['cid'];
						} else
							$apaytype[$qtype['onelv']] = $qtype['cid'];
					}
				}
				return $apaytype;
				
			case 'earn':
				$aearntype = array();
				$query = DB::query("SELECT cid, onelv, seclv FROM ".DB::table('tally_earntype')
						." WHERE uid='$this->uid'");
				while($qtype = DB::fetch($query)) {
					if(array_key_exists($qtype['onelv'], $aearntype)) {
						if(!$qtype['seclv'] || !is_array($aearntype[$qtype['onelv']]))
							return false; //出现一级菜单项目是可选项或者出现重复的一级菜单项目
						$aearntype[$qtype['onelv']][$qtype['seclv']] = $qtype['cid'];
					} else {
						if($qtype['seclv']) {
							$aearntype[$qtype['onelv']] = array();
							$aearntype[$qtype['onelv']][$qtype['seclv']] = $qtype['cid'];
						} else
							$aearntype[$qtype['onelv']] = $qtype['cid'];
					}
				}
				return $aearntype;
			
			case 'account':
				$aaccount = array();
				$query = DB::query("SELECT cid, account FROM ".DB::table('tally_account')
						." WHERE uid='$this->uid' AND type='a'");
				while($atmp = DB::fetch($query)) {
					$aaccount[$atmp['account']] = $atmp['cid'];
				}
				return $aaccount;
			
			case 'loandebt':
				$aloandebt = array();
				$query = DB::query("SELECT cid, account FROM ".DB::table('tally_account')
						." WHERE uid='$this->uid' AND type='l'");
				while($atmp = DB::fetch($query)) {
					$aloandebt[$atmp['account']] = $atmp['cid'];
				}
				return $aloandebt;
				
			default:
				return false;
		}
	}
	
	/**
	 * 获取帐目类型的数据{ id(key):string(val) }
	 * @param string_type $type
	 * @param string_type $status{"a":all}
	 * @return boolean
	 */
	public function getTypeForIdkeys($type, $status="a") {
		switch($type) {
			case 'pay':
				$apaytype = array();
				$query = DB::query("SELECT cid, onelv, seclv, status FROM ".DB::table('tally_paytype')
						." WHERE uid='$this->uid'");
				while($qtype = DB::fetch($query)) {
					if($status!="a" && $qtype['status']!="y")
						break;
					$inum = $qtype['cid'] + 0;
					if(!$qtype['seclv'])
						$apaytype[$inum] = $qtype['onelv'];
					else
						$apaytype[$inum] = array($qtype['onelv'], $qtype['seclv']);
				}
				return $apaytype;
		
			case 'earn':
				$aearntype = array();
				$query = DB::query("SELECT cid, onelv, seclv, status FROM ".DB::table('tally_earntype')
						." WHERE uid='$this->uid'");
				while($qtype = DB::fetch($query)) {
					if($status!="a" && $qtype['status']!="y")
						break;
					$inum = $qtype['cid'] + 0;
					if(!$qtype['seclv'])
						$aearntype[$inum] = $qtype['onelv'];
					else
						$aearntype[$inum] = array($qtype['onelv'], $qtype['seclv']);
				}
				return $aearntype;
			
			case 'account':
				$aaccount = array();
				$query = DB::query("SELECT cid, account, status FROM ".DB::table('tally_account')
						." WHERE uid='$this->uid' AND type='a'");
				while($atmp = DB::fetch($query)) {
					if($status!="a" && $atmp['status']!="y")
						break;
					$inum = $atmp['cid'] + 0;
					$aaccount[$inum] = $atmp['account'];
				}
				return $aaccount;
							
			case 'loandebt':
				$aloandebt = array();
				$query = DB::query("SELECT cid, account, status FROM ".DB::table('tally_account')
						." WHERE uid='$this->uid' AND type='l'");
				while($atmp = DB::fetch($query)) {
					if($status!="a" && $atmp['status']!="y")
						break;
					$inum = $atmp['cid'] + 0;
					$aloandebt[$inum] = $atmp['account'];
				}
				return $aloandebt;
		
			default:
				return false;
		}
	}

	/**
	 * 获取帐目类型在数据库中的对应id
	 * @param string_type $type
	 * @param string_type $onelv
	 * @param string_type $seclv
	 */
	public function getTypeid($type, $onelv, $seclv = null) {
		$data = null;
		switch($type) {
			case 'pay':
				$data = DB::fetch_first("SELECT cid FROM ".DB::table('tally_paytype')
						." WHERE uid='$this->uid' AND onelv='$onelv' AND seclv='$seclv'");
				break;
				
			case 'earn':
				$data = DB::fetch_first("SELECT cid FROM ".DB::table('tally_earntype')
						." WHERE uid='$this->uid' AND onelv='$onelv' AND seclv='$seclv'");
				break;
				
			case 'account':
				$data = DB::fetch_first("SELECT cid FROM ".DB::table('tally_account')
						." WHERE uid='$this->uid' AND type='a' AND account='$onelv'");
				break;
				
			case 'loandebt':
				$data = DB::fetch_first("SELECT cid FROM ".DB::table('tally_account')
						." WHERE uid='$this->uid' AND type='l' AND account='$onelv'");
				break;
				
			default:
				break;
		}
		if($data)
			return $data['cid'];
		return false;
	}
	
	/**
	 * 获取帐目类型在数据库中的对应数据
	 * @param string_type $type
	 * @param int_type $id
	 * @return Ambigous <NULL, array, string>
	 */
	public function getTypestring($type, $id){
		$data = null;
		switch ($type) {
			case 'pay':
				$data = DB::fetch_first("SELECT onelv, seclv FROM ".DB::table('tally_paytype')
						." WHERE uid='$this->uid' AND cid='$id'");
				break;
				
			case 'earn':
				$data = DB::fetch_first("SELECT onelv, seclv FROM ".DB::table('tally_earntype')
						." WHERE uid='$this->uid' AND cid='$id'");
				break;
				
			case 'account':
				$data = DB::fetch_first("SELECT account FROM ".DB::table('tally_account')
						." WHERE uid='$this->uid' AND type='a' AND cid='$id'");
				break;
				
			case 'loandebt':
				$data = DB::fetch_first("SELECT account FROM ".DB::table('tally_account')
						." WHERE uid='$this->uid' AND type='l' AND cid='$id'");
				break;
				
			default:
				break;
		}
		return $data;
	}
	
	/**
	 * 增加数据
	 * @param string_type $type
	 * @param array_type $aInsert
	 */
	public function insertData($type, $aInsert) {
		switch($type) {
			case 'pay':
				DB::insert('tally_paydata', $aInsert);
				DB::query("UPDATE ".DB::table('tally_daytotal')
						." SET paymoney = paymoney + '$aInsert[amount]' 
						WHERE uid = '$aInsert[uid]' AND datadate = '$aInsert[datatime]'");
				if (!DB::affected_rows()) {
					$insarr = array(
						'uid' => $aInsert['uid'],
						'paymoney' => $aInsert['amount'],
						'earnmoney' => 0,
						'datadate' => $aInsert['datatime']
					);
					DB::insert('tally_daytotal', $insarr);
				}
		
				$uidtime  = $this->uid*1000000+intval(date('Ym', $aInsert['datatime']));
				DB::query("UPDATE ".DB::table('tally_budget')
						." SET realcash = realcash + '$aInsert[amount]', recordtime = '$aInsert[recordtime]' 
						WHERE uidtime = '$uidtime' AND typeid = '$aInsert[typeid]' AND category = '支出'");
				if(!DB::affected_rows()) {
					unset($insarr);
					$insarr = array(
						'uidtime'    => $uidtime,
						'typeid'     => $aInsert['typeid'],
						'category'   => '支出',
						'budget'     => 0,
						'realcash'   => $aInsert['amount'],
						'recordtime' => $aInsert['recordtime']
					);
					DB::insert('tally_budget', $insarr);
				}
		
				DB::query("UPDATE ".DB::table('tally_profile')
						." SET totalpay = totalpay + '$aInsert[amount]' WHERE uid = '$this->uid'");
				break;
			
			case 'earn':
				DB::insert('tally_earndata', $aInsert);
				DB::query("UPDATE ".DB::table('tally_daytotal')
						." SET earnmoney = earnmoney + '$aInsert[amount]' 
						WHERE uid = '$aInsert[uid]' AND datadate = '$aInsert[datatime]'");
				if (!DB::affected_rows()) {
					$insarr = array(
							'uid' => $_G['uid'],
							'paymoney' => 0,
							'earnmoney' => $aInsert['amount'],
							'datadate' => $aInsert['datatime']
					);
					DB::insert('tally_daytotal', $insarr);
				}
		
				$uidtime  = $this->uid*1000000+intval(date('Ym', $aInsert['datatime']));
				DB::query("UPDATE ".DB::table('tally_budget')
						." SET realcash = realcash + '$aInsert[amount]', recordtime = '$aInsert[recordtime]' 
						WHERE uidtime = '$uidtime' AND typeid = '$aInsert[typeid]' AND category = '收入'");
				if(!DB::affected_rows()) {
					unset($insarr);
					$insarr = array(
						'uidtime'    => $uidtime,
						'typeid'     => $aInsert['typeid'],
						'category'   => '收入',
						'budget'     => 0,
						'realcash'   => $aInsert['amount'],
						'recordtime' => $aInsert['recordtime']
					);
					DB::insert('tally_budget', $insarr);
				}
		
				DB::query("UPDATE ".DB::table('tally_profile')
						." SET totalearn = totalearn + '$aInsert[amount]' WHERE uid = '$this->uid'");
				break;
				
			case 'transfer':
				DB::insert('tally_transfer', $aInsert);
				break;

			case "borrow":
			case "loan":
			case "repay":
			case "debt":
				DB::insert('tally_loandebt', $aInsert);
				break;
				
			default:
				break;
		}
	}
	
	/**
	 * 修改支出数据
	 * @param array_type $aUpdata
	 * @param int_type $cid
	 * @param int_type $rtime
	 * @return boolean
	 */
	public function modifyPaydata($aUpdata, $cid, $rtime) {
		$sqlstr = "SELECT datatime, amount, typeid FROM "
				.DB::table('tally_paydata')
				." WHERE uid='$this->uid' AND cid='$cid' AND recordtime='$rtime'";

		$aCond = array(
			'cid' => $cid,
			'uid' => $this->uid,
			'recordtime' => $rtime
			);
		if( !($data = DB::fetch_first($sqlstr)) || !DB::update('tally_paydata', $aUpdata, $aCond))
			return false;
		
		if($aUpdata['datatime'] == $data['datatime'] && $data['amount'] != $aUpdata['amount']) { //防止update语句返回false
			if(!DB::query("UPDATE ".DB::table('tally_daytotal')
					." SET paymoney = paymoney - '$data[amount]' + '$aUpdata[amount]' 
					WHERE uid = '$this->uid' AND datadate = '$data[datatime]'"))
				return false;
		} else if($aUpdata['datatime'] != $data['datatime']) {
			DB::query("UPDATE ".DB::table('tally_daytotal')
					." SET paymoney = paymoney + '$aUpdata[amount]' 
					WHERE uid = '$this->uid' AND datadate = '$aUpdata[datatime]'");
			if (!DB::affected_rows()) {
				$insarr = array(
						'uid' => $this->uid,
						'paymoney' => $aUpdata['amount'],
						'earnmoney' => 0,
						'datadate' => $aUpdata['datatime']
						);
				DB::insert('tally_daytotal', $insarr);
			}
			
			if(!DB::query("UPDATE ".DB::table('tally_daytotal')
					." SET paymoney = paymoney - '$data[amount]' 
					WHERE uid = '$this->uid' AND datadate = '$data[datatime]'"))
				return false;
		}
			
		if($data['amount'] != $aUpdata['amount'])	//防止update语句返回false
			if(!DB::query("UPDATE ".DB::table('tally_profile')
					." SET totalpay = totalpay - '$data[amount]' + '$aUpdata[amount]' 
					WHERE uid = '$this->uid'"))
				return false;
		
		$old_time = date('Ym', $data['datatime']);
		$new_time = date('Ym', $aUpdata['datatime']);
		if($old_time!=$new_time || $data['typeid']!=$aUpdata['typeid']) {
			$uidtime  = $this->uid*1000000+intval($old_time);
			DB::query("UPDATE ".DB::table('tally_budget')
					." SET realcash = realcash - '$data[amount]', recordtime = '$aUpdata[recordtime]' 
					WHERE uidtime = '$uidtime' AND typeid = '$data[typeid]' AND category = '支出'");
			$uidtime  = $this->uid*1000000+intval($new_time);
			DB::query("UPDATE ".DB::table('tally_budget')
					." SET realcash = realcash + '$aUpdata[amount]', recordtime = '$aUpdata[recordtime]' 
					WHERE uidtime = '$uidtime' AND typeid = '$aUpdata[typeid]' AND category = '支出'");
			if(!DB::affected_rows()) {
				$insarr = array(
					'uidtime'    => $uidtime,
					'typeid'     => $aUpdata['typeid'],
					'category'   => '支出',
					'budget'     => 0,
					'realcash'   => $aUpdata['amount'],
					'recordtime' => $aUpdata['recordtime']
				);
				DB::insert('tally_budget', $insarr);
			}
		} else if($data['amount'] != $aUpdata['amount']) {
			$uidtime  = $this->uid*1000000+intval($new_time);
			DB::query("UPDATE ".DB::table('tally_budget')
					." SET realcash = realcash + '$aUpdata[amount]' - '$data[amount]',
					recordtime = '$aUpdata[recordtime]' WHERE uidtime = '$uidtime' AND
					typeid = '$aUpdata[typeid]' AND category = '支出'");
		}
		return true;
	}
	
	/**
	 * 修改收入数据
	 * @param array_type $aUpdata
	 * @param int_type $cid
	 * @param int_type $rtime
	 * @return boolean
	 */
	public function modifyEarndata($aUpdata, $cid, $rtime) {
		$sqlstr = "SELECT datatime, amount, typeid FROM "
				.DB::table('tally_earndata')
				." WHERE uid='$this->uid' AND cid='$cid' AND recordtime='$rtime'";
		$aCond = array(
				'cid' => $cid,
				'uid' => $this->uid,
				'recordtime' => $rtime
		);
		if( !($data = DB::fetch_first($sqlstr)) || !DB::update('tally_earndata', $aUpdata, $aCond))
			return false;
		
		if($aUpdata['datatime'] == $data['datatime'] && $data['amount'] != $aUpdata['amount']) {	//防止update语句返回false
			if(!DB::query("UPDATE ".DB::table('tally_daytotal')
					." SET earnmoney = earnmoney - '$data[amount]' + '$aUpdata[amount]' 
					WHERE uid = '$this->uid' AND datadate = '$data[datatime]'"))
				return false;
		} else if($aUpdata['datatime'] != $data['datatime']) {
			DB::query("UPDATE ".DB::table('tally_daytotal')
					." SET earnmoney = earnmoney + '$aUpdata[amount]' 
					WHERE uid = '$this->uid' AND datadate = '$aUpdata[datatime]'");
			if (!DB::affected_rows()) {
				$insarr = array(
						'uid' => $this->uid,
						'paymoney' => 0,
						'earnmoney' => $aUpdata['amount'],
						'datadate' => $aUpdata['datatime']
				);
				DB::insert('tally_daytotal', $insarr);
			
				if(!DB::query("UPDATE ".DB::table('tally_daytotal')
						." SET earnmoney = earnmoney - '$data[amount]' 
						WHERE uid = '$this->uid' AND datadate = '$data[datatime]'"))
					return false;
			}
		}
		
		if($data['amount'] != $aUpdata['amount'])	//防止update语句返回false
			if(!DB::query("UPDATE ".DB::table('tally_profile')
					." SET totalearn = totalearn - '$data[amount]' + '$aUpdata[amount]' 
					WHERE uid = '$this->uid'"))
				return false;
		
		$old_time = date('Ym', $data['datatime']);
		$new_time = date('Ym', $aUpdata['datatime']);
		if($old_time!=$new_time || $data['typeid']!=$aUpdata['typeid']) {
			$uidtime  = $this->uid*1000000+intval($old_time);
			DB::query("UPDATE ".DB::table('tally_budget')
					." SET realcash = realcash - '$data[amount]', recordtime = '$aUpdata[recordtime]'
					WHERE uidtime = '$uidtime' AND typeid = '$aUpdata[typeid]' AND category = '收入'");
			$uidtime  = $this->uid*1000000+intval($new_time);
			DB::query("UPDATE ".DB::table('tally_budget')
					." SET realcash = realcash + '$aUpdata[amount]', recordtime = '$aUpdata[recordtime]'
					WHERE uidtime = '$uidtime' AND typeid = '$aUpdata[typeid]' AND category = '收入'");
			if(!DB::affected_rows()) {
				$insarr = array(
						'uidtime'    => $uidtime,
						'typeid'     => $aUpdata['typeid'],
						'category'   => '收入',
						'budget'     => 0,
						'realcash'   => $aUpdata['amount'],
						'recordtime' => $aUpdata['recordtime']
				);
				DB::insert('tally_budget', $insarr);
			}
		} else if($data['amount'] != $aUpdata['amount']) {
			$uidtime  = $this->uid*1000000+intval($new_time);
			DB::query("UPDATE ".DB::table('tally_budget')
					." SET realcash = realcash + '$aUpdata[amount]' - '$data[amount]', recordtime = '$aUpdata[recordtime]' 
					WHERE uidtime = '$uidtime' AND typeid = '$aUpdata[typeid]' AND category = '收入'");
		}
		return true;
	}
	
	/**
	 * 修改转账数据
	 * @param array_type $aUpdata
	 * @param int_type $cid
	 * @param int_type $rtime
	 * @return boolean
	 */
	public function modifyTransdata($aUpdata, $cid, $rtime) {
		$aCond = array(
				'cid' => $cid,
				'uid' => $this->uid,
				'recordtime' => $rtime
		);
		if( !DB::update('tally_transfer', $aUpdata, $aCond))
			return false;
		return true;
	}
	
	/**
	 * 修改转账数据
	 * @param array_type $aUpdata
	 * @param int_type $cid
	 * @param int_type $rtime
	 * @return boolean
	 */
	public function modifyLoandebtdata($aUpdata, $cid, $rtime) {
		$aCond = array(
				'cid' => $cid,
				'uid' => $this->uid,
				'recordtime' => $rtime
		);
		if( !DB::update('tally_loandebt', $aUpdata, $aCond))
			return false;
		return true;
	}

	/**
	 * 获取某月的预算数据
	 * @param int_type $uidtime
	 * @param &array_type $apay
	 * @param &array_type $aearn
	 * @param string_type $typestatus("a":all,"n":not-all)
	 * @param string_type $retstatus("a":all,"n":not-all)
	 * @return boolean
	 */
	public function getBudget($uidtime, &$apay, &$aearn, $typestatus="a", $retstatus="a") {
		$apaytype = $this->getTypeForIdkeys('pay', $typestatus);
		$aearntype = $this->getTypeForIdkeys('earn', $typestatus);
		$query = DB::query("SELECT * FROM ".DB::table('tally_budget').
				" WHERE uidtime='$uidtime'");
		while($bdata = DB::fetch($query)) {
			$typeid = $bdata['typeid'] + 0;
			if($bdata['category'] == '支出') {
				if(array_key_exists($typeid, $apaytype)) {
					if( is_array($apaytype[$typeid])) {
						$onelv = $apaytype[$typeid][0];
						$seclv = $apaytype[$typeid][1];
						$apay[$onelv]['children'][$seclv]['budget']   = floatval($bdata['budget']);
						$apay[$onelv]['children'][$seclv]['realcash'] = floatval($bdata['realcash']);
					} else {
						$apay[$apaytype[$typeid]]['budget']   = floatval($bdata['budget']);
						$apay[$apaytype[$typeid]]['realcash'] = floatval($bdata['realcash']);
					}
					unset($apaytype[$typeid]);
				} else if($typestatus != "a") {
					
				} else return false;
			} else if($bdata['category'] == '收入') {
				if( is_array($aearntype[$typeid])) {
					$onelv = $aearntype[$typeid][0];
					$seclv = $aearntype[$typeid][1];
					$aearn[$onelv]['children'][$seclv]['budget']   = floatval($bdata['budget']);
					$aearn[$onelv]['children'][$seclv]['realcash'] = floatval($bdata['realcash']);
				} else {
					$aearn[$aearntype[$typeid]]['budget']   = floatval($bdata['budget']);
					$aearn[$aearntype[$typeid]]['realcash'] = floatval($bdata['realcash']);
				}
				unset($aearntype[$typeid]);
			}
		}
		if($retstatus=="a") {
			foreach ($apaytype as $val) {
				if( is_array($val)) {
					$apay[$val[0]]['children'][$val[1]]['budget']   = 0;
					$apay[$val[0]]['children'][$val[1]]['realcash'] = 0;
				} else {
					$apay[$val]['budget']   = 0;
					$apay[$val]['realcash'] = 0;
				}
			}
			
			foreach ($aearntype as $val) {
				if( is_array($val)) {
					$aearn[$val[0]]['children'][$val[1]]['budget']   = 0;
					$aearn[$val[0]]['children'][$val[1]]['realcash'] = 0;
				} else {
					$aearn[$val]['budget']   = 0;
					$aearn[$val]['realcash'] = 0;
				}
			}
		}
		return true;
	}
}

?>        