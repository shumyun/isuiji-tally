/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-02-26
 *    Author: shumyun
 *    Copyright (C) 2011 - forever jiashe.net Inc
 */

jQuery.noConflict();


/*
 * 时间选择控件
 */
jQuery(document).ready(function($) {
	var pop_time1 = $('<div class="p_pop ac_li"><ul><li>最近一个月</li><li>上一个月</li><li>最近一年</li><li>按月份查询</li></ul></div>')
	.appendTo("body")
	.position({
		my: "left top",
		at: "left bottom",
		of: $("#li_popmenu"),
		offset: "0 2"
	}).hide();
	
	$(document).click(function(e){
		if( !pop_time1.is(":hidden") && e.target.id != "li_popmenu" && e.target.id != "a_popmenu") {
			$("#li_popmenu").click();
		}
	});
	
	$("#li_popmenu").click(function() {
		$("#li_popmenu").toggleClass("ac_showm li_hidem");
		if(pop_time1.is(":hidden")){
			$("#a_time").attr("style", "border-bottom-color: #CDCDCD;");
			pop_time1.show();
		} else {
			$("#a_time").attr("style", "border-bottom-color: #fff;");
			pop_time1.hide();
		}
	});
	
	var popn_pos;
	$("#sel_shown").click(function(){
		popn_pos = $("#sel_shown").position();
		$("#sel_hiden").attr("style", "display: block; left:"+popn_pos.left+"px; top:"+popn_pos.top+"px;");
		popn_pos.top = popn_pos.top + 22;
		$("#ac_popn").attr("style", "display: block; left:"+popn_pos.left+"px; top:"+popn_pos.top+"px;");
	});
	
	$("#sel_hiden").click(function(){
		$("#sel_hiden").attr("style", "display: none");
		$("#ac_popn").attr("style", "display: none");
	});
	

	$("#ul_popn > li").each(function(){
		$(this).mouseenter(function() {
			var a_clsid = $(this).attr("a_clsid");
			var a_hclsid = parseInt(a_clsid) + 3;
			$(this).attr("a_clsid", a_hclsid);
			if($(this).hasClass("selimg_arrow")) {
				$(this).toggleClass("selimg_harrow");
				var divid = $(this).attr("div_id");
				var pos = $(this).position();
				pos.top = parseFloat(popn_pos.top) + parseFloat(pos.top);
				pos.left = $("#ac_popn").width() + 5 + popn_pos.left;
				$("#"+divid).attr("style", "display: block; left:"+pos.left+"px; top:"+pos.top+"px;");
			}
			$("a", this).toggleClass("ac_ahover selimg_"+a_clsid+" selimg_"+a_hclsid);
		});
	
		$(this).mouseleave(function() {
			var a_clsid = $(this).attr("a_clsid");
			var a_hclsid = parseInt(a_clsid) - 3;
			$(this).attr("a_clsid", a_hclsid);
			if($(this).hasClass("selimg_arrow")) {
				$(this).toggleClass("selimg_harrow");
				var divid = $(this).attr("div_id");
				$("#"+divid).mouseenter();
				/*
				$("#"+divid).attr("style", "display: none");*/
			}
			$("a", this).toggleClass("ac_ahover selimg_"+a_clsid+" selimg_"+a_hclsid);
		});
	});
	
	$("[popn='div']").each(function(){
		$(this).mouseenter(function() {
		});

		$(this).mouseleave(function() {
			$(this).attr("style", "display: none");
		});
	});
	
	$("[popn='div_ul'] > li").each(function(){
		$(this).mouseenter(function() {
			var a_clsid = $(this).attr("a_clsid");
			var a_hclsid = parseInt(a_clsid) + 3;
			$(this).attr("a_clsid", a_hclsid);
			$("a", this).toggleClass("ac_ahover selimg_"+a_clsid+" selimg_"+a_hclsid);
		});

		$(this).mouseleave(function() {
			var a_clsid = $(this).attr("a_clsid");
			var a_hclsid = parseInt(a_clsid) - 3;
			$(this).attr("a_clsid", a_hclsid);
			$("a", this).toggleClass("ac_ahover selimg_"+a_clsid+" selimg_"+a_hclsid);
		});
	});
	
});
