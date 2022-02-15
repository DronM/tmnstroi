-- Function: rg_materials_balance(int[],int[])

-- DROP FUNCTION rg_materials_balance(int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
	IN in_store_id_ar int[]
	,IN in_material_id_ar int[]
)
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	SELECT
		b.store_id
		,b.material_id
		,b.quant
		,b.total
	FROM rg_materials AS b
	WHERE b.date_time=rg_current_balance_time()
		AND (in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND (in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(int[],int[])
  OWNER TO ;

