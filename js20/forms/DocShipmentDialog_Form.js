/** Copyright (c) 2022
	Andrey Mikhalevich, Katren ltd.
*/
function DocShipmentDialog_Form(options){
	options = options || {};	
	
	options.formName = "DocShipmentDialog";
	options.controller = "DocShipment_Controller";
	options.method = "get_object";
	
	DocShipmentDialog_Form.superclass.constructor.call(this,options);
	
}
extend(DocShipmentDialog_Form,WindowFormObject);

/* Constants */


/* private members */

/* protected*/


/* public methods */

