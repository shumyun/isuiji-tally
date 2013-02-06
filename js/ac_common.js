/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-02-06
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */



/*
 * 模仿common.js 中 simulateSelect 函数
 */
function setSelvalue(selectId, aVal, val){
	var selectObj = $(selectId);
	var ul = document.createElement('ul');
	var bSelect = false;
	for(var i = 0; i < aVal.length; i++) {
		var li = document.createElement('li');
		li.innerHTML = aVal[i];
		li.k_id = i;
		li.k_value = i;
		if(!(val===undefined) && !bSelect && (val == aVal[i])){
			li.className = 'current';
			selectObj.setAttribute('selecti', i);
			bSelect = true;
		}
		li.onclick = function() {
			var menuObj = $(selectId + '_menu');
			if(selectObj.innerHTML != this.innerHTML) {
				var lis = menuObj.getElementsByTagName('li');
				lis[selectObj.getAttribute('selecti')].className = '';
				this.className = 'current';
				selectObj.innerHTML = this.innerHTML;
				$(selectId).setAttribute('selecti', this.k_id);
			}
			hideMenu(menuObj.id);
			return false;
		};
		ul.appendChild(li);
	}
	if(!bSelect) {
		menuObj.getElementsByTagName('li')[0].className = 'current';
		selectObj.setAttribute('selecti', 0);
		selectObj.innerHTML = aVal[0];
	}
	return ul;
}

function ac_fnSimulateSelect(selectId, value) {
	var selectObj = $(selectId);
	if(!selectObj || !value) return;
	/*
	if(BROWSER.other) {
		if(selectObj.getAttribute('change')) {
			selectObj.onchange = function () {eval(selectObj.getAttribute('change'));}
		}
		return;
	}
	*/
	if($(selectId + '_menu')){
		var menuObj = $(selectId + '_menu');
		if(!menuObj.removeChild(menuObj.lastChild)) return;
		var ul = setSelvalue(selectId, value);
		menuObj.appendChild(ul);
		$(selectId).style.display = 'block';
	} else {
		var defaultopt = value[0] ? value[0] : '';
		var menuObj = document.createElement('div');
		var ul = setSelvalue(selectId, value);
		var handleKeyDown = function(e) {
			e = BROWSER.ie ? event : e;
			if(e.keyCode == 40 || e.keyCode == 38) doane(e);
		};

		menuObj.id = selectId + '_menu';
		menuObj.className = 'sltm';
		menuObj.style.display = 'none';
		menuObj.style.width = selectObj.style.width;
		menuObj.appendChild(ul);
		$('append_parent').appendChild(menuObj);

		$(selectId).onclick = function(e) {
			$(selectId + '_menu').style.width = selectwidth;
			showMenu({'ctrlid':(selectId == 'loginfield' ? 'account' : selectId),'menuid':selectId + '_menu','evt':'click','pos':'43'});
			doane(e);
		};
		$(selectId).onfocus = menuObj.onfocus = function() {
			_attachEvent(document.body, 'keydown', handleKeyDown);
		};
		$(selectId).onblur = menuObj.onblur = function() {
			_detachEvent(document.body, 'keydown', handleKeyDown);
		};
		$(selectId).onkeyup = function(e) {
			e = e ? e : window.event;
			value = e.keyCode;
			if(value == 40 || value == 38) {
				if(menuObj.style.display == 'none') {
					$(selectId).onclick();
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
jQuery.noConflict();

var tipdiv = null, timeID = null;

var errTip = function(domID, str, tippos, timeval) {
	if(tipdiv != null) {
		destroyTip();
	}
	tipdiv = jQuery('<div class="acc_tip"><div class="acc_tip_' +tippos+ '"><div class="acc_tip_horn"></div>' +str+ '</div></div>')
	.appendTo("body")
	.position({
		of: jQuery(domID),
		my: "left top",
		at: "left bottom",
		collision: "none"
	});
	jQuery(domID).focus();
	timeID = setTimeout("destroyTip()", timeval);
};

var destroyTip = function() {
	clearTimeout(timeID);
	if(tipdiv) {
		tipdiv.remove();
	}
	tipdiv = null;
	timeID = null;
};



/*
 * 控件获取数据(包括账单归属、账单名称、账户等)
 * aData : 是一组 下标为数据名称,数据为控件ID名称 的数组
 * force : 强制更新
 */
var titledata = {};
var ajax_getdataparam = function(aData, force) {
	var tmparr = {};
	var bajax = false;
	var tmpstr = "";
	if(force) {
		for(var name in aData)
			tmparr.push(name);
	} else {
		var i = 1;
		for (var name in aData) {
			if(name == "richtype_out")
				tmpstr = "richtype";
			else if (name == "loan" || name == "debt")
				tmpstr = "loandebt";
			else
				tmpstr = name;
			
			if(typeof titledata[tmpstr] == "undefined" || titledata[tmpstr] == "") {
				tmparr[i++] = name;
				bajax = true;
			} else {
				switch(name) {
					case "pay":
					case "earn":
						jQuery( "#"+aData[name] ).catcomplete( "option", "source",  titledata[tmpstr]);
						break;

					case "richtype":
					case "richtype_out":
					case "loan":
					case "debt":
						acc_simulateSel(aData[name], titledata[tmpstr]);
						break;
						
					default:break;
				}
			}
		}
	}
	
	if( !bajax )
		return ;
	
	jQuery.post("plugin.php?id=account:ajax&func=getdataparam", jQuery.param(tmparr), function(data) {
		var aParams = (new Function("return " + data))(); //var ar_data = eval('('+data+')');
		for(var x in aParams) {
			for (var y in aParams[x]) {
				if(y == "richtype_out")
					titledata["richtype"] = aParams[x][y];
				else if(y == "loan" || y == "debt")
					titledata["loandebt"] = aParams[x][y];
				else
					titledata[y] = aParams[x][y];
				
				switch(y) {
					case "pay":
					case "earn":
						jQuery( "#"+aData[y] ).catcomplete( "option", "source",  titledata[y]);
						break;
						
					case "richtype":
					case "richtype_out":
						ac_fnSimulateSelect(aData[y], titledata["richtype"]);
						break;
					
					case "loan":
					case "debt":
						ac_fnSimulateSelect(aData[y], titledata["loandebt"]);
						break;
						
					default:break;
				}
			}
		}
	});
};