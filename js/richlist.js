/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-01-18
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */

jQuery.noConflict();


/*
 * 条件选择控件
 * 注意：ie7,ie8,ie9支持的$(a, this) 速度很慢
 */
jQuery(document).ready(function($) {
	
	var hiden_time1 = true, hiden_pop = true, cur_popbtn = null, cur_pop = null;
	$(document).click(function(e){
		if( !pop_time1.is(":hidden") && hiden_time1 ) {
			$("#li_popmenu").click();
		}
		if( cur_popbtn && cur_pop && hiden_pop ) {
			$(cur_popbtn).attr("style", "display: none");
			$(cur_pop).attr("style", "display: none");
			cur_popbtn = cur_pop = null;
		}
		hiden_time1 = hiden_pop = true;
	});
	
	/*
	 * 显示时间选项
	 */
	var display_year = $("#a_popmenu").html();
	var display_month = $("#tb_time1").html();
	var pop_time1 = $('<div class="p_pop ac_li">\
						<div><strong>时间查询：</strong><br />\
							<div style="margin: 4px 0px;">\
								<input id="bdate" type="text" readonly="readonly" onclick="showcalendar(event, this)" class="px" style="width: 65px;"/><br />&nbsp;至<br />\
								<input id="edate" type="text" readonly="readonly" onclick="showcalendar(event, this)" class="px" style="width: 65px;"/><br /></div>\
							<button id="btn_date" class="pn pnc" style="margin: 2px 0px 6px 10px;"><strong>确定</strong></button>\
						</div>\
						<ul class="ac_ultime"><li id="time1_m">最近一个月</li><li id="time1_last">上一个月</li><li id="time1_y">最近一年</li></ul>\
					  </div>')
	.appendTo("body")
	.position({
		my: "left top",
		at: "left bottom",
		of: $("#li_popmenu"),
		offset: "0 2"
	}).hide();
	$("#time1_m").click(function(){
		$("#a_popmenu").html(display_year);
		$("#li_popmenu").toggleClass("ac_showm li_hidem");
		pop_time1.hide();
		$("#tb_time1").html(display_month).attr("tab_time", "undo").attr("title", "");
		var ajaxparam = "bTime=" + parseInt(display_year) + "-" + parseInt(display_month) + "-1&eTime=-";
		if(ajaxparam != $("#tb_time1").attr("data")) {
			$("#datatable").DataTable.ext.oApi.fnAjaxSetParam(ajaxparam);
			$("#tb_time1").attr("data", ajaxparam);
		}
	});
	$("#time1_last").click(function(){
		$("#li_popmenu").toggleClass("ac_showm li_hidem");
		pop_time1.hide();
		var tmp_m = 0, ajaxparam;
		if((tmp_m = parseInt(display_month)-1) == 0){
			var tmp = parseInt(display_year) - 1;
			$("#a_popmenu").html(tmp+"年");
			$("#tb_time1").html("12月份").attr("tab_time", "use").attr("title", "关闭");
			ajaxparam = "bTime=" + tmp + "-12-1&eTime=" + tmp + "-12-31";
		} else {
			$("#a_popmenu").html("<strong>条&nbsp;件&nbsp;</strong>");
			//$("#a_popmenu").html();
			$("#tb_time1").html(+tmp_m+"月份").attr("ac_tab", "use").attr("title", "关闭");
			var tmp_y = parseInt(display_year);
			var day = new Date(tmp_y,tmp_m,0);
			ajaxparam = "bTime="+tmp_y+"-"+tmp_m+"-1&eTime="+tmp_y+"-"+tmp_m+"-"+day.getDate();
		};
		if(ajaxparam != $("#tb_time1").attr("data")) {
			$("#datatable").DataTable.ext.oApi.fnAjaxSetParam(ajaxparam);
			$("#tb_time1").attr("data", ajaxparam);
		}
	});
	$("#time1_y").click(function(){
		$("#li_popmenu").toggleClass("ac_showm li_hidem");
		pop_time1.hide();
		$("#a_popmenu").html("<strong>条&nbsp;件&nbsp;</strong>");
		$("#tb_time1").html(display_year+"全年").attr("tab_time", "use").attr("title", "关闭");
		var ajaxparam = "bTime="+parseInt(display_year)+"-1-1&eTime="+parseInt(display_year)+"-12-31";
		if(ajaxparam != $("#tb_time1").attr("data")) {
			$("#datatable").DataTable.ext.oApi.fnAjaxSetParam(ajaxparam);
			$("#tb_time1").attr("data", ajaxparam);
		}
	});
	
	$("#li_popmenu").click(function() {
		$("#li_popmenu").toggleClass("ac_showm li_hidem");
		if(pop_time1.is(":hidden")){
			pop_time1.show();
			hiden_time1 = false;
		} else {
			pop_time1.hide();
		}
	});
	
	$("[ac_tab='use']").each(function(){
		$(this).hover(function(){
			$(this).attr("style", "padding: 0 17px 0 3px; background: url(static/image/common/data_invalid.gif) no-repeat 98% 50%; font-weight: 700; cursor: pointer;");
		},function(){
			if(!$(this).is(":hidden")){
				$(this).attr("style", "");
			}
		});
		$(this).click(function(){
			$("#datatable").DataTable.ext.oApi.fnDelConditions($(this).attr("name"));
			$(this).hide();
		});
	});
	
	$("#tb_time1").hover(function(){
		if($(this).attr("tab_time") == "use"){
			$(this).attr("style", "padding: 0 17px 0 3px; background: url(static/image/common/data_invalid.gif) no-repeat 98% 50%; font-weight: 700; cursor: pointer;");
		}
	}, function(){
		if(!$(this).is(":hidden") && $(this).attr("tab_time") == "use"){
			$(this).attr("style", "");
		}
	}).click(function(){
		if($(this).attr("tab_time") == "use"){
			$(this).attr("style", "");
			$("#a_popmenu").html(display_year);
			$(this).html(display_month).attr("tab_time", "undo").attr("title", "");
			var ajaxparam = "bTime=" + parseInt(display_year) + "-" + parseInt(display_month) + "-1&eTime=-";
			if(ajaxparam != $(this).attr("data"))
				$("#datatable").DataTable.ext.oApi.fnAjaxSetParam(ajaxparam);
				$(this).attr("data", ajaxparam);
		}
	});
	
	/**
	 * 返回一、二级菜单数据
	 * @param  sID 一级菜单的id号，包括#
	 * @return 
	 */
	function GetPopData(sID) {
		var oData = { "IsAll": "n", "firstData": null };
		var fData = new Array();
		if($(sID +" > a").attr("a_clsid") === "2")
			oData["IsAll"] = "y";
		else {
			$(sID + " > ul > li").each(function(){
				var sFirst = $("a", this).html();
				switch ($(this).attr("a_clsid")) {
					case "2":
						if($(this).attr("count") === "0")
							fData[sFirst] = { "IsNoCld": "y" };
						else
							fData[sFirst] = { "IsAll": "y" };
						break;
					case "1":
						secDiv = $(this).attr("div_id");
						fData[sFirst] = { "IsAll": "n", "aData": null };
						fData[sFirst]["aData"] = new Array();
						$("#"+secDiv+"> ul > li").filter("[a_clsid='2']").each(function(){
							fData[sFirst]["aData"].push($("a", this).html());
						});
						break;
					default:
						break;
				}
			});
		}
		oData["firstData"] = fData;
		return oData;
	}
	
	/**
	 * 获取title的数据
	 * @param typeStr
	 * @param oData
	 */
	function fnTitleData(typeStr, oData) {
		var titStr = "";
		if(oData["IsAll"] === "y") {
			titStr += "所有的" + typeStr;
			return titStr;
		}
		
		var firstData = oData["firstData"];
		var i = 0;
		for(var fstStr in firstData) {
			if(firstData[fstStr].hasOwnProperty("IsNoCld") && firstData[fstStr]["IsNoCld"] === "y"){
				titStr += (i%3 ? "  " : "\n")+fstStr +"；";
			} else if(firstData[fstStr]["IsAll"] === "y") {
				titStr += (i%3 ? "  " : "\n")+fstStr +"；";
			} else {
				titStr += (i%3 ? "  " : "\n")+fstStr+"(";
				for (var j in firstData[fstStr]["aData"])
					titStr += " "+firstData[fstStr]["aData"][j]+" ";
				titStr += ")；";
			}
			i++;
		}
	
		if(titStr)
			titStr = "条件："+titStr;
		return titStr;
	}
	
	/**
	 * 获取需要筛选的账单类别的数据
	 * @param oData 需要解析的数据
	 * @returns aData: 账单类别的数组
	 */
	function fnArrayOfType(oData) {
		aData = new Array();
		if(oData["IsAll"] === "y") {
			return aData.concat("支出", "收入", "转账", "借入", "借出", "还债", "收债");
		}
		var firstData = oData["firstData"];
		for(var fstStr in firstData) {
			if(firstData[fstStr].hasOwnProperty("IsNoCld") && firstData[fstStr]["IsNoCld"] === "y"){
				aData.push(fstStr.slice(0,2));
			} else if(firstData[fstStr]["IsAll"] === "y") {
				aData = aData.concat("借入", "借出", "还债", "收债");
			} else {
				aData = aData.concat(firstData[fstStr]["aData"]);
			}
		}
		return aData;
	}

	/**
	 * 获取需要筛选的账户的数据
	 * @param oData 需要解析的数据
	 * @returns aData: 账户的数组
	 */
	function fnArrayOfAccount(oData) {
		aData = new Array();
		if(oData["IsAll"] === "y") {
			return "all";
		}
		var firstData = oData["firstData"];
		for(var fstStr in firstData) {
			aData.push(fstStr);
		}
		return aData;
	}
	
	/**
	 * @popn_pos	弹出的一级菜单坐标
	 * @popn_width	弹出的一级菜单宽度
	 */
	var popn_pos, popn_width;
	/*
	 * 支出菜单
	 */
	$("#sel_showp").click(function(){
		if(cur_popbtn && cur_pop){
			$(cur_popbtn).attr("style", "display: none");
			$(cur_pop).attr("style", "display: none");
		}
		cur_popbtn = "#sel_hidep";
		cur_pop = "#ac_popp";
		hiden_pop = false;
		
		popn_pos = $("#sel_showp").position();
		$("#sel_hidep").attr("style", "display: block; left:"+popn_pos.left+"px; top:"+popn_pos.top+"px;");
		popn_pos.top = popn_pos.top + 22;
		$("#ac_popp").attr("style", "display: block; left:"+popn_pos.left+"px; top:"+popn_pos.top+"px;");
		popn_width = $("#ac_popp").width();
	});
	
	$("#sel_hidep").click(function(){
		$("#sel_hidep").attr("style", "display: none");
		$("#ac_popp").attr("style", "display: none");
		cur_popbtn = cur_pop = null;
	});
	
	$("#btn_pay").click(function(){
		$("#sel_hidep").attr("style", "display: none");
		$("#ac_popp").attr("style", "display: none");
		cur_popbtn = cur_pop = null;
		
		var pData = GetPopData("#ac_popp");
		
		var pTitle = fnTitleData("支出类型", pData);
		if(pTitle){
			var oDatatype = {"condName": "支出", "FstCol": 2, "SecCol": 1};
			$("#datatable").DataTable.ext.oApi.fnSetConditions(pData, oDatatype);
			$("#tb_pay").attr("title", pTitle).attr("style", "display: block");
		} else {
			$("#tb_pay").attr("style", "display: none");
			$("#datatable").DataTable.ext.oApi.fnDelConditions("支出");
		}
	});
	
	/*
	 * 收入菜单
	 */
	$("#sel_showe").click(function(){
		if(cur_popbtn && cur_pop){
			$(cur_popbtn).attr("style", "display: none");
			$(cur_pop).attr("style", "display: none");
		}
		cur_popbtn = "#sel_hidee";
		cur_pop = "#ac_pope";
		hiden_pop = false;
		
		popn_pos = $("#sel_showe").position();
		$("#sel_hidee").attr("style", "display: block; left:"+popn_pos.left+"px; top:"+popn_pos.top+"px;");
		popn_pos.top = popn_pos.top + 22;
		$("#ac_pope").attr("style", "display: block; left:"+popn_pos.left+"px; top:"+popn_pos.top+"px;");
		popn_width = $("#ac_pope").width();
	});
	
	$("#sel_hidee").click(function(){
		$("#sel_hidee").attr("style", "display: none");
		$("#ac_pope").attr("style", "display: none");
		cur_popbtn = cur_pop = null;
	});
	
	$("#btn_earn").click(function(){
		$("#sel_hidee").attr("style", "display: none");
		$("#ac_pope").attr("style", "display: none");
		cur_popbtn = cur_pop = null;

		var eData = GetPopData("#ac_pope");
		
		var eTitle = fnTitleData("收入类型", eData);
		if(eTitle){
			var oDatatype = {"condName": "收入", "FstCol": 2, "SecCol": 1};
			$("#datatable").DataTable.ext.oApi.fnSetConditions(eData, oDatatype);
			$("#tb_earn").attr("title", eTitle).attr("style", "display: block");
		} else {
			$("#datatable").DataTable.ext.oApi.fnDelConditions("收入");
			$("#tb_earn").attr("style", "display: none");
		}
	});
	
	/*
	 * 账单类型菜单
	 */
	$("#sel_showt").click(function(){
		if(cur_popbtn && cur_pop){
			$(cur_popbtn).attr("style", "display: none");
			$(cur_pop).attr("style", "display: none");
		}
		cur_popbtn = "#sel_hidet";
		cur_pop = "#ac_popt";
		hiden_pop = false;
		
		popn_pos = $("#sel_showt").position();
		$("#sel_hidet").attr("style", "display: block; left:"+popn_pos.left+"px; top:"+popn_pos.top+"px;");
		popn_pos.top = popn_pos.top + 22;
		$("#ac_popt").attr("style", "display: block; left:"+popn_pos.left+"px; top:"+popn_pos.top+"px;");
		popn_width = $("#ac_popt").width();
	});
	
	$("#sel_hidet").click(function(){
		$("#sel_hidet").attr("style", "display: none");
		$("#ac_popt").attr("style", "display: none");
		cur_popbtn = cur_pop = null;
	});
	
	$("#btn_type").click(function(){
		$("#sel_hidet").attr("style", "display: none");
		$("#ac_popt").attr("style", "display: none");
		cur_popbtn = cur_pop = null;

		var tData = GetPopData("#ac_popt");
		var tTitle = fnTitleData("账单类别", tData);
		if(tTitle){
			var oDatatype = {"condName": "类型", "FstCol": null, "SecCol": null};
			tData = fnArrayOfType(tData);
			$("#datatable").DataTable.ext.oApi.fnSetConditions(tData, oDatatype);
			$("#tb_type").attr("title", tTitle).attr("style", "display: block");
		} else {
			$("#datatable").DataTable.ext.oApi.fnDelConditions("类型");
			$("#tb_type").attr("style", "display: none");
		}
	});
	
	/*
	 * 账户归属菜单
	 */
	$("#sel_showb").click(function(){
		if(cur_popbtn && cur_pop){
			$(cur_popbtn).attr("style", "display: none");
			$(cur_pop).attr("style", "display: none");
		}
		cur_popbtn = "#sel_hideb";
		cur_pop = "#ac_popb";
		hiden_pop = false;
		
		popn_pos = $("#sel_showb").position();
		$("#sel_hideb").attr("style", "display: block; left:"+popn_pos.left+"px; top:"+popn_pos.top+"px;");
		popn_pos.top = popn_pos.top + 22;
		$("#ac_popb").attr("style", "display: block; left:"+popn_pos.left+"px; top:"+popn_pos.top+"px;");
		popn_width = $("#ac_popb").width();
	});
	
	$("#sel_hideb").click(function(){
		$("#sel_hideb").attr("style", "display: none");
		$("#ac_popb").attr("style", "display: none");
		cur_popbtn = cur_pop = null;
	});
	
	$("#btn_belong").click(function(){
		$("#sel_hideb").attr("style", "display: none");
		$("#ac_popb").attr("style", "display: none");
		cur_popbtn = cur_pop = null;

		var bData = GetPopData("#ac_popb");
		
		var bTitle = fnTitleData("账户归属", bData);
		if(bTitle){
			var oDatatype = {"condName": "账户", "FstCol": 4, "SecCol": null};
			bData = fnArrayOfAccount(bData);
			$("#datatable").DataTable.ext.oApi.fnSetConditions(bData, oDatatype);
			$("#tb_category").attr("title", bTitle).attr("style", "display: block");
		} else {
			$("#datatable").DataTable.ext.oApi.fnDelConditions("账户");
			$("#tb_category").attr("style", "display: none");
		}
	});
	
	/*
	 * 借贷账户菜单
	 */
	$("#sel_showl").click(function(){
		if(cur_popbtn && cur_pop){
			$(cur_popbtn).attr("style", "display: none");
			$(cur_pop).attr("style", "display: none");
		}
		cur_popbtn = "#sel_hidel";
		cur_pop = "#ac_popl";
		hiden_pop = false;
		
		popn_pos = $("#sel_showl").position();
		$("#sel_hidel").attr("style", "display: block; left:"+popn_pos.left+"px; top:"+popn_pos.top+"px;");
		popn_pos.top = popn_pos.top + 22;
		$("#ac_popl").attr("style", "display: block; left:"+popn_pos.left+"px; top:"+popn_pos.top+"px;");
		popn_width = $("#ac_popl").width();
	});
	
	$("#sel_hidel").click(function(){
		$("#sel_hidel").attr("style", "display: none");
		$("#ac_popl").attr("style", "display: none");
		cur_popbtn = cur_pop = null;
	});
	
	$("#btn_loandebt").click(function(){
		$("#sel_hidel").attr("style", "display: none");
		$("#ac_popl").attr("style", "display: none");
		cur_popbtn = cur_pop = null;

		var lData = GetPopData("#ac_popl");
		
		var lTitle = fnTitleData("借贷账户", lData);
		if(lTitle){
			var oDatatype = {"condName": "借贷账户", "FstCol": 2, "SecCol": null};
			lData = fnArrayOfAccount(lData);
			$("#datatable").DataTable.ext.oApi.fnSetConditions(lData, oDatatype);
			$("#tb_debt").attr("title", lTitle).attr("style", "display: block");
		} else {
			$("#datatable").DataTable.ext.oApi.fnDelConditions("借贷账户");
			$("#tb_debt").attr("style", "display: none");
		}
	});
	
	/*
	 * 时间选择菜单
	 */
	$("#sel_sother").click(function(){
		if(cur_popbtn && cur_pop){
			$(cur_popbtn).attr("style", "display: none");
			$(cur_pop).attr("style", "display: none");
		}
		cur_popbtn = "#sel_hother";
		cur_pop = "#ac_popother";
		hiden_pop = false;
		
		popn_pos = $("#sel_sother").position();
		$("#sel_hother").attr("style", "display: block; left:"+popn_pos.left+"px; top:"+popn_pos.top+"px;");
		popn_pos.top = popn_pos.top + 22;
		$("#ac_popother").attr("style", "display: block; left:"+popn_pos.left+"px; top:"+popn_pos.top+"px; padding-top:8px;");
	});
	
	$("#sel_hother").click(function(){
		$("#sel_hother").attr("style", "display: none");
		$("#ac_popother").attr("style", "display: none");
		cur_popbtn = cur_pop = null;
	});

	function dateFormat(date, separate) {
		var month = parseInt(date.getMonth()) + 1;
		return date.getFullYear() + separate + month + separate + date.getDate();
	}
	
	/**
	 * 解决在IE7和IE8下用new Date()加参数会无法转化，返回NAN的数据
	 */
	function parseISO8601(dateStringInRange) {
		var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/,
		date = new Date(NaN), month,
		parts = isoExp.exec(dateStringInRange);
		
		if(parts) {
			month = +parts[2];
			date.setFullYear(parts[1], month - 1, parts[3]);
			if(month != date.getMonth() + 1) {
				date.setTime(NaN);
			}
		}
		return date;
	}
	
	$("#btn_date").click(function(){
		var bdate = null, edate = null;
		if($("#bdate").val())
			bdate = parseISO8601($("#bdate").val());
		if($("#edate").val())
			edate = parseISO8601($("#edate").val());

		if(bdate && edate && (bdate > edate)){
			alert("错误提示：开始时间不能大于结束时间！");
			return;
		}
		
		$("#sel_hother").attr("style", "display: none");
		$("#ac_popother").attr("style", "display: none");
		cur_popbtn = cur_pop = null;
		if(!bdate && !edate) return;
		
		var str, ajaxparam; 
		if(!bdate){
			str = "<strong>~</strong> — " + dateFormat(edate, ".");
			ajaxparam = "bTime=-&eTime=" + dateFormat(edate, "-");
		} else if(!edate) {
			str = dateFormat(bdate, ".") + " — <strong>~</strong>";
			ajaxparam = "bTime=" + dateFormat(bdate, "-") + "&eTime=-";
		} else {
			str = dateFormat(bdate, ".") + " — " + dateFormat(edate, ".");
			ajaxparam = "bTime=" + dateFormat(bdate, "-") + "&eTime=" + dateFormat(edate, "-");
		}
		$("#a_popmenu").html("<strong>条&nbsp;件&nbsp;</strong>");
		if(ajaxparam != $("#tb_time1").attr("data")) {
			$("#tb_time1").html(str).attr("tab_time", "use").attr("title", "关闭").attr("data", ajaxparam);
			$("#datatable").DataTable.ext.oApi.fnAjaxSetParam(ajaxparam);
		}
	});
	
	/**
	 * @time_id	 子菜单消失定时器
	 * @div_id   子菜单ID
	 * @li_id    子菜单对应的上级选项
	 */
	var time_id = div_id = null, li_id;
	/*
	 * 一级菜单的单击
	 */
	$("[ac_pop]").each(function(){
		$(this).click(function(){
			hiden_pop = false;	//在之后的document接受单击信号时不删除菜单
		});
	});
	/*
	 * “全部”选项的移入、移出、单击
	 */
	$("[a_ulid]").each(function(){
		$(this).mouseenter(function() {
			var a_clsid = $(this).attr("a_clsid");
			var a_hclsid = parseInt(a_clsid) + 3;
			$(this).removeClass("selimg_"+a_clsid).addClass("ac_ahover selimg_"+a_hclsid);
		});

		$(this).mouseleave(function() {
			var a_clsid = $(this).attr("a_clsid");
			var a_hclsid = parseInt(a_clsid) + 3;
			$(this).addClass("selimg_"+a_clsid).removeClass("ac_ahover selimg_"+a_hclsid);
		});
		
		$(this).click(function() {
			var ul_id = $(this).attr("a_ulid");
			var a_clsid = $(this).attr("a_clsid");
			if(a_clsid == "0") {
				$(this).attr("a_clsid", 2);
				$(this).addClass("selimg_5").removeClass("selimg_3");
				$("#"+ul_id+" > li").each(function(){
					$("a", this).addClass("selimg_2").removeClass("selimg_0");
					var sum = $(this).attr("count");
					$(this).attr("sum", sum);
					$(this).attr("a_clsid", 2);
					var child_ul =$("#"+$(this).attr("div_id")).attr("div_ulid");
					$("#"+child_ul+" > li").each(function(){
						$(this).attr("a_clsid", 2);
						$("a", this).addClass("selimg_2").removeClass("selimg_0");
					});
				});
				var sum = $("#"+ul_id).attr("count");
				$("#"+ul_id).attr("sum", sum);
			} else if (a_clsid == "2") {
				$(this).attr("a_clsid", 0);
				$(this).addClass("selimg_3").removeClass("selimg_5");
				$("#"+ul_id+" > li").each(function(){
					$("a", this).addClass("selimg_0").removeClass("selimg_2");
					$(this).attr("sum", 0);
					$(this).attr("a_clsid", 0);
					var child_ul =$("#"+$(this).attr("div_id")).attr("div_ulid");
					$("#"+child_ul+" > li").each(function(){
						$(this).attr("a_clsid", 0);
						$("a", this).addClass("selimg_0").removeClass("selimg_2");
					});
				});
				$("#"+ul_id).attr("sum", 0);
			}
		});
	});
	/*
	 * 一级菜单选项的移入、移开、单击
	 */
	$("[ul_aid] > li").each(function(){
		$(this).mouseenter(function() {
			if(time_id && div_id){	//隐藏上个子菜单
				clearTimeout(time_id);
				$("#"+div_id).attr("style", "display: none");
				div_id = null;
				time_id = null;
			}
			li_id = this;
			var a_clsid = $(this).attr("a_clsid");
			var a_hclsid = parseInt(a_clsid) + 3;
			if($(this).attr("count") != "0") {			//有子菜单的判断
				$(this).addClass("selimg_harrow");
				div_id = $(this).attr("div_id");
				var pos = $(this).position();
				pos.top = parseFloat(popn_pos.top) + parseFloat(pos.top);
				pos.left = popn_width + 5 + popn_pos.left;
				$("#"+div_id).attr("style", "display: block; left:"+pos.left+"px; top:"+pos.top+"px;");
			}
			$("a", this).removeClass("selimg_"+a_clsid).addClass("ac_ahover selimg_"+a_hclsid);
		});
	
		$(this).mouseleave(function() {
			var a_clsid = $(this).attr("a_clsid");
			var a_hclsid = parseInt(a_clsid) + 3;
			if($(this).attr("count") != "0") {
				$(this).removeClass("selimg_harrow");
				time_id = setTimeout(function() {
					jQuery("#"+div_id).attr("style", "display: none");
					time_id = null;
					div_id = null;
				}, 150);
			}
			$("a", this).addClass("selimg_"+a_clsid).removeClass("ac_ahover selimg_"+a_hclsid);
		});
		
		$(this).click(function(){
			var a_clsid = $(this).attr("a_clsid");
			var count = $(this).attr("count");
			if(count == "0"){
				if(a_clsid == "2"){
					var parent = $(this).parent();
					var sum = parent.attr("sum");
					var a_id = parent.attr("ul_aid");
					if(sum == parent.attr("count")) {
						$("#"+a_id).attr("a_clsid", 0).addClass("selimg_0").removeClass("selimg_2");
					}
					sum--;
					parent.attr("sum", sum);
					$(this).attr("sum", 0);
					$(this).attr("a_clsid", 0);
					$("a", this).addClass("selimg_3").removeClass("selimg_5");
				} else {
					var parent = $(this).parent();
					var sum = parent.attr("sum");
					sum++;
					parent.attr("sum", sum);
					var a_id = parent.attr("ul_aid");
					if(sum == parent.attr("count")) {
						$("#"+a_id).attr("a_clsid", 2).addClass("selimg_2").removeClass("selimg_0");
					}
					$(this).attr("sum", 1);
					$(this).attr("a_clsid", 2);
					$("a", this).addClass("selimg_5").removeClass("selimg_3");
				}
			} else {
				if(a_clsid == "2"){
					$("a", this).addClass("selimg_3").removeClass("selimg_5");
					$(this).attr("sum", 0);
					$(this).attr("a_clsid", 0);
					var child_ul = $("#"+div_id).attr("div_ulid");
					$("#"+child_ul+" > li").each(function(){
						$(this).attr("a_clsid", 0);
						$("a", this).addClass("selimg_0").removeClass("selimg_2");
					});
					var parent = $(this).parent();
					var sum = parent.attr("sum");
					var a_id = parent.attr("ul_aid");
					if(sum == parent.attr("count")) {
						$("#"+a_id).attr("a_clsid", 0).addClass("selimg_0").removeClass("selimg_2");
					}
					sum--;
					parent.attr("sum", sum);
				} else {
					$("a", this).addClass("selimg_5").removeClass("selimg_3 selimg_4");
					$(this).attr("sum", count);
					$(this).attr("a_clsid", 2);
					var child_ul = $("#"+div_id).attr("div_ulid");
					$("#"+child_ul+" > li").each(function(){
						$(this).attr("a_clsid", 2);
						$("a", this).addClass("selimg_2").removeClass("selimg_0");
					});
					var parent = $(this).parent();
					var sum = parent.attr("sum");
					var a_id = parent.attr("ul_aid");
					sum++;
					parent.attr("sum", sum);
					if(sum == parent.attr("count")) {
						$("#"+a_id).attr("a_clsid", 2).addClass("selimg_2").removeClass("selimg_0");
					}
				}
			}
		});
	});
	
	/*
	 * 子菜单的移入、移出、单击
	 */
	$("[div_ulid]").each(function(){
		$(this).mouseenter(function() {
			if(time_id){
				clearTimeout(time_id);
				time_id = null;
			}
			if(li_id){
				$(li_id).addClass("selimg_harrow");
				var a_clsid = $(li_id).attr("a_clsid");
				var a_hclsid = parseInt(a_clsid) + 3;
				$("a", li_id).removeClass("selimg_"+a_clsid).addClass("ac_ahover selimg_"+a_hclsid);
			}
		});

		$(this).mouseleave(function() {
			$(this).attr("style", "display: none");
			if(li_id){
				$(li_id).removeClass("selimg_harrow");
				var a_clsid = $(li_id).attr("a_clsid");
				var a_hclsid = parseInt(a_clsid) + 3;
				$("a", li_id).addClass("selimg_"+a_clsid).removeClass("ac_ahover selimg_"+a_hclsid);
				li_id = null;
				divid = null;
			}
		});
		
		$(this).click(function(){
			hiden_pop = false;
		});
	});
	
	/*
	 * 子菜单的选项的移入、移出、单击
	 */
	$("[popn='div_ul'] > li").each(function(){
		$(this).mouseenter(function() {
			var a_clsid = $(this).attr("a_clsid");
			var a_hclsid = parseInt(a_clsid) + 3;
			$("a", this).addClass("ac_ahover selimg_"+a_hclsid).removeClass("selimg_"+a_clsid);
		});

		$(this).mouseleave(function() {
			var a_clsid = $(this).attr("a_clsid");
			var a_hclsid = parseInt(a_clsid) + 3;
			$("a", this).addClass("selimg_"+a_clsid).removeClass("ac_ahover selimg_"+a_hclsid);
		});
		
		$(this).click(function(){
			var a_clsid = $(this).attr("a_clsid");
			var li_parent = $(li_id).parent();
			var a_id = li_parent.attr("ul_aid");
			var sum = li_parent.attr("sum");
			var count = li_parent.attr("count");
			if(li_id){
				var tmp = $(li_id).attr("sum");
				if(a_clsid == "0") {
					tmp++;
					if (tmp == $(li_id).attr("count")) {
						sum++;
						if(sum == count) {
							$("#"+a_id).addClass("selimg_2").removeClass("selimg_0").attr("a_clsid", 2);
						}
						li_parent.attr("sum", sum);
						$("a", li_id).addClass("selimg_5").removeClass("selimg_3 selimg_4");
						$(li_id).attr("a_clsid", 2);
					} else {
						$("a", li_id).addClass("selimg_4").removeClass("selimg_3 selimg_5");
						$(li_id).attr("a_clsid", 1);
					}
					$("a", this).addClass("selimg_5").removeClass("selimg_3");
					$(this).attr("a_clsid", 2);
				} else if(a_clsid == "2") {
					tmp--;
					if($(li_id).attr("sum") == $(li_id).attr("count")) {
						if(sum == count)
							$("#"+a_id).attr("a_clsid", 0).addClass("selimg_0").removeClass("selimg_2");
						sum--;
						li_parent.attr("sum", sum);
					}
					if(tmp == 0){
						$("a", li_id).addClass("selimg_3").removeClass("selimg_4 selimg_5");
						$(li_id).attr("a_clsid", 0);
					} else {
						$("a", li_id).addClass("selimg_4").removeClass("selimg_3 selimg_5");
						$(li_id).attr("a_clsid", 1);
					}
					$("a", this).addClass("selimg_3").removeClass("selimg_5");
					$(this).attr("a_clsid", 0);
				}
				$(li_id).attr("sum", tmp);
			}
		});
	});
	
});
