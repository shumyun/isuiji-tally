/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-02-06
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */
jQuery.noConflict();


var Setwinmodify = function (data, ctl) {

	var ac_date = new Date(data["date"]);
	jQuery("#richdate").val(ac_date.getFullYear()+'-'+(ac_date.getMonth()+1)+'-'+ac_date.getDate());

	var aData = new Array();
	switch(data["type"]) {
		case '支出':
			aData["pay"] = "richname";
		case '收入':
			if(data['type'] == '收入')
				aData["earn"] = "richname";
			ajax_getdataparam(aData, false);
			jQuery("#l_1").html("账单日期：");
			jQuery("#l_2").html("账单名称：");
			jQuery("#l_3").html("账单金额：");
			jQuery("#l_4").html("账单归属：");
			jQuery("#richname").val(data["data1"]);
			jQuery("#richcategory").val(data["data2"]);
			jQuery("#richnum").val(data["amount"]);
			jQuery("#message").val(data["msg"]);
			if(jQuery("#richtype_out_ctrl").length)
				jQuery("#richtype_out_ctrl").hide();
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
	jQuery(document).ready(function($) {
		$("#ac_dmodify").show().position({
			my: "left center",
			at: "center center",
			of: $(ctl),
			offset: "-50 0"
		});
	});
	return true;
}

/*
 * 修改窗口
 */
jQuery(document).ready(function($) {
	
	//日期控件初始化
	$("#richnum").calculator();
	
	//获取归属的数据
	var aData = new Array();
	aData["richtype"] = "richtype";
	ajax_getdataparam(aData, false);
	
	/*
	 * 自动匹配功能
	 */
	$( "#richname" )
	.catcomplete({
		delay: 0,
		minLength: 0,
		source: [{ label: "", category: "" }],
		category: $("#richcategory")
	});	
	
	$( "#richnamebtn" )
	.attr( {"tabIndex":-1, "title":"显示所有名称"} )
	.click(function() {
		// close if already visible
		if ( $("input#richname").catcomplete( "widget" ).is( ":visible" ) ) {
			$("input#richname").catcomplete( "close" );
			return;
		}
		
		// work around a bug (likely same cause as #5265)
		$( this ).blur();
		
		// pass empty string as value to search for, displaying all results
		$("input#richname").catcomplete( "search", "" );
		$("input#richname").focus();
	});
	
	//移动控件
	$("#h3_move").mousedown(function(e){
		$('#richname').blur();
		dragMenu($("#ac_dmodify")[0], e, 1);
	});
	
	//关闭按钮
	$("#modify_aclose").click(function(){
		$("#ac_dmodify").hide();
		jQuery("#datatable").DataTable.ext.oApi.fnModifyData();
	});
	
	//整个控件的初始化
	$("#ac_dmodify").detach().appendTo("body");

});
