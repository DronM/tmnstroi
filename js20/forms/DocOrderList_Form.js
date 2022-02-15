/** Copyright (c) 2022
 *	Andrey Mikhalevich, Katren ltd.
 */
function DocOrderList_Form(options){
	options = options || {};	
	
	options.formName = "DocOrderList";
	options.controller = "DocOrder_Controller";
	options.method = "get_list";
	
	DocOrderList_Form.superclass.constructor.call(this,options);
		
}
extend(DocOrderList_Form,WindowFormObject);

/* Constants */


/* private members */

/* protected*/


/* public methods */

