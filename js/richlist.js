/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-02-22
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
	
	$("#a_popmenu").toggle(
		function() {ac_ajax.show();},
		function() {ac_ajax.hide();}
	);
	
	$("#a_popmenu").click(function() {
		$("#li_popmenu").toggleClass("ac_showm ac_hidem");
		if($("#li_popmenu").hasClass("ac_hidem")) {
			$("#a_time").attr("style", "border-bottom-color: #CDCDCD;");
		} else {
			$("#a_time").attr("style", "border-bottom-color: #fff;");
		}
	});
	
	$(document).click(function(e){
		alert(e.target.id);
	});
});