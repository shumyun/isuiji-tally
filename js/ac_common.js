/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-01-30
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */


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