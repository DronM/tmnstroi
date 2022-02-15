/* Copyright (c) 2019
 *	Andrey Mikhalevich, Katren ltd.
 */
function OKEIList_Form(options){
	options = options || {};	
	
	options.formName = "OKEIList";
	options.controller = "OKEI_Controller";
	options.method = "get_list";
	
	OKEIList_Form.superclass.constructor.call(this,options);
		
}
extend(OKEIList_Form,WindowFormObject);

/* Constants */


/* private members */

/* protected*/


/* public methods */

