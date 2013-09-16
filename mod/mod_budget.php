<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-09-16
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

$richbudget_y = date('Y', $_G['timestamp']);
$richbudget_m = date('n', $_G['timestamp']);

$uidtime = $_G['uid'].date('Ym', $_G['timestamp']);

$arr = Array("earntype", "paytype");
$account->GetParam($_G['uid'], $arr);

$apay = title_tobudget($account->account_config['paytype']);
$aearn = title_tobudget($account->account_config['earntype']);

/* 获取当月预算数据 */
$query = DB::query("SELECT * FROM ".DB::table('account_budget').
		" WHERE uidtime='$uidtime'");
while($paydata = DB::fetch($query)) {
	if($paydata['category'] == '支出') {
		if($paydata['seclv'] == '') {
			$apay[$paydata['onelv']]['_budget']   = $paydata['budget'];
			$apay[$paydata['onelv']]['_realcash'] = $paydata['realcash'];
		} else {
			$apay[$paydata['onelv']][$paydata['seclv']]['_budget']   = $paydata['budget'];
			$apay[$paydata['onelv']][$paydata['seclv']]['_realcash'] = $paydata['realcash'];
		}
	} else if($paydata['category'] == '收入') {
		if($paydata['seclv'] == '') {
			$aearn[$paydata['onelv']]['_budget']   = $paydata['budget'];
			$aearn[$paydata['onelv']]['_realcash'] = $paydata['realcash'];
		} else {
			$aearn[$paydata['onelv']][$paydata['seclv']]['_budget']   = $paydata['budget'];
			$aearn[$paydata['onelv']][$paydata['seclv']]['_realcash'] = $paydata['realcash'];
		}
	}
}

/* 获取上月预算数据 */
$uidtime = $_G['uid'].date("Ym", strtotime("-1 month"));
$query = DB::query("SELECT * FROM ".DB::table('account_budget').
		" WHERE uidtime='$uidtime'");
while($paydata = DB::fetch($query)) {
	if($paydata['category'] == '支出') {
		if($paydata['seclv'] == '') {
			$apay[$paydata['onelv']]['budget']   = $paydata['budget'];
			$apay[$paydata['onelv']]['realcash'] = $paydata['realcash'];
		} else {
			$apay[$paydata['onelv']][$paydata['seclv']]['budget']   = $paydata['budget'];
			$apay[$paydata['onelv']][$paydata['seclv']]['realcash'] = $paydata['realcash'];
		}
	} else if($paydata['category'] == '收入') {
		if($paydata['seclv'] == '') {
			$aearn[$paydata['onelv']]['budget']   = $paydata['budget'];
			$aearn[$paydata['onelv']]['realcash'] = $paydata['realcash'];
		} else {
			$aearn[$paydata['onelv']][$paydata['seclv']]['budget']   = $paydata['budget'];
			$aearn[$paydata['onelv']][$paydata['seclv']]['realcash'] = $paydata['realcash'];
		}
	}
}

$phtml = '';
$budget = 0;
$realcash = 0;
$_budget = 0;
$_realcash = 0;
foreach ($apay as $key => $label) {
	$phtml .= '<tr><td width="90px"><span>';
	if(array_key_exists('children', $label)){
		$phtml .= '<a title="收起/展开" href="#">	<img alt="收起/展开" src="static/image/common/tree_plus.gif" style="vertical-align: middle;"/>'.$key.'</a></span></td>';
		foreach ($label as $val) {
			$budget    += $val['budget'];
			$realcash  += $val['realcash'];
			$_budget   += $val['_budget'];
			$_realcash += $val['_realcash'];
		}
		$phtml .= '<td width="80px"><strong style="float: right;">'.round($budget, 2).
					'</strong></td><td width="120px"><span style="float: right;">'.round($realcash, 2).
					'</span></td><td width="125x"><strong style="float: right; color: #';
		$res = budget_color($realcash, $budget);
		if(!$res)
			$phtml .= '0;">-';
		else {
			$phtml .= $res.';">'.round($realcash*100/$budget, 1).'%';
		}
		$phtml .= '</strong></td><td width="120px"><span style="float: right;">'.$_budget.
					'</span></td><td width="120px"><input style="float: right; width: 70px;" value="'.$_realcash.
					'"/></td><td></td></tr>';
	} else {
		$phtml .= $key.'</span></td>';
		$phtml .= '<td width="80px"><strong style="float: right;">'.round($label['budget'], 2).
					'</strong></td><td width="120px"><span style="float: right;">'.round($label['realcash'], 2).
					'</span></td><td width="125x"><strong style="float: right; color: #';
		$res = budget_color($label['realcash'], $label['budget']);
		if(!$res)
			$phtml .= '0;">-';
		else {
			$phtml .= $res.';">'.round($label['realcash']*100/$label['budget'], 1).'%';
		}
		$phtml .= '</strong></td><td width="120px"><span style="float: right;">'.$label['_budget'].
					'</span></td><td width="120px"><input style="float: right; width: 70px;" value="'.$label['_realcash'].
					'"/></td><td></td></tr>';
	}
}

/*
<tr><td colspan="7" style="padding: 0;">
<div style="background: #F2F2F2; margin-left: 10px; width: 700px; padding: 5px 0;">
<table id="">
<tbody>
<tr>
<td style="padding: 0 4px 0 12px; border-bottom: none; width: 72px;">食品</td>
<td width="80px" style="padding: 0 4px; border-bottom: none;"><strong style="float: right;">0.00</strong></td>
<td width="120px" style="padding: 0 4px; border-bottom: none;"><span style="float: right;">0.00</span></td>
<td width="125px" style="padding: 0 4px; border-bottom: none;"><strong style="float: right; color: #f10000;">90%</strong></td>
<td width="120px" style="padding: 0 4px; border-bottom: none;"><span style="float: right;">0.00</span></td>
<td width="120px" style="padding: 0 4px; border-bottom: none;"><input style="float: right; width: 70px;" /></td>
</tr>
<tr>
<td style="padding: 0 4px 0 12px; border-bottom: none; width: 72px;">家具物品</td>
<td width="80px" style="padding: 0 4px; border-bottom: none;"><strong style="float: right;">0.00</strong></td>
<td width="120px" style="padding: 0 4px; border-bottom: none;"><span style="float: right;">0.00</span></td>
<td width="125px" style="padding: 0 4px; border-bottom: none;"><strong style="float: right; color: #f10000;">90%</strong></td>
<td width="120px" style="padding: 0 4px; border-bottom: none;"><span style="float: right;">0.00</span></td>
<td width="120px" style="padding: 0 4px; border-bottom: none;"><input style="float: right; width: 70px;" /></td>
</tr>
</tbody>
</table>
</div></td>
</tr>
*/

?>
