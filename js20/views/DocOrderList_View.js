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
function DocOrderList_View(id,options){	

	options.HEAD_TITLE = "Заказы материалов";

	DocOrderList_View.superclass.constructor.call(this,id,options);
	
	var model = options.models.DocOrderList_Model;
	var contr = new DocOrder_Controller();
	
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
		,"closed":{
			"binding":new CommandBinding({
				"control":new EditCheckBox(id+":filter-ctrl-closed",{
					"contClassName":"form-group-filter",
					"labelCaption":"Закрыт:"
				}),
				"field":new FieldBool("closed")}),
			"sign":"e"		
		}
		
	};
	
	this.addElement(new GridAjx(id+":grid",{
		"model":model,
		"controller":contr,
		"editInline":false,
		"editWinClass":DocOrderDialog_Form,
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
						,new GridCellHead(id+":grid:head:closed_inf",{
							"value":"Закрыт",
							"columns":[
								new GridColumn({
									"formatFunction":function(fields){
										console.log(fields)
										/*
										var res = "";
										if(fields.closed.getFieValue()){
											var inf = fields.closed_inf.GetValue();
											if(inf&&inf.date_time){
												res = DateHelper.format(DateHelper.strtotime(inf.date_time),"d/m/y H:i");
											}
											if(inf&&inf.users_ref&&inf.users_ref.descr){
												if(res!=""){
													res+= ", ";
												}
												res+= inf.users_ref.descr;
											}
										}
										return res;
										*/
									}
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
extend(DocOrderList_View,ViewAjxList);
