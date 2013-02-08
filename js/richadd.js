/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-02-08
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 *    未知错误使用已经到 3
 */
jQuery.noConflict();


/*
 * 二级菜单
 */
var acc_changehtml = function(cur, change) {
	curjquery = '#'+cur.replace(".", "\\.");
	jQuery(curjquery).parent().attr("curstatus", cur);
	jQuery(curjquery).attr("style", "cursor:auto").toggleClass("a");
	change = '#'+change.replace(".", "\\.");
	jQuery(change).attr("style", "cursor:pointer").toggleClass("a");
};


/*
 * 初始化数据
 * type	:	1	恢复 支出/收入页面
 *				2	恢复 转账页面
 *				3	恢复 借贷页面
 *         (4:负债, 5:借出, 6:还债, 7:收债)
 */
var set_default = function(type){
	
	var ac_date = new Date();
	jQuery("#richdate").val(ac_date.getFullYear()+'-'+(ac_date.getMonth()+1)+'-'+ac_date.getDate());
	jQuery("#richnum").val('');
	jQuery("#richcategory").val('');
	jQuery("#richname").val('');
	jQuery("#message").val('').blur();

	ac_setSelvalue("richtype");
	
	switch(type){
		case 1:
			jQuery("#l_1").html("账单日期：");
			jQuery("#l_2").html("账单名称：");
			jQuery("#richtype_out").hide();
			jQuery("#richname").show();
			jQuery("#richnamebtn").show();
			jQuery("#s_help").show();
			jQuery("#l_3").html("账单金额：");
			jQuery("#l_4").html("账单归属：");
			break;
			
		case 2:
			jQuery("#l_1").html("转账日期：");
			jQuery("#l_2").html("转出归属：");
			jQuery("#richname").hide();
			jQuery("#richnamebtn").hide();
			jQuery("#s_help").hide();
			jQuery("#richtype_out").show();
			jQuery("#l_3").html("转账金额：");
			jQuery("#l_4").html("转入归属：");
			break;
			
		case 3:
			jQuery("#richname").hide();
			jQuery("#richnamebtn").hide();
			jQuery("#s_help").hide();
			jQuery("#richtype_out").show();
			
		case 4:
			jQuery("#l_1").html("负债日期：");
			jQuery("#l_2").html("债权账户：");
			jQuery("#l_3").html("负债金额：");
			jQuery("#l_4").html("存入归属：");
			break;
			
		case 5:
			jQuery("#l_1").html("借出日期：");
			jQuery("#l_2").html("负债账户：");
			jQuery("#l_3").html("借出金额：");
			jQuery("#l_4").html("借出归属：");
			break;
			
		case 6:
			jQuery("#l_1").html("还债日期：");
			jQuery("#l_2").html("债权账户：");
			jQuery("#l_3").html("还债金额：");
			jQuery("#l_4").html("还债归属：");
			break;
			
		case 7:
			jQuery("#l_1").html("收债日期：");
			jQuery("#l_2").html("负债账户：");
			jQuery("#l_3").html("收债金额：");
			jQuery("#l_4").html("存入归属：");
			break;
			
		default:break;
	}
};

