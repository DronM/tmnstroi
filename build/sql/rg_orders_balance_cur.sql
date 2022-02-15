-- Function: rg_orders_balance(int[])

-- DROP FUNCTION rg_orders_balance(int[]);

CREATE OR REPLACE FUNCTION rg_orders_balance(
	IN in_material_id_ar int[]
)
  RETURNS TABLE(
  	material_id int
  	,quant numeric(19,3)
  	) AS
$BODY$
	SELECT
		b.material_id
		,b.quant
	FROM rg_orders AS b
	WHERE b.date_time=rg_current_balance_time()
		AND (in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
		)
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_orders_balance(int[])
  OWNER TO ;

