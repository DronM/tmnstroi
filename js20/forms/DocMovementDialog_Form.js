/** Copyright (c) 2022
	Andrey Mikhalevich, Katren ltd.
*/
function DocMovementDialog_Form(options){
	options = options || {};	
	
	options.formName = "DocMovementDialog";
	options.controller = "DocMovement_Controller";
	options.method = "get_object";
	
	DocMovementDialog_Form.superclass.constructor.call(this,options);
	
}
extend(DocMovementDialog_Form,WindowFormObject);

/* Constants */


/* private members */

/* protected*/


/* public methods */

