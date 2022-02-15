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

function Material_Controller(options){
	options = options || {};
	options.listModelClass = MaterialList_Model;
	options.objModelClass = MaterialList_Model;
	Material_Controller.superclass.constructor.call(this,options);	
	
	//methods
	this.addInsert();
	this.addUpdate();
	this.addDelete();
	this.addGetList();
	this.addGetObject();
	this.addComplete();
	this.add_get_material_action();
		
}
extend(Material_Controller,ControllerObjServer);

			Material_Controller.prototype.addInsert = function(){
	Material_Controller.superclass.addInsert.call(this);
	
	var pm = this.getInsert();
	
	var options = {};
	options.primaryKey = true;options.autoInc = true;
	var field = new FieldInt("id",options);
	
	pm.addField(field);
	
	var options = {};
	options.required = true;
	var field = new FieldString("name",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldText("name_full",options);
	
	pm.addField(field);
	
	var options = {};
	options.required = true;
	var field = new FieldString("okei_code",options);
	
	pm.addField(field);
	
	pm.addField(new FieldInt("ret_id",{}));
	
	
}

			Material_Controller.prototype.addUpdate = function(){
	Material_Controller.superclass.addUpdate.call(this);
	var pm = this.getUpdate();
	
	var options = {};
	options.primaryKey = true;options.autoInc = true;
	var field = new FieldInt("id",options);
	
	pm.addField(field);
	
	field = new FieldInt("old_id",{});
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldString("name",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldText("name_full",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldString("okei_code",options);
	
	pm.addField(field);
	
	
}

			Material_Controller.prototype.addDelete = function(){
	Material_Controller.superclass.addDelete.call(this);
	var pm = this.getDelete();
	var options = {"required":true};
		
	pm.addField(new FieldInt("id",options));
}

			Material_Controller.prototype.addGetList = function(){
	Material_Controller.superclass.addGetList.call(this);
	
	
	
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
	
	pm.addField(new FieldString("name",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldText("name_full",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldJSON("okei_ref",f_opts));
	pm.getField(this.PARAM_ORD_FIELDS).setValue("name");
	
}

			Material_Controller.prototype.addGetObject = function(){
	Material_Controller.superclass.addGetObject.call(this);
	
	var pm = this.getGetObject();
	var f_opts = {};
		
	pm.addField(new FieldInt("id",f_opts));
	
	pm.addField(new FieldString("mode"));
}

			Material_Controller.prototype.addComplete = function(){
	Material_Controller.superclass.addComplete.call(this);
	
	var f_opts = {};
	
	var pm = this.getComplete();
	pm.addField(new FieldString("name",f_opts));
	pm.getField(this.PARAM_ORD_FIELDS).setValue("name");	
}

			Material_Controller.prototype.add_get_material_action = function(){
	var opts = {"controller":this};	
	var pm = new PublicMethodServer('get_material_action',opts);
	
				
	
	var options = {};
	
		pm.addField(new FieldString("cond_fields",options));
	
				
	
	var options = {};
	
		pm.addField(new FieldString("cond_vals",options));
	
				
	
	var options = {};
	
		pm.addField(new FieldString("cond_ic",options));
	
				
	
	var options = {};
	
		pm.addField(new FieldString("cond_sgns",options));
	
				
	
	var options = {};
	
		pm.addField(new FieldString("ord_fields",options));
	
				
	
	var options = {};
	
		pm.addField(new FieldString("ord_directs",options));
	
				
	
	var options = {};
	
		pm.addField(new FieldString("field_sep",options));
	
				
	
	var options = {};
	
		pm.addField(new FieldString("templ",options));
	
				
	
	var options = {};
	
		pm.addField(new FieldInt("inline",options));
					
			
	this.addPublicMethod(pm);
}

		