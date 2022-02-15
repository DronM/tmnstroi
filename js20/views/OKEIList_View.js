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
function OKEIList_View(id,options){
	options = options || {};	
	
	OKEIList_View.superclass.constructor.call(this,id,options);
	
	var model = options.models.OKEIList_Model;
	var contr = new OKEI_Controller();
	
	var constants = {"doc_per_page_count":null};
	window.getApp().getConstantManager().get(constants);
	
	var pagClass = window.getApp().getPaginationClass();
	
	var popup_menu = new PopUpMenu();
	
	this.addElement(new GridAjx(id+":grid",{
		"model":model,
		"keyIds":["code"],
		"controller":contr,
		"editInline":null,
		"editWinClass":null,
		"popUpMenu":popup_menu,
		"commands":new GridCmdContainerAjx(id+":grid:cmd",{
			"cmdInsert":false,
			"cmdEdit":false,
			"cmdDelete":false
		}),
		"head":new GridHead(id+":grid:head",{
			"elements":[
				new GridRow(id+":grid:head:row0",{					
					"elements":[
						new GridCellHead(id+":grid:head:code",{
							"value":"Код",
							"columns":[
								new GridColumn({
									"field":model.getField("code")
								})
							]
						})
					
						,new GridCellHead(id+":grid:head:okei_sections_ref",{
							"value":"Группа",
							"columns":[
								new GridColumnRef({
									"field":model.getField("okei_sections_ref")
								})
							]
						})
						,new GridCellHead(id+":grid:head:name_full",{
							"value":"Наименование",
							"columns":[
								new GridColumn({
									"field":model.getField("name_full")
								})
							]
						})
						,new GridCellHead(id+":grid:head:name_nat",{
							"value":"Нац.наименование",
							"columns":[
								new GridColumn({
									"field":model.getField("name_nat")
								})
							]
						})
						,new GridCellHead(id+":grid:head:name_internat",{
							"value":"Межд.наименование",
							"columns":[
								new GridColumn({
									"field":model.getField("name_internat")
								})
							]
						})
						,new GridCellHead(id+":grid:head:code_internat",{
							"value":"Нац.код",
							"columns":[
								new GridColumn({
									"field":model.getField("code_internat")
								})
							]
						})						
						,new GridCellHead(id+":grid:head:code_internat",{
							"value":"Межд.код",
							"columns":[
								new GridColumn({
									"field":model.getField("code_internat")
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
extend(OKEIList_View,ViewAjxList);

/* Constants */


/* private members */

/* protected*/


/* public methods */

