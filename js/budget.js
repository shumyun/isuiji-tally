/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-08-02
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */

var func_prevm = function(imonth, sel=0){
	if(imonth <= 0) {
		if(sel) jQuery("#tally_year").val(parseInt(jQuery("#tally_year").val())-1);
		return imonth+12;
	} else return imonth;
}

var func_nextm = function(imonth, sel=0){
	if(imonth > 12) {
		if(sel) jQuery("#tally_year").val(parseInt(jQuery("#tally_year").val())+1);
		return imonth-12;
	} else return imonth;
}

jQuery(document).ready(function($) {
	$("#prev_year").click(function(){
		$("#tally_year").val(parseInt($("#tally_year").val())-1);
	});
	
	$("#next_year").click(function(){
		$("#tally_year").val(parseInt($("#tally_year").val())+1);
	});
	
	var imonth = parseInt($("#a_m3").html());
	$("#a_m1").html(func_prevm(imonth-2)+"月");
	$("#a_m2").html(func_prevm(imonth-1)+"月");
	$("#a_m4").html(func_nextm(imonth+1)+"月");
	$("#a_m5").html(func_nextm(imonth+2)+"月");
	
	$("#prev_month").click(function(){
		$("#a_m1").html(func_prevm(parseInt($("#a_m1").html())-1)+"月");
		$("#a_m2").html(func_prevm(parseInt($("#a_m2").html())-1)+"月");
		$("#a_m3").html(func_prevm(parseInt($("#a_m3").html())-1, 1)+"月");
		$("#a_m4").html(func_prevm(parseInt($("#a_m4").html())-1)+"月");
		$("#a_m5").html(func_prevm(parseInt($("#a_m5").html())-1)+"月");
	});
	
	$("#next_month").click(function(){
		$("#a_m1").html(func_nextm(parseInt($("#a_m1").html())+1)+"月");
		$("#a_m2").html(func_nextm(parseInt($("#a_m2").html())+1)+"月");
		$("#a_m3").html(func_nextm(parseInt($("#a_m3").html())+1, 1)+"月");
		$("#a_m4").html(func_nextm(parseInt($("#a_m4").html())+1)+"月");
		$("#a_m5").html(func_nextm(parseInt($("#a_m5").html())+1)+"月");
	});
	
});