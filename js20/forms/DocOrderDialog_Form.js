/** Copyright (c) 2022
	Andrey Mikhalevich, Katren ltd.
*/
function DocOrderDialog_Form(options){
	options = options || {};	
	
	options.formName = "DocOrderDialog";
	options.controller = "DocOrder_Controller";
	options.method = "get_object";
	
	DocOrderDialog_Form.superclass.constructor.call(this,options);
	
}
extend(DocOrderDialog_Form,WindowFormObject);

/* Constants */


/* private members */

/* protected*/


/* public methods */

