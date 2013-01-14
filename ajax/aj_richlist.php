<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-01-14
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
	echo '{"state":"error", "errinfo":"时间错误"}';
	return ;
} else if ($_POST['bTime']=='-') {
	$sTime = "datatime <= ".$eTime;
} else if ($_POST['eTime']=='-') {
	$sTime = "datatime >= ".$bTime;
} else {
	if ($eTime < $bTime) {
		echo '{"state":"error", "errinfo":"开始时间应该大于结束时间"}';
		return ;
	}
	$sTime = "datatime >= ".$bTime." AND datatime <= ".$eTime;
}

$outjson = '{"state":"ok"';
$oTable = "";


/**
 * 获取支出类型的数据
 */
$query = DB::query("SELECT * FROM ".DB::table('account_paydata').
		" WHERE uid='$_G[uid]' AND ".$sTime);

$datatmp = '';
$data['pay'] = '';
while($daydata = DB::fetch($query)) {
	$datatmp = '["'.$daydata['recordtime'].'", "'.
			date('Y/m/d', $daydata['datatime']).'", "'.
			$daydata['seclv'].'", "'.($daydata['onelv'] ? $daydata['onelv'] : '').
			'", "'.$daydata['amount'].'", "'.
			$daydata['category'].
			($daydata['info'] ? '", "'.$daydata['info'] : '').'"]';
	
	$data['pay'] .= $datatmp.',';
}
if($data['pay'])
	$oTable .= ( $oTable ? ', ':'').'"支出":['.substr($data['pay'], 0, strlen($data['pay'])-1).']';


/**
 * 获取收入类型的数据
 */
$query = DB::query("SELECT * FROM ".DB::table('account_earndata').
     " WHERE uid='$_G[uid]' AND ".$sTime);

$datatmp = '';
$data['earn'] = '';
while($daydata = DB::fetch($query)) {
	$datatmp = '["'.$daydata['recordtime'].'", "'.
				date('Y/m/d', $daydata['datatime']).'", "'.
				$daydata['seclv'].'", "'.($daydata['onelv'] ? $daydata['onelv'] : '').
				'", "'.$daydata['amount'].'", "'.
				$daydata['category'].
				($daydata['info'] ? '", "'.$daydata['info'] : '').'"]';
	
	$data['earn'] .= $datatmp.',';
}
if($data['earn'])
	$oTable .= ( $oTable ? ', ':'').'"收入":['.substr($data['earn'], 0, strlen($data['earn'])-1).']';


/**
 * 获取转账类型的数据
 */
$query = DB::query("SELECT * FROM ".DB::table('account_transfer').
		" WHERE uid='$_G[uid]' AND ".$sTime);

$datatmp = '';
$data['transfer'] = '';
while($daydata = DB::fetch($query)) {
	$datatmp = '["'.$daydata['recordtime'].'", "'.
			date('Y/m/d', $daydata['datatime']).
			'", "", "'.$daydata['ocategory'].
			'", "'.$daydata['amount'].'", "'.
			$daydata['icategory'].
			($daydata['info'] ? '", "'.$daydata['info'] : '').'"]';
	
	$data['transfer'] .= $datatmp.',';
}
if($data['transfer'])
	$oTable .= ( $oTable ? ', ':'').'"转账":['.substr($data['transfer'], 0, strlen($data['transfer'])-1).']';


/**
 * 获取借贷类型的数据
 */
$query = DB::query("SELECT * FROM ".DB::table('account_loandebt').
		" WHERE uid='$_G[uid]' AND ".$sTime);

$datastr = array('', '', '', '', '');
$datatmp = '';
while($daydata = DB::fetch($query)) {
	$datatmp = '["'.$daydata['recordtime'].'", "'.
			date('Y/m/d', $daydata['datatime']).
			'", "", "'.$daydata['loandebt'].
			'", "'.$daydata['amount'].'", "'.
			$daydata['category'].
			($daydata['info'] ? '", "'.$daydata['info'] : '').'"]';
	
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
