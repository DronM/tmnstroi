/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2022

 * @extends GridAjx
 * @requires core/extend.js  

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {Object} options
 * @param {string} options.className
 */
function DocMaterialGrid(id,options){
	var model = new DocMaterialList_Model({
		"sequences":{"id":0}
	});

	var self = this;
	var cells = [
		new GridCellHead(id+":head:row0:materials_ref",{
			"value":"Материал",
			"columns":[
				new GridColumnRef({
					"field":model.getField("materials_ref"),
					"ctrlClass":MaterialEdit,
					"ctrlOptions":{
						"labelCaption":""
					}					
				})
			]
		})
		,new GridCellHead(id+":head:row0:quant",{
			"value":"Количество",
			"columns":[
				new GridColumnFloat({
					"field":model.getField("quant"),
					"ctrlClass":EditFloat,
					"precision":"4",
					"ctrlOptions":{
						"maxLength":19,
						"precision":4,
						"events":{
							"keyup":function(e){
								self.calcTotal();
							}
						}
					}					
				})
			]
		})
		,new GridCellHead(id+":head:row0:price",{
			"value":"Цена",
			"columns":[
				new GridColumnFloat({
					"field":model.getField("price"),
					"precision":"2",
					"ctrlClass":EditMoney,
					"ctrlOptions":{
						"events":{
							"keyup":function(e){
								self.calcTotal();
							}
						}
					}
				})
			]
		})
		,new GridCellHead(id+":head:row0:total",{
			"value":"Итого",
			"columns":[
				new GridColumnFloat({
					"field":model.getField("total"),
					"precision":"2",
					"ctrlClass":EditMoney,
					"ctrlOptions":{
						"events":{
							"keyup":function(e){
								self.calcPrice();
							}
						}
					}
				})				
			]
		})
		
	];

	options = {
		"model":model,
		"keyIds":["id"],
		"controller":new DocMaterial_Controller({"clientModel":model}),
		"editInline":true,
		"editWinClass":null,
		"popUpMenu":new PopUpMenu(),
		"commands":new GridCmdContainerAjx(id+":cmd",{
			"cmdSearch":false,
			"cmdExport":false
		}),
		"head":new GridHead(id+":head",{
			"elements":[
				new GridRow(id+":head:row0",{
					"elements":cells
				})
			]
		}),
		"foot":new GridFoot(id+"grid:foot",{
			"autoCalc":true,			
			"elements":[
				new GridRow(id+":grid:foot:row0",{
					"elements":[
						new GridCell(id+":grid:foot:total_sp1",{
							"colSpan":"3"
						})											
						,new GridCellFoot(id+":grid:foot:tot_total",{
							"attrs":{"align":"right"},
							"calcOper":"sum",
							"calcFieldId":"total",
							"gridColumn":new GridColumnFloat({"id":"tot_total"})
						})
					]
				})
			]		
		}),
		"pagination":null,				
		"autoRefresh":false,
		"refreshInterval":0,
		"rowSelect":false
	};	
	DocMaterialGrid.superclass.constructor.call(this,id,options);
}
extend(DocMaterialGrid,GridAjx);

/* Constants */


/* private members */

/* protected*/


/* public methods */
DocMaterialGrid.prototype.calcTotal = function(){
	var f = this.getEditViewObj();
	var price = f.getElement("price").getValue();
	if(isNaN(price)){
		price = 0;
	}
	var quant = f.getElement("quant").getValue();
	if(isNaN(quant)){
		quant = 0;
	}
	f.getElement("total").setValue(price * quant);
}
DocMaterialGrid.prototype.calcPrice = function(){
	var f = this.getEditViewObj();
	var total = f.getElement("total").getValue();
	if(isNaN(total)){
		total = 0;
	}
	var quant = f.getElement("quant").getValue();
	if(isNaN(quant)){
		quant = 0;
	}
	var price = 0;
	if(quant){
		price = Math.round(total/quant * 100) / 100;
	}
	f.getElement("price").setValue(price);
}
