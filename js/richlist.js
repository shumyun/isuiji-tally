/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-02-23
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
	
	$("#sel_shown").click(function(){
		var pos = $("#sel_shown").position();
		$("#sel_hiden").attr("style", "display: block; left:"+pos.left+"px; top:"+pos.top+"px;");
		var tmp = pos.top + 22;
		$("#ac_popn").attr("style", "display: block; left:"+pos.left+"px; top:"+tmp+"px;");
	});
	
	$("#sel_hiden").click(function(){
		$("#sel_hiden").attr("style", "display: none");
		$("#ac_popn").attr("style", "display: none");
	});
	
});