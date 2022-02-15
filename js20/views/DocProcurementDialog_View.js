/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2022
 
 * @extends ViewObjectAjx.js
 * @requires core/extend.js  
 * @requires controls/ViewObjectAjx.js 
 
 * @class
 * @classdesc
	
 * @param {string} id view identifier
 * @param {object} options
 * @param {object} options.models All data models
 * @param {object} options.variantStorage {name,model}
 */	
function DocProcurementDialog_View(id,options){	

	options = options || {};
	
	options.controller = new DocProcurement_Controller();
	options.model = (options.models&&options.models.DocProcurementDialog_Model)? options.models.DocProcurementDialog_Model : new DocProcurementDialog_Model();
	
	var is_employee = (window.getApp().getServVar("role_id")=="employee");
	
	options.addElement = function(){
		this.addElement(new EditInt(id+":id",{
			"inline":true,
			"enabled":!is_employee
		}));	
		this.addElement(new EditDateTime(id+":date_time",{
			"inline":true,
			"dateFormat":"d/m/y H:i",
			"editMask":"99/99/99 99:99"
		}));	

		var app = window.getApp();
		this.addElement(new UserEditRef(id+":users_ref",{
			"labelCaption":"Автор:",
			"value":new RefType({"keys":{"id":app.getServVar("user_id")},"descr":app.getServVar("user_name")}),
			"enabled":!is_employee
		}));	
		
		//********* material grid ***********************
		this.addElement(new DocMaterialGrid(id+":materials",{
		}));		
						
	}
	
	DocProcurementDialog_View.superclass.constructor.call(this,id,options);
	
	//****************************************************
	//read
	this.setDataBindings([
		new DataBinding({"control":this.getElement("date_time")})
		,new DataBinding({"control":this.getElement("users_ref"),"fieldId":"user_id"})
		,new DataBinding({"control":this.getElement("materials"),"fieldId":"materials"})
	]);
	
	//write
	this.setWriteBindings([
		new CommandBinding({"control":this.getElement("date_time")})
		,new CommandBinding({"control":this.getElement("users_ref"),"fieldId":"user_id"})
		,new CommandBinding({"control":this.getElement("materials"),"fieldId":"materials"})
	]);
	
}
extend(DocProcurementDialog_View,ViewObjectAjx);
