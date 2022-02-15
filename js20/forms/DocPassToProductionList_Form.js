/** Copyright (c) 2022
 *	Andrey Mikhalevich, Katren ltd.
 */
function DocPassToProductionList_Form(options){
	options = options || {};	
	
	options.formName = "DocPassToProductionList";
	options.controller = "DocPassToProduction_Controller";
	options.method = "get_list";
	
	DocPassToProductionList_Form.superclass.constructor.call(this,options);
		
}
extend(DocPassToProductionList_Form,WindowFormObject);

/* Constants */


/* private members */

/* protected*/


/* public methods */

