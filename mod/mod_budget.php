<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-09-26
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
//print_r($account->account_config['paytype']);
$aearn = title_tobudget($account->account_config['earntype']);

/* 获取当月预算数据 */
$query = DB::query("SELECT * FROM ".DB::table('account_budget').
		" WHERE uidtime='$uidtime'");
while($paydata = DB::fetch($query)) {
	if($paydata['category'] == '支出') {
		if($paydata['seclv'] == '') {
			$apay[$paydata['onelv']]['_budget']   = floatval($paydata['budget']);
			$apay[$paydata['onelv']]['_realcash'] = floatval($paydata['realcash']);
		} else {
			$apay[$paydata['onelv']]['children'][$paydata['seclv']]['_budget']   = floatval($paydata['budget']);
			$apay[$paydata['onelv']]['children'][$paydata['seclv']]['_realcash'] = floatval($paydata['realcash']);
		}
	} else if($paydata['category'] == '收入') {
		if($paydata['seclv'] == '') {
			$aearn[$paydata['onelv']]['_budget']   = floatval($paydata['budget']);
			$aearn[$paydata['onelv']]['_realcash'] = floatval($paydata['realcash']);
		} else {
			$aearn[$paydata['onelv']]['children'][$paydata['seclv']]['_budget']   = floatval($paydata['budget']);
			$aearn[$paydata['onelv']]['children'][$paydata['seclv']]['_realcash'] = floatval($paydata['realcash']);
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
			$apay[$paydata['onelv']]['budget']   = floatval($paydata['budget']);
			$apay[$paydata['onelv']]['realcash'] = floatval($paydata['realcash']);
		} else {
			$apay[$paydata['onelv']]['children'][$paydata['seclv']]['budget']   = floatval($paydata['budget']);
			$apay[$paydata['onelv']]['children'][$paydata['seclv']]['realcash'] = floatval($paydata['realcash']);
		}
	} else if($paydata['category'] == '收入') {
		if($paydata['seclv'] == '') {
			$aearn[$paydata['onelv']]['budget']   = $paydata['budget'];
			$aearn[$paydata['onelv']]['realcash'] = $paydata['realcash'];
		} else {
			$aearn[$paydata['onelv']]['children'][$paydata['seclv']]['budget']   = floatval($paydata['budget']);
			$aearn[$paydata['onelv']]['children'][$paydata['seclv']]['realcash'] = floatval($paydata['realcash']);
		}
	}
}

$phtml = '';
$inum = 0;
foreach ($apay as $key => $label) {
	$budget = 0;
	$realcash = 0;
	$_budget = 0;
	$_realcash = 0;
	$phtml .= '<tr type="pay" Steps="1" class="acbt_tr"><td class="acbt_td_1"><span>';
	if(array_key_exists('children', $label)){
		$inum++;
		$phtml .= '<a title="收起/展开" href="javascript:;" children_id="p_'
			.$inum.'"><img alt="收起/展开" src="static/image/common/tree_minus.gif" style="vertical-align: middle;"/>'
			.$key.'</a></span></td>';
		
		$childrenhtml = '<tr type="pay" class="acbt_tr"><td colspan="7" style="padding: 0;"><div id="p_'.$inum.'" class="acb_div_sec"><table><tbody>';
		foreach ($label['children'] as $name => $val) {
			$childrenhtml .= '<tr Steps="2"><td class="acbt_td_21">'.$name.'</td>
				<td class="acbt_td_22"><strong style="float: right;">'.round($val['budget'], 2).'</strong></td>
				<td class="acbt_td_23"><span style="float: right;">'.round($val['realcash'], 2).'</span></td>';
			$res = budget_color($val['realcash'], $val['budget']);
			if(!$res)
				$childrenhtml .= '<td class="acbt_td_24"><strong style="float: right; color: #0;">-';
			else {
				$childrenhtml .= '<td class="acbt_td_24"><strong style="float: right; color: #'.$res.';">'
					.round($val['realcash']*100/$val['budget'], 1).'%';
			}
			$childrenhtml .= '</strong></td><td class="acbt_td_25"><span style="float: right;">'.$val['_budget'].'</span></td>
				<td class="acbt_td_26"><input class="acbt_input" value="'.$val['_realcash']
				.'" onkeyup="value=value.replace(/[^\d\.]/g,\'\')" onafterpaste="this.value=this.value.replace(/[^\d\.]/g,\'\')"/>
				</td></tr>';
			
			$budget    += $val['budget'];
			$realcash  += $val['realcash'];
			$_budget   += $val['_budget'];
			$_realcash += $val['_realcash'];
		}
		$childrenhtml .= '</tbody></table></div></td></tr>';
		
		$phtml .= '<td class="acbt_td_2"><strong style="float: right;">'.round($budget, 2)
			.'</strong></td><td class="acbt_td_3"><span style="float: right;">'.round($realcash, 2)
			.'</span></td><td class="acbt_td_4"><strong style="float: right; color: #';
		$res = budget_color($realcash, $budget);
		if(!$res)
			$phtml .= '0;">-';
		else {
			$phtml .= $res.';">'.round($realcash*100/$budget, 1).'%';
		}
		$phtml .= '</strong></td><td class="acbt_td_5"><span style="float: right;">'.$_budget
			.'</span></td><td class="acbt_td_6">
			<input style="float: right; width: 70px; text-align:right;" value="'.$_realcash
			.'" onkeyup="value=value.replace(/[^\d\.]/g,\'\')" onafterpaste="this.value=this.value.replace(/[^\d\.]/g,\'\')"/>
			</td><td></td></tr>'.$childrenhtml;
	} else {
		$phtml .= $key.'</span></td>';
		$phtml .= '<td class="acbt_td_2"><strong style="float: right;">'.round($label['budget'], 2)
			.'</strong></td><td class="acbt_td_3"><span style="float: right;">'.round($label['realcash'], 2)
			.'</span></td><td class="acbt_td_4"><strong style="float: right; color: #';
		$res = budget_color($label['realcash'], $label['budget']);
		if(!$res)
			$phtml .= '0;">-';
		else {
			$phtml .= $res.';">'.round($label['realcash']*100/$label['budget'], 1).'%';
		}
		$phtml .= '</strong></td><td class="acbt_td_5"><span style="float: right;">'.$label['_budget']
			.'</span></td><td class="acbt_td_6"><input style="float: right; width: 70px; text-align:right;" value="'.$label['_realcash']
			.'" onkeyup="value=value.replace(/[^\d\.]/g,\'\')" onafterpaste="this.value=this.value.replace(/[^\d\.]/g,\'\')"/>
			</td><td></td></tr>';
	}
}

