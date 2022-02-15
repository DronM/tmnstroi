-- Function: rg_materials_balance(doc_types, integer ,int[],int[])

-- DROP FUNCTION rg_materials_balance(doc_types, integer ,int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
	IN in_doc_type doc_types
	,IN in_doc_id integer
	,in_store_id_ar int[]
	,in_material_id_ar int[]
)
RETURNS TABLE(
	store_id int
	,material_id int
	,quant numeric(19,3)
	,total numeric(15,2)
) AS
$BODY$
	SELECT * FROM rg_materials_balance(
		(SELECT doc_log.date_time FROM doc_log WHERE doc_log.doc_type=in_doc_type AND doc_log.doc_id=in_doc_id)
		,in_store_id_ar
		,in_material_id_ar
	);
$BODY$
  LANGUAGE sql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(doc_types, integer ,int[],int[])
  OWNER TO ;

