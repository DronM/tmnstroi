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
function DocShipmentDialog_View(id,options){	

	options = options || {};
	
	options.controller = new DocShipment_Controller();
	options.model = (options.models&&options.models.DocShipmentDialog_Model)? options.models.DocShipmentDialog_Model : new DocShipmentDialog_Model();
	
	var is_employee = (window.getApp().getServVar("role_id")=="employee");
	
	options.addElement = function(){
		this.addElement(new EditInt(id+":id",{
			"inline":true,
			"enabled":!is_employee
		}));	
		this.addElement(new EditDate(id+":ship_date",{
			"labelCaption":"Дата отгрузки:"
		}));	

		this.addElement(new EditDateTime(id+":date_time",{
			"inline":true,
			"dateFormat":"d/m/y H:i",
			"editMask":"99/99/99 99:99"
		}));	

		this.addElement(new OKTMOEdit(id+":oktmo_ref",{
			"required":true,
			"dependBaseControl":"oktmo_contracts_ref",
			"dependBaseFieldIds":["id"],
			"dependFieldIds":["oktmo_id"]			
		}));	

		this.addElement(new OKTMOContractEdit(id+":oktmo_contracts_ref",{
			"required":true
		}));	
			
		this.addElement(new EditCheckBox(id+":closed",{
			"labelCaption":"Закрыт:",
			"title":"Закрыть/сделать доступным документ",
			"enabled":!is_employee
		}));	

		this.addElement(new EditString(id+":barge_num",{
			"labelCaption":"№ баржи:",
			"title":"Номер баржи",
			"enabled":!is_employee
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
	
	DocShipmentDialog_View.superclass.constructor.call(this,id,options);
	
	//****************************************************
	//read
	this.setDataBindings([
		new DataBinding({"control":this.getElement("date_time")})
		,new DataBinding({"control":this.getElement("ship_date")})
		,new DataBinding({"control":this.getElement("oktmo_ref"),"fieldId":"oktmo_id"})
		,new DataBinding({"control":this.getElement("oktmo_contracts_ref"),"fieldId":"oktmo_contract_id"})
		,new DataBinding({"control":this.getElement("barge_num")})
		,new DataBinding({"control":this.getElement("users_ref"),"fieldId":"user_id"})
		,new DataBinding({"control":this.getElement("materials"),"fieldId":"materials"})
	]);
	
	//write
	this.setWriteBindings([
		new CommandBinding({"control":this.getElement("date_time")})
		,new CommandBinding({"control":this.getElement("ship_date")})
		,new CommandBinding({"control":this.getElement("oktmo_ref"),"fieldId":"oktmo_id"})
		,new CommandBinding({"control":this.getElement("oktmo_contracts_ref"),"fieldId":"oktmo_contract_id"})
		,new CommandBinding({"control":this.getElement("barge_num")})
		,new CommandBinding({"control":this.getElement("users_ref"),"fieldId":"user_id"})
		,new CommandBinding({"control":this.getElement("materials"),"fieldId":"materials"})
	]);
	
}
extend(DocShipmentDialog_View,ViewObjectAjx);
