/* Copyright (c) 2019
 *	Andrey Mikhalevich, Katren ltd.
 */
function OKEIEdit(id,options){
	options = options || {};	
	if (options.labelCaption!=""){
		options.labelCaption = options.labelCaption || "Единица:";
	}
	options.cmdInsert = (options.cmdInsert!=undefined)? options.cmdInsert:false;
	
	options.keyIds = options.keyIds || ["code"];
	
	//форма выбора из списка
	options.selectWinClass = OKEIList_Form;
	options.selectDescrIds = options.selectDescrIds || ["name_nat"];
	
	//форма редактирования элемента
	options.editWinClass = null;
	
	options.acMinLengthForQuery = 1;
	options.acController = new OKEI_Controller(options.app);
	options.acModel = new OKEIList_Model();
	options.acPatternFieldId = options.acPatternFieldId || "name_search";
	options.acKeyFields = options.acKeyFields || [options.acModel.getField("code")];
	options.acDescrFields = options.acDescrFields || [options.acModel.getField("name_full")];
	options.acICase = options.acICase || "1";
	options.acMid = options.acMid || "1";
	
	OKEIEdit.superclass.constructor.call(this,id,options);
}
extend(OKEIEdit,EditRef);

/* Constants */


/* private members */

/* protected*/


/* public methods */

