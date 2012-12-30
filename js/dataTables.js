/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-12-29
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
			
			//判断数据来源
			//if( $.isEmptyObject(DataTable.ext.optdata["Ajax"])) {
			if( DataTable.ext.optdata["Ajax"] === null) {
				//整合表格数据
				_fnInitData();
			} else {
				$.post(DataTable.ext.optdata["Ajax"], DataTable.ext.optdata["ajData"], function(data) {
								_fnAjaxSaveData(data);
								_fnSetSort();
								_fnDefaultOut();
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
				return ;
			}
			
			var oTable = {};
			if(!(oTable = oReceive["oTable"])) {
				_fnLog( null, 0, "无数据显示");
				return ;
			}
			
			var aDate = {"sortday" : null, "asort" : null };
			aDate["sortday"] = new Array();
			aDate["asort"] = new Array();
			for (var oname in oTable) {
				var aData = oTable[oname];
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
								+'"><td class="td_left"></td>'
								+'<td class="td_rsecond">'+ oData[2]
								+'</td><td class="td_lfirst">'+ oData[3]
								+'</td><td class="td_right">'+ oData[4]
								+'</td><td class="td_center">'+ oname
								+'</td><td class="td_center">'+ oData[5]
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
					aDate["asort"].push(oCol);
				}
			}
			DataTable.DataCols["aDate"] = aDate;
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

		/**
		 * 排序初始化
		 * @returns {Boolean}
		 */
		function _fnSetSort() {
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
					th.bind("click.DT", { index: aCols[i][0],type: aCols[i][1], fn: DataTable.ext.oApi.fnSort}, function(e){
						e.data.fn(e.data.index, e.data.type);
					}).css("cursor", "pointer");
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
			var aDate = DataTable.DataCols["aDate"];
			switch( sortby ) {
				case "asc":
					aDate["asort"].sort(function(a, b) {
						x = pinyin(_fntransition(a.children('":eq('+index+')"').html(), "string"), false, ",");
						y = pinyin(_fntransition(b.children('":eq('+index+')"').html(), "string"), false, ",");
						xId = a.attr("id");
						yId = b.attr("id");
						return ((x < y) ? -1 : ((x > y) ? 1 : (xId - yId)));
					});
					break;
				case "desc":
					aDate["asort"].sort(function(a, b) {
						x =  pinyin(_fntransition(a.children('":eq('+index+')"').html(), "string"), false, ",");
						y =  pinyin(_fntransition(b.children('":eq('+index+')"').html(), "string"), false, ",");
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
		 * 
		 * @param type  排序的类型
		 * @returns boolean
		 */
		function _fnOut(type) {
			var aOutData = DataTable.DataCols["aDate"];
			var othis = DataTable.ext.oTable;
			othis = $("tbody", othis);
			othis.children().hide();
			switch(type) {
				case "date":
					for (var x = 0; x < aOutData["sortday"].length; x++) {
						var tmpDate = aOutData["sortday"][x];
						var aData = aOutData[tmpDate]["adata"];
						var OutType = aOutData[tmpDate]["oType"];
						var str = "";
						
						$("td>ul", aOutData[tmpDate]["trWidget"]).children().remove(".ac_datefloat");
						
						for (var i in OutType) {
							str += '<strong style="padding-right: 15px;">'+i+'：';
							switch(i) {
								case '收入':
									str += '<font color="green">+'+OutType[i].sum.toFixed(2).toString()+'</font>';
									break;
						
								case '支出':
									str += '<font color="red">-'+OutType[i].sum.toFixed(2).toString()+'</font>';
									break;
						
								default:
									break;
							}
							str += '（'+OutType[i].count+'条记录）</strong>';
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
					var aData = aOutData["asort"];
					for (var x = 0; x < aData.length; x++) {
						if( !(x%2) && $(aData[x]).hasClass(DataTable.DataCols.TrClass["cClass"][1]) )
							$(aData[x]).removeClass(DataTable.DataCols.TrClass["cClass"][1]);
						else
							$(aData[x]).addClass(DataTable.DataCols.TrClass["cClass"][x%2]);
						othis.append(aOutData[x]);
						$(aData[x]).show();
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
			th.append($('<span id="sort" class="ac_sortby">&darr;</span>'));
			aSort.doing = "n";
			aSort.sortID = DataTable.ext.optdata["SortColumns"]["defCol"];
			aSort.sortby = "desc";
			return true;
		}
		
		this.oApi = {
			"fnInit"                : _fnInit,
			"_fnLog"                : _fnLog,
			"_fnExtend"             : _fnExtend,
			"_fntransition"         : _fntransition,
			"_fnInitData"           : _fnInitData,
			"_fnSaveData"           : _fnSaveData,
			"_fnAjaxSaveData"       : _fnAjaxSaveData,
			"_fnSetSort"            : _fnSetSort,
			"fnSort"                : _fnSort,
			"_fnSortDate"           : _fnSortDate,
			"_fnSortDateElement"    : _fnSortDateElement,
			"fnDefaultOut"          : _fnDefaultOut
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
	 * @aDate       : { "每天的时间": { "oType":    {"类型名字":{"sum":该类型的数据总和, "count":该类型的记录个数}},
	 *                                  "adata":    当天数据,
	 *                                  "iSumCols": 当天的记录个数,
	 *                                  "trWidget": 当天的tr}
	 *                  "sortday"   : 每天时间的排序 }
	 * @aSort       : { doing  < 'n' or 'y' 默认为 y ,防止无数据及排序 >
	 * 					sortID <列数从零开始>
	 * 					sortby <"asc" or "desc">    }
	 * @TrClass     : cClass: 隔行的CSS类[单行的css, 双行的css]
	 * 				  hClass: hover时CSS类
	 */
	DataTable.DataCols = {
		"aDate"     : null,
		"aSort"     : {"doing": "y", "sortID": null, "sortby": null},
		"TrClass"   : {"cClass": [null, "notrans_td"], "hClass": "notrans_td"},
		"CountCols" : 0
	};
	
	DataTable.ext = {
		"sErrMode": "alert",
		"optdata" : {},
		"oApi"    : {}
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
