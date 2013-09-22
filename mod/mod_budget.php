<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-09-22
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
			$apay[$paydata['onelv']]['_budget']   = $paydata['budget'];
			$apay[$paydata['onelv']]['_realcash'] = $paydata['realcash'];
		} else {
			$apay[$paydata['onelv']]['children'][$paydata['seclv']]['_budget']   = $paydata['budget'];
			$apay[$paydata['onelv']]['children'][$paydata['seclv']]['_realcash'] = $paydata['realcash'];
		}
	} else if($paydata['category'] == '收入') {
		if($paydata['seclv'] == '') {
			$aearn[$paydata['onelv']]['_budget']   = $paydata['budget'];
			$aearn[$paydata['onelv']]['_realcash'] = $paydata['realcash'];
		} else {
			$aearn[$paydata['onelv']]['children'][$paydata['seclv']]['_budget']   = $paydata['budget'];
			$aearn[$paydata['onelv']]['children'][$paydata['seclv']]['_realcash'] = $paydata['realcash'];
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
			$apay[$paydata['onelv']]['children'][$paydata['seclv']]['budget']   = $paydata['budget'];
			$apay[$paydata['onelv']]['children'][$paydata['seclv']]['realcash'] = $paydata['realcash'];
		}
	} else if($paydata['category'] == '收入') {
		if($paydata['seclv'] == '') {
			$aearn[$paydata['onelv']]['budget']   = $paydata['budget'];
			$aearn[$paydata['onelv']]['realcash'] = $paydata['realcash'];
		} else {
			$aearn[$paydata['onelv']]['children'][$paydata['seclv']]['budget']   = $paydata['budget'];
			$aearn[$paydata['onelv']]['children'][$paydata['seclv']]['realcash'] = $paydata['realcash'];
		}
	}
}

$phtml = '';
$budget = 0;
$realcash = 0;
$_budget = 0;
$_realcash = 0;
$inum = 0;
foreach ($apay as $key => $label) {
	$phtml .= '<tr type="pay"><td style="width:90px; padding: 4px 4px;"><span>';
	if(array_key_exists('children', $label)){
		$inum++;
		$phtml .= '<a title="收起/展开" href="#" children_id="p_'
				.$inum
				.'"><img alt="收起/展开" src="static/image/common/tree_plus.gif" style="vertical-align: middle;"/>'
				.$key.'</a></span></td>';
		
		$childrenhtml = '<tr type="pay"><td colspan="7" style="padding: 0;"><div id="p_'.$inum.'" class="acb_div_sec"><table><tbody>';
		foreach ($label['children'] as $name => $val) {
			$childrenhtml .= '<tr><td style="padding: 0 4px 0 12px; border-bottom: none; width: 82px;">'.$name.'</td>
								<td style="padding: 0 4px; border-bottom: none; width: 80px;">
									<strong style="float: right;">'.round($val['budget'], 2).'</strong></td>
								<td style="padding: 0 4px; border-bottom: none; width: 120px;">
									<span style="float: right;">'.round($val['realcash'], 2).'</span></td>';
			$res = budget_color($val['realcash'], $val['budget']);
			if(!$res)
				$childrenhtml .= '<td style="padding: 0 4px; border-bottom: none; width: 125px;">
									<strong style="float: right; color: #0;">-';
			else {
				$childrenhtml .= '<td style="padding: 0 4px; border-bottom: none; width: 125px;">
									<strong style="float: right; color: #'.$res.';">'.round($val['realcash']*100/$val['budget'], 1).'%';
			}
			$childrenhtml .= '</strong></td><td style="padding: 0 4px; border-bottom: none; width: 120px;">
												<span style="float: right;">'.$val['_budget'].'</span></td>
											<td style="padding: 0 4px; border-bottom: none; width: 120px;">
												<input style="float: right; width: 70px;" value="'.$val['_realcash'].'"/></td></tr>';
			
			$budget    += $val['budget'];
			$realcash  += $val['realcash'];
			$_budget   += $val['_budget'];
			$_realcash += $val['_realcash'];
		}
		$childrenhtml .= '</tbody></table></div></td></tr>';
		
		$phtml .= '<td style="width:80px; padding: 2px 4px;"><strong style="float: right;">'.round($budget, 2).
					'</strong></td><td style="width:120px; padding: 2px 4px;"><span style="float: right;">'.round($realcash, 2).
					'</span></td><td style="width:125px; padding: 2px 4px;"><strong style="float: right; color: #';
		$res = budget_color($realcash, $budget);
		if(!$res)
			$phtml .= '0;">-';
		else {
			$phtml .= $res.';">'.round($realcash*100/$budget, 1).'%';
		}
		$phtml .= '</strong></td><td style="width:120px; padding: 2px 4px;"><span style="float: right;">'.$_budget.
					'</span></td><td style="width:120px; padding: 2px 4px;"><input style="float: right; width: 70px;" value="'.$_realcash.
					'"/></td><td></td></tr>'.$childrenhtml;
	} else {
		$phtml .= $key.'</span></td>';
		$phtml .= '<td style="width:90px; padding: 2px 4px;"><strong style="float: right;">'.round($label['budget'], 2).
					'</strong></td><td style="width:120px; padding: 2px 4px;"><span style="float: right;">'.round($label['realcash'], 2).
					'</span></td><td style="width:125px; padding: 2px 4px;"><strong style="float: right; color: #';
		$res = budget_color($label['realcash'], $label['budget']);
		if(!$res)
			$phtml .= '0;">-';
		else {
			$phtml .= $res.';">'.round($label['realcash']*100/$label['budget'], 1).'%';
		}
		$phtml .= '</strong></td><td style="width:120px; padding: 2px 4px;"><span style="float: right;">'.$label['_budget'].
					'</span></td><td style="width:120px; padding: 2px 4px;"><input style="float: right; width: 70px;" value="'.$label['_realcash'].
					'"/></td><td></td></tr>';
	}
}

