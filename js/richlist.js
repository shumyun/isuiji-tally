/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-02-20
 *    Author: shumyun
 *    Copyright (C) 2011 - forever jiashe.net Inc
 */

jQuery.noConflict();

jQuery(document).ready(function($) {
	//
	ac_ajax = $('<div class="p_pop" style="position: absolute; z-index:301;">1</div>')
	.appendTo("body")
	.position({
		my: "left top",
		at: "left bottom",
		of: $("#li_popmenu"),
		offset: "0 0"
	}).hide();
	
	$("#li_popmenu").toggle(
		function() {ac_ajax.show();},
		function() {ac_ajax.hide();}
	);
	
	$("#li_popmenu").click(function() {
		$("#li_popmenu").toggleClass("ac_showm ac_hidem");
	});
});