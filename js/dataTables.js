/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-04-23
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
			_fnSortData(odata);
			
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
		 * 整合原始datatable数据,包括排序、合计
		 *  @param {object} oOut Object to extend
		 *  @param {object} oExtender Object from which the properties will be applied to oOut
		 *  @returns {object} oOut Reference, just for convenience - oOut === the return.
		 *  @memberof DataTable#oApi
		 *  @todo This doesn't take account of arrays inside the deep copied objects.
		 */
		function _fnSortData(odata) {
			if(!DataTable.ext.hasOwnProperty("oTable") || DataTable.ext["oTable"] === null) {
				_fnLog( null, 0, "找不到相应的table控件。");
				return false;
			}
			othis = DataTable.ext["oTable"];
			
			$("tbody > tr", othis).length;
			return true;
		}
		
		this.oApi = {
			"fnInit"    : _fnInit,
			"_fnLog"    : _fnLog,
			"_fnExtend" : _fnExtend,
			"_fnSortData" : _fnSortData
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
	
	DataTable.optdata = {};
	
	DataTable.ext = {
		"sErrMode": "alert",
		"optdata" : {}
	};
	
	/**
	 * 默认数据
	 * @SortColumns : 含2个数据的对象,包括{列数(从0开始计算)，该列的数据类型("date","string","numerical")
	 * @Searchwidget: 进行搜索的控件，一般为input,含有2个数据的对象,包括{搜索的列的列数，进行搜索的控件}
	 * @CountRows   : 按照时间进行统计，对象包括3个数据
	 *                {iOrderByTime: 时间所在列, iOrderByType: 统计时的类型, iOrderByTotal: 统计时的数据}
	 */
	DataTable.defaults = {
		"SortColumns" : null,
		"SearchWidget": null,
		"CountRows"   : null
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
		"SearchWidget": [5, "s_input"],
		"CountRows"   : [{"iOrderByTime": 0}, {"iOrderByType": 1}, {"iOrderByTotal": 3}]
	});
});