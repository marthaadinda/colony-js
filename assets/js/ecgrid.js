$.fn.ecGrid = function (method) {
	if (methodsGrid[method]) {
		return methodsGrid[method].apply(this, Array.prototype.slice.call(arguments, 1));
	} else {
		methodsGrid['init'].apply(this,arguments);
	}
}

$(function() {
	
});

var Settings_EcGrid = {
	serverSide: false,
	dataSource: {
		data:[],
		serverModel: {
			recordsTotal: "",
			recordsData: "",
		},
	},
	height: 0,
	width: 0,
	// groupable: true,
	sortable: true,
	pageable: {
		refresh: true,
		// pageSizes: true,
		buttonCount: 5,
	},
	columns: [],
	footer: {
		visible: false,
		columnIndex: 0,
		displayTemplate: "",
		field: "",
	},
	selectRow: function(res){

	},
	changePage: function(res){

	},
};

var Setting_Coloumn = {
	displayTemplateRow: function(){
		return "";	
	},
	field: "",
	title: "",
	attrColoumn: {},
	displayTemplateHeader: "",
	classHeader: "",
	attrHeader: {},
	width: "",
	freeze: false,
	displayTemplateFooter: "",
	classFooter: "",
	attrFooter: {},
	columns: [],
}

var methodsGrid = {
	init: function(options){
		var settings = $.extend({}, Settings_EcGrid, options || {});
		var settingDataSources = $.extend({}, Setting_DataSource_Lookup, settings['dataSource'] || {});
		return this.each(function () {
			$(this).data("ecGrid", new $.ecGridSetting(this,settings));
			$(this).data("ecGridDataSource", new $.ecDataSource(this,settings['dataSource'], "ecGridDataSource"));
			methodsGrid.createElementGrid(this, settings);
		});
	},
	createElementGrid: function(element, options){
		$(element).html("");
		var $o = $(element), $container = $o.parent(), idgrid = $o.attr('id'), columndata = {}, footerTemp = false, $divHeadCol, $divRightCol;
		$o.data('ecGridDataSource').Reload();
		var records = $o.data('ecGridDataSource').getDataSource(), objfreeze = {};

		$divTable = $("<div class='ecgrid-tbcontainer'></div>");
		$divTable.appendTo($o);

		options.columns.map(function (a,b) { 
			columndata = $.extend({}, Setting_Coloumn, options.columns[b] || {});
			if (columndata.freeze in objfreeze) objfreeze[columndata.freeze].push(columndata); else objfreeze[columndata.freeze] = [columndata]; } 
		);
		var splitElement = "", elementCreate = "";
		if (objfreeze.true){
			$divHeadCol = $("<div class='ecgrid-headcol'></div>");
			$divHeadCol.appendTo($divTable);

			$tablehead = $("<table class='table ecgrid table-bordered table-striped'></table>");
			$tablehead.appendTo($divHeadCol);

			$tagHead = $('<thead class="ecgrid-head"></thead>');
			$tagHead.appendTo($tablehead);
			$tagHeadtr = $('<tr></tr>');
			$tagHeadtr.appendTo($tagHead);
			$tagFootHeadtr = $('<tr></tr>');
			for (var a = 0; a < objfreeze.true.length; a++){
				$tagFoottd = $('<th>&nbsp;</th>');
				if(objfreeze.true[a].displayTemplateFooter != ""){
					footerTemp = true;
					$tagFoottd = $('<th>'+objfreeze.true[a].displayTemplateFooter+'</th>');
				}
				$tagFoottd.addClass(objfreeze.true[a].classFooter);
				$tagFoottd.appendTo($tagFootHeadtr);

				$tagHeadth = $('<th>&nbsp;</th>');
				if (objfreeze.true[a].displayTemplateHeader != "")
					$tagHeadth = $('<th>'+objfreeze.true[a].displayTemplateHeader+'</th>');
				else if (objfreeze.true[a].title != "" && objfreeze.true[a].displayTemplateHeader == "")
					$tagHeadth = $('<th>'+objfreeze.true[a].title+'</th>');
				$tagHeadth.addClass(objfreeze.true[a].classHeader);
				$tagHeadth.css("width", objfreeze.true[a].width);
				$tagHeadth.appendTo($tagHeadtr);
			}
			$tagbody = $('<tbody class="ecgrid-body"></tbody>');
			$tagbody.appendTo($tablehead);

			for (var i = 0; i < records.length; i++) {
				$tagRow = $('<tr></tr>');
				$tagRow.appendTo($tagbody);
				for( var a = 0; a < objfreeze.true.length; a++){
					if(objfreeze.true[a].displayTemplateRow() != "" ){
						splitElement = objfreeze.true[a].displayTemplateRow().split('#'); elementCreate = '';
						for (var key in splitElement){
							var res = splitElement[key].substring(0,1);
							if (res == '*'){
								elementCreate += records[i][splitElement[key].substring(1,splitElement[key].length)];
							} else {
								elementCreate += splitElement[key];
							}
						}
						$tagColoumn = $('<td>'+elementCreate+'</td>');
					}else{
						$tagColoumn = $('<td>'+records[i][objfreeze.true[a].field]+'</td>');
					}
					$tagColoumn.attr(objfreeze.true[a].attrColoumn);
					$tagColoumn.appendTo($tagRow);
				}
			}
			$divRightCol = $("<div class='ecgrid-rightcol'></div>");
			$divRightCol.appendTo($divTable);
		}

		$tableElem = $('<table class="table ecgrid table-bordered table-striped"></table>');
		if (objfreeze.true){
			$tableElem.appendTo($divRightCol);
		} else {
			$tableElem.appendTo($o);
		}
		$tagHead = $('<thead class="ecgrid-head"></thead>');
		$tagHead.appendTo($tableElem);
		$tagHeadtr = $('<tr></tr>');
		$tagHeadtr.appendTo($tagHead);
		$tagbody = $('<tbody class="ecgrid-body"></tbody>');
		$tagbody.appendTo($tableElem);

		$tagFoottr = $('<tr></tr>');
		var widthRight = 0;
		for (var a = 0; a < objfreeze.false.length; a++){
			$tagFoottd = $('<th>&nbsp;</th>');
			if(objfreeze.false[a].displayTemplateFooter != ""){
				footerTemp = true;
				$tagFoottd = $('<th>'+objfreeze.false[a].displayTemplateFooter+'</th>');
			}
			$tagFoottd.addClass(objfreeze.false[a].classFooter);
			$tagFoottd.appendTo($tagFoottr);

			$tagHeadth = $('<th>&nbsp;</th>');
			if (objfreeze.false[a].displayTemplateHeader != "")
				$tagHeadth = $('<th>'+objfreeze.false[a].displayTemplateHeader+'</th>');
			else if (objfreeze.false[a].title != "" && objfreeze.false[a].displayTemplateHeader == "")
				$tagHeadth = $('<th>'+objfreeze.false[a].title+'</th>');
			$tagHeadth.addClass(objfreeze.false[a].classHeader);
			if (objfreeze.false[a].width != 0)
				$tagHeadth.css("width", objfreeze.false[a].width);
			widthRight += objfreeze.false[a].width;
			$tagHeadth.appendTo($tagHeadtr);
		}
		if (widthRight > 0 && objfreeze.true != undefined){
			$tableElem.css("width",widthRight+'px');
		}
		if (footerTemp){
			$tagFoot = $('<tfoot></tfoot>');
			$tagFoottr.appendTo($tagFoot);
			$tagFoot.appendTo($tableElem);

			if (objfreeze.true){
				$tagFootHead = $('<tfoot></tfoot>');
				$tagFootHeadtr.appendTo($tagFootHead);
				$tagFootHead.appendTo($tablehead);
			}
		}

		var splitElement = "", elementCreate = "";
		for (var i = 0; i < records.length; i++) {
			$tagRow = $('<tr></tr>');
			$tagRow.appendTo($tagbody);
			for( var a = 0; a < objfreeze.false.length; a++){
				if(objfreeze.false[a].displayTemplateRow() != "" ){
					splitElement = objfreeze.false[a].displayTemplateRow().split('#'); elementCreate = '';
					for (var key in splitElement){
						var res = splitElement[key].substring(0,1);
						if (res == '*'){
							elementCreate += records[i][splitElement[key].substring(1,splitElement[key].length)];
						} else {
							elementCreate += splitElement[key];
						}
					}
					$tagColoumn = $('<td>'+elementCreate+'</td>');
				}else{
					$tagColoumn = $('<td>'+records[i][objfreeze.false[a].field]+'</td>');
				}
				$tagColoumn.attr(objfreeze.false[a].attrColoumn);
				$tagColoumn.appendTo($tagRow);
			}
		}
		if (objfreeze.true){
			$divRightCol.css("height",($tableElem.height()+2)+'px');
			$o.find('.ecgrid-rightcol table>tbody>tr').each(function( index ) {
				$o.find('.ecgrid-headcol table>tbody>tr').eq(index).css("height",$(this).height());
			});
		}

		// $divPagin = $('<div class="pagination"></div>');
		// $taginputPaging = $('<div class="pageleft"><input type="hidden" id="cur_page"/><input type="hidden" id="show_ppage" /><div id="page_nav"></div></div>');
		// $tagInfoPage = $('<div class="pageright"><span class="infopage">nnanana</span></div>')
		// $taginputPaging.appendTo($divPagin);
		// $tagInfoPage.appendTo($divPagin);
		// $divPagin.appendTo($o);

		// /*paging*/
		// $o.data('ecGrid').showPage(1);
		
	},
	reloadData: function(options){

	},
}	

