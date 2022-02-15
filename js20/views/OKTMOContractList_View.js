/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2022

 * @extends ViewAjxList
 * @requires core/extend.js
 * @requires controls/ViewAjxList.js     

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {object} options
 */
function OKTMOContractList_View(id,options){
	options = options || {};	
	
	options.HEAD_TITLE = "Контракты ОКТМО";
	
	OKTMOContractList_View.superclass.constructor.call(this,id,options);
	
	var model = (options.models && options.models.OKTMOContractList_Model)? options.models.OKTMOContractList_Model : new OKTMOContractList_Model();
	var contr = new OKTMOContract_Controller();
	
	var constants = {"doc_per_page_count":null,"grid_refresh_interval":null};
	window.getApp().getConstantManager().get(constants);
	
	var pagClass = window.getApp().getPaginationClass();
	
	var popup_menu = new PopUpMenu();
	
	var filters = {
		"application_state":{
			"binding":new CommandBinding({
				"control":new OKTMOContractEdit(id+":filter-ctrl-oktmo_contract",{
					"contClassName":"form-group-filter"
				}),
				"field":new FieldInt("oktmo_contract")}),
			"sign":"e"		
		}
	};
	
	this.addElement(new GridAjx(id+":grid",{
		"model":model,
		"keyIds":["id"],
		"controller":contr,
		"editInline":true,
		"editWinClass":null,
		"popUpMenu":popup_menu,
		"commands":new GridCmdContainerAjx(id+":grid:cmd",{
			"filters":filters,
			"variantStorage":options.variantStorage
		}),
		"head":new GridHead(id+":grid:head",{
			"elements":[
				new GridRow(id+":grid:head:row0",{					
					"elements":[
						!options.detail? new GridCellHead(id+":grid:head:oktmo_ref",{
							"value":"ОКТМО",
							"columns":[
								new GridColumnRef({
									"field":model.getField("oktmo_ref"),
									"ctrlClass":OKTMOEdit
								})
							]
						}) : null
						,new GridCellHead(id+":grid:head:name",{
							"value":"Наименование",
							"columns":[
								new GridColumn({
									"field":model.getField("name")
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
//ViewObjectAjx,ViewAjxList
extend(OKTMOContractList_View,ViewAjxList);

/* Constants */


/* private members */

/* protected*/


/* public methods */

