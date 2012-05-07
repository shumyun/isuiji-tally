/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-04-28
 *    Author: shumyun
 *    Copyright (C) 2011 - forever 21bang.net Inc
 */

(function($, window, document, undefined) {
	var DataTable = function (odata) {
		function _fnInit(odata, othis)
		{
			//初始化数据
			$.extend(true, DataTable.ext, {"oTable": othis});
			DataTable.ext.optdata = _fnExtend( $.extend(true, {}, DataTable.defaults), odata );
			
			//整合表格数据
			_fnInitData();
			
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
		 * 存储数据
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
		 * 数据排序
		 *  @returns boolean
		 */
		function _fnSortData(){
				/*
	  		for (var x in aSortColumns) {
					var aSort = aSortColumns[x];
					
					if( $(this).children() || $(this).children().eq(aSort[0]) ) {
						var tmp = $(this).children().eq(aSort[0]);
						if(!(tmp = _fntransition(tmp.html().replace(/\./g, "/"), aSort[1]))) 
							return false;
							
						var oCol = DataTable.DataCols["aSort"];
						oCol["count"]++;
						alert(DataTable.DataCols["aSort"][aSort[0]]["count"]);
					} else {
						_fnLog( null, 0, "找不到相应的节点存储。");
						return false;
					}
				}
				*/
			return true;
		}
		
		/**
		 * 数据输出
		 *  @returns boolean
		 */
		function _fnDefaultOut() {
			var aOutData = DataTable.DataCols["aDate"];
			var othis = DataTable.ext.oTable;
			othis = $("tbody", othis);
	  	for (var x in aOutData) {
	  		//var d = new Date(x);
	  		var d=0;
				var aData = aOutData[x]["adata"];
				
	  		var oCol = $('<tr class="' + DataTable.ext["optdata"]["CountRows"]["trClass"] + '">\
	  										<td colspan="' + DataTable.ext["optdata"]["CountRows"]["tdCount"] + '">' + d + '</td></tr>');
				othis.append(oCol);
				for (var y=0; y<aData.length; y++) {
					othis.append(aData[y]);
					$(aData[y]).show();
					if(y%2) $(aData[y]).addClass(DataTable.ext["optdata"]["trClass"]);
				}
			}
			return true;
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
					if ( typeof srcdata != 'string' ) { srcdata = ''; }
						return srcdata.toLowerCase();
						
				default:
					_fnLog( null, 0, "存储的数据类型有误");
					return false;
  		};
		}
		
		this.oApi = {
			"fnInit"        : _fnInit,
			"_fnLog"        : _fnLog,
			"_fnExtend"     : _fnExtend,
			"_fntransition" : _fntransition,
			"_fnInitData"   : _fnInitData,
			"_fnSaveData"   : _fnSaveData,
			"_fnSortData"   : _fnSortData,
			"fnDefaultOut"  : _fnDefaultOut
		};
		
		/* 判断控件为table */
		if ( this[0].nodeName.toLowerCase() != 'table' )
		{
			_fnLog( null, 0, "初始化的节点不是Table ："+this[0].nodeName );
			return ;
		}
		
		return _fnInit(odata, this[0]);
	};
	
	DataTable.version = "0.1.0";
	
	DataTable.DataCols = {
		"aDate"     : null,
		"aSort"     : null,
		"CountCols" : 0
	};
	
	DataTable.ext = {
		"sErrMode": "alert",
		"optdata" : {}
	};
	
	/**
	 * 默认数据
	 * @SortColumns : 含2个数据的对象,包括{列数(从0开始计算)，该列的数据类型("date","string","numerical")}
	 * @Searchwidget: 进行搜索的控件，一般为input,含有2个数据的对象,包括{搜索的列的列数，进行搜索的控件}
	 * @CountRows   : 按照时间进行统计，对象包括3个数据
	 *                {iOrderByTime: 时间所在列, iOrderByType: 统计时的类型, iOrderByTotal: 统计时的数据, trClass: 统计行的css类, tdCount: 合并的td个数}
	 * @trClass     : 隔行的CSS类[单行的css, 双行的css]
	 * @operateCols : 操作列的列数(从0开始计算)
	 */
	DataTable.defaults = {
		"SortColumns" : null,
		"TrClass"     : null,
		"OperateCols" : null,
		"SearchWidget": {},
		"CountRows"   : {},
		"Ajax"        : {}
	};
	
	$.fn.DataTable = DataTable;
	
}(jQuery, window, document, undefined));

jQuery(document).ready(function($) {
	$("#datatable").DataTable({
		"SortColumns" : [[0, "date"],
		                 [1, "string"],
		                 [2, "string"],
		                 [3, "numerical"],
		                 [4, "string"]],
		"TrClass"     : [null, "notrans_td"],
		"OperateCols" : 6,
		"SearchWidget": {"SearchCol": 5, "Id": "s_input"},
		"CountRows"   : {"iOrderByTime": 0, "iOrderByType": 1, "iOrderByTotal": 3, "trClass": "tr_sum", "tdCount": 7},
		"Ajax"        : {"url":"plugin.php?id=account:ajax&func=aj_richlist", "bProcessing": true}
	});
});