$.ecGridSetting = function(element, options){
	var $o = $(element), $container = $o.parent(), idgrid = $o.attr('id'), columndata = {}, footerTemp = false;
	var count = options.pageable.buttonCount;
	makepager = function(page){
		var show_ppage = count;
		var num_item = $container.find('.ecgrid tbody>tr').size();
		var num_page = Math.ceil(num_item / show_ppage);
		var num_toshow = num_item;
		var nav_html = '';
		var info ='';
		var cur_page = page;
		var cur_link = (num_toshow >= cur_page ? 1 : num_toshow + 1);
		if(cur_page > 1)
			cur_link = cur_page;
		if(cur_link != 1)
			nav_html += "<a class='nextbutton' href=\"javascript:first();\"><span class='glyphicon glyphicon-backward'></span></a>&nbsp;<a class='nextbutton' href=\"javascript:previous();\"><span class='glyphicon glyphicon-chevron-left'></span></a>&nbsp;";
		if(cur_link == num_page - 1){
			cur_link = cur_link - 3;
		}else if(cur_link == num_page){
			cur_link = cur_link - 4;
		}else if(cur_link > 2){
		}else{
			cur_link = 1;
		}
		var pages = num_toshow;
		var $o = $(element)
		while(pages != 0){
			if (num_page < cur_link) { break; }
			if (cur_link >= 1){
				nav_html += "<a class='" + ((cur_link == cur_page) ? "currentPageButton" : "numericButton") + "' href=\"javascript: onshowPage(" + cur_link + ")\" longdesc='" + cur_link + "'>" + (cur_link) + "</a>&nbsp;";
				
			}
			cur_link ++;
			pages--;
		}
		if (num_page > cur_page){
            nav_html += "<a class='nextbutton' href=\"javascript:next()\"><span class='glyphicon glyphicon-chevron-right'></span></a>&nbsp;<a class='nextbutton' href=\"javascript:last(" + num_page + ");\"><span class='glyphicon glyphicon-forward'></span></a>";
            
        }

        $container.find('#page_nav').html(nav_html);
        
	}
	var pageSize = count;
	this.showPage = function (page) {
        onshowPage(page);
	}
	var contain =[];
	onshowPage = function (page) {
        $container.find('.ecgrid tbody>tr').hide();
        $container.find('#cur_page').val(page);
        $container.find('.ecgrid tbody>tr').each(function (n) {
            if (n >= pageSize * (page - 1) && n < pageSize * page){
            	$(this).show();
            	contain.push($container.find('.ecgrid tbody>tr').index($(this))+1);
            }

        });
        min_tr = Math.min.apply(Math, contain);
    	max_tr = Math.max.apply(Math, contain);
    	//console.log("min :"+min_tr+" max :"+max_tr);
    	var info = "<span>"+min_tr+" - "+max_tr+" of "+$container.find('.ecgrid tbody>tr').size()+" items</span>";
    	infoPage(info);
    	contain =[];

    	makepager(page);
	}
	next = function () {
        var new_page = parseInt($container.find('#cur_page').val()) + 1;
        $o.data('ecGrid').showPage(new_page);
    }
    last = function (num_page) {
        var new_page = num_page;
        $container.find('#cur_page').val(new_page);
        $o.data('ecGrid').showPage(new_page);
    }
    first = function () {
        var new_page = "1";
        $container.find('#cur_page').val(new_page);
        $o.data('ecGrid').showPage(new_page);    
 	}
    previous = function () {
        var new_page = parseInt($container.find('#cur_page').val()) - 1;
        $container.find('#cur_page').val(new_page);
        $o.data('ecGrid').showPage(new_page);
	}
	infoPage = function(info){
		 $container.find('.infopage').html(info);
	}
}