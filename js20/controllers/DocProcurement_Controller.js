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

function DocProcurement_Controller(options){
	options = options || {};
	options.listModelClass = DocProcurementList_Model;
	options.objModelClass = DocProcurementDialog_Model;
	DocProcurement_Controller.superclass.constructor.call(this,options);	
	
	//methods
	this.addInsert();
	this.addUpdate();
	this.addDelete();
	this.addGetList();
	this.addGetObject();
	this.addComplete();
		
}
extend(DocProcurement_Controller,ControllerObjServer);

			DocProcurement_Controller.prototype.addInsert = function(){
	DocProcurement_Controller.superclass.addInsert.call(this);
	
	var pm = this.getInsert();
	
	var options = {};
	options.primaryKey = true;options.autoInc = true;
	var field = new FieldInt("id",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldDateTimeTZ("date_time",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldInt("user_id",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldJSONB("materials",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldText("materials_search",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldFloat("total",options);
	
	pm.addField(field);
	
	pm.addField(new FieldInt("ret_id",{}));
	
	
}

			DocProcurement_Controller.prototype.addUpdate = function(){
	DocProcurement_Controller.superclass.addUpdate.call(this);
	var pm = this.getUpdate();
	
	var options = {};
	options.primaryKey = true;options.autoInc = true;
	var field = new FieldInt("id",options);
	
	pm.addField(field);
	
	field = new FieldInt("old_id",{});
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldDateTimeTZ("date_time",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldInt("user_id",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldJSONB("materials",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldText("materials_search",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldFloat("total",options);
	
	pm.addField(field);
	
	
}

			DocProcurement_Controller.prototype.addDelete = function(){
	DocProcurement_Controller.superclass.addDelete.call(this);
	var pm = this.getDelete();
	var options = {"required":true};
		
	pm.addField(new FieldInt("id",options));
}

			DocProcurement_Controller.prototype.addGetList = function(){
	DocProcurement_Controller.superclass.addGetList.call(this);
	
	
	
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
	
	pm.addField(new FieldInt("id",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldDateTimeTZ("date_time",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldInt("user_id",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldJSON("users_ref",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldText("materials_search",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldFloat("total",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldString("self_descr",f_opts));
	pm.getField(this.PARAM_ORD_FIELDS).setValue("date_time");
	
}

			DocProcurement_Controller.prototype.addGetObject = function(){
	DocProcurement_Controller.superclass.addGetObject.call(this);
	
	var pm = this.getGetObject();
	var f_opts = {};
		
	pm.addField(new FieldInt("id",f_opts));
	
	pm.addField(new FieldString("mode"));
}

			DocProcurement_Controller.prototype.addComplete = function(){
	DocProcurement_Controller.superclass.addComplete.call(this);
	
	var f_opts = {};
	
	var pm = this.getComplete();
	pm.addField(new FieldString("self_descr",f_opts));
	pm.getField(this.PARAM_ORD_FIELDS).setValue("self_descr");	
}

		