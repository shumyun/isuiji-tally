/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-02-19
 *    Author: shumyun
 *    Copyright (C) 2011 - forever jiashe.net Inc
 */

jQuery.noConflict();

jQuery(document).ready(function($) {
	  $("#li_popmenu").click(function() {
	    $("#li_popmenu").toggleClass("ac_showm ac_hidem");
	  });
});