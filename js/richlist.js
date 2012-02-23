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
	// z-index:301;
	ac_ajax = $('<div class="p_pop" style="position: absolute; border-top: none;">1</div>')
	.appendTo("body")
	.position({
		my: "left top",
		at: "left bottom",
		of: $("#li_popmenu"),
		offset: "0 2"
	}).hide();
	
	$(document).click(function(e){
		if( !ac_ajax.is(":hidden") && e.target.id != "a_popmenu") {
			$("#a_popmenu").click();
		}
	});
	
	$("#a_popmenu").click(function() {
		$("#li_popmenu").toggleClass("ac_showm ac_hidem");
		if(ac_ajax.is(":hidden")){
			$("#a_time").attr("style", "border-bottom-color: #CDCDCD;");
			ac_ajax.show();
		} else {
			$("#a_time").attr("style", "border-bottom-color: #fff;");
			ac_ajax.hide();
		}
	});
	
	
});