$ehtml = '';
$inum = 0;
foreach ($aearn as $key => $label) {
	$budget = 0;
	$realcash = 0;
	$_budget = 0;
	$_realcash = 0;
	$ehtml .= '<tr type="earn" Steps="1" class="acbt_tr"><td class="acbt_td_1"><span>';
	if(array_key_exists('children', $label)){
		$inum++;
		$ehtml .= '<a title="收起/展开" href="javascript:;" children_id="e_'
			.$inum.'"><img alt="收起/展开" src="static/image/common/tree_minus.gif" style="vertical-align: middle;"/>'
			.$key.'</a></span></td>';
		
		$childrenhtml = '<tr type="earn" class="acbt_tr"><td colspan="7" style="padding: 0;"><div id="e_'.$inum.'" class="acb_div_sec"><table><tbody>';
		foreach ($label['children'] as $name => $val) {
			$childrenhtml .= '<tr Steps="2"><td class="acbt_td_21">'.$name.'</td>
				<td class="acbt_td_22"><strong style="float: right;">'.round($val['budget'], 2).'</strong></td>
				<td class="acbt_td_23"><span style="float: right;">'.round($val['realcash'], 2).'</span></td>';
			$res = budget_color($val['realcash'], $val['budget']);
			if(!$res)
				$childrenhtml .= '<td class="acbt_td_24"><strong style="float: right; color: #0;">-';
			else {
				$childrenhtml .= '<td class="acbt_td_24"><strong style="float: right; color: #'.$res.';">'
					.round($val['realcash']*100/$val['budget'], 1).'%';
			}
			$childrenhtml .= '</strong></td><td class="acbt_td_25"><span style="float: right;">'.$val['_budget'].'</span></td>
				<td class="acbt_td_26"><input class="acbt_input" value="'.$val['_realcash']
				.'" onkeyup="value=value.replace(/[^\d\.]/g,\'\')" onafterpaste="this.value=this.value.replace(/[^\d\.]/g,\'\')"/>
				</td></tr>';
			
			$budget    += $val['budget'];
			$realcash  += $val['realcash'];
			$_budget   += $val['_budget'];
			$_realcash += $val['_realcash'];
		}
		$childrenhtml .= '</tbody></table></div></td></tr>';
		
		$ehtml .= '<td class="acbt_td_2"><strong style="float: right;">'.round($budget, 2)
			.'</strong></td><td class="acbt_td_3"><span style="float: right;">'.round($realcash, 2)
			.'</span></td><td class="acbt_td_4"><strong style="float: right; color: #';
		$res = budget_color($realcash, $budget);
		if(!$res)
			$ehtml .= '0;">-';
		else {
			$ehtml .= $res.';">'.round($realcash*100/$budget, 1).'%';
		}
		$ehtml .= '</strong></td><td class="acbt_td_5"><span style="float: right;">'.$_budget
			.'</span></td><td class="acbt_td_6">
			<input style="float: right; width: 70px; text-align:right;" value="'.$_realcash
			.'" onkeyup="value=value.replace(/[^\d\.]/g,\'\')" onafterpaste="this.value=this.value.replace(/[^\d\.]/g,\'\')"/>
			</td><td></td></tr>'.$childrenhtml;
	} else {
		$ehtml .= $key.'</span></td>';
		$ehtml .= '<td class="acbt_td_2"><strong style="float: right;">'.round($label['budget'], 2)
			.'</strong></td><td class="acbt_td_3"><span style="float: right;">'.round($label['realcash'], 2)
			.'</span></td><td class="acbt_td_4"><strong style="float: right; color: #';
		$res = budget_color($label['realcash'], $label['budget']);
		if(!$res)
			$ehtml .= '0;">-';
		else {
			$ehtml .= $res.';">'.round($label['realcash']*100/$label['budget'], 1).'%';
		}
		$ehtml .= '</strong></td><td class="acbt_td_5"><span style="float: right;">'.$label['_budget']
			.'</span></td><td class="acbt_td_6"><input style="float: right; width: 70px; text-align:right;" value="'.$label['_realcash']
			.'" onkeyup="value=value.replace(/[^\d\.]/g,\'\')" onafterpaste="this.value=this.value.replace(/[^\d\.]/g,\'\')"/>
			</td><td></td></tr>';
	}
}

?>
