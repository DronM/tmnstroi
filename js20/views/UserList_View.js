/** Copyright (c) 2016
 *	Andrey Mikhalevich, Katren ltd.
 */
function UserList_View(id,options){	

	UserList_View.superclass.constructor.call(this,id,options);
	
	var model = options.models.UserList_Model;
	var contr = new User_Controller();
	
	var constants = {"doc_per_page_count":null,"grid_refresh_interval":null};
	window.getApp().getConstantManager().get(constants);
	
	var popup_menu = new PopUpMenu();
	
	this.addElement(new GridAjx(id+":grid",{
		"model":model,
		"controller":contr,
		"editInline":false,
		"editWinClass":User_Form,
		"commands":new GridCmdContainerAjx(id+":grid:cmd"),		
		"popUpMenu":popup_menu,
		"head":new GridHead(id+"-grid:head",{
			"elements":[
				new GridRow(id+":grid:head:row0",{
					"elements":[
						new GridCellHead(id+":grid:head:id",{
							"value":this.COL_ID_CAP,
							"columns":[
								new GridColumn({"field":model.getField("id")})
							],
							"sortable":true
						}),					
						new GridCellHead(id+":grid:head:name",{
							"value":this.COL_NAME,
							"columns":[
								new GridColumn({"field":model.getField("name")})
							],
							"sortable":true,
							"sort":"asc"							
						}),
						new GridCellHead(id+":grid:head:name_full",{
							"value":this.COL_NAME_FULL,
							"columns":[
								new GridColumn({"field":model.getField("name_full")})
							],
							"sortable":true
						}),
						
						new GridCellHead(id+":grid:head:email",{
							"value":this.COL_EMAIL,
							"columns":[
								new GridColumn({"field":model.getField("email")})
							]
						}),
						new GridCellHead(id+":grid:head:oktmo_ref",{
							"value":"ОКТМО",
							"columns":[
								new GridColumnRef({
									"field":model.getField("oktmo_ref"),
									"ctrlClass":OKTMOEdit
								})
							]
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
extend(UserList_View,ViewAjxList);