jQuery(document).ready(function($) {
	$("#li\\.pay").click(function() {
		var change = $(this).parent().attr("curstatus");
		if ("li\\.pay" != change){
			acc_changehtml("li.pay", change);
			$("#p\\.loandebt").slideUp();
			set_default(("li\\.earn" != change)?1:0);
			var aData = new Array();
			aData["pay"] = "richname";
			ajax_getdataparam(aData, false);
		}
	});
	
	$("#li\\.earn").click(function() {
		var change = $(this).parent().attr("curstatus");
		if ("li.earn" != change) {
			acc_changehtml("li.earn", change);
			$("#p\\.loandebt").slideUp();
			set_default(("li\\.pay" != change)?1:0);
			var aData = new Array();
			aData["earn"] = "richname";
			ajax_getdataparam(aData, false);
		}
	});
	
	$("#li\\.transfer").click(function() {
		var change = $(this).parent().attr("curstatus");
		if ("li.transfer" != change) {
			acc_changehtml("li.transfer", change);
			$("#p\\.loandebt").slideUp();
			set_default(2);
			var aData = new Array();
			aData["richtype_out"] = "richtype_out";
			ajax_getdataparam(aData, false);
		}
	});
	
	$("#li\\.loandebt").click(function() {
		var change = $(this).parent().attr("curstatus");
		if ("li.loandebt" != change) {
			acc_changehtml("li.loandebt", change);
			$("#p\\.loandebt").show("normal");
			set_default(3);
			change = $("#p\\.loandebt").attr("curstatus");
			if ("a.borrow" != change)
				acc_changehtml("a.borrow", change);
			var aData = new Array();
			aData["loan"] = "richtype_out";
			ajax_getdataparam(aData, false);
		}
	});
	
	/*
	 * 隶属 “借贷” 的二级菜单
	 */
	$("#a\\.borrow").click(function() {
		var change = $(this).parent().attr("curstatus");
		if ("a.borrow" != change) {
			acc_changehtml("a.borrow", change);
			set_default(4);
			var aData = new Array();
			aData["loan"] = "richtype_out";
			ajax_getdataparam(aData, false);
		}
	});

	$("#a\\.loan").click(function() {
		var change = $(this).parent().attr("curstatus");
		if ("a.loan" != change) {
			acc_changehtml("a.loan", change);
			set_default(5);
			var aData = new Array();
			aData["debt"] = "richtype_out";
			ajax_getdataparam(aData, false);
		}
	});

	$("#a\\.repay").click(function() {
		var change = $(this).parent().attr("curstatus");
		if ("a.repay" != change) {
			acc_changehtml("a.repay", change);
			set_default(6);
			var aData = new Array();
			aData["loan"] = "richtype_out";
			ajax_getdataparam(aData, false);
		}
	});

	$("#a\\.debt").click(function() {
		var change = $(this).parent().attr("curstatus");
		if ("a.debt" != change) {
			acc_changehtml("a.debt", change);
			set_default(7);
			var aData = new Array();
			aData["debt"] = "richtype_out";
			ajax_getdataparam(aData, false);
		}
	});
});

/*
 * ajax tip Dialog
 */
var ac_ajax = new Object();
var hide_addajaxDialog = function() {
	ac_ajax.hide();
};


/*
 * 增加财务收支简报表和本月收支趋势图的数据
 */
var addamount = function(dataobj, chart){
	
	var words = jQuery("#a_totalamount").html();
	var str, chartdata;
	switch (dataobj.curstatus) {
	case 'pay':
		str = 'p';
		var amount = parseFloat(words) - parseFloat(dataobj.richnum);
		jQuery("#a_totalamount").html(amount);
		chartdata = chart.series[0];
		break;
	case 'earn':
		str = 'e';
		var amount = parseFloat(words) + parseFloat(dataobj.richnum);
		jQuery("#a_totalamount").html(amount);
		chartdata = chart.series[1];
		break;
	default:
		return;
	}
	var time = jQuery("#tb_account").attr("curdate");
	
	var tmpday = new Date();
	tmpday.setTime(time*1000);
	var tmpnum = tmpday.getDay() ? tmpday.getDay() : 7;
	var startweek = time - (tmpnum-1)*24*3600;
	var endweek = parseInt(time) + (7-tmpnum)*24*3600;
	
	tmpday.setDate(1);
	var startmonth = tmpday.getTime()/1000, endmonth;
	if( tmpday.getMonth()==11 ) {
		tmpday.setDate(31);
		endmonth = tmpday.getTime()/1000;
	} else {
		tmpday.setMonth(tmpday.getMonth()+1);
		endmonth = tmpday.getTime()/1000-24*3600;
	}
	
	words = dataobj.richdate.split('-');
	var m_day = words[2]-1;
	tmpday.setFullYear(words[0]);
	tmpday.setMonth(words[1]-1);
	tmpday.setDate(words[2]);
	var adddate = tmpday.getTime()/1000;
	if(adddate == time) {
		words = jQuery("#a_d"+str+"m").html().substr(1);
		var amount = parseFloat(words) + parseFloat(dataobj.richnum);
		jQuery("#a_d"+str+"m").html("￥"+amount.toFixed(2));
	}
	if(startweek<= adddate && adddate <= endweek) {
		words = jQuery("#a_w"+str+"m").html().substr(1);
		var amount = parseFloat(words) + parseFloat(dataobj.richnum);
		jQuery("#a_w"+str+"m").html("￥"+amount.toFixed(2));
	}
	if(startmonth<= adddate && adddate <= endmonth) {
		words = jQuery("#a_m"+str+"m").html().substr(1);
		var amount = parseFloat(words) + parseFloat(dataobj.richnum);
		jQuery("#a_m"+str+"m").html("￥"+amount.toFixed(2));
		
		if(jQuery("#a_remdm").html() != '-' && str == 'p') {
			var words = jQuery("#a_remdm").html();
			var amount = parseFloat(words) - parseFloat(dataobj.richnum);
			jQuery("#a_remdm").html(amount.toFixed(2));
		}
		chartdata.data[m_day].update(chartdata.data[m_day].y+=parseFloat(dataobj.richnum));
	}
};


