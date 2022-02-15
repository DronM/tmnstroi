/** Copyright (c) 2022
 *	Andrey Mikhalevich, Katren ltd.
 */
function DocShipmentList_Form(options){
	options = options || {};	
	
	options.formName = "DocShipmentList";
	options.controller = "DocShipment_Controller";
	options.method = "get_list";
	
	DocShipmentList_Form.superclass.constructor.call(this,options);
		
}
extend(DocShipmentList_Form,WindowFormObject);

/* Constants */


/* private members */

/* protected*/


/* public methods */

