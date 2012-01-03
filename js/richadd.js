/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2011-11-03
 *    Author: shumyun
 *    Copyright (C) 2011 - forever 57day.com Inc
 */
jQuery.noConflict();


/*
 * 二级菜单
 */
function acc_changeli(cur, change) {
	curjquery = '#'+cur.replace(".", "\\.");
	jQuery(curjquery).parent().attr("curstatus", cur);
	jQuery(curjquery).attr("style", "cursor:auto").toggleClass("a");
	change = '#'+change.replace(".", "\\.")
	jQuery(change).attr("style", "cursor:pointer").toggleClass("a");
}

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
	 * 提交数据
	 */
	$("#richaddbtn").click( function() {
		if( $("#richnum").val() == '' ) {
			errTip("#richnum", "金额不能为空", 1, 2500);
			return ;
		} else if ( $("#richname").val() == '' ) {
			errTip("#richname", "名称不能为空", 1, 2500);
			return ;
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
		dataobj.message = $("#message").val();
		
		$.ajax({
			type: "POST",
			url: "plugin.php?id=account:index&mod=ajax",
			data: $.param(dataobj)
		});
		
		;
	});
	
});