jQuery(document).ready(function($) {
	
	/*
	 * 自动匹配功能
	 */
	$( "#richname" )
	.catcomplete({
		delay: 0,
		minLength: 0,
		source: [{ label: "", category: "" }],
		category: $("#richcategory")
	});	
	
	$( "#richnamebtn" )
	.attr( {"tabIndex":-1, "title":"显示所有名称"} )
	.click(function() {
		// close if already visible
		if ( $("input#richname").catcomplete( "widget" ).is( ":visible" ) ) {
			$("input#richname").catcomplete( "close" );
			return;
		}
		
		// work around a bug (likely same cause as #5265)
		$( this ).blur();
		
		// pass empty string as value to search for, displaying all results
		$("input#richname").catcomplete( "search", "" );
		$("input#richname").focus();
	});
	
	
	/*
	 * 获取一些控件的数据
	 */
	var arr = new Array();
	arr["pay"] = "richname";
	arr["richtype"] = "richtype";
	ajax_getdataparam(arr, false);
	
	
	/*
	 * 计算器
	 */
	$("#richnum").calculator();
	
	
	/*
	 * 详细信息框
	 */
	var msgstr = '此处可输入详细信息，限制最大字数为200。';
	$("#message")
	.blur(function(){
		if($("#message").val() == ''){
			$("#message").val(msgstr);
			$("#message").removeClass('xg2').addClass('xg1');
		}
	})
	.focus(function(){
		if($("#message").val() == msgstr) {
			$("#message").val('');
			$("#message").removeClass('xg1').addClass('xg2');
		}
	});
	
	
	/*
	 * 提交数据
	 */
	ac_ajax = $('<div style="position: absolute;" />')
				.appendTo("body")
				.position({
				  my: "center center",
				  at: "center center",
				  of: $("#richaddlist"),
				  offset: "-50 -50"
				}).hide();
	$("#richaddbtn").click( function() {
		
		if( $("#richnum").val() == '' ) {
			errTip("#richnum", "金额不能为空", 1, 2500);
			return ;
		}
		dataobj.richnum  = $("#richnum").val();
		
		if($("#richtype").html() == '') {
			errTip("#richtype", "无数据请刷新页面", 1, 2500);
			return ;
		}
		dataobj.richtype = $("#richtype").attr("selecti");
		
		var catcompletedata = "";
		var dataobj = new Object();
		switch( $("ul.tb.cl").attr("curstatus") ) {
			case "li.pay":
				dataobj.curstatus = "pay";
				catcompletedata = titledata["pay"];
				if($("#richname").val() == '') {
					errTip("#richname", "名称不能为空", 1, 2500);
					return ;
				}
				if(!fncatcompletetest(catcompletedata, $("#richcategory").val(), "richcategory", $("#richname").val())) {
					errTip("#richname", "名称不在列表中，请重选或添加该名称", 1, 2500);
					return ;
				}
				dataobj.richcategory = $("#richcategory").val();
				dataobj.richname = $("#richname").val();
				break;
				
			case "li.earn":
				dataobj.curstatus = "earn";
				catcompletedata = titledata["earn"];
				if($("#richname").val() == '') {
					errTip("#richname", "名称不能为空", 1, 2500);
					return ;
				}
				if(!fncatcompletetest(catcompletedata, $("#richcategory").val(), "richcategory", $("#richname").val())) {
					errTip("#richname", "名称不在列表中，请重选或添加该名称", 1, 2500);
					return ;
				}
				dataobj.richcategory = $("#richcategory").val();
				dataobj.richname = $("#richname").val();
				break;
				
			case "li.transfer":
				if($("#richtype").html() == $("#richtype_out").html()) {
					errTip("#richtype_out", "转出和转入的归属不能相同", 1, 2500);
					return ;
				}
				dataobj.curstatus = "transfer";
				dataobj.richtype_out = $("#richtype_out").attr("selecti");
				break;
				
			case "li.loandebt":
				switch($("#p\\.loandebt").attr("curstatus")) {
					case "a.borrow":
						dataobj.curstatus = "borrow";
						break;
					case "a.loan":
						dataobj.curstatus = "loan";
						break;
					case "a.repay":
						dataobj.curstatus = "repay";
						break;
					case "a.debt":
						dataobj.curstatus = "debt";
						break;
					default:
						alert("未知错误3");
						return;
				}
				dataobj.loandebt = $("#richtype_out").attr("selecti");
				break;
				
			default:
				alert("未知错误3");
				return;
		}
		
		dataobj.richdate = $("#richdate").val();
		dataobj.message = ($("#message").val() == msgstr ? '':$("#message").val());
		
		ac_ajax
		.html('<table cellpadding="0" cellspacing="0" class="fwin"><tr><td class="t_l"></td><td class="t_c"></td><td class="t_r"></td></tr>\
			<tr><td class="m_l">&nbsp;&nbsp;</td>\
				<td class="m_c"><h3 class="flb"><em><img src="' + IMGDIR + '/loading.gif"> 正在保存...</em></td>\
				<td class="m_r"></td></tr>\
			<tr><td class="b_l"></td><td class="b_c"></td><td class="b_r"></td></tr></table>')
		.show();

		$.post("plugin.php?id=account:ajax&func=adddata", $.param(dataobj),
				function(data) {
					if(data == null) {
			  			ac_ajax.hide();
						alert("未知错误1");
					}
			  		if(data.state.toLowerCase() == 'ok') {
			  			ac_ajax.html('<table cellpadding="0" cellspacing="0" class="fwin"><tr><td class="t_l"></td><td class="t_c"></td><td class="t_r"></td></tr>\
			  					<tr><td class="m_l">&nbsp;&nbsp;</td>\
			  					<td class="m_c"><h3 class="flb"><em><img src="' + IMGDIR + '/check_right.gif"> 保存成功.</em></td>\
			  					<td class="m_r"></td></tr>\
			  				<tr><td class="b_l"></td><td class="b_c"></td><td class="b_r"></td></tr></table>');
			  			setTimeout("hide_addajaxDialog()", 1000);
			  			
			  			set_default(0);
			  			addamount(dataobj, chart);
			  			
			  		} else {
			  			ac_ajax.hide();
			  			switch( data.curerr ) {
			  			case "richdate":
			  				errTip("#richdate", "请选择正确的日期", 1, 2500);
			  				break;
			  			case "richnum":
			  				errTip("#richnum", "请填写大于零且最多两位小数的金额", 1, 2500);
			  				break;
			  			case "richname":
			  				errTip("#richname", "名称不在列表中，请重选或添加该名称", 1, 2500);
			  				break;
			  			case "richtype":
			  				errTip("#richtype", "归属不存在，请重选或添加该名称", 1, 2500);
			  				break;
			  			case "richtype_out":
			  				errTip("#richtype_out", "归属不存在，请重选或添加该名称", 1, 2500);
			  				break;
			  			case "richtype_same":
								errTip("#richtype_out", "转出和转入的归属不能相同", 1, 2500);
			  				break;
			  			case "no_login":
			  				showWindow('login', 'plugin.php?id=account:index');
			  				break;
			  			case "no_type":
			  				alert("未知类型增加");
			  				break;
			  			default:
							alert("页面错误1");
		  					break;
			  			}
			  		}
				},"json")
		.error(function() {
  			ac_ajax.hide();
			alert("未知错误2");
		});
	});

});


/*
 * 本月收支趋势图
 */
var chart;

jQuery(document).ready(function($) {

	$.ajax({
		  type: 'POST',
		  url: 'plugin.php?id=account:ajax&func=chart',
		  data: 'chart=SimpleCurY',
		  dataType: 'json',
		  context: '#container',
		  success: function(data) {
			if(data.state.toLowerCase() == 'ok') {
  				$("#container").html("");
				chart = new Highcharts.Chart({
				chart: {
					renderTo: 'container',
					defaultSeriesType: 'line',
					spacingBottom: 0
				},
				title:{text:''},yAxis:{title:{text:''}},yAxis:{title:{text:''}},credits:{enabled:false},
				xAxis: {
					categories: data.data.date
				},
				yAxis: {
			        title: {
			            text: data.data.detail
			        }
			    },
				plotOptions: {
					line: {
						dataLabels: {
						enabled: true
						},
					enableMouseTracking: false
				}
				},
				series: 	//ac_bug:这里使用全中文字幕会出现文字不居中，现解决方法文字中加上单字节符号			
					[{ name: ': 支出  ', data: data.data.pay  },
					 { name: ': 收入',   data: data.data.earn }]
				});
  			} else {
  				;
  			}
		}
	});
});
