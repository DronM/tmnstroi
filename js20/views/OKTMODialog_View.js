/* Copyright (c) 2016
 *	Andrey Mikhalevich, Katren ltd.
 */
function OKTMODialog_View(id,options){	

	options = options || {};
	options.controller = new OKTMO_Controller();
	options.model = (options.models&&options.models.OKTMO_Model)? options.models.OKTMO_Model : new OKTMO_Model();

	options.addElement = function(){
		this.addElement(new EditString(id+":name",{
			"maxLength":"500",
			"labelCaption":"Наименование:"
		}));

		//contracts grid
		this.addElement(new OKTMOContractList_View(id+":oktmo_contracts_list",{"detail":true}));
		
	}	
	
	OKTMODialog_View.superclass.constructor.call(this,id,options);
	
	//****************************************************	
	
	//read
	var r_bd = [
		new DataBinding({"control":this.getElement("name")}),
	];
	this.setDataBindings(r_bd);
	
	//write
	this.setWriteBindings([
		new CommandBinding({"control":this.getElement("name")}),
	]);
	
	this.addDetailDataSet({
		"control":this.getElement("oktmo_contracts_list").getElement("grid"),
		"controlFieldId":"oktmo_id",
		"field":this.m_model.getField("id")
	});
	
}
extend(OKTMODialog_View,ViewObjectAjx);
