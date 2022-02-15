/** Copyright (c) 2022
	Andrey Mikhalevich, Katren ltd.
*/
function DocProcurementDialog_Form(options){
	options = options || {};	
	
	options.formName = "DocProcurementDialog";
	options.controller = "DocProcurement_Controller";
	options.method = "get_object";
	
	DocProcurementDialog_Form.superclass.constructor.call(this,options);
	
}
extend(DocProcurementDialog_Form,WindowFormObject);

/* Constants */


/* private members */

/* protected*/


/* public methods */

