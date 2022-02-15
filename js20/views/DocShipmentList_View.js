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
function DocShipmentList_View(id,options){	

	options.HEAD_TITLE = "Отгрузки материалов";

	DocShipmentList_View.superclass.constructor.call(this,id,options);
	
	var model = options.models.DocShipmentList_Model;
	var contr = new DocShipment_Controller();
	
	var constants = {"doc_per_page_count":null,"grid_refresh_interval":null};
	window.getApp().getConstantManager().get(constants);
	
	var popup_menu = new PopUpMenu();
	
	var period_ctrl = new EditPeriodDate(id+":filter-ctrl-period",{
		"field":new FieldDateTime("date_time")
	});
	
	var filters = options.fromApp? null:{
		"period":{
			"binding":new CommandBinding({
				"control":period_ctrl,
				"field":period_ctrl.getField()
			}),
			"bindings":[
				{"binding":new CommandBinding({
					"control":period_ctrl.getControlFrom(),
					"field":period_ctrl.getField()
					}),
				"sign":"ge"
				},
				{"binding":new CommandBinding({
					"control":period_ctrl.getControlTo(),
					"field":period_ctrl.getField()
					}),
				"sign":"le"
				}
			]
		}
		,"oktmo":{
			"binding":new CommandBinding({
				"control":new OKTMOEdit(id+":filter-ctrl-oktmo",{
					"contClassName":"form-group-filter",
					"labelCaption":"ОКТМО:",
					"dependBaseControl":"filter-ctrl-oktmo_contract",
					"dependBaseFieldIds":["id"],
					"dependFieldIds":["oktmo_id"]
				}),
				"field":new FieldInt("oktmo_id")}),
			"sign":"e"		
		}
		,"oktmo_contract":{
			"binding":new CommandBinding({
				"control":new OKTMOContractEdit(id+":filter-ctrl-oktmo_contract",{
					"contClassName":"form-group-filter",
					"labelCaption":"Контракт:"
				}),
				"field":new FieldInt("oktmo_contract_id")}),
			"sign":"e"		
		}
		,"user":{
			"binding":new CommandBinding({
				"control":new UserEditRef(id+":filter-ctrl-user",{
					"contClassName":"form-group-filter",
					"labelCaption":"Пользователь:"
				}),
				"field":new FieldInt("oktmo_contract_id")}),
			"sign":"e"		
		}
	};
	
	this.addElement(new GridAjx(id+":grid",{
		"model":model,
		"controller":contr,
		"editInline":false,
		"editWinClass":DocShipmentDialog_Form,
		"commands":new GridCmdContainerAjx(id+":grid:cmd",{
			"cmdFilter":options.fromApp? false:true,
			"filters":filters,
			"variantStorage":options.variantStorage
		}),
		"popUpMenu":popup_menu,
		"head":new GridHead(id+"-grid:head",{
			"elements":[
				new GridRow(id+":grid:head:row0",{
					"elements":[
						new GridCellHead(id+":grid:head:id",{
							"value":"№",
							"columns":[
								new GridColumn({
									"field":model.getField("id"),
									"searchOptions":{
										"field":new FieldInt("id"),
										"searchType":"on_match"
									}
								})
							],
							"sortable":true
						})
						,new GridCellHead(id+":grid:head:date_time",{
							"value":"Дата создания",
							"columns":[
								new GridColumnDateTime({
									"field":model.getField("date_time"),
									"ctrlClass":EditDate,
									"searchOptions":{
										"field":new FieldDate("date_time"),
										"searchType":"on_beg"
									}									
								})
							],
							"sortable":true,
							"sort":"desc"
						})					
						
						,new GridCellHead(id+":grid:head:oktmo_ref",{
							"value":"ОКТМО",
							"columns":[
								new GridColumnRef({
									"field":model.getField("oktmo_ref"),
									"ctrlClass":OKTMOEdit,
									"searchOptions":{
										"field":new FieldInt("oktmo_id"),
										"searchType":"on_match",
										"typeChange":false
									}									
								})
							],
							"sortable":true
						})					
						,new GridCellHead(id+":grid:head:oktmo_contracts_ref",{
							"value":"Контракт",
							"columns":[
								new GridColumnRef({
									"field":model.getField("oktmo_contracts_ref"),
									"ctrlClass":OKTMOContractEdit,
									"searchOptions":{
										"field":new FieldInt("oktmo_contract_id"),
										"searchType":"on_match",
										"typeChange":false
									}									
								})
							],
							"sortable":true
						})	
						,new GridCellHead(id+":grid:head:users_ref",{
							"value":"Пользователь",
							"columns":[
								new GridColumnRef({
									"field":model.getField("users_ref"),
									"ctrlClass":UserEditRef,
									"searchOptions":{
										"field":new FieldInt("user_id"),
										"searchType":"on_match",
										"typeChange":false
									}									
								})
							],
							"sortable":true
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
extend(DocShipmentList_View,ViewAjxList);
