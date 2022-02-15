-- Function: rg_orders_balance(doc_types, integer ,int[])

-- DROP FUNCTION rg_orders_balance(doc_types, integer ,int[]);

CREATE OR REPLACE FUNCTION rg_orders_balance(
	IN in_doc_type doc_types
	,IN in_doc_id integer
	,in_material_id_ar int[]
)
RETURNS TABLE(
	material_id int
	,quant numeric(19,3)
) AS
$BODY$
	SELECT * FROM rg_orders_balance(
		(SELECT doc_log.date_time FROM doc_log WHERE doc_log.doc_type=in_doc_type AND doc_log.doc_id=in_doc_id)
		,in_material_id_ar
	);
$BODY$
  LANGUAGE sql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_orders_balance(doc_types, integer ,int[])
  OWNER TO ;

