/**
 *    isuiji_tally v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-10-21
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */
jQuery.noConflict();

var dataobj = {};
var Setwinmodify = function (data, ctl) {
	dataobj = {};
	var ac_date = new Date(data["date"]);
	jQuery("#richdate").val(ac_date.getFullYear()+'-'+(ac_date.getMonth()+1)+'-'+ac_date.getDate());

	var aData = new Array();
	switch(data["type"]) {
		case '支出':
		case '收入':
			jQuery("#richtype_out").hide();
			jQuery("#l_1").html("账单日期：");
			jQuery("#l_2").html("账单名称：");
			jQuery("#l_3").html("账单金额：");
			jQuery("#l_4").html("账单归属：");
			if(data['type'] == '支出')
				aData["pay"] = "richname";
			else
				aData["earn"] = "richname";
			ajax_getdataparam(aData, false);
			jQuery("#richname").val(data["data1"]);
			jQuery("#richcategory").val(data["data2"]);
			jQuery("#richnum").val(data["amount"]);
			jQuery("#message").val(data["msg"]);
			ac_setSelvalue("richtype", data["account"]);
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
			aData["richtype_out"] = "richtype_out";
			ajax_getdataparam(aData, false);
			ac_setSelvalue("richtype_out", data["data2"]);
			jQuery("#richtype_out").show();
			ac_setSelvalue("richtype", data["account"]);
			jQuery("#richnum").val(data["amount"]);
			jQuery("#message").val(data["msg"]);
			break;
			
		case '借入':
			jQuery("#richname").hide();
			jQuery("#richnamebtn").hide();
			jQuery("#l_1").html("负债日期：");
			jQuery("#l_2").html("债权账户：");
			jQuery("#l_3").html("负债金额：");
			jQuery("#l_4").html("存入归属：");
			aData["loan"] = "richtype_out";
			ajax_getdataparam(aData, false);
			ac_setSelvalue("richtype_out", data["data2"]);
			jQuery("#richtype_out").show();
			ac_setSelvalue("richtype", data["account"]);
			jQuery("#richnum").val(data["amount"]);
			jQuery("#message").val(data["msg"]);
			break;
		case '借出':
			jQuery("#richname").hide();
			jQuery("#richnamebtn").hide();
			jQuery("#l_1").html("借出日期：");
			jQuery("#l_2").html("负债账户：");
			jQuery("#l_3").html("借出金额：");
			jQuery("#l_4").html("借出归属：");
			aData["debt"] = "richtype_out";
			ajax_getdataparam(aData, false);
			ac_setSelvalue("richtype_out", data["data2"]);
			jQuery("#richtype_out").show();
			ac_setSelvalue("richtype", data["account"]);
			jQuery("#richnum").val(data["amount"]);
			jQuery("#message").val(data["msg"]);
			break;
		case '收债':
			jQuery("#richname").hide();
			jQuery("#richnamebtn").hide();
			jQuery("#l_1").html("收债日期：");
			jQuery("#l_2").html("负债账户：");
			jQuery("#l_3").html("收债金额：");
			jQuery("#l_4").html("存入归属：");
			aData["debt"] = "richtype_out";
			ajax_getdataparam(aData, false);
			ac_setSelvalue("richtype_out", data["data2"]);
			jQuery("#richtype_out").show();
			ac_setSelvalue("richtype", data["account"]);
			jQuery("#richnum").val(data["amount"]);
			jQuery("#message").val(data["msg"]);
			break;
		case '还债':
			jQuery("#richname").hide();
			jQuery("#richnamebtn").hide();
			jQuery("#l_1").html("还债日期：");
			jQuery("#l_2").html("债权账户：");
			jQuery("#l_3").html("还债金额：");
			jQuery("#l_4").html("还债归属：");
			aData["loan"] = "richtype_out";
			ajax_getdataparam(aData, false);
			ac_setSelvalue("richtype_out", data["data2"]);
			jQuery("#richtype_out").show();
			ac_setSelvalue("richtype", data["account"]);
			jQuery("#richnum").val(data["amount"]);
			jQuery("#message").val(data["msg"]);
			break;
		default:break;
	}
	jQuery("#ac_dmodify").show().position({
		my: "left center",
		at: "center center",
		of: jQuery(ctl),
		offset: "-50 0"
	});
	dataobj = data;
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
	aData["loan"] = "richtype_out";
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
		$("#richname").blur();
		destroyTip();
		dragMenu($("#ac_dmodify")[0], e, 1);
	});
	
	//关闭按钮
	$("#modify_aclose").click(function(){
		$("#ac_dmodify").hide();
		jQuery("#datatable").DataTable.ext.oApi.fnModifyData();
	});
	$("#modify_cancel").click(function(){
		$("#ac_dmodify").hide();
		jQuery("#datatable").DataTable.ext.oApi.fnModifyData();
	});
	
	//整个控件的初始化
	$("#ac_dmodify").detach().appendTo("body");

	$("#modify_submit").click(function() {
		var odata = {}, oparam = {'one':'', 'two':'', 'three':'', 'four':'', 'five':'', 'six':'', 'seven':''};
		
		oparam.id = odata.onlyid = dataobj.onlyid;
		odata.isort  = dataobj.isort;
		
		if( $("#richnum").val() == '' ) {
			errTip("#richnum", "金额不能为空", 1, 2500);
			return ;
		}
		odata.richnum  = $("#richnum").val();
		var num = new Number(odata.richnum);
		oparam.four = num.toFixed(2);
		
		switch(dataobj["type"]) {
			case '支出':
			case '收入':
				if(dataobj["type"] == '支出')
					catcompletedata = titledata["pay"];
				else
					catcompletedata = titledata["earn"];
				if($("#richname").val() == '') {
					errTip("#richname", "名称不能为空", 1, 2500);
					return ;
				}
				if(!fncatcompletetest(catcompletedata, $("#richcategory").val(), "richcategory", $("#richname").val())) {
					errTip("#richname", "名称不在列表中，请重选或添加该名称", 1, 2500);
					return ;
				}
				oparam.three = odata.richcategory = $("#richcategory").val();
				oparam.two   = odata.richname     = $("#richname").val();
				break;
				
			case '转账':
				if($("#richtype").html() == $("#richtype_out").html()) {
					errTip("#richtype_out", "转出和转入的归属不能相同", 1, 2500);
					return ;
				}
				oparam.three = odata.richtype_out = $("#richtype_out").html();
				break;
				
			case '借入':
			case '借出':
			case '收债':
			case '还债':
				oparam.three = odata.loandebt = $("#richtype_out").html();
				break;
		}
	
		odata.richdate = $("#richdate").val();
		oparam.one     = odata.richdate.replace(/-/g, "/");
		oparam.five    = odata.richtype = $("#richtype").html();
		oparam.seven   = odata.message  = $("#message").val();
		oparam.six     = dataobj["type"];
		
		$("#datatable").DataTable.ext.oApi.fnModifyData(odata, oparam);
		$("#ac_dmodify").hide();
	});
});
