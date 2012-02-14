/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-02-13
 *    Author: shumyun
 *    Copyright (C) 2011 - forever jiashe.net Inc
 *    未知错误使用已经到 3
 */
jQuery.noConflict();


/*
 * 模仿common.js 中 simulateSelect 函数
 */

function setSelvalue(selectId, value){
	var selectObj = $(selectId);
	var ul = document.createElement('ul');
	
	for(var i = 0; i < value.length; i++) {
		var li = document.createElement('li');
		li.innerHTML = value[i];
		li.k_id = i;
		li.k_value = i;
		if(i == 0) {
			li.className = 'current';
			selectObj.setAttribute('selecti', i);
			selectObj.options.length = 0;
			selectObj.options[0] = new Option('', li.k_value);
			eval(selectObj.getAttribute('change'));
			if($(selectId + '_ctrl'))
				$(selectId + '_ctrl').innerHTML = value[i];
		}
		li.onclick = function() {
			var menuObj = $(selectId + '_ctrl_menu');
			if($(selectId + '_ctrl').innerHTML != this.innerHTML) {
				var lis = menuObj.getElementsByTagName('li');
				lis[$(selectId).getAttribute('selecti')].className = '';
				this.className = 'current';
				$(selectId + '_ctrl').innerHTML = this.innerHTML;
				$(selectId).setAttribute('selecti', this.k_id);
				$(selectId).options.length = 0;
				$(selectId).options[0] = new Option('', this.k_value);
				eval(selectObj.getAttribute('change'));
			}
			hideMenu(menuObj.id);
			return false;
		};
		ul.appendChild(li);
	}
	return ul;
}

function acc_simulateSel(selectId, value) {
	var selectObj = $(selectId);
	if(!selectObj || !value) return;
	if(BROWSER.other) {
		if(selectObj.getAttribute('change')) {
			selectObj.onchange = function () {eval(selectObj.getAttribute('change'));}
		}
		return;
	}
	if($(selectId + '_ctrl_menu') && $(selectId + '_ctrl')){
		var menuObj = $(selectId + '_ctrl_menu');
		if(!menuObj.removeChild(menuObj.lastChild)) return;
		var ul = setSelvalue(selectId, value);
		menuObj.appendChild(ul);
		jQuery("#"+selectId+"_ctrl").show();
	} else {
		var defaultopt = value[0] ? value[0] : '';
		var menuObj = document.createElement('div');
		var ul = setSelvalue(selectId, value);
		var handleKeyDown = function(e) {
			e = BROWSER.ie ? event : e;
			if(e.keyCode == 40 || e.keyCode == 38) doane(e);
		};
		var selectwidth = (selectObj.getAttribute('width', i) ? selectObj.getAttribute('width', i) : 70) + 'px';
		var tabindex = selectObj.getAttribute('tabindex', i) ? selectObj.getAttribute('tabindex', i) : 1;
		
		selectObj.style.display = 'none';
		selectObj.outerHTML += '<a href="javascript:;" id="' + selectId + '_ctrl" style="width:' + selectwidth + '" tabindex="' + tabindex + '">' + defaultopt + '</a>';

		menuObj.id = selectId + '_ctrl_menu';
		menuObj.className = 'sltm';
		menuObj.style.display = 'none';
		menuObj.style.width = selectwidth;
		menuObj.appendChild(ul);
		$('append_parent').appendChild(menuObj);

		$(selectId + '_ctrl').onclick = function(e) {
			$(selectId + '_ctrl_menu').style.width = selectwidth;
			showMenu({'ctrlid':(selectId == 'loginfield' ? 'account' : selectId + '_ctrl'),'menuid':selectId + '_ctrl_menu','evt':'click','pos':'43'});
			doane(e);
		};
		$(selectId + '_ctrl').onfocus = menuObj.onfocus = function() {
			_attachEvent(document.body, 'keydown', handleKeyDown);
		};
		$(selectId + '_ctrl').onblur = menuObj.onblur = function() {
			_detachEvent(document.body, 'keydown', handleKeyDown);
		};
		$(selectId + '_ctrl').onkeyup = function(e) {
			e = e ? e : window.event;
			value = e.keyCode;
			if(value == 40 || value == 38) {
				if(menuObj.style.display == 'none') {
					$(selectId + '_ctrl').onclick();
				} else {
					lis = menuObj.getElementsByTagName('li');
					selecti = selectObj.getAttribute('selecti');
					lis[selecti].className = '';
					if(value == 40) {
						selecti = parseInt(selecti) + 1;
					} else if(value == 38) {
						selecti = parseInt(selecti) - 1;
					}
					if(selecti < 0) {
						selecti = lis.length - 1
					} else if(selecti > lis.length - 1) {
						selecti = 0;
					}
					lis[selecti].className = 'current';
					selectObj.setAttribute('selecti', selecti);
					lis[selecti].parentNode.scrollTop = lis[selecti].offsetTop;
				}
			} else if(value == 13) {
				var lis = menuObj.getElementsByTagName('li');
				lis[selectObj.getAttribute('selecti')].onclick();
			} else if(value == 27) {
				hideMenu(menuObj.id);
			}
		};
	}
}


