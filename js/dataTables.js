/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-01-10
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */

(function($, window, document, undefined) {
	var DataTable = function (odata) {
		function _fnInit(odata, othis)
		{
			//初始化数据
			$.extend(true, DataTable.ext, {"oTable": othis});
			DataTable.ext.optdata = _fnExtend( $.extend(true, {}, DataTable.defaults), odata );
			_fnInitConditions();
			//判断数据来源
			//if( $.isEmptyObject(DataTable.ext.optdata["Ajax"])) {
			if( DataTable.ext.optdata["Ajax"] === null) {
				//整合表格数据
				_fnInitData();
			} else {
				$.post(DataTable.ext.optdata["Ajax"], DataTable.ext.optdata["ajData"], function(data) {
								if( _fnAjaxSaveData(data) ){
									_fnInitTheadSort();
									_fnDefaultOut();
								};
							});
			}
			
			return ;
		}
		
		/**
		 * Log an error message
		 *  @param {object} oSettings dataTables settings object
		 *  @param {int} iLevel log error messages, or display them to the user
		 *  @param {string} sMesg error message
		 *  @memberof DataTable#oApi
		 */
		function _fnLog( oSettings, iLevel, sMesg ) {
			var sAlert = (oSettings===null) ?
				"DataTable 错误: "+sMesg :
				"DataTable 错误 (table id = '"+oSettings.sTableId+"'): "+sMesg;
			
			if ( iLevel === 0 ) {
				if ( DataTable.ext.sErrMode == 'alert' ) {
					alert( sAlert );
				} else {
					throw sAlert;
				}
				return;
			}
			else if ( console !== undefined && console.log ) {
				console.log( sAlert );
			}
		}
		
		/**
		 * Extend objects - very similar to jQuery.extend, but deep copy objects, and shallow
		 * copy arrays. The reason we need to do this, is that we don't want to deep copy array
		 * init values (such as aaSorting) since the dev wouldn't be able to override them, but
		 * we do want to deep copy arrays.
		 *  @param {object} oOut Object to extend
		 *  @param {object} oExtender Object from which the properties will be applied to oOut
		 *  @returns {object} oOut Reference, just for convenience - oOut === the return.
		 *  @memberof DataTable#oApi
		 *  @todo This doesn't take account of arrays inside the deep copied objects.
		 */
		function _fnExtend( oOut, oExtender ) {
			for ( var prop in oOut ) {
				if ( oOut.hasOwnProperty(prop) && oExtender[prop] !== undefined ) {
					if ( typeof oExtender[prop] === 'object' && $.isArray(oExtender[prop]) === false ) {
						$.extend( true, oOut[prop], oExtender[prop] );
					} else {
						oOut[prop] = oExtender[prop];
					}
				}
			}
			return oOut;
		}
		 
		/**
		 * 将相应的数据类型转换成数字
		 *  @param {object} oOut Object to extend
		 *  @param {object} oExtender Object from which the properties will be applied to oOut
		 *  @returns {object} oOut Reference, just for convenience - oOut === the return.
		 *  @memberof DataTable#oApi
		 *  @todo This doesn't take account of arrays inside the deep copied objects.
		 */
		function _fntransition(srcdata, srctype) {
			switch(srctype) {
				case "date":
					var x = Date.parse(srcdata);
					if ( isNaN(x) || x==="" ) {
						_fnLog( null, 0, "存储的"+srctype+"数据有误");
						return false;
					}
					return x;
					
				case "numerical":
					return (srcdata=="-" || srcdata==="") ? 0 : srcdata*1;
				
				case "string":
					if ( typeof srcdata != 'string' ) {
						srcdata = (srcdata !== null && srcdata.toString) ? srcdata.toString() : '';
					}
					return srcdata.toLowerCase();
						
				default:
					_fnLog( null, 0, "存储的数据类型有误");
					return false;
			};
		}
		
		/**
		 * 整合原始datatable数据,包括存储、排序、合计
		 */
		function _fnInitData() {
			if(!DataTable.ext.hasOwnProperty("oTable") || DataTable.ext["oTable"] === null) {
				_fnLog( null, 0, "找不到相应的table控件。");
				return false;
			}
			
			if(!_fnSaveData()) return false;
			
			if(!_fnSortData()) return false;
			
			if(!_fnDefaultOut()) return false;
			return true;
		}
		
		/**
		 * 存储ajax数据
		 *  @returns boolean
		 */
		function _fnAjaxSaveData(aj_data) {
			var oReceive = $.parseJSON(aj_data);
			if(oReceive["state"] == "error") {
				_fnLog( null, 0, oReceive["errinfo"]);
				return false;
			}
			
			var oTable = {};
			if(!(oTable = oReceive["oTable"])) {
				_fnLog( null, 0, "无数据显示");
				return false;
			}
			
			var aDate = {"sortday" : null, "asort" : null };
			var aSortData = new Array();
			var ClassData = new Array();
			aDate["sortday"] = new Array();
			for (var oname in oTable) {
				var aData = oTable[oname];
				ClassData[oname] = new Array();
				var oType = {};
				var tmpdate = new Date();
				for (var i = 0; i < aData.length; i++) {
					var oData = aData[i];
					if((tmpTime = _fntransition(oData[1], "date")) === false)
						return false;
					if( !aDate.hasOwnProperty(tmpTime) ) {
						aDate[tmpTime] = {"oType": {}, "adata": null, "iSumCols": 0, "trWidget": null};
						aDate[tmpTime]["oType"][oname] = {"sum": 0, "count": 0};
						aDate[tmpTime]["adata"] = new Array();
						aDate["sortday"].push(tmpTime);
						tmpdate.setTime(tmpTime);
						var nMonth = parseInt(tmpdate.getMonth()) + 1;
						//每日合计显示
						aDate[tmpTime]["trWidget"] = $('<tr class="' + DataTable.ext["optdata"]["CountRows"]["trClass"] + '">\
	  													<td colspan="' + DataTable.ext["optdata"]["CountRows"]["tdCount"] + '">\
	  													<ul><li style="padding-left: 5px; float: left;"><span class="ac_datenum">'
	  													+tmpdate.getFullYear()+'</span>年<span class="ac_datenum">'
	  													+nMonth+'</span>月<span class="ac_datenum">'
	  													+tmpdate.getDate()+'</span>日</li></ul></td></tr>');
						oType = aDate[tmpTime]["oType"];
					} else {
						oType = aDate[tmpTime]["oType"];
						if( !oType.hasOwnProperty(oname)) {
							oType[oname] = {"sum": 0, "count": 0};
							$.extend(true, aDate[tmpTime]["oType"], oType);
						}
					}
					var oCol = $('<tr id="'+ oData[0]
								+'"><td date="'+ oData[1] +'" class="td_left"></td>'
								+'<td class="td_rsecond">'+ oData[2]
								+'</td><td class="td_lfirst">'+ oData[3]
								+'</td><td class="td_right">'+ oData[4]
								+'</td><td class="td_center">'+ oData[5]
								+'</td><td class="td_center">'+ oname
								+'</td><td class="td_left">-</td></tr>')
								.hover(
									function () {
										$(this).children(":eq(0)").html('<a style="color:#f00">删除</a><span class="pipe">|</span><a style="color:#f00">修改</a>');
									}, 
									function () {
										$(this).children(":eq(0)").html('');
									}
								);
					if((tmpval = _fntransition(oData[4], "numerical")) === false)
						return false;
					oType[oname]["sum"] += tmpval;
					oType[oname]["count"]++;
					aDate[tmpTime]["adata"].push(oCol);
					aDate[tmpTime]["iSumCols"]++;
					aSortData.push(oCol);
					ClassData[oname].push(oCol);
				}
			}
			DataTable.DataCols["aDate"] = aDate;
			DataTable.DataCols["Data"] = ClassData;
			DataTable.DataCols["aSort"]["sortData"] = aSortData;
			return true;
		}
		
		/**
		 * 存储table数据
		 *  @returns boolean
		 */
		function _fnSaveData(){
			var othis = DataTable.ext.oTable;
			var aCountRows = DataTable.ext.optdata["CountRows"];
			
			var aSort = new Array();
			var aDate = new Array();
			var oType = {};
			$("tbody > tr", othis).each(function() {
				aSort.push(this);
				$(this).hide();
				
				if( aCountRows["iOrderByTime"] !== undefined && $(this).children()) {
					var tmpType = $(this).children().eq(aCountRows["iOrderByType"]);
					if(!tmpType || (tmpType = _fntransition(tmpType.html(), "string")) === false)
						return false;
					if(typeof oType[tmpType] == "undefined") {
						oType[tmpType] = 0;
						for(var x in aDate) {
							aDate[x]["oType"][tmpType] = 0;
						}
					}
					
					var tmpTime = $(this).children().eq(aCountRows["iOrderByTime"]);
					if(!tmpTime || (tmpTime = _fntransition(tmpTime.html().replace(/\./g, "/"), "date")) === false )
						return false;
					if( !aDate.hasOwnProperty(tmpTime) ) {
						aDate[tmpTime] = {"oType": {}, "adata": null, "iSumCols": 0};
						$.extend(true, aDate[tmpTime]["oType"], oType);
						aDate[tmpTime]["adata"] = new Array();
					}
					
					var tmpval = $(this).children().eq(aCountRows["iOrderByTotal"]);
					if(!tmpval || (tmpval = _fntransition(tmpval.html(), "numerical")) === false )
						return false;
					aDate[tmpTime]["oType"][tmpType] += tmpval;
					aDate[tmpTime]["adata"].push(this);
					aDate[tmpTime]["iSumCols"]++;
				}
			});
			DataTable.DataCols["aDate"] = aDate;
			DataTable.DataCols["aSort"] = aSort;
			return true;
		}
		
		function _fnSetDataDate(aData) {
			//清空date数据
			aDate = DataTable.DataCols["aDate"];
			for(var i in aDate) {
				aDate[i]["iSumCols"] = 0;
				aDate[i]["adata"]    = null;
				aDate[i]["adata"]    = new Array();
				$("ul >li" ,aDate[i]["trWidget"]).children(".ac_datefloat").remove();
				for(var j in aDate[i]["oType"]) {
					aDate[i]["oType"][j]["sum"]   = 0;
					aDate[i]["oType"][j]["count"] = 0;
				}
			}
			
			var idate, stype, imoney;
			for(var i in aData) {
				idate = _fntransition(aData[i].children(":eq(0)").attr("date"), "date");
				imoney = _fntransition(aData[i].children(":eq(3)").attr("date"), "numerical");
				stype = aData[i].children(":eq(5)").html();
				aDate[idate]["adata"].push(aData[i]);
				aDate[idate]["iSumCols"]++;
				aDate[idate]["oType"][stype]["sum"] += imoney;
				aDate[idate]["oType"][stype]["count"] ++;
			}
			
			return true;
		}

		/**
		 * 排序初始化
		 * @returns {Boolean}
		 */
		function _fnInitTheadSort() {
			if(!DataTable.ext.hasOwnProperty("oTable") || DataTable.ext["oTable"] === null) {
				_fnLog( null, 0, "找不到相应的table控件。");
				return false;
			}
			var othis = DataTable.ext.oTable;
			var oSortCols = DataTable.ext.optdata["SortColumns"];
			var aCols = oSortCols.Cols;
			for(var i = 0; i<aCols.length; i++) {
				var th = null;
				if(th = $("thead > tr", othis).children('":eq('+aCols[i][0]+')"')) {
					th.bind("click.DT", {index: aCols[i][0], type: aCols[i][1], fn: DataTable.ext.oApi.fnSort}, function(e){
						e.data.fn(e.data.index, e.data.type);
					}).css("cursor", "pointer");
				}
			}
			return true;
		}
		
		/**
		 * 排序
		 * @param index   排序的列号，从零开始
		 * @param sortby  排序
		 * @returns {Boolean}
		 */
		function _fnSetTheadClass(index, sortby) {
			var aSort = DataTable.DataCols["aSort"];
			var othis = DataTable.ext.oTable;
			newth = $("thead > tr", othis).children('":eq('+index+')"');
			if( aSort.sortID != index ){
				oldth = $("thead > tr", othis).children('":eq('+aSort.sortID+')"');
				$("#sort", oldth).remove();
				$("span", oldth).removeClass("ac_colblue");
				$("span", newth).addClass("ac_colblue");
				newth.append($('<span id="sort" style="font-size: 15px; color:#00F;">&darr;</span>'));
			} else {
				if(sortby === "asc"){
					$("#sort", newth).html("&uarr;");
				} else {
					$("#sort", newth).html("&darr;");
				}
			}
			return true;
		}
		
		/**
		 * 排序
		 * @param index 排序的列号，从零开始
		 * @param type  排序的类型
		 * @returns {Boolean}
		 */
		function _fnSort(index, type){
			var aSort = DataTable.DataCols["aSort"];
			if(aSort.doing === "n"){
				aSort.doing = "y";
				//var oSortCols = DataTable.ext.optdata["SortColumns"];
				var sortby;
				if( aSort.sortID === index ) {		//相同列的排序
					sortby = (aSort.sortby==="asc" ? "desc":"asc");
				} else {
					sortby = "desc";
				}
				switch(type) {
					case "date":
						if(_fnSortDate(sortby)) {
							_fnOut(type);
							_fnSetTheadClass(index, sortby);
							aSort.sortID = index;
							aSort.sortby = sortby;
						}
						break;
						
					case "string":
						if(_fnSortString(index, sortby)) {
							_fnOut(type);
							_fnSetTheadClass(index, sortby);
							aSort.sortID = index;
							aSort.sortby = sortby;
						}
						break;
						
					case "numerical":
						if(_fnSortNumerical(index, sortby)) {
							_fnOut(type);
							_fnSetTheadClass(index, sortby);
							aSort.sortID = index;
							aSort.sortby = sortby;
						}
						break;
					default:
						aSort.doing ="n";
						_fnLog( null, 0, "排序的类型未知。");
						return false;
				}
				aSort.doing ="n";
				return true;
			}
			return false;
		}
		
		/**
		 * 日期总排序
		 * @param sortby asc or desc
		 * @returns boolean
		 */
		function _fnSortDate( sortby ) {
			var aNum = DataTable.DataCols["aDate"]["sortday"];
			switch( sortby ) {
				case "asc":
					aNum.sort(function(a, b) {
						return a - b;
					});
					break;
				case "desc":
					aNum.sort(function(a, b) {
						return b - a;
					});
					break;
				default:
					_fnLog( null, 0, "日期排序错误。");
					return false;
			}
			if(!_fnSortDateElement(sortby))
				return false;
			return true;
		}
		
		/**
		 * 日期单元数据排序
		 *  @param sortby asc or desc
		 *  @returns boolean
		 */
		function _fnSortDateElement(sortby){
			var aDate = DataTable.DataCols["aDate"];
			for(var date in aDate){
				if(date === "sortday" || date === "asort")
					continue;
				switch( sortby ) {
					case "asc":
						aDate[date]["adata"].sort(function(a, b) {
							return a.attr("id") - b.attr("id");
						});
						break;
					case "desc":
						aDate[date]["adata"].sort(function(a, b) {
							return b.attr("id") - a.attr("id");
						});
						break;
					default:
						_fnLog( null, 0, "日期元素排序错误。");
						return false;
				}
			}
			return true;
		}
		
		/**
		 * 字符排序
		 * @param index   排序的列号，从零开始
		 * @param sortby asc or desc
		 * @returns boolean
		 */
		function _fnSortString( index, sortby ) {
			var aData = DataTable.DataCols["aSort"];
			switch( sortby ) {
				case "asc":
					aData["sortData"].sort(function(a, b) {
						x = pinyin(_fntransition(a.children('":eq('+index+')"').html(), "string"), true, ",");
						y = pinyin(_fntransition(b.children('":eq('+index+')"').html(), "string"), true, ",");
						xId = a.attr("id");
						yId = b.attr("id");
						return ((x < y) ? -1 : ((x > y) ? 1 : (xId - yId)));
					});
					break;
				case "desc":
					aData["sortData"].sort(function(a, b) {
						x =  pinyin(_fntransition(a.children('":eq('+index+')"').html(), "string"), true, ",");
						y =  pinyin(_fntransition(b.children('":eq('+index+')"').html(), "string"), true, ",");
						xId = a.attr("id");
						yId = b.attr("id");
						return ((x < y) ? 1 : ((x > y) ? -1 : (xId - yId)));
					});
					break;
				default:
					_fnLog( null, 0, "第"+index+"列排序错误。");
					return false;
			}
			return true;
		}

		
		/**
		 * 金额排序
		 * @param index   排序的列号，从零开始
		 * @param sortby asc or desc
		 * @returns boolean
		 */
		function _fnSortNumerical( index, sortby ) {
			var aData = DataTable.DataCols["aSort"];
			switch( sortby ) {
				case "asc":
					aData["sortData"].sort(function(a, b) {
						x = _fntransition(a.children('":eq('+index+')"').html(), "numerical");
						y = _fntransition(b.children('":eq('+index+')"').html(), "numerical");
						xId = a.attr("id");
						yId = b.attr("id");
						return ((x - y) ? (x - y) : (xId - yId));
					});
					break;
				case "desc":
					aData["sortData"].sort(function(a, b) {
						x =  _fntransition(a.children('":eq('+index+')"').html(), "numerical");
						y =  _fntransition(b.children('":eq('+index+')"').html(), "numerical");
						xId = a.attr("id");
						yId = b.attr("id");
						return ((y - x) ? (y - x) : (xId - yId));
					});
					break;
				default:
					_fnLog( null, 0, "第"+index+"列排序错误。");
					return false;
			}
			return true;
		}
		/**
		 * 
		 * @param type  排序的类型
		 * @returns boolean
		 */
		function _fnOut(type) {
			var othis = DataTable.ext.oTable;
			othis = $("tbody", othis);
			othis.children().hide();
			switch(type) {
				case "date":
					var aOutData = DataTable.DataCols["aDate"];
					for (var x = 0; x < aOutData["sortday"].length; x++) {
						var tmpDate = aOutData["sortday"][x];
						var aData = aOutData[tmpDate]["adata"];
						var OutType = aOutData[tmpDate]["oType"];
						var str = "", otherSum = 0, otherStr = "";
						
						$("td>ul", aOutData[tmpDate]["trWidget"]).children().remove(".ac_datefloat");
						
						for (var i in OutType) {
							switch(i) {
								case '收入':
									str += '<strong style="padding-right: 15px;">'+i+'：';
									str += '<font color="green">+'+OutType[i].sum.toFixed(2).toString()+'</font>';
									str += '（'+OutType[i].count+'条记录）</strong>';
									break;
						
								case '支出':
									str += '<strong style="padding-right: 15px;">'+i+'：';
									str += '<font color="red">-'+OutType[i].sum.toFixed(2).toString()+'</font>';
									str += '（'+OutType[i].count+'条记录）</strong>';
									break;
						
								default:
									otherSum += OutType[i].count;
									otherStr += '\n'+i+'：'+OutType[i].count+'条记录';
									break;
							}
						}
						
						if(otherSum && otherStr) {
							otherStr = '其中包括：'+otherStr;
							str += '<strong style="padding-right: 15px; cursor: default;" title="'+otherStr+
											'">其它：（'+otherSum+'条记录）</strong>';
						}
						
						$("td>ul", aOutData[tmpDate]["trWidget"]).append($('<li class="ac_datefloat">'+ str +'</li>'));
						othis.append(aOutData[tmpDate]["trWidget"]);
						aOutData[tmpDate]["trWidget"].show();
						for (var y=0; y<aData.length; y++) {
							if( !(y%2) && $(aData[y]).hasClass(DataTable.DataCols.TrClass["cClass"][1]) )
								$(aData[y]).removeClass(DataTable.DataCols.TrClass["cClass"][1]);
							else
								$(aData[y]).addClass(DataTable.DataCols.TrClass["cClass"][y%2]);
							othis.append(aData[y]);
							$(aData[y]).show();
						}
					}
					break;
					
				default:
					var aOutData = DataTable.DataCols["aSort"]["sortData"];
					for (var x = 0; x < aOutData.length; x++) {
						if( !(x%2) && $(aOutData[x]).hasClass(DataTable.DataCols.TrClass["cClass"][1]) )
							$(aOutData[x]).removeClass(DataTable.DataCols.TrClass["cClass"][1]);
						else
							$(aOutData[x]).addClass(DataTable.DataCols.TrClass["cClass"][x%2]);
						othis.append(aOutData[x]);
						$(aOutData[x]).show();
					}
					break;
			}
			return true;
		}
		
		/**
		 * 数据输出
		 *  @returns boolean
		 */
		function _fnDefaultOut() {
			//$("#loading", othis).hide();
			var aSort = DataTable.DataCols["aSort"];
			aSort.doing = "y";

			_fnSortDate("desc");
			_fnOut("date");

			var othis = DataTable.ext.oTable;
			th = $("thead > tr", othis).children('":eq('+DataTable.ext.optdata["SortColumns"]["defCol"]+')"');
			$("span", th).addClass("ac_colblue");
			th.append($('<span id="sort" class="ac_sortby ac_colblue">&darr;</span>'));
			aSort.doing = "n";
			aSort.sortID = DataTable.ext.optdata["SortColumns"]["defCol"];
			aSort.sortby = "desc";
			return true;
		}
		
		/**
		 * 初始化筛选条件
		 * 说明： 账户和借贷账户没有存储该行的数据，因此这里存储的是数组[筛选的列号, 筛选的数据]
		 */
		function _fnInitConditions() {
			DataTable.ext.oConditions = {
				"Step" : {
					"Fst": {"adata": ["借贷", "借贷账户"], "haddata": null, "andor": "and"},
					"Sec": {"adata": ["支出", "转账", "收入"], "haddata": ["Fst"], "andor": "or"},
					"Thr": {"adata": ["账户"], "haddata": ["Sec"], "andor": "and"}},
				"odata": {"借贷": {"data": null, "col":"", "isUsed": 'n'}, "支出": {"data": null, "col":"", "isUsed": 'n'},
						  "转账": {"data": null, "col":"", "isUsed": 'n'}, "收入": {"data": null, "col":"", "isUsed": 'n'},
						  "账户": {"data": null, "col":"", "isUsed": 'n'}, "借贷账户": {"data": null, "col":"", "isUsed": 'n'}}};
		}
		
		/**
		 * 筛选后存储需要显示的数据并返回
		 * @param sName   要比对的数据名
		 * @param sFirst  首先筛选的条件
		 * @param fCol    首先筛选的列号
		 * @param aSecond 二次筛选的条件(数组)
		 * @param sCol    二次筛选的列号
		 * @returns {Boolean}
		 */
		function _fnSaveConditions(sName, sFirst, fCol, aSecond, sCol) {
			var beData = DataTable.DataCols["Data"][sName];
			var toData = new Array();
			var tmpData = new Array();
			if(typeof(sFirst) == "undefined" || typeof(fCol) == "undefined")
				return false;
			for(var i in beData) {
				if(beData[i].children(":eq("+fCol+")").html() === sFirst)
					tmpData.push(beData[i]);
			}
			if(typeof(aSecond) != "undefined" && typeof(sCol) != "undefined")
			{
				for(var i in aSecond) {
					for(var j in tmpData) {
						if(tmpData[j].children(":eq("+sCol+")").html() === aSecond[i])
							toData.push(tmpData[j]);
					}
				}
			} else
				toData = tmpData;
			DataTable.ext.oConditions.odata[sName]["data"] = toData;
			DataTable.ext.oConditions.odata[sName]["isUsed"] = 'y';
			return true;
		}
		
		/**
		 * 每步的并交的处理
		 * @param adata   该步骤要操作的对象合集名称
		 * @param haddata 上步骤所得的对象数组
		 * @param andor   并交集
		 * @returns {Array} 返回这步骤的数据组
		 */
		function _fnCondStepSort(adata, haddata, andor) {
			var odata = DataTable.ext.oConditions.odata;
			var todata = new Array();
			var tmpdata = new Array();
			var afilter = new Array();
			if(haddata) {
				tmpdata = tmpdata.concat(haddata);
			}
			for(var i in adata) {
				if(odata[adata[i]]["isUsed"] === 'y') {
					if(odata[adata[i]]["data"])
						tmpdata = tmpdata.concat(odata[adata[i]]["data"]);
					else if(odata[adata[i]]["col"])
						afilter.push({"str": adata[i], "col": odata[adata[i]]["col"]});
				}
			}
			if(andor === "and") {
				for(var i in afilter) {
					for (var j in tmpdata) {
						if(tmpdata[j].children(":eq("+afilter[i]["col"]+")").html() === afilter[i]["str"])
							todata.push(tmpdata[j]);
					}
					tmpdata = todata;
				}
			}
			return todata = tmpdata;
		}
		
		function _fnSortConditions() {
			var step = DataTable.ext.oConditions.Step;
			var tmpdata = null;
			tmpdata = _fnCondStepSort(step.Fst["adata"], tmpdata, step.Fst["andor"]);
			tmpdata = _fnCondStepSort(step.Sec["adata"], tmpdata, step.Sec["andor"]);
			tmpdata = _fnCondStepSort(step.Thr["adata"], tmpdata, step.Thr["andor"]);
			
			var aSort = DataTable.DataCols["aSort"];
			aSort["sortData"] = tmpdata;
			_fnSetDataDate(tmpdata);
			aSort["sortby"] = (DataTable.DataCols["aSort"]["sortby"]==="asc" ? "desc":"asc");
			var Cols = DataTable.ext.optdata.SortColumns.Cols;
			for(var i in Cols){
				if(Cols[i][0] === aSort.sortID) {
					_fnSort(aSort.sortID, Cols[i][1]);
					break;
				}
			}
		}
		
		/**
		 * 设置筛选参数
		 * @param Data     : 筛选的数据
		 * @param dataType : (筛选的结构)
		 * 					{ condName: 筛选条件的名字,
		 *					  FstCol: 查询的列号,
		 *					  SecCol: 查询的列号 }
		 * @returns {Boolean}
		 */
		function _fnSetConditions(Data, dataType) {
			var toData = DataTable.ext.oConditions.odata;
			
			if(!dataType["condName"] || !toData.hasOwnProperty(dataType["condName"]))
				return false;
			
			var condName = dataType["condName"];
			if(!DataTable.DataCols["Data"].hasOwnProperty(condName)) {
				if(toData.hasOwnProperty(condName)) {
					if(!dataType["FstCol"])
						return false;
					toData[condName]["data"] = Data;
					toData[condName]["col"] = dataType["FstCol"];
					toData[condName]["isUsed"] = 'y';
				} else if (condName === "类型") {
					for(var i in Data) {
						if(toData[i]["IsUsed"] === 'n' && DataTable.DataCols["Data"].hasOwnProperty(i)) {
							toData[i]["data"] = DataTable.DataCols["Data"][i];
							toData[condName]["isUsed"] = 'y';
						}
					}
				} else {return false;}
			} else {
				if(Data.hasOwnProperty("IsAll") && Data["IsAll"] === "y") {
					toData[condName]["data"] = DataTable.DataCols["Data"][condName];
					toData[condName]["isUsed"] = 'y';
				} else {
					var aFstData = Data["firstData"];
					var str = "";
					for(var i in aFstData) {
						if(aFstData[i].hasOwnProperty("IsNoCld") && aFstData[i]["IsNoCld"] === "y") {
							if(!_fnSaveConditions(condName, i, dataType["SecCol"]))
								return false;
						} else if(aFstData[i].hasOwnProperty("IsAll") && aFstData[i]["IsAll"] === "y") {
							if(!_fnSaveConditions(condName, i, dataType["FstCol"]))
								return false;
						} else {
							var aThrData = aFstData[i]["aData"];
							if(!_fnSaveConditions(condName, i, dataType["FstCol"], aThrData, dataType["SecCol"]))
								return false;
						}
					}
				}
			}
			_fnSortConditions();
			return true;
		}
		
		this.oApi = {
			"fnInit"                : _fnInit,
			"_fnLog"                : _fnLog,
			"_fnExtend"             : _fnExtend,
			"_fntransition"         : _fntransition,
			"_fnInitData"           : _fnInitData,
			"_fnAjaxSaveData"       : _fnAjaxSaveData,
			"_fnSaveData"           : _fnSaveData,
			"_fnSetDataDate"        : _fnSetDataDate,
			"_fnInitTheadSort"      : _fnInitTheadSort,
			"_fnSetTheadClass"      : _fnSetTheadClass,
			"fnSort"                : _fnSort,
			"_fnSortDate"           : _fnSortDate,
			"_fnSortDateElement"    : _fnSortDateElement,
			"_fnSortString"			: _fnSortString,
			"_fnSortNumerical"		: _fnSortNumerical,
			"_fnOut"                : _fnOut,
			"fnDefaultOut"          : _fnDefaultOut,
			"_fnInitConditions"     : _fnInitConditions,
			"_fnSaveConditions"		: _fnSaveConditions,
			"_fnCondStepSort"       : _fnCondStepSort,
			"_fnSortConditions"     : _fnSortConditions,
			"fnSetConditions"		: _fnSetConditions
		};
		
		$.extend( DataTable.ext.oApi, this.oApi );
		
		/* 判断控件为table */
		if ( this[0].nodeName.toLowerCase() != 'table' )
		{
			_fnLog( null, 0, "初始化的节点不是Table ："+this[0].nodeName );
			return ;
		}
		
		return _fnInit(odata, this[0]);
	};
	
	DataTable.version = "0.1.0";
	
	/**
	 * 
	 * @aDate   : { "每天的时间": { "oType": {"类型名字":{"sum":该类型的数据总和, "count":该类型的记录个数}},
	 *                			  "adata": 当天的行数据组,
	 *               		   "iSumCols": 当天的记录个数,
	 *                		   "trWidget": 当天的tr},
	 *               "sortday": 每天时间的排序
	 *            }
	 * @Data    : { "类型名字": [该类型的行数据组] }
	 * @aSort   : { doing  < 'n' or 'y' 默认为 y ,防止无数据及排序 >
	 * 				sortID <列数从零开始>
	 * 				sortby <"asc" or "desc"> 
	 *              sortData <需要输出的数据>
	 * 			  }
	 * @TrClass : { cClass: 隔行的CSS类[单行的css, 双行的css]
	 * 			    hClass: hover时CSS类
	 * 			  }
	 * @CountCols : 分页的数据
	 */
	DataTable.DataCols = {
		"aDate"     : {},
		"Data"      : {},
		"aSort"     : {"doing": "y", "sortID": null, "sortby": null, "sortData": null},
		"TrClass"   : {"cClass": [null, "notrans_td"], "hClass": "notrans_td"},
		"aClassData": {},
		"CountCols" : 0
	};
	
	DataTable.ext = {
		"sErrMode": "alert",
		"optdata" : {},
		"oApi"    : {},
		"oConditions": {}
	};
	
	/**
	 * 默认数据
	 * @SortColumns : 含2个数据的对象,包括1、需要排列的列数：{列数(从0开始计算)，该列的数据类型("date","string","numerical")}
	 * 									2、默认排列的列号
	 * @OperateCols : 操作列的列数(从0开始计算)
	 * @Searchwidget: 进行搜索的控件，一般为input,含有2个数据的对象,包括{搜索的列的列数，进行搜索的控件}
	 * @CountRows   : 按照时间进行统计，对象包括3个数据
	 *                {iOrderByTime: 时间所在列, iOrderByType: 统计时的类型, iOrderByTotal: 统计时的数据, trClass: 统计行的css类, tdCount: 合并的td个数}
	 * @Ajax        : ajax的地址
	 * @ajData      : ajax传送的数据
	 */
	DataTable.defaults = {
		"SortColumns" : {"Cols":null, "defCol":null},
		"OperateCols" : null,
		"SearchWidget": {},
		"CountRows"   : {},
		"Ajax"        : null,
		"ajData"	  : null
	};
	
	$.fn.DataTable = DataTable;
	
}(jQuery, window, document, undefined));

jQuery(document).ready(function($) {
	$("#datatable").DataTable({
		"SortColumns" : {"Cols":[[0, "date"],[1, "string"],[2, "string"],
		                         [3, "numerical"],[4, "string"],[5, "string"]],
		                 "defCol" : 0},
		"OperateCols" : 0,
		"SearchWidget": {"SearchCol": 5, "Id": "s_input"},
		"CountRows"   : {"iOrderByTime": 0, "iOrderByType": 1, "iOrderByTotal": 3, "trClass": "tr_sum", "tdCount": 7},
		"Ajax"		  : "plugin.php?id=account:ajax&func=aj_richlist",
		"ajData"	  : $("#tb_time1").attr("data")
	});
});
