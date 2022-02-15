/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017
 
 * THIS FILE IS GENERATED FROM TEMPLATE build/templates/controllers/Controller_js20.xsl
 * ALL DIRECT MODIFICATIONS WILL BE LOST WITH THE NEXT BUILD PROCESS!!!
 
 * @class
 * @classdesc controller
 
 * @extends ControllerObjServer
  
 * @requires core/extend.js
 * @requires core/ControllerObjServer.js
  
 * @param {Object} options
 * @param {Model} options.listModelClass
 * @param {Model} options.objModelClass
 */ 

function OKEI_Controller(options){
	options = options || {};
	options.listModelClass = OKEIList_Model;
	options.objModelClass = OKEIList_Model;
	OKEI_Controller.superclass.constructor.call(this,options);	
	
	//methods
	this.addGetList();
	this.addGetObject();
	this.addComplete();
		
}
extend(OKEI_Controller,ControllerObjServer);

			OKEI_Controller.prototype.addGetList = function(){
	OKEI_Controller.superclass.addGetList.call(this);
	
	
	
	var pm = this.getGetList();
	
	pm.addField(new FieldInt(this.PARAM_COUNT));
	pm.addField(new FieldInt(this.PARAM_FROM));
	pm.addField(new FieldString(this.PARAM_COND_FIELDS));
	pm.addField(new FieldString(this.PARAM_COND_SGNS));
	pm.addField(new FieldString(this.PARAM_COND_VALS));
	pm.addField(new FieldString(this.PARAM_COND_ICASE));
	pm.addField(new FieldString(this.PARAM_ORD_FIELDS));
	pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));
	pm.addField(new FieldString(this.PARAM_FIELD_SEP));

	var f_opts = {};
	
	pm.addField(new FieldString("code",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldJSON("okei_sections_ref",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldText("name_full",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldString("name_nat",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldString("name_internat",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldString("code_nat",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldString("code_internat",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldText("name_search",f_opts));
}

			OKEI_Controller.prototype.addGetObject = function(){
	OKEI_Controller.superclass.addGetObject.call(this);
	
	var pm = this.getGetObject();
	var f_opts = {};
		
	pm.addField(new FieldString("code",f_opts));
	
	pm.addField(new FieldString("mode"));
}

			OKEI_Controller.prototype.addComplete = function(){
	OKEI_Controller.superclass.addComplete.call(this);
	
	var f_opts = {};
	
	var pm = this.getComplete();
	pm.addField(new FieldText("name_search",f_opts));
	pm.getField(this.PARAM_ORD_FIELDS).setValue("name_search");	
}

		