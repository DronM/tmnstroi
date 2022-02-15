/** Copyright (c) 2022
 *	Andrey Mikhalevich, Katren ltd.
 */
function ClientList_View(id,options){	

	options.HEAD_TITLE = "Контрагенты";

	ClientList_View.superclass.constructor.call(this,id,options);
	
	var model = (options.models&&options.models.Client_Model)? options.models.Client_Model : new Client_Model();
	var contr = new Client_Controller();
	
	var constants = {"doc_per_page_count":null,"grid_refresh_interval":null};
	window.getApp().getConstantManager().get(constants);
	
	var popup_menu = new PopUpMenu();
	
	this.addElement(new GridAjx(id+":grid",{
		"model":model,
		"controller":contr,
		"editInline":true,
		"editWinClass":null,
		"commands":new GridCmdContainerAjx(id+":grid:cmd"),		
		"popUpMenu":popup_menu,
		"head":new GridHead(id+"-grid:head",{
			"elements":[
				new GridRow(id+":grid:head:row0",{
					"elements":[
						new GridCellHead(id+":grid:head:name",{
							"value":"Наименование",
							"columns":[
								new GridColumn({"field":model.getField("name")})
							],
							"className":window.getBsCol(8),
							"sortable":true,
							"sort":"asc"							
						}),
						new GridCellHead(id+":grid:head:inn",{
							"value":"ИНН",
							"columns":[
								new GridColumn({"field":model.getField("inn")})
							],
							"className":window.getBsCol(4)
						})					
					]
				})
			]
		}),
		"pagination":new GridPagination(id+"_page",
			{"countPerPage":constants.doc_per_page_count.getValue()}),		
		
		"autoRefresh":false,
		"refreshInterval":constants.grid_refresh_interval.getValue()*1000,
		"rowSelect":false,
		"focus":true
	}));	
	


}
extend(ClientList_View,ViewAjxList);
