/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-02-05
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */
jQuery.noConflict();


var Setwinmodify = function (data, fncallback) {
	switch(data['type']) {
		case '支出':
		case '收入':
			jQuery("#l_1").html("账单日期：");
			jQuery("#l_2").html("账单名称：");
			jQuery("#l_3").html("账单金额：");
			jQuery("#l_4").html("账单归属：");
			if(jQuery("#richtype_out_ctrl").length)
				jQuery("#richtype_out_ctrl").hide();
			jQuery("#richname").show();
			jQuery("#richnamebtn").show();
			break;
		case '转账':
			jQuery("#richname").hide();
			jQuery("#richnamebtn").hide();
			jQuery("#l_1").html("转账日期：");
			jQuery("#l_2").html("转出归属：");
			jQuery("#l_3").html("转账金额：");
			jQuery("#l_4").html("转入归属：");
			break;
		case '借入':
			jQuery("#richname").hide();
			jQuery("#richnamebtn").hide();
			jQuery("#l_1").html("负债日期：");
			jQuery("#l_2").html("负债账户：");
			jQuery("#l_3").html("负债金额：");
			jQuery("#l_4").html("存入归属：");
			break;
		case '借出':
			jQuery("#richname").hide();
			jQuery("#richnamebtn").hide();
			jQuery("#l_1").html("借出日期：");
			jQuery("#l_2").html("债权账户：");
			jQuery("#l_3").html("借出金额：");
			jQuery("#l_4").html("借出归属：");
			break;
		case '收债':
			jQuery("#richname").hide();
			jQuery("#richnamebtn").hide();
			jQuery("#l_1").html("收债日期：");
			jQuery("#l_2").html("债权账户：");
			jQuery("#l_3").html("收债金额：");
			jQuery("#l_4").html("存入归属：");
			break;
		case '还债':
			jQuery("#richname").hide();
			jQuery("#richnamebtn").hide();
			jQuery("#l_1").html("还债日期：");
			jQuery("#l_2").html("负债账户：");
			jQuery("#l_3").html("还债金额：");
			jQuery("#l_4").html("还债归属：");
			break;
		default:break;
	}
	jQuery("#ac_dmodify").show();
	return true;
}

/*
 * 修改窗口
 */
jQuery(document).ready(function($) {
	$("#richnum").calculator();
	
	$("#ac_dmodify").detach().appendTo("body").position({
		my: "center center",
		at: "center center",
		of: $("body"),
		offset: "0 -50"
	});
	$("#h3_move").mousedown(function(e){
		dragMenu($("#ac_dmodify")[0], e, 1);
	});
	$("#modify_aclose").click(function(){
		$("#ac_dmodify").hide();
	});
	
	
});
