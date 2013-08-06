/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-08-06
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */

var func_prevm = function(imonth, sel=0) {
	if(imonth <= 0) {
		if(sel) jQuery("#tally_year").val(parseInt(jQuery("#tally_year").val())-1);
		return imonth+12;
	} else return imonth;
};

var func_nextm = function(imonth, sel=0) {
	if(imonth > 12) {
		if(sel) jQuery("#tally_year").val(parseInt(jQuery("#tally_year").val())+1);
		return imonth-12;
	} else return imonth;
};

var g_imonth = 0;

jQuery(document).ready(function($) {
	$("#prev_year").click(function(){
		$("#tally_year").val(parseInt($("#tally_year").val())-1);
	});
	
	$("#next_year").click(function(){
		$("#tally_year").val(parseInt($("#tally_year").val())+1);
	});
	
	g_imonth = parseInt($("#a_m3").html());
	$("#a_m1").html(func_prevm(g_imonth-2)+"月");
	$("#a_m2").html(func_prevm(g_imonth-1)+"月");
	$("#a_m4").html(func_nextm(g_imonth+1)+"月");
	$("#a_m5").html(func_nextm(g_imonth+2)+"月");
	
	$("#prev_month").click(function(){
		$("li.acb_mli > a[class!='acb_msel']").each(function(){
			$(this).html(func_prevm(parseInt($(this).html())-1)+"月");
		});
		g_imonth = func_prevm(g_imonth-1, 1);
		$("a.acb_msel").html(g_imonth+"月");
	});
	
	$("#next_month").click(function(){
		$("li.acb_mli > a[class!='acb_msel']").each(function(){
			$(this).html(func_nextm(parseInt($(this).html())+1)+"月");
		});
		g_imonth = func_nextm(g_imonth+1, 1);
		$("a.acb_msel").html(g_imonth+"月");
	});

	$("li.acb_mli > a").each(function(){
		$(this).click(function(){
			if(!$(this).hasClass("acb_msel")) {
				$("a.acb_msel").removeClass("acb_msel");
				$(this).addClass("acb_msel");
				var tmp = parseInt($(this).html()) - g_imonth;
				if(tmp < -5) $("#next_year").click();
				else if(tmp > 5) $("#prev_year").click();
				g_imonth += tmp;
			}
		});
	});
	
});

(function($, window, document, undefined) {
	$.fn.budgetTable = function() {
		;
	};
}(jQuery, window, document, undefined));

jQuery(document).ready(function($){
	
});