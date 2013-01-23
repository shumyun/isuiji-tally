<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-01-23
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

define('NOROBOT', TRUE);

if (!isset($_POST['bTime']) || ($_POST['bTime']!='-' && !($bTime = strtotime($_POST['bTime'])))) {
	echo '{"state":"error", "errinfo":"开始时间错误"}';
	return ;
}

if (!isset($_POST['eTime']) || ($_POST['eTime']!='-' && !($eTime = strtotime($_POST['eTime'])))) {
	echo '{"state":"error", "errinfo":"结束时间错误"}';
	return ;
}

if ($_POST['bTime']=='-' && $_POST['eTime']=='-') {
	$sTime = "";
} else if ($_POST['bTime']=='-') {
	$sTime = " AND datatime <= ".$eTime;
} else if ($_POST['eTime']=='-') {
	$sTime = " AND datatime >= ".$bTime;
} else {
	if ($eTime < $bTime) {
		echo '{"state":"error", "errinfo":"开始时间应该大于结束时间"}';
		return ;
	}
	$sTime = " AND datatime >= ".$bTime." AND datatime <= ".$eTime;
}

$outjson = '{"state":"ok"';
$oTable = "";

/**
 * 添加唯一标志
 * uid*(存储的行数*10+该数据所在的表的号码)
 */
$tmpsign = 0;

/**
 * 获取支出类型的数据 表号: AC_PAY
 */
$query = DB::query("SELECT * FROM ".DB::table('account_paydata').
		" WHERE uid='$_G[uid]'".$sTime);

$datatmp = '';
$data['pay'] = '';
while($daydata = DB::fetch($query)) {
	
	$tmpsign = $_G[uid]*($daydata['cid']*10+AC_PAY);
	$datatmp = '["'.$tmpsign.'", "'.$daydata['recordtime'].'", "'.
			date('Y/m/d', $daydata['datatime']).'", "'.
			addslashes($daydata['seclv']).'", "'.($daydata['onelv'] ? addslashes($daydata['onelv']) : '').
			'", "'.$daydata['amount'].'", "'.
			addslashes($daydata['category']).
			($daydata['info'] ? '", "'.addslashes($daydata['info']) : '').'"]';
	
	$data['pay'] .= $datatmp.',';
}
if($data['pay'])
	$oTable .= ( $oTable ? ', ':'').'"支出":['.substr($data['pay'], 0, strlen($data['pay'])-1).']';


/**
 * 获取收入类型的数据 表号: AC_EARN
 */
$query = DB::query("SELECT * FROM ".DB::table('account_earndata').
     " WHERE uid='$_G[uid]'".$sTime);

$datatmp = '';
$data['earn'] = '';
while($daydata = DB::fetch($query)) {
	
	$tmpsign = $_G[uid]*($daydata['cid']*10+AC_EARN);
	$datatmp = '["'.$tmpsign.'", "'.$daydata['recordtime'].'", "'.
				date('Y/m/d', $daydata['datatime']).'", "'.
				addslashes($daydata['seclv']).'", "'.($daydata['onelv'] ? addslashes($daydata['onelv']) : '').
				'", "'.$daydata['amount'].'", "'.
				addslashes($daydata['category']).
				($daydata['info'] ? '", "'.addslashes($daydata['info']) : '').'"]';
	
	$data['earn'] .= $datatmp.',';
}
if($data['earn'])
	$oTable .= ( $oTable ? ', ':'').'"收入":['.substr($data['earn'], 0, strlen($data['earn'])-1).']';


/**
 * 获取转账类型的数据 表号: AC_TRANSFER
 */
$query = DB::query("SELECT * FROM ".DB::table('account_transfer').
		" WHERE uid='$_G[uid]'".$sTime);

$datatmp = '';
$data['transfer'] = '';
while($daydata = DB::fetch($query)) {
	
	$tmpsign = $_G[uid]*($daydata['cid']*10+AC_TRANSFER);
	$datatmp = '["'.$tmpsign.'", "'.$daydata['recordtime'].'", "'.
			date('Y/m/d', $daydata['datatime']).
			'", "", "'.addslashes($daydata['ocategory']).
			'", "'.$daydata['amount'].'", "'.
			addslashes($daydata['icategory']).
			($daydata['info'] ? '", "'.addslashes($daydata['info']) : '').'"]';
	
	$data['transfer'] .= $datatmp.',';
}
if($data['transfer'])
	$oTable .= ( $oTable ? ', ':'').'"转账":['.substr($data['transfer'], 0, strlen($data['transfer'])-1).']';


/**
 * 获取借贷类型的数据 表号: AC_LOANDEBT
 */
$query = DB::query("SELECT * FROM ".DB::table('account_loandebt').
		" WHERE uid='$_G[uid]'".$sTime);

$datastr = array('', '', '', '', '');
$datatmp = '';
while($daydata = DB::fetch($query)) {
	
	$tmpsign = $_G[uid]*($daydata['cid']*10+AC_LOANDEBT);
	$datatmp = '["'.$tmpsign.'", "'.$daydata['recordtime'].'", "'.
			date('Y/m/d', $daydata['datatime']).
			'", "", "'.addslashes($daydata['loandebt']).
			'", "'.$daydata['amount'].'", "'.
			addslashes($daydata['category']).
			($daydata['info'] ? '", "'.addslashes($daydata['info']) : '').'"]';
	
	$datastr[$daydata['type']] .= $datatmp.',';
}
if($datastr[1])
	$oTable .= ( $oTable ? ', ':'').'"借入":['.substr($datastr[1], 0, strlen($datastr[1])-1).']';
if($datastr[2])
	$oTable .= ( $oTable ? ', ':'').'"借出":['.substr($datastr[2], 0, strlen($datastr[2])-1).']';
if($datastr[3])
	$oTable .= ( $oTable ? ', ':'').'"还债":['.substr($datastr[3], 0, strlen($datastr[3])-1).']';
if($datastr[4])
	$oTable .= ( $oTable ? ', ':'').'"收债":['.substr($datastr[4], 0, strlen($datastr[4])-1).']';


$outjson .= ( $oTable ? ', "oTable": {'.$oTable.'}':'').'}';

echo $outjson;

?>
