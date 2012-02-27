/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-02-27
 *    Author: shumyun
 *    Copyright (C) 2011 - forever jiashe.net Inc
 */

jQuery.noConflict();


/*
 * 时间选择控件
 */
jQuery(document).ready(function($) {
	
	/*
	 * 顶头显示时间选项
	 */
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
	
	var time_id, divid, li_id;
	$("#ul_popn > li").each(function(){
		$(this).mouseenter(function() {
			li_id = this;
			var a_clsid = $(this).attr("a_clsid");
			var a_hclsid = parseInt(a_clsid) + 3;
			$(this).attr("a_clsid", a_hclsid);
			if($(this).hasClass("selimg_arrow")) {
				$(this).addClass("selimg_harrow");
				var divid = $(this).attr("div_id");
				var pos = $(this).position();
				pos.top = parseFloat(popn_pos.top) + parseFloat(pos.top);
				pos.left = $("#ac_popn").width() + 5 + popn_pos.left;
				$("#"+divid).attr("style", "display: block; left:"+pos.left+"px; top:"+pos.top+"px;");
			}
			$("a", this).removeClass("selimg_"+a_clsid);
			$("a", this).addClass("ac_ahover selimg_"+a_hclsid);
		});
	
		$(this).mouseleave(function() {
			var a_hclsid = $(this).attr("a_clsid");
			var a_clsid = parseInt(a_hclsid) - 3;
			$(this).attr("a_clsid", a_clsid);
			if($(this).hasClass("selimg_arrow")) {
				$(this).removeClass("selimg_harrow");
				if(time_id){
					clearTimeout(time_id);
					$("#"+divid).attr("style", "display: none");
				}
				time_id = setTimeout(function() {
					jQuery("#"+divid).attr("style", "display: none");
					time_id = null;
				}, 150);
				divid = $(this).attr("div_id");
			}
			$("a", this).addClass("selimg_"+a_clsid);
			$("a", this).removeClass("ac_ahover selimg_"+a_hclsid);
		});
	});
	
	$("[popn='div']").each(function(){
		$(this).mouseenter(function() {
			if(time_id){
				clearTimeout(time_id);
				time_id = null;
			}
			if(li_id){
				$(li_id).addClass("selimg_harrow");
				var a_clsid = $(li_id).attr("a_clsid");
				var a_hclsid = parseInt(a_clsid) + 3;
				$("a", li_id).removeClass("selimg_"+a_clsid);
				$("a", li_id).addClass("ac_ahover selimg_"+a_hclsid);
			}
		});

		$(this).mouseleave(function() {
			$(this).attr("style", "display: none");
			if(li_id){
				$(li_id).removeClass("selimg_harrow");
				var a_clsid = $(li_id).attr("a_clsid");
				var a_hclsid = parseInt(a_clsid) + 3;
				$("a", li_id).addClass("selimg_"+a_clsid);
				$("a", li_id).removeClass("ac_ahover selimg_"+a_hclsid);
				li_id = null;
			}
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
		
		$(this).click(function(){
			$("a", this).toggleClass("selimg_3 selimg_5");
			var a_clsid = $(this).attr("a_clsid");
			$(this).attr("a_clsid", (a_clsid-1)%4+3);
		});
	});
	
});
