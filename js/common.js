/**
 *    isuiji_tally v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-08-08
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */



/*
 * 模仿common.js 中 simulateSelect 函数
 */
function ac_setSelect(selectId, aVal){
	var selectObj = $(selectId);
	var ul = document.createElement('ul');
	for(var i = 0; i < aVal.length; i++) {
		var li = document.createElement('li');
		li.innerHTML = aVal[i];
		li.k_id = i;
		li.k_value = i;
		if(!i) {
			li.className = 'current';
			selectObj.setAttribute('selecti', i);
			selectObj.innerHTML = aVal[i];
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
	return ul;
}

function ac_setSelvalue(selectId, val) {
	var menuObj = $(selectId + '_menu');
	var selectObj = $(selectId);
	
	var lis = menuObj.getElementsByTagName('li');
	var selecti = selectObj.getAttribute('selecti');
	lis[selecti].className = '';
	
	for(var i = 0; i< menuObj.getElementsByTagName('li').length; i++) {
		var li = menuObj.getElementsByTagName('li')[i];
		li.className = '';
		if(!(val===undefined) && (val == li.innerHTML)) {
			li.className = 'current';
			selectObj.setAttribute('selecti', i);
			selectObj.innerHTML = li.innerHTML;
			return true;
		}
	}
	lis[0].className = 'current';
	selectObj.setAttribute('selecti', 0);
	selectObj.innerHTML = lis[0].innerHTML;
	return true;
}

function ac_fnSimulateSelect(selectId, aVal) {
	var selectObj = $(selectId);
	if(!selectObj || !aVal) return;
	if($(selectId + '_menu')){
		var menuObj = $(selectId + '_menu');
		if(!menuObj.removeChild(menuObj.lastChild)) return;
		var ul = ac_setSelect(selectId, aVal);
		menuObj.appendChild(ul);
	} else {
		var menuObj = document.createElement('div');
		var ul = ac_setSelect(selectId, aVal);
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

		selectObj.onclick = function(e) {
			$(selectId + '_menu').style.width = this.style.width;
			showMenu({'ctrlid':(selectId == 'loginfield' ? 'account' : selectId),'menuid':selectId + '_menu','evt':'click','pos':'43'});
			doane(e);
		};
		selectObj.onfocus = menuObj.onfocus = function() {
			_attachEvent(document.body, 'keydown', handleKeyDown);
		};
		selectObj.onblur = menuObj.onblur = function() {
			_detachEvent(document.body, 'keydown', handleKeyDown);
		};
		selectObj.onkeyup = function(e) {
			e = e ? e : window.event;
			value = e.keyCode;
			if(value == 40 || value == 38) {
				if(menuObj.style.display == 'none') {
					this.onclick();
				} else {
					lis = menuObj.getElementsByTagName('li');
					selecti = this.getAttribute('selecti');
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
					this.setAttribute('selecti', selecti);
					lis[selecti].parentNode.scrollTop = lis[selecti].offsetTop;
				}
			} else if(value == 13) {
				var lis = menuObj.getElementsByTagName('li');
				lis[this.getAttribute('selecti')].onclick();
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
	tipdiv = jQuery('<div class="acc_tip" style="position: absolute; z-index: 301;"><div class="acc_tip_' +tippos+ '"><div class="acc_tip_horn"></div>' +str+ '</div></div>')
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
		bajax = true;
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
						ac_fnSimulateSelect(aData[name], titledata[tmpstr]);
						break;
						
					default:break;
				}
			}
		}
	}
	
	if( !bajax )
		return ;
	
	jQuery.post("plugin.php?id=tally:ajax&func=getparam", jQuery.param(tmparr), function(data) {
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


/*
 * 测试支出和收入数据
 * return  :  false  出现错误数据
 *         :  true   正确
 */
var fncatcompletetest = function(catcompletedata, fData, fId, sData){
	var berr = true;
	var tempstr = "";
	for (x in catcompletedata) {
		if( catcompletedata[x].label.match(sData)) {
			if( catcompletedata[x].category == fData) {
				tempstr = catcompletedata[x].category;
				berr = false;
				break;
			} else {
				tempstr = catcompletedata[x].category;
				berr = false;
			}
		}
	}
	if(berr) return false;
	jQuery("#"+fId).val(tempstr);
	return true;
};