/*
 * jQuery UI tip
 * Depends:
 *	jquery.ui.position.js
 */
var tipdiv = null, timeID = null;
var destroyTip = function() {
	clearTimeout(timeID);
	if(tipdiv) {
		tipdiv.remove();
	}
	tipdiv = null;
	timeID = null;
};
var errTip = function(dom, str, tippos, timeval) {
	if(tipdiv != null) {
		destroyTip();
	}
	tipdiv = jQuery('<div class="acc_tip"><div class="acc_tip_' +tippos+ '"><div class="acc_tip_horn"></div>' +str+ '</div></div>')
	.appendTo("body")
	.position({
		of: jQuery(dom),
		my: "left top",
		at: "left bottom",
		collision: "none"
	});
	jQuery(dom).focus();
	timeID = setTimeout("destroyTip()", timeval);
};


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
 * type	:	0	恢复空数据
 * 			1	恢复 支出/收入页面
 * 			2	恢复 转账页面
 * 			3	恢复 借贷页面
 */
var set_default = function(type){
	
	var ac_date = new Date();
	jQuery("#richdate").val(ac_date.getFullYear()+'-'+(ac_date.getMonth()+1)+'-'+ac_date.getDate());
	jQuery("#richnum").val('');
	jQuery("#richcategory").val('');
	jQuery("#richname").val('');
	jQuery("#message").val('').blur();
	
	switch(type){
		case 1:
			jQuery("#richtype_out");
			jQuery("#l_1").html("账单日期：");
			jQuery("#l_2").html("账单名称：");
			if(jQuery("#richtype_out_ctrl").length)
				jQuery("#richtype_out_ctrl").hide();
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
			jQuery("#l_3").html("转账金额：");
			jQuery("#l_4").html("转入归属：");
			break;
			
		case 3:
			jQuery("#richname").hide();
			jQuery("#richnamebtn").hide();
			jQuery("#s_help").hide();
			
		case 4:
			jQuery("#l_1").html("负债日期：");
			jQuery("#l_2").html("负债账户：");
			jQuery("#l_3").html("负债金额：");
			jQuery("#l_4").html("存入归属：");
			break;
			
		case 5:
			jQuery("#l_1").html("借出日期：");
			jQuery("#l_2").html("债权账户：");
			jQuery("#l_3").html("借出金额：");
			jQuery("#l_4").html("借出归属：");
			break;
			
		case 6:
			jQuery("#l_1").html("还债日期：");
			jQuery("#l_2").html("负债账户：");
			jQuery("#l_3").html("还债金额：");
			jQuery("#l_4").html("还债归属：");
			break;
			
		case 7:
			jQuery("#l_1").html("收债日期：");
			jQuery("#l_2").html("债权账户：");
			jQuery("#l_3").html("收债金额：");
			jQuery("#l_4").html("存入归属：");
			break;
			
		default:break;
	}
};

/*
 * 获取账单名称
 * force  :  强制更新
 */
