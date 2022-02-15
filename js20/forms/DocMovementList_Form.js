/** Copyright (c) 2022
 *	Andrey Mikhalevich, Katren ltd.
 */
function DocMovementList_Form(options){
	options = options || {};	
	
	options.formName = "DocMovementList";
	options.controller = "DocMovement_Controller";
	options.method = "get_list";
	
	DocMovementList_Form.superclass.constructor.call(this,options);
		
}
extend(DocMovementList_Form,WindowFormObject);

/* Constants */


/* private members */

/* protected*/


/* public methods */

