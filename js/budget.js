/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2014-01-25
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */
jQuery.noConflict(); //discuz 使用了'$'符号

var func_prevm = function(imonth, sdom) {
	var sel = arguments[2] ? arguments[2] : false;
	var iyear = parseInt(jQuery(sdom).attr("year"));
	if(imonth <= 0) {
		if(sel)	jQuery("#tally_year").val(parseInt(jQuery("#tally_year").val())-1);
		iyear -= 1;
		jQuery(sdom).attr("year", iyear);
		imonth += 12;
	}
	itime = iyear*100+imonth;
	if(itime > g_itime)
		jQuery(sdom).attr("style", "color:#b5b5b5");
	else 
		jQuery(sdom).attr("style", "");
	return imonth;
};

var func_nextm = function(imonth, sdom) {
	var sel = arguments[2] ? arguments[2] : false;
	var iyear = parseInt(jQuery(sdom).attr("year"));
	if(imonth > 12) {
		if(sel) jQuery("#tally_year").val(parseInt(jQuery("#tally_year").val())+1);
		iyear += 1;
		jQuery(sdom).attr("year", iyear);
		imonth -= 12;
	}
	itime = iyear*100+imonth;
	if(itime > g_itime)
		jQuery(sdom).attr("style", "color:#b5b5b5");
	else 
		jQuery(sdom).attr("style", "");
	return imonth;
};

var g_imonth = 0;
var g_itime = 0;	// 当月的时间
jQuery(document).ready(function($) {
	
	g_itime = $("#tally_year").val()*100+parseInt($("#a_m3").html());
	var func_getdata = function() {
		var iyear = parseInt($("#tally_year").val());
		if(iyear*100+g_imonth < g_itime) {
			var dataobj = {"curstatus":"get", "year": iyear, "month": g_imonth};
			$.post("plugin.php?id=account:ajax&func=budget", $.param(dataobj),
			function(data) {
				if(data["支出"]){
					var paydata = data["支出"];
					for(x in paydata) {
						;
					}
				}
			}, "json");
		} else {
			;
		}
	};
	
	$("#prev_year").click(function(){
		$("#tally_year").val(parseInt($("#tally_year").val())-1);
		$("li.acb_mli > a").each(function(){
			var iyear = parseInt($(this).attr("year"))-1;
			$(this).attr("year", iyear);
			var itime = iyear*100+parseInt($(this).html());
			if(itime > g_itime)
				$(this).attr("style", "color:#b5b5b5");
			else 
				$(this).attr("style", "");
		});
	});
	
	$("#next_year").click(function(){
		$("#tally_year").val(parseInt($("#tally_year").val())+1);
		$("li.acb_mli > a").each(function(){
			var iyear = parseInt($(this).attr("year"))+1;
			$(this).attr("year", iyear);
			var itime = iyear*100+parseInt($(this).html());
			if(itime > g_itime)
				$(this).attr("style", "color:#b5b5b5");
			else 
				$(this).attr("style", "");
		});
	});
	
	g_imonth = parseInt($("#a_m3").html());
	$("#a_m1").html(func_prevm(g_imonth-2, "#a_m1")+"月");
	$("#a_m2").html(func_prevm(g_imonth-1, "#a_m2")+"月");
	$("#a_m4").html(func_nextm(g_imonth+1, "#a_m4")+"月");
	$("#a_m5").html(func_nextm(g_imonth+2, "#a_m5")+"月");
	
	$("#prev_month").click(function(){
		$("li.acb_mli > a[class!='acb_msel']").each(function(){
			$(this).html(func_prevm(parseInt($(this).html())-1, this)+"月");
		});
		g_imonth = func_prevm(g_imonth-1, "a.acb_msel", true);
		$("a.acb_msel").html(g_imonth+"月");
	});
	
	$("#next_month").click(function(){
		$("li.acb_mli > a[class!='acb_msel']").each(function(){
			$(this).html(func_nextm(parseInt($(this).html())+1, this)+"月");
		});
		g_imonth = func_nextm(g_imonth+1, "a.acb_msel", true);
		$("a.acb_msel").html(g_imonth+"月");
		func_getdata();
	});

	$("li.acb_mli > a").each(function(){
		$(this).click(function(){
			if(!$(this).hasClass("acb_msel")) {
				$("a.acb_msel").removeClass("acb_msel");
				$(this).addClass("acb_msel");
				var tmp = parseInt($(this).html()) - g_imonth;
				if(tmp < -5) $("#tally_year").val(parseInt($("#tally_year").val())+1);
				else if(tmp > 5) $("#tally_year").val(parseInt($("#tally_year").val())-1);
				g_imonth += tmp;
			}
		});
	});
	
	$("#a_pay").toggle(function(){
			$("[type='pay']").hide();
			$("img", this).attr("src", "static/image/common/collapsed_yes.gif");
		}, function(){
			$("[type='pay']").show();
			$("img", this).attr("src", "static/image/common/collapsed_no.gif");
	});
	
	$("#a_earn").toggle(
		function() {
			$("[type='earn']").hide("slow");
			$("img", this).attr("src", "static/image/common/collapsed_yes.gif");
		}, function() {
			$("[type='earn']").show("slow");
			$("img", this).attr("src", "static/image/common/collapsed_no.gif");
		}
	);
	
	$("[sname]").hover(
		function() {
			$(this).addClass("acb_table_tr_hover");
		}, function() {
			$(this).removeClass("acb_table_tr_hover");
		}
	);
	
	$("[children_id]").toggle(
		function() {
			$("#"+$(this).attr("children_id")).hide("slow");
			$("img", this).attr("src", "static/image/common/tree_plus.gif");
		}, function() {
			$("#"+$(this).attr("children_id")).show();
			$("img", this).attr("src", "static/image/common/tree_minus.gif");
		}
	);
	
	$("#copy_all").click(function(){
		$("#copy_pay").click();
		$("#copy_earn").click();
	});
	
	$("#copy_pay").click(function(){
		var parentdom = $(this).parents("tr");
		parentdom.nextAll("[type='pay'][sname]").each(function(){
			$("img[title='复制']", this).click();
		});
	});
	
	$("#copy_earn").click(function(){
		var parentdom = $(this).parents("tr");
		parentdom.nextAll("[type='earn'][sname]").each(function(){
			$("img[title='复制']", this).click();
		});
	});
	
	$("img[title='复制']").click(function(){
		var parentdom = $(this).parent();
		var dom = parentdom.prevAll(".acbt_td_2");
		if(dom.length) {
			var inum = dom.children("strong").html();
			parentdom.children("input").val(inum);
			
			var str = dom.prev().find("a").attr("children_id");
			$("img[title='复制']", $("#"+str)).click();
		} else {
			var inum = parentdom.prevAll(".acbt_td_22").children("strong").html();
			parentdom.children("input").val(inum);
		}
	});
});
/*
(function($, window, document, undefined) {
	$.fn.budgetTable = function() {
		$.post("plugin.php?id=account:ajax&func=budget", $.param(dataobj),
				function(data) {},"json");
	};
}(jQuery, window, document, undefined));

jQuery(document).ready(function($){
	;
});
*/
