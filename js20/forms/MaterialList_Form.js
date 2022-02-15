/** Copyright (c) 2019
 *	Andrey Mikhalevich, Katren ltd.
 */
function MaterialList_Form(options){
	options = options || {};	
	
	options.formName = "MaterialList";
	options.controller = "Material_Controller";
	options.method = "get_list";
	
	MaterialList_Form.superclass.constructor.call(this,options);
		
}
extend(MaterialList_Form,WindowFormObject);

/* Constants */


/* private members */

/* protected*/


/* public methods */