var titledata = {};
var ajax_radata = function(arr, force){
	var tmparr = {};
	var bajax = false;
	var tmpstr = "";
	if(force) {
		tmparr = arr;
	} else {
		for (x in arr)
		{
			if(arr[x] == "richtype_out")
				tmpstr = "richtype";
			else if (arr[x] == "loan" || arr[x] == "debt")
				tmpstr = "loandebt";
			else
				tmpstr = arr[x];
			
			if(typeof titledata[tmpstr] == "undefined" || titledata[tmpstr] == "") {
				tmparr[x] = arr[x];
				bajax = true;
			} else {
				switch(arr[x]) {
					case "pay":
					case "earn":
						jQuery( "#richname" ).catcomplete( "option", "source",  titledata[arr[x]]);
						break;

					case "richtype":
					case "richtype_out":
						acc_simulateSel(arr[x], titledata['richtype']);
						break;
						
					case "loan":
					case "debt":
						acc_simulateSel("richtype_out", titledata['loandebt']);
					default:break;
				}
			}
		}
	}
	
	if( !bajax )
		return ;
	
	jQuery.post("plugin.php?id=account:ajax&func=ra_data", jQuery.param(tmparr), function(data) {
		var ar_data = (new Function("return " + data))(); //var ar_data = eval('('+data+')');
		for( x in ar_data) {
			for (y in ar_data[x]) {
				if(y == "richtype_out")
					titledata["richtype"] = ar_data[x][y];
				else if(y == "loan" || y == "debt")
					titledata["loandebt"] = ar_data[x][y];
				else
					titledata[y] = ar_data[x][y];
				
				switch(y) {
					case "pay":
					case "earn":
						jQuery( "#richname" ).catcomplete( "option", "source",  titledata[y]);
						break;
						
					case "richtype":
					case "richtype_out":
						acc_simulateSel(y, titledata["richtype"]);
						break;
					
					case "loan":
					case "debt":
						acc_simulateSel("richtype_out", titledata["loandebt"]);
						break;
						
					default:break;
				}
			}
		}
	});
};

