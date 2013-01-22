/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-01-22
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
			
			_fnInitPages();
			
			_fnInitOperate();
			
			if( DataTable.ext.optdata["Ajax"] === null) {
				return ;
			} else {
				$.post(DataTable.ext.optdata["Ajax"], DataTable.ext.optdata["ajParam"],
					function(data) {
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
		 * 设置table的ajax的参数，并开始查询
		 * @param {string} sParam 参数
		 * @returns boolean
		 */
		function _fnAjaxSetParam(sParam){
			if(DataTable.ext.optdata["ajParam"] === sParam)
				return true;
			DataTable.ext.optdata["ajParam"] = sParam;

			$.post(DataTable.ext.optdata["Ajax"], DataTable.ext.optdata["ajParam"],
				function(data) {
					if( _fnAjaxSaveData(data) ) {
						_fnAgainSaveCond();
						_fnAgainOut();
					};
				});
			return true;
		}
		
		/**
		 * 存储ajax数据
		 *  @returns boolean
		 */
		function _fnAjaxSaveData(ajaxdata) {

			ajaxdata = ajaxdata.replace(/\n/g, "<BR>");
			var oReceive = $.parseJSON(ajaxdata);
			if(oReceive["state"] == "error") {
				_fnLog( null, 0, oReceive["errinfo"]);
				return false;
			}
			
			var oTable = {};
			if(!(oTable = oReceive["oTable"])) {
				_fnLog( null, 0, "无数据显示");
				return false;
			}
			
			var aDate = {"sortday" : null };
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
					tmpdate.setTime(tmpTime);
					var nMonth = parseInt(tmpdate.getMonth()) + 1;
					if( !aDate.hasOwnProperty(tmpTime) ) {
						aDate[tmpTime] = {"oType": {}, "adata": null, "trWidget": null};
						aDate[tmpTime]["oType"][oname] = {"sum": 0, "count": 0};
						aDate[tmpTime]["adata"] = new Array();
						aDate["sortday"].push(tmpTime);
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
					var oOperate = DataTable.ext.oOperate;
					var oCol = $('<tr id="'+ oData[0]
								+'"><td date="'+ oData[1] +'" class="td_left"></td>'
								+'<td class="td_rsecond td_linehide" title="'+oData[2]+'">'+ oData[2]
								+'</td><td class="td_lfirst td_linehide" title="'+oData[3]+'">'+ oData[3]
								+'</td><td class="td_right">'+ oData[4]
								+'</td><td class="td_center td_linehide" title="'+oData[5]+'">'+ oData[5]
								+'</td><td class="td_center td_linehide" title="'+oname+'">'+ oname
								+'</td><td class="td_left td_linehide" title="'+(oData[6]?oData[6].replace(/<BR>/g, "\r\n"):'')+'">'
								+(oData[6]?oData[6].replace(/<BR>/g, "\r\n"):'')+'</td></tr>')
								.hover(
									function () {
										$(this).children(":eq(0)").html("")
										.append(oOperate.DelCtl).append('<span class="pipe">|</span>').append(oOperate.ChangeCtl);
									},
									function () {
										$(this).children(":eq(0)").children().detach();
										if(DataTable.DataCols["aSort"]["OutType"] == "SortData"){
											var date=new Date($(this).children(":eq(0)").attr("date"));
											var month = parseInt(date.getMonth()) + 1;
											var idate = parseInt(date.getDate());
											$(this).children(":eq(0)")
													.html(date.getFullYear()+"."
															+(month<10 ? ("0"+month):month)+"."
															+(idate<10 ? ("0"+idate):idate));
										} //else
									}
								);
					oCol.children(":eq(0)").attr("title", tmpdate.getFullYear()+"年"+nMonth+"月"+tmpdate.getDate()+"日");
					if((tmpval = _fntransition(oData[4], "numerical")) === false)
						return false;
					oType[oname]["sum"] += tmpval;
					oType[oname]["count"]++;
					aDate[tmpTime]["adata"].push(oCol);
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
		function _fnSetDataDate(aData) {
			//清空date数据
			aDate = DataTable.DataCols["aDate"];
			aDate["sortday"] = [];
			for(var i in aDate) {
				if(i === "sortday")
					continue;
				aDate[i]["adata"]    = [];
				//$("ul >li" ,aDate[i]["trWidget"]).children(".ac_datefloat").remove();
				for(var j in aDate[i]["oType"]) {
					aDate[i]["oType"][j]["sum"]   = 0;
					aDate[i]["oType"][j]["count"] = 0;
				}
			}
			
			var idate, stype, imoney;
			for(var i in aData) {
				idate = _fntransition(aData[i].children(":eq(0)").attr("date"), "date");
				imoney = _fntransition(aData[i].children(":eq(3)").html(), "numerical");
				stype = aData[i].children(":eq(5)").html();
				aDate[idate]["adata"].push(aData[i]);
				aDate[idate]["oType"][stype]["sum"] += imoney;
				aDate[idate]["oType"][stype]["count"] ++;
			}
			
			for(var i in aDate) {
				if(i === "sortday")
					continue;
				if(aDate[i]["adata"].length)
					aDate["sortday"].push(i);
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
				if(date === "sortday")
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
		 * 按类型排序
		 * @param type  排序的类型
		 * @returns {boolean}
		 */
		function _fnOut(type) {
			switch(type) {
				case "date":
					_fnSetPagesNum("idayPages");
					_fnSetPagesDiv("idayPages");
					_fnPagesOut(1);
					break;
					
				default:
					_fnSetPagesNum("iPages");
					_fnSetPagesDiv("iPages");
					_fnPagesOut(1);
					break;
			}
			return true;
		}
		
		
		/**
		 * 新数据按旧排序显示
		 * @returns {Boolean}
		 */
		function _fnAgainOut() {
			var aSort = DataTable.DataCols["aSort"];
			aSort["sortby"] = (aSort["sortby"]==="asc" ? "desc":"asc");
			var Cols = DataTable.ext.optdata.SortColumns.Cols;
			for(var i in Cols){
				if(Cols[i][0] === aSort.sortID) {
					_fnSort(aSort.sortID, Cols[i][1]);
					break;
				}
			}
			return true;
		}
		
		/**
		 * 数据输出
		 * @returns {boolean}
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
		 * 注意： isUsed : 'y' 有筛选条件
		 *              : 'a' 类型选择
		 *              : 'n' 未使用该条件
		 */
		function _fnInitConditions() {
			DataTable.ext.oConditions = {
				"Step" : {
					"Fst": {"adata": ["借入", "借出", "还债", "收债"], "haddata": null, "filtertype": "and"},
					"Sec": {"adata": ["借贷账户"], "haddata": ["Fst"], "filtertype": "and"},
					"Thr": {"adata": ["支出", "转账", "收入"], "haddata": ["Sec"], "filtertype": "or"},
					"For": {"adata": ["账户"], "haddata": ["Thr"], "filtertype": "and"},
					"Fiv": {"adata": ["备注"], "haddata": ["For"], "filtertype": "contain"}},
				"odata": {"收入": {"data": null, "cond":"", "isUsed": 'n'}, "支出": {"data": null, "cond":"", "isUsed": 'n'},
						  "借入": {"data": null, "cond":"", "isUsed": 'n'}, "借出": {"data": null, "cond":"", "isUsed": 'n'},
						  "还债": {"data": null, "cond":"", "isUsed": 'n'}, "收债": {"data": null, "cond":"", "isUsed": 'n'},
						  "转账": {"data": null, "cond":"", "isUsed": 'n'},
						  "账户": {"cond":"", "isUsed": 'n'}, "借贷账户": {"cond":"", "isUsed": 'n'},
						  "备注": {"cond":"", "isUsed": 'n'}},
				"iCount": 0};
		}
		
		/**
		 * 筛选后存储需要显示的数据并返回
		 * @param sName   要比对的数据名
		 * @returns {Boolean}
		 */
		function _fnSaveConditions(sName) {
			
			var toData = new Array();
			
			if(DataTable.DataCols["Data"].hasOwnProperty(sName)) {
				var beData = DataTable.DataCols["Data"][sName];
				var aConditions = DataTable.ext.oConditions.odata[sName]["cond"];
				DataTable.ext.oConditions.odata[sName]["data"] = [];
				var tmpData = new Array();
				for(var i in aConditions.one) {
					for(var j in beData) {
						if(beData[j].children(":eq("+aConditions.one[i][1]+")").html() === aConditions.one[i][0])
							toData.push(beData[j]);
					}
				}
				for(var i in aConditions.two) {
					for(var j in beData) {
						if(beData[j].children(":eq("+aConditions.two[i][1]+")").html() === aConditions.two[i][0])
							tmpData.push(beData[j]);
					}
					for(var j in aConditions.two[i][2]) {
						for(var z in tmpData) {
							if(tmpData[z].children(":eq("+aConditions.two[i][3]+")").html() === aConditions.two[i][2][j])
								toData.push(tmpData[z]);
						}
					}
				}
			}
			
			DataTable.ext.oConditions.odata[sName]["data"] = toData;
			if(DataTable.ext.oConditions.odata[sName]["isUsed"] === 'n')
				DataTable.ext.oConditions.iCount++;
			DataTable.ext.oConditions.odata[sName]["isUsed"] = 'y';	//有可能是'a'条件
			return true;
		}
		
		/**
		 * 获取新数据后，按旧条件选择数据
		 * @returns {Boolean}
		 */
		function _fnAgainSaveCond(){
			var odata = DataTable.ext.oConditions.odata;
			for(var i in odata) {
				if(odata[i]["isUsed"] == 'a' && DataTable.DataCols["Data"].hasOwnProperty(i))
					odata[i]["data"] = DataTable.DataCols["Data"][i];
				else if(odata[i]["isUsed"] == 'y') {
					if(odata[i].hasOwnProperty("data")) {
						if(DataTable.DataCols["Data"].hasOwnProperty(i)) {
							if(odata[i]["cond"] == false)
								odata[i]["data"] = DataTable.DataCols["Data"][i];
							else {
								if(!_fnSaveConditions(i))
									return false;
							}
						}
					}
				}
			}
			_fnSortConditions();
			return true;
		}
		
		/**
		 * 每步的并交的处理
		 * @param adata   该步骤要操作的对象合集名称
		 * @param haddata 上步骤所得的对象数组
		 * @param filtertype   并交集
		 * @returns {Array} 返回这步骤的数据组
		 */
		function _fnCondStepSort(adata, haddata, filtertype) {
			var odata = DataTable.ext.oConditions.odata;
			var todata = new Array();
			var tmpdata = new Array();
			var afilter = [];
			if(haddata) {
				tmpdata = tmpdata.concat(haddata);
			}
			for(var i in adata) {
				if(odata[adata[i]]["isUsed"] != 'n') {	//'y'和'a'两种条件
					if(odata[adata[i]]["data"])
						tmpdata = tmpdata.concat(odata[adata[i]]["data"]);
					else if(typeof DataTable.DataCols["Data"][i] == "undefined")
						afilter = odata[adata[i]]["cond"];
				}
			}
			if(filtertype === "and") {
				for(var i in afilter) {
					for (var j in tmpdata) {
						if(tmpdata[j].children(":eq("+afilter[i]["col"]+")").html() === afilter[i]["str"])
							todata.push(tmpdata[j]);
					}
					tmpdata = todata;
				}
			} else if (filtertype === "contain") {
				for(var i in afilter) {
					for (var j in tmpdata) {
						var sData = tmpdata[j].children(":eq("+afilter[i]["col"]+")").html();
						sData = sData.replace(/[\r\n]/g, " ");
						var oSearch =  new RegExp(afilter[i]["str"].split(' '), "i");
						if( oSearch.test(sData) )
							todata.push(tmpdata[j]);
					}
					tmpdata = todata;
				}
			}
			return todata = tmpdata;
		}
		
		/**
		 * 筛选条件的排序输出
		 */
		function _fnSortConditions() {
			var step = DataTable.ext.oConditions.Step;
			var tmpdata = [];
			//当只有筛选账户和借贷账户时
			if(DataTable.ext.oConditions.iCount === 0) {
				var alldata = DataTable.DataCols["Data"];
				for(var i in alldata) {
					tmpdata = tmpdata.concat(alldata[i]);
				}
			}
			tmpdata = _fnCondStepSort(step.Fst["adata"], tmpdata, step.Fst["filtertype"]);
			tmpdata = _fnCondStepSort(step.Sec["adata"], tmpdata, step.Sec["filtertype"]);
			tmpdata = _fnCondStepSort(step.Thr["adata"], tmpdata, step.Thr["filtertype"]);
			tmpdata = _fnCondStepSort(step.For["adata"], tmpdata, step.For["filtertype"]);
			tmpdata = _fnCondStepSort(step.Fiv["adata"], tmpdata, step.Fiv["filtertype"]);
			
			var aSort = DataTable.DataCols["aSort"];
			aSort["sortData"] = tmpdata;
			_fnSetDataDate(tmpdata);
			_fnAgainOut();
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
			
			if(!dataType["condName"] ||
					(!toData.hasOwnProperty(dataType["condName"]) && dataType["condName"] != "类型"))
				return false;
			
			var condName = dataType["condName"];
			if(condName === "类型") {
				for(var i in Data) {
					if(toData[Data[i]]["isUsed"] === 'n') {
						if(DataTable.DataCols["Data"].hasOwnProperty(Data[i]))
							toData[Data[i]]["data"] = DataTable.DataCols["Data"][Data[i]];
						toData[Data[i]]["isUsed"] = 'a';
						DataTable.ext.oConditions.iCount++;
					}
				}
			} else if (!toData[condName].hasOwnProperty("data")) {
				if(!dataType["FstCol"])
					return false;
				toData[condName]["cond"] = [];
				for(var i in Data) {
					var tmp = {"str": Data[i], "col": dataType["FstCol"]};
					toData[condName]["cond"].push(tmp);
				}
				toData[condName]["isUsed"] = 'y';
			} else {
				if(Data.hasOwnProperty("IsAll") && Data["IsAll"] === "y") {
					if(DataTable.DataCols["Data"].hasOwnProperty(condName))
						toData[condName]["data"] = DataTable.DataCols["Data"][condName];
					if(toData[condName]["isUsed"] === 'n')
						DataTable.ext.oConditions.iCount++;
					toData[condName]["isUsed"] = 'y';	//有可能会是'a'的条件
					toData[condName]["cond"] = [];
				} else {
					var aFstData = Data["firstData"];
					var str = "";
					toData[condName]["data"] = [];
					toData[condName]["cond"] = {"one": [], "two": []};
					for(var i in aFstData) {
						if(aFstData[i].hasOwnProperty("IsNoCld") && aFstData[i]["IsNoCld"] === "y")
							toData[condName]["cond"]["one"].push([i, dataType["SecCol"]]);
						else if(aFstData[i].hasOwnProperty("IsAll") && aFstData[i]["IsAll"] === "y")
							toData[condName]["cond"]["one"].push([i, dataType["FstCol"]]);
						else {
							var aThrData = aFstData[i]["aData"];
							toData[condName]["cond"]["two"].push([i, dataType["FstCol"], aThrData, dataType["SecCol"]]);
						}
					}
					if(!_fnSaveConditions(condName))
						return false;
				}
			}
			_fnSortConditions();
			return true;
		}
		
		/**
		 * 删除筛选条件
		 * @param sType
		 * @returns {Boolean}
		 */
		function _fnDelConditions(sType){
			var oData = DataTable.ext.oConditions.odata;
			if(!oData.hasOwnProperty(sType) && sType != "类型" && sType != "all")
				return false;
			if(sType === "类型") {
				for(var i in oData) {
					if(oData[i]["isUsed"] === 'a') {
						oData[i]["isUsed"] = 'n';
						oData[i]["data"]  = [];
						DataTable.ext.oConditions.iCount--;
					}
				}
			} else if(sType === "all") {
				for(var i in oData) {
					oData[i]["cond"] = [];
					oData[i]["isUsed"] = 'n';
					if(oData[i].hasOwnProperty("data"))
						oData[i]["data"]  = [];
				}
				DataTable.ext.oConditions.iCount = 0;
			} else {
				if(oData[sType]["isUsed"] === 'y') {
					oData[sType]["isUsed"] = 'n';
					oData[sType]["cond"]  = [];
					if(oData[sType].hasOwnProperty("data") && oData[sType]["data"]) {
						oData[sType]["data"]  = [];
						DataTable.ext.oConditions.iCount--;
					}
				}
			}
			
			for(var i in oData) {
				if(oData[i]["isUsed"] != 'n') {	//存在y和a两种条件
					_fnSortConditions();
					return true;
				}
			}
			
			//显示所有数据
			var alldata = DataTable.DataCols["Data"];
			var tmpdata = [];
			for(var i in alldata) {
				tmpdata = tmpdata.concat(alldata[i]);
			}
			var aSort = DataTable.DataCols["aSort"];
			aSort["sortData"] = tmpdata;
			_fnSetDataDate(tmpdata);
			
			_fnAgainOut();
			
			return true;
		}
		
		function _fnInitPages() {
			if(!DataTable.ext.optdata.pagedivId)
				return true;
			divId = DataTable.ext.optdata.pagedivId;
			$("#"+divId).hide().children().remove();
			
			DataTable.ext.oPages = {"curType": null, "iPagesCount": 5, "iStart": 0, "iEnd": 0, "idayPages": 0, "adays":[], "iPages": 0 };
			return true;
		}
		
		function _fnSetPagesNum(PagesType) {
			var oPages = DataTable.ext.oPages;
			var divId = DataTable.ext.optdata.pagedivId;
			var iPageCols = DataTable.DataCols.PageCols;
			if(iPageCols == 0 || !divId)
				return true;
			oPages.curType = PagesType;
			switch(PagesType) {
				case "idayPages":
					var aOutData = DataTable.DataCols["aDate"];
					var tmplen = 0, x;
					oPages.adays = [];
					oPages.idayPages = 0;
					oPages.adays.push(0);		//这里表示从0开始
					for (x = 0; x < aOutData["sortday"].length; x++) {
						var tmpDate = aOutData["sortday"][x];
						tmplen += aOutData[tmpDate]["adata"].length;
						if(tmplen >= iPageCols) {
							oPages.adays.push(x+1);
							tmplen = 0;
							oPages.idayPages++;
						}
					}
					if(tmplen){
							oPages.adays.push(x);
							oPages.idayPages++;
					}
					break;
					
				case "iPages":
					var aOutData = DataTable.DataCols["aSort"]["sortData"];
					oPages.iPages = Math.ceil(aOutData.length/iPageCols);
					break;
					
				default:
					return false;
			}
			return true;
		}
		
		function _fnSetPagesDiv(PagesType) {
			oPages = DataTable.ext.oPages;
			divId = DataTable.ext.optdata.pagedivId;
			if(DataTable.DataCols == 0 || !divId)
				return true;
			$("#"+divId).hide().children().remove();
			if(oPages.hasOwnProperty(PagesType)) {
				iNum = oPages[PagesType];
				if(iNum<2)
					return false;
				$('<a class="prev">上一页</a>').appendTo("#"+divId).click(function(){
					_fnPagesOut($("#"+divId).children("strong").html()-1);
				});

				$('<a class="first">'+1+'...</a>').appendTo("#"+divId).click(function(){
					_fnPagesOut(1);
				});
					
				$('<strong>0</strong>').appendTo("#"+divId);
				
				var itmp = iNum<oPages.iPagesCount ? iNum:oPages.iPagesCount;
				for (var i = 2; i <= itmp; i++) {
					$('<a name="'+i+'">'+i+'</a>').appendTo("#"+divId).click(function(){
						_fnPagesOut($(this).html());
					});
				}
				
				oPages.iStart = 1;
				oPages.iEnd = itmp;
				
				$('<a class="last">...'+iNum+'</a>').appendTo("#"+divId).click(function(){
					_fnPagesOut(parseInt($(this).html().slice(3)));
				});
				
				$('<label><input id="custompage" class="px" type="text" value="1" title="输入页码，按回车快速跳转" size="2" /><span title="共 '
						+iNum+' 页"> / '+iNum+' 页</span></label>').appendTo("#"+divId);
				$('#custompage').keypress(function(eventData){
					if(eventData.keyCode == 13 && parseInt($(this).val()) > 0)
						_fnPagesOut(parseInt($(this).val()));
				});
				
				$('<a class="nxt">下一页</a>').appendTo("#"+divId).click(function(){
					_fnPagesOut(parseInt($("#"+divId).children("strong").html())+1);
				});
			}
			return true;
		}
		
		function _fnChangePagesDiv(iNum) {
			var oPages = DataTable.ext.oPages;
			$("#"+divId).show();
			if(oPages[oPages.curType]<2)
				return false;
			var tmpStrong = $("#"+divId).children("strong");
			if(iNum == tmpStrong.html())
				return true;
			$("a.nxt", "#"+divId).show();
			$("a.prev", "#"+divId).show();
			if (iNum == 1) {
				$("a.prev", "#"+divId).hide();
			} else if (iNum == oPages[oPages.curType]) {
				$("a.nxt", "#"+divId).hide();
			}
			
			if(iNum<=oPages.iStart || iNum>=oPages.iEnd) {
				$("a.first", "#"+divId).hide();
				$("a.last", "#"+divId).hide();
				var tmp = Math.floor(oPages.iPagesCount/2);
				
				oPages.iEnd = parseInt(tmp)+parseInt(iNum)-(oPages.iPagesCount%2?0:1);
				if(oPages.iEnd < oPages[oPages.curType]) {
					$("a.last", "#"+divId).show();
				} else if (oPages.iEnd > oPages[oPages.curType]) {
					tmp += oPages.iEnd - oPages[oPages.curType];
					oPages.iEnd = oPages[oPages.curType];
				}
				
				oPages.iStart = 1;
				if(iNum > tmp+1) {
					$("a.first", "#"+divId).show();
					oPages.iStart = iNum - tmp;
				}
				
				$("a[name]", "#"+divId).each(function(index) {
					if(iNum <= oPages.iStart+index) {
						if(iNum == oPages.iStart+index)
							tmpStrong.insertBefore($("a.last", "#"+divId)).html(iNum);
						$(this).insertBefore($("a.last", "#"+divId)).html(oPages.iStart+index+1);
					} else {
						$(this).insertBefore($("a.last", "#"+divId)).html(oPages.iStart+index);
					}
				});
				if(iNum == oPages.iEnd) {
					tmpStrong.insertBefore($("a.last", "#"+divId)).html(iNum);
				}
			} else {
				$("a[name]", "#"+divId).each(function(index) {
					if($(this).html() == iNum) {
						$(this).after('<strong>'+$(this).html()+'</strong>');
						$(this).insertAfter(tmpStrong).html(tmpStrong.html());
						tmpStrong.remove();
						return false;
					}
				});
			}
			
			$("#custompage").val(iNum);
			$("#"+divId).show();
			return true;
		}
		
		function _fnPagesOut(iNum) {
			var othis = DataTable.ext.oTable;
			var oPages = DataTable.ext.oPages;
			var iPageCols = DataTable.DataCols.PageCols;
			othis = $("tbody", othis);
			othis.children().hide();
			var x = imax = 0;
			switch(oPages.curType) {
				case "idayPages":
					var aOutData = DataTable.DataCols["aDate"];
					if(iPageCols) {
						iNum = iNum>oPages.idayPages ? oPages.idayPages:iNum;
						x = oPages.adays[iNum-1];
						imax = oPages.adays[iNum];
					} else {
						x = 0;
						imax = aOutData["sortday"].length;
					}
					for (; x < imax; x++) {
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
							aData[y].children(":eq(0)").html("");
							othis.append(aData[y]);
							$(aData[y]).show();
						}
					}
					DataTable.DataCols["aSort"]["OutType"] = "DateData";
					break;
					
				case "iPages":
					var aOutData = DataTable.DataCols["aSort"]["sortData"];
					if(iPageCols) {
						iNum = iNum>oPages.iPages ? oPages.iPages:iNum;
						x = iPageCols*(iNum-1);
						imax = iPageCols*iNum;
					} else {
						x = 0;
						imax = aOutData.length;
					}
					for (; x<imax && x<aOutData.length; x++) {
						if( !(x%2) && $(aOutData[x]).hasClass(DataTable.DataCols.TrClass["cClass"][1]) )
							$(aOutData[x]).removeClass(DataTable.DataCols.TrClass["cClass"][1]);
						else
							$(aOutData[x]).addClass(DataTable.DataCols.TrClass["cClass"][x%2]);
						var date=new Date(aOutData[x].children(":eq(0)").attr("date"));
						var month = parseInt(date.getMonth()) + 1;
						var idate = parseInt(date.getDate());
						aOutData[x].children(":eq(0)")
									.html(date.getFullYear()+"."
											+(month<10 ? ("0"+month):month)+"."
											+(idate<10 ? ("0"+idate):idate));
						othis.append(aOutData[x]);
						$(aOutData[x]).show();
					}
					DataTable.DataCols["aSort"]["OutType"] = "SortData";
					break;
				default:
					return false;
			}
			return _fnChangePagesDiv(iNum);
		}
		
		function _fnInitOperate() {
			
			var aDel = $('<a style="color: #f00; cursor: pointer;">删除</a>').click(function(){
				var trData = $(this).closest("tr");
				var msg = '您确定要删除于<label style="color: #f00;">'+trData.children(":eq(0)").attr("title")+
							'</label>发生的<br/>一笔金额为<label style="color: #f00;">'+
							trData.children(":eq(3)").html()+'</label>的记录吗?';
				hideWindow("change");
				showDialog(msg, "confirm", "操作提示", "jQuery('#datatable').DataTable.ext.oApi.fnDelData(\""+trData.children(":eq(3)").html()+"\")");
			});
			
			var aChange = $('<a style="color:#f00; cursor: pointer;">修改</a>').click(function(){
				showWindow("change", "plugin.php?id=account:index&mod=winchange");
			});
			
			DataTable.ext.oOperate = {"DelCtl": aDel, "ChangeCtl": aChange};
		}
		
		function _fnDelData(e) {
			alert(e);
		}
		
		this.oApi = {
			"fnInit"                : _fnInit,
			"_fnLog"                : _fnLog,
			"_fnExtend"             : _fnExtend,
			"_fntransition"         : _fntransition,
			"fnAjaxSetParam"        : _fnAjaxSetParam,
			"_fnAjaxSaveData"       : _fnAjaxSaveData,
			"_fnSetDataDate"        : _fnSetDataDate,
			"_fnInitTheadSort"      : _fnInitTheadSort,
			"_fnSetTheadClass"      : _fnSetTheadClass,
			"fnSort"                : _fnSort,
			"_fnSortDate"           : _fnSortDate,
			"_fnSortDateElement"    : _fnSortDateElement,
			"_fnSortString"         : _fnSortString,
			"_fnSortNumerical"      : _fnSortNumerical,
			"_fnOut"                : _fnOut,
			"_fnAgainOut"           : _fnAgainOut,
			"fnDefaultOut"          : _fnDefaultOut,
			"_fnInitConditions"     : _fnInitConditions,
			"_fnSaveConditions"     : _fnSaveConditions,
			"_fnAgainSaveCond"      : _fnAgainSaveCond,
			"_fnCondStepSort"       : _fnCondStepSort,
			"_fnSortConditions"     : _fnSortConditions,
			"fnSetConditions"       : _fnSetConditions,
			"fnDelConditions"       : _fnDelConditions,
			"_fnInitPages"          : _fnInitPages,
			"_fnSetPagesNum"        : _fnSetPagesNum,
			"_fnSetPagesDiv"        : _fnSetPagesDiv,
			"_fnChangePagesDiv"     : _fnChangePagesDiv,
			"_fnPagesOut"           : _fnPagesOut,
			"_fnInitOperate"        : _fnInitOperate,
			"fnDelData"             : _fnDelData
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
	 *                		   "trWidget": 当天的tr},
	 *               "sortday": 每天时间的排序
	 *            }
	 * @Data    : { "类型名字": [该类型的行数据组] }
	 * @aSort   : { doing  < 'n' or 'y' 默认为 y ,防止无数据及排序 >
	 * 				sortID <列数从零开始>
	 * 				sortby <"asc" or "desc">
	 *				OutType <"SortData" or "DateData">
	 *              sortData <需要输出的数据>
	 * 			  }
	 * @TrClass : { cClass: 隔行的CSS类[单行的css, 双行的css]
	 * 			    hClass: hover时CSS类
	 * 			  }
	 * @PageCols : 每页的数据量
	 */
	DataTable.DataCols = {
		"aDate"     : {},
		"Data"      : {},
		"aSort"     : {"doing": "y", "sortID": null, "sortby": null, "OutType":null, "sortData": null},
		"TrClass"   : {"cClass": [null, "notrans_td"], "hClass": "notrans_td"},
		"aClassData": {},
		"PageCols"  : 30
	};
	
	DataTable.ext = {
		"sErrMode"    : "alert",
		"optdata"     : {},
		"oApi"        : {},
		"oConditions" : {},
		"oPages"      : {},
		"oOperate"    : {}
	};
	
	/**
	 * 默认数据
	 * @SortColumns : 含2个数据的对象,包括1、需要排列的列数：{列数(从0开始计算)，该列的数据类型("date","string","numerical")}
	 * 									2、默认排列的列号
	 * @OperateCols : 操作列的列数(从0开始计算)
	 * @CountRows   : 按照时间进行统计，对象包括3个数据
	 *                {iOrderByTime: 时间所在列, iOrderByType: 统计时的类型, iOrderByTotal: 统计时的数据, trClass: 统计行的css类, tdCount: 合并的td个数}
	 * @Ajax        : ajax的地址
	 * @ajParam     : ajax传送的参数
	 * @pagedivId   : pageDIV的ID号
	 */
	DataTable.defaults = {
		"SortColumns" : {"Cols": null, "defCol": null},
		"OperateCols" : null,
		"CountRows"   : {},
		"Ajax"        : null,
		"ajParam"     : null,
		"pagedivId"   : null
	};
	
	$.fn.DataTable = DataTable;
	
}(jQuery, window, document, undefined));

jQuery(document).ready(function($) {
	$("#datatable").DataTable({
		"SortColumns" : {"Cols":[[0, "date"],[1, "string"],[2, "string"],
		                         [3, "numerical"],[4, "string"],[5, "string"]],
		                 "defCol" : 0},
		"OperateCols" : 0,
		"CountRows"   : {"iOrderByTime": 0, "iOrderByType": 1, "iOrderByTotal": 3, "trClass": "tr_sum", "tdCount": 7},
		"Ajax"		  : "plugin.php?id=account:ajax&func=aj_richlist",
		"ajParam"	  : $("#tb_time").attr("data"),
		"pagedivId"   : "tb_page"
	});
});
