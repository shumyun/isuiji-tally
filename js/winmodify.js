/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-02-04
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */
jQuery.noConflict();

/*
 * 计算器
 */
jQuery(document).ready(function($) {
	$("#richnum").calculator();
	
	$("#win_dmodify").detach().appendTo("body").position({
		my: "center center",
		at: "center center",
		of: $("body"),
		offset: "0 -50"
	}).show();
	
});
