/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-02-04
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */
jQuery.noConflict();

/*
 * 修改窗口
 */
jQuery(document).ready(function($) {
	$("#richnum").calculator();
	
	$("#ac_dmodify").detach().appendTo("body").position({
		my: "center center",
		at: "center center",
		of: $("body"),
		offset: "0 -50"
	});
	$("#h3_move").mousedown(function(e){
		dragMenu($("#ac_dmodify")[0], e, 1);
	});
	$("#modify_aclose").click(function(){
		$("#ac_dmodify").hide();
	});
});