$ehtml = '';
$budget = 0;
$realcash = 0;
$_budget = 0;
$_realcash = 0;
$inum = 0;
foreach ($aearn as $key => $label) {
	$ehtml .= '<tr type="earn"><td style="width:90px; padding: 4px 4px;"><span>';
	if(array_key_exists('children', $label)){
		$inum++;
		$ehtml .= '<a title="收起/展开" href="#" children_id="e_'
		.$inum
		.'"><img alt="收起/展开" src="static/image/common/tree_plus.gif" style="vertical-align: middle;"/>'
		.$key.'</a></span></td>';

		$childrenhtml = '<tr type="earn"><td colspan="7" style="padding: 0;"><div id="e_'.$inum.'" class="acb_div_sec"><table><tbody>';
		foreach ($label['children'] as $name => $val) {
			$childrenhtml .= '<tr><td style="padding: 0 4px 0 12px; border-bottom: none; width: 82px;">'.$name.'</td>
			<td style="padding: 0 4px; border-bottom: none; width: 80px;">
			<strong style="float: right;">'.round($val['budget'], 2).'</strong></td>
			<td style="padding: 0 4px; border-bottom: none; width: 120px;">
			<span style="float: right;">'.round($val['realcash'], 2).'</span></td>';
			$res = budget_color($val['realcash'], $val['budget']);
			if(!$res)
				$childrenhtml .= '<td style="padding: 0 4px; border-bottom: none; width: 125px;">
				<strong style="float: right; color: #0;">-';
			else {
				$childrenhtml .= '<td style="padding: 0 4px; border-bottom: none; width: 125px;">
				<strong style="float: right; color: #'.$res.';">'.round($val['realcash']*100/$val['budget'], 1).'%';
			}
			$childrenhtml .= '</strong></td><td style="padding: 0 4px; border-bottom: none; width: 120px;">
			<span style="float: right;">'.$val['_budget'].'</span></td>
			<td style="padding: 0 4px; border-bottom: none; width: 120px;">
			<input style="float: right; width: 70px;" value="'.$val['_realcash'].'"/></td></tr>';
				
			$budget    += $val['budget'];
			$realcash  += $val['realcash'];
			$_budget   += $val['_budget'];
			$_realcash += $val['_realcash'];
		}
		$childrenhtml .= '</tbody></table></div></td></tr>';

		$ehtml .= '<td style="width:80px; padding: 2px 4px;"><strong style="float: right;">'.round($budget, 2).
		'</strong></td><td style="width:120px; padding: 2px 4px;"><span style="float: right;">'.round($realcash, 2).
		'</span></td><td style="width:125px; padding: 2px 4px;"><strong style="float: right; color: #';
		$res = budget_color($realcash, $budget);
		if(!$res)
			$ehtml .= '0;">-';
		else {
			$ehtml .= $res.';">'.round($realcash*100/$budget, 1).'%';
		}
		$ehtml .= '</strong></td><td style="width:120px; padding: 2px 4px;"><span style="float: right;">'.$_budget.
		'</span></td><td style="width:120px; padding: 2px 4px;"><input style="float: right; width: 70px;" value="'.$_realcash.
		'"/></td><td></td></tr>'.$childrenhtml;
	} else {
		$ehtml .= $key.'</span></td>';
		$ehtml .= '<td style="width:90px; padding: 2px 4px;"><strong style="float: right;">'.round($label['budget'], 2).
		'</strong></td><td style="width:120px; padding: 2px 4px;"><span style="float: right;">'.round($label['realcash'], 2).
		'</span></td><td style="width:125px; padding: 2px 4px;"><strong style="float: right; color: #';
		$res = budget_color($label['realcash'], $label['budget']);
		if(!$res)
			$ehtml .= '0;">-';
		else {
			$ehtml .= $res.';">'.round($label['realcash']*100/$label['budget'], 1).'%';
		}
		$ehtml .= '</strong></td><td style="width:120px; padding: 2px 4px;"><span style="float: right;">'.$label['_budget'].
		'</span></td><td style="width:120px; padding: 2px 4px;"><input style="float: right; width: 70px;" value="'.$label['_realcash'].
		'"/></td><td></td></tr>';
	}
}

?>
