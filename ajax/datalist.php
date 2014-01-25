<?php

/**
 *    isuiji_tally v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2014-01-25
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

$apayID = $tally->getTypeForIdkeys('pay');
$aearnID = $tally->getTypeForIdkeys('earn');
$aaccountID = $tally->getTypeForIdkeys('account');
$aloandebtID = $tally->getTypeForIdkeys('loandebt');
/**
 * 添加唯一标志
 * uid*(存储的行数*10+该数据所在的表的号码)
 */
$tmpsign = 0;

/**
 * 获取支出类型的数据 表号: ISUIJI_PAY
 */
$query = DB::query("SELECT * FROM ".DB::table('tally_paydata').
		" WHERE uid='$_G[uid]'".$sTime);
$datatmp = '';
$data['pay'] = '';
while($daydata = DB::fetch($query)) {
	
	$tmpsign = $_G[uid]*($daydata['cid']*10+ISUIJI_PAY);
	
	$tmplv = $apayID[$daydata['typeid']];
	$lvstr = '';
	if(is_array($tmplv))
		$lvstr = addslashes($tmplv[1]).'", "'.addslashes($tmplv[0]);
	else
		$lvstr = addslashes($tmplv);
	
	$datatmp = '["'.$tmpsign.'", "'.$daydata['recordtime'].'", "'.
			date('Y/m/d', $daydata['datatime']).'", "'.$lvstr.
			'", "'.$daydata['amount'].'", "'.
			addslashes($aaccountID[$daydata['accountid']]).
			($daydata['info'] ? '", "'.addslashes($daydata['info']) : '').'"]';
	
	$data['pay'] .= $datatmp.',';
}
if($data['pay'])
	$oTable .= ( $oTable ? ', ':'').'"支出":['.substr($data['pay'], 0, strlen($data['pay'])-1).']';


/**
 * 获取收入类型的数据 表号: ISUIJI_EARN
 */
$query = DB::query("SELECT * FROM ".DB::table('tally_earndata').
     " WHERE uid='$_G[uid]'".$sTime);

$datatmp = '';
$data['earn'] = '';
while($daydata = DB::fetch($query)) {
	
	$tmpsign = $_G[uid]*($daydata['cid']*10+ISUIJI_EARN);
	
	$tmplv = $aearnID[$daydata['typeid']];
	$lvstr = '';
	if(is_array($tmplv))
		$lvstr = addslashes($tmplv[1]).'", "'.addslashes($tmplv[0]);
	else
		$lvstr = addslashes($tmplv);
	
	$datatmp = '["'.$tmpsign.'", "'.$daydata['recordtime'].'", "'.
				date('Y/m/d', $daydata['datatime']).'", "'.$lvstr.
				'", "'.$daydata['amount'].'", "'.
				addslashes($aaccountID[$daydata['accountid']]).
				($daydata['info'] ? '", "'.addslashes($daydata['info']) : '').'"]';
	
	$data['earn'] .= $datatmp.',';
}
if($data['earn'])
	$oTable .= ( $oTable ? ', ':'').'"收入":['.substr($data['earn'], 0, strlen($data['earn'])-1).']';


/**
 * 获取转账类型的数据 表号: ISUIJI_TRANSFER
 */
$query = DB::query("SELECT * FROM ".DB::table('tally_transfer').
		" WHERE uid='$_G[uid]'".$sTime);

$datatmp = '';
$data['transfer'] = '';
while($daydata = DB::fetch($query)) {
	
	$tmpsign = $_G[uid]*($daydata['cid']*10+ISUIJI_TRANSFER);	
	$datatmp = '["'.$tmpsign.'", "'.$daydata['recordtime'].'", "'.
			date('Y/m/d', $daydata['datatime']).
			'", "", "'.addslashes($aaccountID[$daydata['oaccount']]).
			'", "'.$daydata['amount'].'", "'.
			addslashes($aaccountID[$daydata['iaccount']]).
			($daydata['info'] ? '", "'.addslashes($daydata['info']) : '').'"]';
	
	$data['transfer'] .= $datatmp.',';
}
if($data['transfer'])
	$oTable .= ( $oTable ? ', ':'').'"转账":['.substr($data['transfer'], 0, strlen($data['transfer'])-1).']';


/**
 * 获取借贷类型的数据 表号: ISUIJI_LOANDEBT
 */
$query = DB::query("SELECT * FROM ".DB::table('tally_loandebt').
		" WHERE uid='$_G[uid]'".$sTime);

$datastr = array('b'=>'', 'l'=>'', 'r'=>'', 'd'=>'');
$datatmp = '';
while($daydata = DB::fetch($query)) {
	
	$tmpsign = $_G[uid]*($daydata['cid']*10+ISUIJI_LOANDEBT);
	$datatmp = '["'.$tmpsign.'", "'.$daydata['recordtime'].'", "'.
			date('Y/m/d', $daydata['datatime']).
			'", "", "'.addslashes($aloandebtID[$daydata['lid']]).
			'", "'.$daydata['amount'].'", "'.
			addslashes($aaccountID[$daydata['aid']]).
			($daydata['info'] ? '", "'.addslashes($daydata['info']) : '').'"]';
	
	$datastr[$daydata['type']] .= $datatmp.',';
}
if($datastr['b'])
	$oTable .= ( $oTable ? ', ':'').'"借入":['.substr($datastr['b'], 0, strlen($datastr['b'])-1).']';
if($datastr['l'])
	$oTable .= ( $oTable ? ', ':'').'"借出":['.substr($datastr['l'], 0, strlen($datastr['l'])-1).']';
if($datastr['r'])
	$oTable .= ( $oTable ? ', ':'').'"还债":['.substr($datastr['r'], 0, strlen($datastr['r'])-1).']';
if($datastr['d'])
	$oTable .= ( $oTable ? ', ':'').'"收债":['.substr($datastr['d'], 0, strlen($datastr['d'])-1).']';


$outjson .= ( $oTable ? ', "oTable": {'.$oTable.'}':'').'}';

echo $outjson;

?>