jQuery(document).ready(function($) {
	$("#li\\.pay").click(function() {
		var change = $(this).parent().attr("curstatus");
		if ("li\\.pay" != change){
			acc_changehtml("li.pay", change);
			$("#loandebt\\.p").slideUp();
			set_default(("li\\.earn" != change)?1:0);
			ajax_radata(["pay"], false);
		}
	});
	
	$("#li\\.earn").click(function() {
		var change = $(this).parent().attr("curstatus");
		if ("li.earn" != change) {
			acc_changehtml("li.earn", change);
			$("#loandebt\\.p").slideUp();
			set_default(("li\\.pay" != change)?1:0);
			ajax_radata(["earn"], false);
		}
	});
	
	$("#li\\.transfer").click(function() {
		var change = $(this).parent().attr("curstatus");
		if ("li.transfer" != change) {
			acc_changehtml("li.transfer", change);
			$("#loandebt\\.p").slideUp();
			set_default(2);
			ajax_radata(["richtype_out"], false);
		}
	});
	
	$("#li\\.loandebt").click(function() {
		var change = $(this).parent().attr("curstatus");
		if ("li.loandebt" != change) {
			acc_changehtml("li.loandebt", change);
			$("#loandebt\\.p").show("fast");
			set_default(3);
			change = $("#loandebt\\.p").attr("curstatus");
			if ("a.inloan" != change)
				acc_changehtml("a.inloan", change);
			ajax_radata(["loan"], false);
		}
	});
	
	/*
	 * 隶属 “借贷” 的二级菜单
	 */
	$("#a\\.inloan").click(function() {
		var change = $(this).parent().attr("curstatus");
		if ("a.inloan" != change) {
			acc_changehtml("a.inloan", change);
			set_default(4);
			ajax_radata(["loan"], false);
		}
	});

	$("#a\\.outdebt").click(function() {
		var change = $(this).parent().attr("curstatus");
		if ("a.outdebt" != change) {
			acc_changehtml("a.outdebt", change);
			set_default(5);
			ajax_radata(["debt"], false);
		}
	});

	$("#a\\.outloan").click(function() {
		var change = $(this).parent().attr("curstatus");
		if ("a.outloan" != change) {
			acc_changehtml("a.outloan", change);
			set_default(6);
			ajax_radata(["loan"], false);
		}
	});

	$("#a\\.indebt").click(function() {
		var change = $(this).parent().attr("curstatus");
		if ("a.indebt" != change) {
			acc_changehtml("a.indebt", change);
			set_default(7);
			ajax_radata(["debt"], false);
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


/*
 * 支出/收入时测试数据状况
 * return  :  false  出现错误数据
 *         :  true   正确
 */
var test_earnpay = function(catcompletedata){
	
	if ( jQuery("#richname").val() == '' ) {
		errTip("#richname", "名称不能为空", 1, 2500);
		return false;
	}

	var berr = true;
	var tempstr = "";
	for (x in catcompletedata) {
		if( catcompletedata[x].label.match(jQuery("#richname").val())) {
			if( catcompletedata[x].category == jQuery("#richcategory").val()) {
				tempstr = catcompletedata[x].category;
				berr = false;
				break;
			} else {
				tempstr = catcompletedata[x].category;
				berr = false;
			}
		}
	}
	if(berr) {
		errTip("#richname", "名称不在列表中，请重选或添加该名称", 1, 2500);
		return false;
	}
	jQuery("#richcategory").val(tempstr);
	return true;
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
	var arr = ["pay", "richtype"];
	ajax_radata(arr, false);
	
	
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
	ac_ajax = jQuery('<div style="position: absolute;" />')
				.appendTo("body")
				.position({
				  my: "center center",
				  at: "center center",
				  of: jQuery("#richaddlist"),
				  offset: "-50 -50"
				}).hide();
	$("#richaddbtn").click( function() {
		if( $("#richnum").val() == '' ) {
			errTip("#richnum", "金额不能为空", 1, 2500);
			return ;
		}
		/*
		var pyarr = pinyin($("#richname").val(), true);
		var pystr = '';
		for (x in pyarr){
			pystr = pystr + pyarr[x].substring(0, 1).toLowerCase();
		}
		*/
		var catcompletedata = "";
		
		var dataobj = new Object();
		switch( $("ul.tb.cl").attr("curstatus") ) {
			case "li.pay":
				dataobj.curstatus = "pay";
				catcompletedata = titledata["pay"];
				if(!test_earnpay(catcompletedata))
					return ;
				dataobj.richcategory = $("#richcategory").val();
				dataobj.richname = $("#richname").val();
				dataobj.richtype = $("#richtype").val();
				break;
				
			case "li.earn":
				dataobj.curstatus = "earn";
				catcompletedata = titledata["earn"];
				if(!test_earnpay(catcompletedata))
					return ;
				dataobj.richcategory = $("#richcategory").val();
				dataobj.richname = $("#richname").val();
				dataobj.richtype = $("#richtype").val();
				break;
				
			case "li.transfer":
				if($("#richtype").val() == $("#richtype_out").val()) {
					errTip("#richtype_out_ctrl", "转出和转入的归属不能相同", 1, 2500);
					return ;
				}
				dataobj.curstatus = "transfer";
				dataobj.richtype_out = $("#richtype_out").val();
				dataobj.richtype = $("#richtype").val();
				break;
				
			default:
				alert("未知错误3");
				return;
		}
		
		dataobj.richdate = $("#richdate").val();
		dataobj.richnum  = $("#richnum").val();
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
			  				errTip("#richnum", "请填写大于零的金额", 1, 2500);
			  				break;
			  			case "richname":
			  				errTip("#richname", "名称不在列表中，请重选或添加该名称", 1, 2500);
			  				break;
			  			case "richtype":
			  				errTip("#richtype_ctrl", "归属不存在，请重选或添加该名称", 1, 2500);
			  				break;
			  			case "richtype_out":
			  				errTip("#richtype_out_ctrl", "归属不存在，请重选或添加该名称", 1, 2500);
			  				break;
			  			case "richtype_same":
							errTip("#richtype_out_ctrl", "转出和转入的归属不能相同", 1, 2500);
			  				break;
			  			case "no_login":
			  				showWindow('login', 'plugin.php?id=account:index');
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
