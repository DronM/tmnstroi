/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017
 * @class
 * @classdesc Enumerator class. Created from template build/templates/js/Enum_js.xsl. !!!DO NOT MODIFY!!!
 
 * @extends EditSelect
 
 * @requires core/extend.js
 * @requires controls/EditSelect.js
 
 * @param string id 
 * @param {object} options
 */

function Enum_reg_types(id,options){
	options = options || {};
	options.addNotSelected = (options.addNotSelected!=undefined)? options.addNotSelected:true;
	options.options = [{"value":"material",
"descr":this.multyLangValues[window.getApp().getLocale()+"_"+"material"],
checked:(options.defaultValue&&options.defaultValue=="material")}
,{"value":"order",
"descr":this.multyLangValues[window.getApp().getLocale()+"_"+"order"],
checked:(options.defaultValue&&options.defaultValue=="order")}
];
	
	Enum_reg_types.superclass.constructor.call(this,id,options);
	
}
extend(Enum_reg_types,EditSelect);

Enum_reg_types.prototype.multyLangValues = {"ru_material":"Учет материалов"
};


