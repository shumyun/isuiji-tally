/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-02-27
 *    Author: shumyun
 *    Copyright (C) 2011 - forever jiashe.net Inc
 */

jQuery.noConflict();


/*
 * 时间选择控件
 */
jQuery(document).ready(function($) {
	
	/*
	 * 顶头显示时间选项
	 */
	var pop_time1 = $('<div class="p_pop ac_li"><ul><li>最近一个月</li><li>上一个月</li><li>最近一年</li><li>按月份查询</li></ul></div>')
	.appendTo("body")
	.position({
		my: "left top",
		at: "left bottom",
		of: $("#li_popmenu"),
		offset: "0 2"
	}).hide();
	
	$(document).click(function(e){
		if( !pop_time1.is(":hidden") && e.target.id != "li_popmenu" && e.target.id != "a_popmenu") {
			$("#li_popmenu").click();
		}
	});
	
	$("#li_popmenu").click(function() {
		$("#li_popmenu").toggleClass("ac_showm li_hidem");
		if(pop_time1.is(":hidden")){
			$("#a_time").attr("style", "border-bottom-color: #CDCDCD;");
			pop_time1.show();
		} else {
			$("#a_time").attr("style", "border-bottom-color: #fff;");
			pop_time1.hide();
		}
	});
	
	var popn_pos;
	$("#sel_shown").click(function(){
		popn_pos = $("#sel_shown").position();
		$("#sel_hiden").attr("style", "display: block; left:"+popn_pos.left+"px; top:"+popn_pos.top+"px;");
		popn_pos.top = popn_pos.top + 22;
		$("#ac_popn").attr("style", "display: block; left:"+popn_pos.left+"px; top:"+popn_pos.top+"px;");
	});
	
	$("#sel_hiden").click(function(){
		$("#sel_hiden").attr("style", "display: none");
		$("#ac_popn").attr("style", "display: none");
	});
	
	/*
	 * time_id	子菜单消失定时器
	 * div_id   子菜单ID
	 * li_id    子菜单对应的上级选项
	 */
	var time_id = div_id = null, li_id;
	/*
	 * 一级菜单的移入、移开、单击
	 */
	$("#ul_popn > li").each(function(){
		$(this).mouseenter(function() {
			if(time_id && div_id){	//隐藏上个子菜单
				clearTimeout(time_id);
				$("#"+div_id).attr("style", "display: none");
				div_id = null;
				time_id = null;
			}
			li_id = this;
			var a_clsid = $(this).attr("a_clsid");
			var a_hclsid = parseInt(a_clsid) + 3;
			if($(this).attr("count") != "0") {			//有子菜单的判断
				$(this).addClass("selimg_harrow");
				div_id = $(this).attr("div_id");
				var pos = $(this).position();
				pos.top = parseFloat(popn_pos.top) + parseFloat(pos.top);
				pos.left = $("#ac_popn").width() + 5 + popn_pos.left;
				$("#"+div_id).attr("style", "display: block; left:"+pos.left+"px; top:"+pos.top+"px;");
			}
			$("a", this).removeClass("selimg_"+a_clsid).addClass("ac_ahover selimg_"+a_hclsid);
		});
	
		$(this).mouseleave(function() {
			var a_clsid = $(this).attr("a_clsid");
			var a_hclsid = parseInt(a_clsid) + 3;
			if($(this).attr("count") != "0") {
				$(this).removeClass("selimg_harrow");
				time_id = setTimeout(function() {
					jQuery("#"+div_id).attr("style", "display: none");
					time_id = null;
					div_id = null;
				}, 150);
			}
			$("a", this).addClass("selimg_"+a_clsid).removeClass("ac_ahover selimg_"+a_hclsid);
		});
		
		$(this).click(function(){
			var a_clsid = $(this).attr("a_clsid");
			var count = $(this).attr("count");
			if(count == "0"){
				if(a_clsid == "2"){
					$("a", this).addClass("selimg_3").removeClass("selimg_5");
					$(this).attr("sum", 0);
					$(this).attr("a_clsid", 0);
				} else {
					$("a", this).addClass("selimg_5").removeClass("selimg_3");
					$(this).attr("sum", 1);
					$(this).attr("a_clsid", 2);
				}
			} else {
				if(a_clsid == "2"){
					$("a", this).addClass("selimg_3").removeClass("selimg_5");
					$(this).attr("sum", 0);
					$(this).attr("a_clsid", 0);
					$("#"+div_id+" > ul > li").each(function(){
						$(this).attr("a_clsid", 0);
						$("a", this).addClass("selimg_0").removeClass("selimg_2");
					});
				} else {
					$("a", this).addClass("selimg_5").removeClass("selimg_3 selimg_4");
					$(this).attr("sum", count);
					$(this).attr("a_clsid", 2);
					$("#"+div_id+" > ul > li").each(function(){
						$(this).attr("a_clsid", 2);
						$("a", this).addClass("selimg_2").removeClass("selimg_0");
					});
				}
			}
		});
	});
	
	/*
	 * 子菜单的移入、移出
	 */
	$("[popn='div']").each(function(){
		$(this).mouseenter(function() {
			if(time_id){
				clearTimeout(time_id);
				time_id = null;
			}
			if(li_id){
				$(li_id).addClass("selimg_harrow");
				var a_clsid = $(li_id).attr("a_clsid");
				var a_hclsid = parseInt(a_clsid) + 3;
				$("a", li_id).removeClass("selimg_"+a_clsid).addClass("ac_ahover selimg_"+a_hclsid);
			}
		});

		$(this).mouseleave(function() {
			$(this).attr("style", "display: none");
			if(li_id){
				$(li_id).removeClass("selimg_harrow");
				var a_clsid = $(li_id).attr("a_clsid");
				var a_hclsid = parseInt(a_clsid) + 3;
				$("a", li_id).addClass("selimg_"+a_clsid).removeClass("ac_ahover selimg_"+a_hclsid);
				li_id = null;
				divid = null;
			}
		});
	});
	
	/*
	 * 子菜单的选项的移入、移出、单击
	 */
	$("[popn='div_ul'] > li").each(function(){
		$(this).mouseenter(function() {
			var a_clsid = $(this).attr("a_clsid");
			var a_hclsid = parseInt(a_clsid) + 3;
			$("a", this).addClass("ac_ahover selimg_"+a_hclsid).removeClass("selimg_"+a_clsid);
		});

		$(this).mouseleave(function() {
			var a_clsid = $(this).attr("a_clsid");
			var a_hclsid = parseInt(a_clsid) + 3;
			$("a", this).addClass("selimg_"+a_clsid).removeClass("ac_ahover selimg_"+a_hclsid);
		});
		
		$(this).click(function(){
			var a_clsid = $(this).attr("a_clsid");
			if(li_id){
				var tmp = $(li_id).attr("sum");
				if(a_clsid == "0") {
					$("a", this).addClass("selimg_5").removeClass("selimg_3");
					$(this).attr("a_clsid", 2);
					tmp++;
				} else if(a_clsid == "2") {
					$("a", this).addClass("selimg_3").removeClass("selimg_5");
					$(this).attr("a_clsid", 0);
					tmp--;
				}
				$(li_id).attr("sum", tmp);
				if(tmp == 0){
					$("a", li_id).addClass("selimg_3").removeClass("selimg_4 selimg_5");
					$(li_id).attr("a_clsid", 0);
				} else if (tmp == $(li_id).attr("count")) {
					$("a", li_id).addClass("selimg_5").removeClass("selimg_3 selimg_4");
					$(li_id).attr("a_clsid", 2);
				} else {
					$("a", li_id).addClass("selimg_4").removeClass("selimg_3 selimg_5");
					$(li_id).attr("a_clsid", 1);
				}
			}
		});
	});
	
});
