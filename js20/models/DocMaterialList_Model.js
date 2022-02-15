/**	
 *
 * THIS FILE IS GENERATED FROM TEMPLATE build/templates/models/Model_js.xsl
 * ALL DIRECT MODIFICATIONS WILL BE LOST WITH THE NEXT BUILD PROCESS!!!
 *
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017
 * @class
 * @classdesc Model class. Created from template build/templates/models/Model_js.xsl. !!!DO NOT MODEFY!!!
 
 * @extends ModelJSON
 
 * @requires core/extend.js
 * @requires core/ModelJSON.js
 
 * @param {string} id 
 * @param {Object} options
 */

function DocMaterialList_Model(options){
	var id = 'DocMaterialList_Model';
	options = options || {};
	
	options.fields = {};
	
				
	
	var filed_options = {};
	filed_options.primaryKey = true;	
	
	filed_options.autoInc = true;	
	
	options.fields.id = new FieldInt("id",filed_options);
	
				
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	
	filed_options.autoInc = false;	
	
	options.fields.materials_ref = new FieldJSON("materials_ref",filed_options);
	
				
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	
	filed_options.autoInc = false;	
	
	options.fields.quant = new FieldFloat("quant",filed_options);
	options.fields.quant.getValidator().setMaxLength('19');
	
				
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	
	filed_options.autoInc = false;	
	
	options.fields.price = new FieldFloat("price",filed_options);
	options.fields.price.getValidator().setMaxLength('15');
	
				
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	
	filed_options.autoInc = false;	
	
	options.fields.total = new FieldFloat("total",filed_options);
	options.fields.total.getValidator().setMaxLength('15');
	
		DocMaterialList_Model.superclass.constructor.call(this,id,options);
}
extend(DocMaterialList_Model,ModelJSON);

