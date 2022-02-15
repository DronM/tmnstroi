/** Copyright (c) 2022
	Andrey Mikhalevich, Katren ltd.
*/
function DocPassToProductionDialog_Form(options){
	options = options || {};	
	
	options.formName = "DocPassToProductionDialog";
	options.controller = "DocPassToProduction_Controller";
	options.method = "get_object";
	
	DocPassToProductionDialog_Form.superclass.constructor.call(this,options);
	
}
extend(DocPassToProductionDialog_Form,WindowFormObject);

/* Constants */


/* private members */

/* protected*/


/* public methods */

