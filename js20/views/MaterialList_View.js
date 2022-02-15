/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2019

 * @extends ViewAjxList
 * @requires core/extend.js
 * @requires controls/ViewAjxList.js     

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {object} options
 */
function MaterialList_View(id,options){
	options = options || {};	
	
	MaterialList_View.superclass.constructor.call(this,id,options);
	
	var model = options.models.MaterialList_Model;
	var contr = new Material_Controller();
	
	var constants = {"doc_per_page_count":null};
	window.getApp().getConstantManager().get(constants);
	
	var pagClass = window.getApp().getPaginationClass();
	
	var popup_menu = new PopUpMenu();
	
	this.addElement(new GridAjx(id+":grid",{
		"model":model,
		"keyIds":["id"],
		"controller":contr,
		"editInline":true,
		"editWinClass":null,
		"popUpMenu":popup_menu,
		"commands":new GridCmdContainerAjx(id+":grid:cmd"),
		"head":new GridHead(id+":grid:head",{
			"elements":[
				new GridRow(id+":grid:head:row0",{					
					"elements":[
						new GridCellHead(id+":grid:head:name",{
							"value":"Наименование",
							"columns":[
								new GridColumn({
									"field":model.getField("name"),
									"ctrlClass":EditString,
									"ctrlOptions":{
										"labelCaption":""
									}									
								})
							],
							"sortable":true,
							"sort":"asc"
						})
						,new GridCellHead(id+":grid:head:name_full",{
							"value":"Описание",
							"columns":[
								new GridColumn({
									"field":model.getField("name_full"),
									"ctrlClass":EditString,
									"ctrlOptions":{
										"labelCaption":""
									}																		
								})
							]
						})
						,new GridCellHead(id+":grid:head:okei_ref",{
							"value":"Единица",
							"columns":[
								new GridColumnRef({
									"field":model.getField("okei_ref"),
									"ctrlClass":OKEIEdit,
									"ctrlBindFieldId":"okei_code",
									"ctrlOptions":{
										"labelCaption":""
									}
								})
							]
						})
						
					]
				})
			]
		}),
		"pagination":new pagClass(id+"_page",
			{"countPerPage":constants.doc_per_page_count.getValue()}),		
		
		"autoRefresh":false,
		"refreshInterval":0,
		"rowSelect":false,
		"focus":true
	}));		
	
}
//ViewObjectAjx,ViewAjxList
extend(MaterialList_View,ViewAjxList);

/* Constants */


/* private members */

/* protected*/


/* public methods */

