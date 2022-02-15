
-- DROP FUNCTION materials_actions(in_date_time_from timestampTZ, in_date_time_to timestampTZ, in_store_id int, in_materials int[]);

CREATE OR REPLACE FUNCTION materials_actions(in_date_time_from timestampTZ, in_date_time_to timestampTZ, in_store_id int, in_materials int[])
  RETURNS TABLE(
  	material_id int,
  	material_descr text,
  	beg_quant numeric(19,4),
  	beg_total numeric(15,2),
  	deb_quant numeric(19,4),
  	deb_total numeric(15,2),
  	kred_quant numeric(19,4),
  	kred_total numeric(15,2),
  	end_quant numeric(19,4),
  	end_total numeric(15,2)  	
  ) AS
$$
	SELECT
		acts.material_id,
		m.name AS material_descr,
		sum(acts.rg_beg_quant) AS beg_quant,
		sum(acts.rg_beg_total) AS beg_total,
		sum(acts.ra_deb_quant) AS deb_quant,
		sum(acts.ra_deb_total) AS deb_total,
		sum(acts.ra_kred_quant) AS kred_quant,
		sum(acts.ra_kred_total) AS kred_total,
		sum(acts.rg_beg_quant + acts.ra_deb_quant - acts.ra_kred_quant) AS end_quant,
		sum(acts.rg_beg_total + acts.ra_deb_total - acts.ra_kred_total) AS end_quant
	FROM (
	SELECT
		ra.material_id,
		0 AS rg_beg_quant,
		0 AS rg_beg_total,
		sum(CASE WHEN ra.deb THEN ra.quant ELSE 0 END) AS ra_deb_quant,
		sum(CASE WHEN ra.deb THEN ra.total ELSE 0 END) AS ra_deb_total,
		sum(CASE WHEN NOT ra.deb THEN ra.quant ELSE 0 END) AS ra_kred_quant,
		sum(CASE WHEN NOT ra.deb THEN ra.total ELSE 0 END) AS ra_kred_total,
		0 AS rg_end_quant,
		0 AS rg_end_total
		
	FROM ra_materials AS ra
	WHERE ra.date_time BETWEEN in_date_time_from AND in_date_time_to AND ra.store_id = in_store_id
	GROUP BY ra.material_id

	UNION ALL

	--остаток нач
	SELECT
		rg_beg.material_id,
		sum(rg_beg.quant) AS rg_beg_quant,
		sum(rg_beg.total) AS rg_beg_total,
		0 AS ra_deb_quant,
		0 AS ra_deb_total,
		0 AS ra_kred_quant,
		0 AS ra_kred_total,
		0 AS rg_end_quant,
		0 AS rg_end_total
		
	FROM rg_materials_balance(in_date_time_from, ARRAY[in_store_id], in_materials) AS rg_beg
	GROUP BY rg_beg.material_id
/*
	UNION ALL

	--остаток кон
	SELECT
		rg_end.material_id,
		0 AS rg_beg_quant,
		0 AS rg_beg_total,
		0 AS ra_deb_quant,
		0 AS ra_deb_total,
		0 AS ra_kred_quant,
		0 AS ra_kred_total,
		sum(rg_end.quant) AS rg_end,
		sum(rg_end.total) AS rg_end_total
		
	FROM rg_materials_balance(in_date_time_to, ARRAY[in_store_id], in_materials) AS rg_end
	GROUP BY rg_end.material_id
*/	
	) AS acts
	
	LEFT JOIN materials AS m ON m.id = acts.material_id
	
	GROUP BY acts.material_id,m.name
	ORDER BY material_descr
	;

$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION materials_actions(in_date_time_from timestampTZ, in_date_time_to timestampTZ, in_store_id int, in_materials int[]) OWNER TO ;	
	
