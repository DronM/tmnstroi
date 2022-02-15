/** Copyright (c) 2022
	Andrey Mikhalevich, Katren ltd.
*/
function OKTMO_Form(options){
	options = options || {};	
	
	options.formName = "OKTMODialog";
	options.controller = "OKTMO_Controller";
	options.method = "get_object";
	
	OKTMO_Form.superclass.constructor.call(this,options);
	
}
extend(OKTMO_Form,WindowFormObject);

/* Constants */


/* private members */

/* protected*/


/* public methods */

