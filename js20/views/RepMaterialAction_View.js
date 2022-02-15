/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2022
 
 * @class
 * @classdesc Движения материалов по основному скалду
	
 * @param {string} id view identifier
 * @param {namespace} options
 */	
function RepMaterialAction_View(id,options){

	options = options || {};
	
	var contr = new Material_Controller();	
	options.publicMethod = contr.getPublicMethod("get_material_action");
	options.reportViewId = "ViewHTMLXSLT";
	options.templateId = "RepMaterialAction";
	
	options.cmdMake = true;
	options.cmdPrint = true;
	options.cmdFilter = true;
	options.cmdExcel = true;
	options.cmdPdf = false;
	
	var period_ctrl = new EditPeriodDateTime(id+":filter-ctrl-period",{
		//"valueFrom":(options.templateParams)? options.templateParams.date_from:DateHelper.getStartOfShift(DateHelper.time()),
		//"valueTo":(options.templateParams)? options.templateParams.date_to:DateHelper.getEndOfShift(DateHelper.time()),
		"field":new FieldDateTime("date_time")
	});
	
	options.filters = {
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
		,"store":{
			"binding":new CommandBinding({
				"control":new StoreEdit(id+":filter-ctrl-store",{
					"contClassName":"form-group-filter",
					"labelCaption":"Место хранения:"
				}),
				"field":new FieldInt("store_id")}),
			"sign":"e"		
		}
		
		,"material":{
			"binding":new CommandBinding({
				"control":new MaterialEdit(id+":filter-ctrl-material",{
					"contClassName":"form-group-filter",
					"labelCaption":"Материал:"
				}),
				"field":new FieldInt("material_id")}),
			"sign":"e"		
		}
		/*,"document":{
			"binding":new CommandBinding({
				"control":new EditCompound(id+":filter-ctrl-document",{
					"contClassName":"form-group-filter",
					"labelCaption":"Документ:",
					"possibleDataTypes":[
						{"dataType":"doc_procurements"
						,"dataTypeDescrLoc":"Поставка материалов"
						,"ctrlClass":DocProcurementEdit
						}
						,{"dataType":"doc_shipments"
						,"dataTypeDescrLoc":"Отгрузка материалов"
						,"ctrlClass":DocShipmentEdit
						}
					]					
				}),
				"field":new FieldJSON("doc_ref")}),
			"sign":"e"		
		}*/
	};

	RepMaterialAction_View.superclass.constructor.call(this, id, options);
	
}
extend(RepMaterialAction_View,ViewReport);
