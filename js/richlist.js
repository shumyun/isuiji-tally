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
	var sel_time1 = $('<div class="p_pop ac_li" style="position: absolute; border-top: none;">\
					<ul>\
						<li>最近一个月</li><li>上一个月</li><li>最近一年</li><li>按月份查询</li>\
					</ul></div>')
	.appendTo("body")
	.position({
		my: "left top",
		at: "left bottom",
		of: $("#li_popmenu"),
		offset: "0 2"
	}).hide();
	
	$(document).click(function(e){
		if( !sel_time1.is(":hidden") && e.target.id != "li_popmenu" && e.target.id != "a_popmenu") {
			$("#li_popmenu").click();
		}
	});
	
	$("#li_popmenu").click(function() {
		$("#li_popmenu").toggleClass("ac_showm ac_hidem");
		if(sel_time1.is(":hidden")){
			$("#a_time").attr("style", "border-bottom-color: #CDCDCD;");
			sel_time1.show();
		} else {
			$("#a_time").attr("style", "border-bottom-color: #fff;");
			sel_time1.hide();
		}
	});

	var btn_name = $('<div class="ac_sel ac_hidem" style="position: absolute; z-index:101;"><a>账单分类</a></div>')
	.appendTo("body")
	.position({
		my: "center center",
		at: "center center",
		of: $("#sel_name")
	}).hide();
	
	var sel_name = $('<div class="p_pop ac_li" style="position: absolute;">\
			<ul>\
				<li>最近一个月</li><li>上一个月</li><li>最近一年</li><li>按月份查询</li>\
			</ul></div>')
	.appendTo("body").hide();
	
	$("#sel_name").click(function(){
		btn_name.show();
		sel_name.position({
			my: "left top",
			at: "left bottom",
			of: btn_name,
			offset: "0 -1"
		}).show();
	});
});