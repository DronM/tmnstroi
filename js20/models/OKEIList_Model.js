/**	
 *
 * THIS FILE IS GENERATED FROM TEMPLATE build/templates/models/Model_js.xsl
 * ALL DIRECT MODIFICATIONS WILL BE LOST WITH THE NEXT BUILD PROCESS!!!
 *
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017
 * @class
 * @classdesc Model class. Created from template build/templates/models/Model_js.xsl. !!!DO NOT MODEFY!!!
 
 * @extends ModelXML
 
 * @requires core/extend.js
 * @requires core/ModelXML.js
 
 * @param {string} id 
 * @param {Object} options
 */

function OKEIList_Model(options){
	var id = 'OKEIList_Model';
	options = options || {};
	
	options.fields = {};
	
				
	
	var filed_options = {};
	filed_options.primaryKey = true;	
	
	filed_options.autoInc = false;	
	
	options.fields.code = new FieldString("code",filed_options);
	options.fields.code.getValidator().setRequired(true);
	options.fields.code.getValidator().setMaxLength('5');
	
				
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	
	filed_options.autoInc = false;	
	
	options.fields.okei_sections_ref = new FieldJSON("okei_sections_ref",filed_options);
	
				
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	
	filed_options.autoInc = false;	
	
	options.fields.name_full = new FieldText("name_full",filed_options);
	options.fields.name_full.getValidator().setRequired(true);
	
				
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	
	filed_options.autoInc = false;	
	
	options.fields.name_nat = new FieldString("name_nat",filed_options);
	options.fields.name_nat.getValidator().setRequired(true);
	options.fields.name_nat.getValidator().setMaxLength('150');
	
				
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	
	filed_options.autoInc = false;	
	
	options.fields.name_internat = new FieldString("name_internat",filed_options);
	options.fields.name_internat.getValidator().setMaxLength('150');
	
				
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	
	filed_options.autoInc = false;	
	
	options.fields.code_nat = new FieldString("code_nat",filed_options);
	options.fields.code_nat.getValidator().setRequired(true);
	options.fields.code_nat.getValidator().setMaxLength('150');
	
				
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	
	filed_options.autoInc = false;	
	
	options.fields.code_internat = new FieldString("code_internat",filed_options);
	options.fields.code_internat.getValidator().setRequired(true);
	options.fields.code_internat.getValidator().setMaxLength('150');
	
				
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	
	filed_options.autoInc = false;	
	
	options.fields.name_search = new FieldText("name_search",filed_options);
	
		OKEIList_Model.superclass.constructor.call(this,id,options);
}
extend(OKEIList_Model,ModelXML);

