/** Copyright (c) 2022
 *	Andrey Mikhalevich, Katren ltd.
 */
function DocProcurementList_Form(options){
	options = options || {};	
	
	options.formName = "DocProcurementList";
	options.controller = "DocProcurement_Controller";
	options.method = "get_list";
	
	DocProcurementList_Form.superclass.constructor.call(this,options);
		
}
extend(DocProcurementList_Form,WindowFormObject);

/* Constants */


/* private members */

/* protected*/


/* public methods */

