/* Copyright (c) 2022
 *	Andrey Mikhalevich, Katren ltd.
 */
function MaterialEdit(id,options){
	options = options || {};	
	if (options.labelCaption!=""){
		options.labelCaption = options.labelCaption || "Материал:";
	}
	options.cmdInsert = (options.cmdInsert!=undefined)? options.cmdInsert:false;
	
	options.keyIds = options.keyIds || ["id"];
	
	//форма выбора из списка
	options.selectWinClass = MaterialList_Form;
	options.selectDescrIds = options.selectDescrIds || ["name"];
	
	//форма редактирования элемента
	options.editWinClass = null;
	
	options.acMinLengthForQuery = 1;
	options.acController = new Material_Controller(options.app);
	options.acModel = new MaterialList_Model();
	options.acPatternFieldId = options.acPatternFieldId || "name";
	options.acKeyFields = options.acKeyFields || [options.acModel.getField("id")];
	options.acDescrFields = options.acDescrFields || [options.acModel.getField("name")];
	options.acICase = options.acICase || "1";
	options.acMid = options.acMid || "1";
	
	MaterialEdit.superclass.constructor.call(this,id,options);
}
extend(MaterialEdit,EditRef);

/* Constants */


/* private members */

/* protected*/


/* public methods */

