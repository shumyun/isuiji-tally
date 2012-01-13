/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-01-09
 *    Author: shumyun
 *    Copyright (C) 2011 - forever jiashe.net Inc
 */
jQuery.noConflict();


/*
 * jQuery UI tip
 * Depends:
 *	jquery.ui.position.js
 */
var tipdiv = null, timeID = null;
function errTip(dom, str, tippos, timeval) {
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
}

function destroyTip() {
	clearTimeout(timeID);
	if(tipdiv) {
		tipdiv.remove();
	}
	tipdiv = null;
	timeID = null;
}


/*
 * 二级菜单
 */
function acc_changeli(cur, change) {
	curjquery = '#'+cur.replace(".", "\\.");
	jQuery(curjquery).parent().attr("curstatus", cur);
	jQuery(curjquery).attr("style", "cursor:auto").toggleClass("a");
	change = '#'+change.replace(".", "\\.");
	jQuery(change).attr("style", "cursor:pointer").toggleClass("a");
}

jQuery(document).ready(function($) {
	$("#li\\.pay").click(function() {
		var change = $(this).parent().attr("curstatus");
		if ("li\\.pay" != change){
			acc_changeli("li.pay", change);
			$("#lend\\.p").slideUp();
		}
	});
	
	$("#li\\.earn").click(function() {
		var change = $(this).parent().attr("curstatus");
		if ("li.earn" != change) {
			acc_changeli("li.earn", change);
			$("#lend\\.p").slideUp();
		}
	});
	
	$("#li\\.transfer").click(function() {
		var change = $(this).parent().attr("curstatus");
		if ("li.transfer" != change) {
			acc_changeli("li.transfer", change);
			$("#lend\\.p").slideUp();
		}
	});
	
	$("#li\\.lend").click(function() {
		var change = $(this).parent().attr("curstatus");
		if ("li.lend" != change) {
			acc_changeli("li.lend", change);
			$("#lend\\.p").show("fast");
		}
	});
});

/*
 * ajax tip Dialog
 */
var ac_ajax = new Object();
function hide_addajaxDialog() {
	ac_ajax.hide();
}



var chart;

jQuery(document).ready(function($) {
	/*
	 * 自动匹配功能
	 */
	var phpdata = $("#richnamevalue").val();
	phpdata = eval('('+phpdata+')');
	$( "#richname" )
	.catcomplete({
		delay: 0,
		minLength: 0,
		source: phpdata,
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
				  of: jQuery("body")
				}).hide();
	$("#richaddbtn").click( function() {
		if( $("#richnum").val() == '' ) {
			errTip("#richnum", "金额不能为空", 1, 2500);
			return ;
		} else if ( $("#richname").val() == '' ) {
			errTip("#richname", "名称不能为空", 1, 2500);
			return ;
		} else {
			/*
			var pyarr = pinyin($("#richname").val(), true);
			var pystr = '';
			for (x in pyarr){
				pystr = pystr + pyarr[x].substring(0, 1).toLowerCase();
			}
			*/
			var berr = true;
			var tempstr = "";
			for (x in phpdata) {
				if( phpdata[x].label.match($("#richname").val())) {
					if( phpdata[x].category == $("#richcategory").val()) {
						tempstr = phpdata[x].category;
						berr = false;
						break;
					} else {
						tempstr = phpdata[x].category;
						berr = false;
					}
				}
			}
			if(berr) {
				errTip("#richname", "名称不在列表中，请重选或添加该名称", 1, 2500);
				return ;
			}
			$("#richcategory").val(tempstr);
		}
		
		var dataobj = new Object();
		switch( $("ul.tb.cl").attr("curstatus") ) {
			case "li.pay":
				dataobj.curstatus = "pay";
				break;
			case "li.earn":
				dataobj.curstatus = "curstatus=earn";
				break;
			default: break;
		}
		dataobj.richdate = $("#richdate").val();
		dataobj.richnum  = $("#richnum").val();
		dataobj.richcategory = $("#richcategory").val();
		dataobj.richname = $("#richname").val()/* + $("#richname").attr("pinyin")*/;
		dataobj.richtype = $("#richtype").get(0).selectedIndex;
		dataobj.message = ($("#message").val() == msgstr ? '':$("#message").val());
		
		$("#richaddlist").ajaxStart(function(){
			ac_ajax
			.html('<table cellpadding="0" cellspacing="0" class="fwin"><tr><td class="t_l"></td><td class="t_c"></td><td class="t_r"></td></tr>\
				<tr><td class="m_l">&nbsp;&nbsp;</td>\
					<td class="m_c"><h3 class="flb"><em><img src="' + IMGDIR + '/loading.gif"> 正在保存...</em></td>\
					<td class="m_r"></td></tr>\
				<tr><td class="b_l"></td><td class="b_c"></td><td class="b_r"></td></tr></table>')
			.show();
		});

		$.post("plugin.php?id=account:index&mod=ajax", $.param(dataobj),
				function(data) {
			  		if(data.state.toLowerCase() == 'ok') {
			  			ac_ajax.html('<table cellpadding="0" cellspacing="0" class="fwin"><tr><td class="t_l"></td><td class="t_c"></td><td class="t_r"></td></tr>\
			  					<tr><td class="m_l">&nbsp;&nbsp;</td>\
			  					<td class="m_c"><h3 class="flb"><em><img src="' + IMGDIR + '/check_right.gif"> 保存成功.</em></td>\
			  					<td class="m_r"></td></tr>\
			  				<tr><td class="b_l"></td><td class="b_c"></td><td class="b_r"></td></tr></table>');
			  			setTimeout("hide_addajaxDialog()", 1000);
			  			
			  			var ac_date = new Date();
			  			$("#richdate").val(ac_date.getFullYear()+'-'+(ac_date.getMonth()+1)+'-'+ac_date.getDate());
			  			$("#richnum").val('');
			  			$("#richcategory").val('');
			  			$("#richname").val('');
			  			$("#message").val('').blur();
			  		} else {
			  			ac_ajax.hide();
			  			if(data.curerr == "richdate") {
			  				errTip("#richdate", "请选择正确的日期", 1, 2500);
			  			} else if(data.curerr == "richnum") {
			  				errTip("#richnum", "请填写大于零的金额", 1, 2500);
			  			} else if(data.curerr == "richname") {
			  				errTip("#richname", "名称不在列表中，请重选或添加该名称", 1, 2500);
			  			} else if(data.curerr == "no_login"){
			  				showWindow('login', 'plugin.php?id=account:index');
			  			}
			  		}
				},"json");
	});
	

	chart = new Highcharts.Chart({
		chart: {
			renderTo: 'container',
			defaultSeriesType: 'line',
			spacingBottom: 0
		},
		title:{text: ''},yAxis:{title:{text:''}},yAxis:{title:{text:''}},credits:{enabled:false},
		xAxis: {
			categories: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
		},
		plotOptions: {
			line: {
				dataLabels: {
					enabled: true
				},
				enableMouseTracking: false
			}
		},
		series: [{
			name: '收入',
			data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		}, {
			name: '支出',
			data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		}]
	});

});
