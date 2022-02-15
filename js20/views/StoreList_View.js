/** Copyright (c) 2022
 *	Andrey Mikhalevich, Katren ltd.
 */
function StoreList_View(id,options){	

	StoreList_View.superclass.constructor.call(this,id,options);
	
	var model = options.models.StoreList_Model;
	var contr = new Store_Controller();
	
	var constants = {"grid_refresh_interval":null};
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
						new GridCellHead(id+":grid:head:row0:name",{
							"value":this.COL_NAME,
							"columns":[
								new GridColumn({"field":model.getField("name")})
							],
							"sortable":true,
							"sort":"asc"							
						}),
						new GridCellHead(id+":grid:head:row0:oktmo_contracts_ref",{
							"value":"Контракт",
							"columns":[
								new GridColumnRef({
									"field":model.getField("oktmo_contracts_ref"),
									"ctrlClass":OKTMOContractEdit
								})
							]
						})					
						
					]
				})
			]
		}),
		"pagination":null,				
		"autoRefresh":false,
		"refreshInterval":constants.grid_refresh_interval.getValue()*1000,
		"rowSelect":false,
		"focus":true
	}));	
	


}
extend(StoreList_View,ViewAjxList);
