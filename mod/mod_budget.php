<?php

/**
 *    isuiji_tally v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2014-01-28
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

$richbudget_y = date('Y', $_G['timestamp']);
$richbudget_m = date('n', $_G['timestamp']);

$uidtime = $_G['uid'].date('Ym', $_G['timestamp']);

/* 获取当月预算数据 */
$apay = Array();
$aearn = Array();

if(!$tally->getBudget($uidtime, $apay, $aearn, "n", "a"))
	return false;

/* 获取上月预算数据 */
$uidtime = $_G['uid'].date("Ym", strtotime("-1 month"));
$alastpay = Array();
$alastearn = Array();

if(!$tally->getBudget($uidtime, $alastpay, $alastearn, "a", "n"))
	return false;

require_once DISCUZ_ROOT.$basedir."function/func_common.php";

$phtml = '';
$inum = 0;
foreach ($apay as $key => $label) {
	$budget = 0;
	$realcash = 0;
	$_budget = 0;
	$_realcash = 0;
	$phtml .= '<tr type="pay" sname="'.$key.'" class="acbt_tr"><td class="acbt_td_1"><span>';
	if(array_key_exists('children', $label) && is_array($label['children'])) {
		$inum++;
		$phtml .= '<a title="收起/展开" href="javascript:;" children_id="p_'
			.$inum.'"><img alt="收起/展开" src="static/image/common/tree_minus.gif" style="vertical-align: middle;"/>'
			.$key.'</a></span></td>';
		
		$childrenhtml = '<tr type="pay" class="acbt_tr"><td colspan="7" style="padding: 0;"><div id="p_'.$inum.'" class="acb_div_sec"><table><tbody>';
		foreach ($label['children'] as $name => $val) {
			$b_last = $r_last = 0;
			if(array_key_exists($key, $alastpay)) {
				$b_last = $alastpay[$key]['children'][$name]['budget'];
				$r_last = $alastpay[$key]['children'][$name]['realcash'];
			}
			$childrenhtml .= '<tr sname="'.$name.'"><td class="acbt_td_21">'.$name.'</td>
				<td class="acbt_td_22"><strong style="float: right;">'.$b_last.'</strong></td>
				<td class="acbt_td_23"><span style="float: right;">'.$r_last.'</span></td>';
			$res = budget_color($r_last, $b_last);
			if(!$res)
				$childrenhtml .= '<td class="acbt_td_24"><strong style="float: right; color: #0;">-';
			else {
				$childrenhtml .= '<td class="acbt_td_24"><strong style="float: right; color: #'.$res.';">'
					.round($r_last*100/$b_last, 1).'%';
			}
			$childrenhtml .= '</strong></td><td class="acbt_td_25"><span style="float: right;">'.round($val['realcash'], 2)
						.'</span></td><td class="acbt_td_26">';
			if(array_key_exists('status', $val) && $val['status'] == 'disable')
				$childrenhtml .= '<input class="acbt_input" value="'.round($val['budget'], 2)
							.'" disabled="disabled"/></td></tr>';
			else
				$childrenhtml .= '<img class="acbt_img" title="复制" alt="复制" src="static/image/common/copy.png" />
							<input class="acbt_input" value="'.round($val['budget'], 2)
							.'" onkeyup="value=value.replace(/[^\d\.]/g,\'\')"
							onafterpaste="this.value=this.value.replace(/[^\d\.]/g,\'\')"/></td></tr>';
			
			$budget    += $val['budget'];
			$realcash  += $val['realcash'];
			$_budget   += $b_last;
			$_realcash += $r_last;
		}
		$childrenhtml .= '</tbody></table></div></td></tr>';
		
		$phtml .= '<td class="acbt_td_2"><strong style="float: right;">'.$_budget
			.'</strong></td><td class="acbt_td_3"><span style="float: right;">'.$_realcash
			.'</span></td><td class="acbt_td_4"><strong style="float: right; color: #';
		$res = budget_color($_realcash, $_budget);
		if(!$res)
			$phtml .= '0;">-';
		else {
			$phtml .= $res.';">'.round($_realcash*100/$_budget, 1).'%';
		}
		$phtml .= '</strong></td><td class="acbt_td_5"><span style="float: right;">'.round($realcash, 2)
			.'</span></td><td class="acbt_td_6"><img class="acbt_img" title="复制" alt="复制" src="static/image/common/copy.png" />
			<input style="float: right; width: 70px; text-align:right;" value="'.round($budget, 2).'" readonly="readonly"/>
			</td><td></td></tr>'.$childrenhtml;
	} else {
		$b_last = $r_last = 0;
		if(array_key_exists($key, $alastpay)) {
			$b_last = $alastpay[$key]['budget'];
			$r_last = $alastpay[$key]['realcash'];
		}
		$phtml .= $key.'</span></td>';
		$phtml .= '<td class="acbt_td_2"><strong style="float: right;">'.$b_last
			.'</strong></td><td class="acbt_td_3"><span style="float: right;">'.$r_last
			.'</span></td><td class="acbt_td_4"><strong style="float: right; color: #';
		$res = budget_color($r_last, $b_last);
		if(!$res)
			$phtml .= '0;">-';
		else {
			$phtml .= $res.';">'.round($r_last*100/$b_last, 1).'%';
		}
		$phtml .= '</strong></td><td class="acbt_td_5"><span style="float: right;">'.round($label['realcash'], 2)
			.'</span></td><td class="acbt_td_6"><img class="acbt_img" title="复制" alt="复制" src="static/image/common/copy.png" />
			<input style="float: right; width: 70px; text-align:right;" value="'.round($label['budget'], 2)
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
	$ehtml .= '<tr type="earn" sname="'.$key.'" class="acbt_tr"><td class="acbt_td_1"><span>';
	if(array_key_exists('children', $label) && is_array($label['children'])){
		$inum++;
		$ehtml .= '<a title="收起/展开" href="javascript:;" children_id="e_'
			.$inum.'"><img alt="收起/展开" src="static/image/common/tree_minus.gif" style="vertical-align: middle;"/>'
			.$key.'</a></span></td>';
		
		$childrenhtml = '<tr type="earn" class="acbt_tr"><td colspan="7" style="padding: 0;"><div id="e_'.$inum.'" class="acb_div_sec"><table><tbody>';
		foreach ($label['children'] as $name => $val) {
			$b_last = $r_last = 0;
			if(array_key_exists($key, $alastearn)) {
				$b_last = $alastearn[$key]['children'][$name]['budget'];
				$r_last = $alastearn[$key]['children'][$name]['realcash'];
			}
			$childrenhtml .= '<tr sname="'.$name.'"><td class="acbt_td_21">'.$name.'</td>
				<td class="acbt_td_22"><strong style="float: right;">'.$b_last.'</strong></td>
				<td class="acbt_td_23"><span style="float: right;">'.$r_last.'</span></td>';
			$res = budget_color($r_last, $b_last);
			if(!$res)
				$childrenhtml .= '<td class="acbt_td_24"><strong style="float: right; color: #0;">-';
			else {
				$childrenhtml .= '<td class="acbt_td_24"><strong style="float: right; color: #'.$res.';">'
					.round($r_last*100/$b_last, 1).'%';
			}
			$childrenhtml .= '</strong></td><td class="acbt_td_25"><span style="float: right;">'.round($val['realcash'], 2)
					.'</span></td><td class="acbt_td_26">';
			if(array_key_exists('status', $val) && $val['status'] == 'disable')
				$childrenhtml .= '<input class="acbt_input" value="'.round($val['budget'], 2)
							.'" disabled="disabled"/></td></tr>';
			else
				$childrenhtml .= '<img class="acbt_img" title="复制" alt="复制" src="static/image/common/copy.png" />
							<input class="acbt_input" value="'.round($val['budget'], 2)
							.'" onkeyup="value=value.replace(/[^\d\.]/g,\'\')"
							onafterpaste="this.value=this.value.replace(/[^\d\.]/g,\'\')"/></td></tr>';
			
			$budget    += $val['budget'];
			$realcash  += $val['realcash'];
			$_budget   += $b_last;
			$_realcash += $r_last;
		}
		$childrenhtml .= '</tbody></table></div></td></tr>';
		
		$ehtml .= '<td class="acbt_td_2"><strong style="float: right;">'.$_budget
			.'</strong></td><td class="acbt_td_3"><span style="float: right;">'.$_realcash
			.'</span></td><td class="acbt_td_4"><strong style="float: right; color: #';
		$res = budget_color($_realcash, $_budget);
		if(!$res)
			$ehtml .= '0;">-';
		else {
			$ehtml .= $res.';">'.round($_realcash*100/$_budget, 1).'%';
		}
		$ehtml .= '</strong></td><td class="acbt_td_5"><span style="float: right;">'.round($realcash, 2)
			.'</span></td><td class="acbt_td_6"><img class="acbt_img" title="复制" alt="复制" src="static/image/common/copy.png" />
			<input style="float: right; width: 70px; text-align:right;" value="'.round($budget, 2).'" readonly="readonly"/>
			</td><td></td></tr>'.$childrenhtml;
	} else {
		$b_last = $r_last = 0;
		if(array_key_exists($key, $alastearn)) {
			$b_last = $alastearn[$key]['budget'];
			$r_last = $alastearn[$key]['realcash'];
		}
		$ehtml .= $key.'</span></td>';
		$ehtml .= '<td class="acbt_td_2"><strong style="float: right;">'.$b_last
			.'</strong></td><td class="acbt_td_3"><span style="float: right;">'.$r_last
			.'</span></td><td class="acbt_td_4"><strong style="float: right; color: #';
		$res = budget_color($label['realcash'], $label['budget']);
		if(!$res)
			$ehtml .= '0;">-';
		else {
			$ehtml .= $res.';">'.round($label['realcash']*100/$label['budget'], 1).'%';
		}
		$ehtml .= '</strong></td><td class="acbt_td_5"><span style="float: right;">'.round($label['realcash'], 2)
			.'</span></td><td class="acbt_td_6"><img class="acbt_img" title="复制" alt="复制" src="static/image/common/copy.png" />
			<input style="float: right; width: 70px; text-align:right;" value="'.round($label['budget'], 2)
			.'" onkeyup="value=value.replace(/[^\d\.]/g,\'\')" onafterpaste="this.value=this.value.replace(/[^\d\.]/g,\'\')"/>
			</td><td></td></tr>';
	}
}

?>
