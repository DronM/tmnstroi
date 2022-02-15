-- Function: rg_materials_balance(timestampTZ,int[],int[])

-- DROP FUNCTION rg_materials_balance(timestampTZ,int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
    IN in_date_time timestampTZ
    ,IN in_store_id_ar int[]
    ,IN in_material_id_ar int[]
    )
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	WITH
	last_calc_per AS (SELECT rg_period_balance('material'::reg_types, rg_calc_period('material'::reg_types)) AS v ),
	cur_per AS (SELECT rg_calc_period_start('material'::reg_types, in_date_time::timestamp without time zone) AS v ),
	next_per AS (SELECT rg_calc_period_start('material'::reg_types, (SELECT v FROM cur_per)+rg_calc_interval('material'::reg_types)) AS v ),
	act_forward AS (
		SELECT
			rg_period_balance('material'::reg_types,in_date_time::timestamp without time zone) - in_date_time >
			in_date_time - (SELECT t.v FROM cur_per t)
			AS v
	),
	act_sg AS (SELECT CASE WHEN t.v THEN 1 ELSE -1 END AS v FROM act_forward t)
	SELECT
		sub.store_id
		,sub.material_id
		,SUM(sub.quant)::numeric(19,3) AS quant
		,SUM(sub.total)::numeric(15,2) AS total
	FROM(
		-- *** BALANCE ***
		(SELECT
			b.store_id
			,b.material_id
			,b.quant
			,b.total
		FROM rg_materials AS b
		WHERE
		(
			--date bigger than last calc period
			( in_date_time > (SELECT v FROM last_calc_per) AND b.date_time = (SELECT rg_current_balance_time()) )
			OR (
				in_date_time <= (SELECT v FROM last_calc_per)
				AND (
					--forward from previous period
					( (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)-rg_calc_interval('material'::reg_types)
					)
					--backward from current
					OR			
					( NOT (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)
					)
				)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
		)
		
		UNION ALL
		
		-- *** ACTS ***
		(SELECT
			act.store_id
			,act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant * (SELECT t.v FROM act_sg t)
			ELSE -act.quant * (SELECT t.v FROM act_sg t)
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total * (SELECT t.v FROM act_sg t)
			ELSE -act.total * (SELECT t.v FROM act_sg t)
		END AS quant
		
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE
		--date less then last calc period
		in_date_time <= (SELECT v FROM last_calc_per)
		AND 
		(
			--forward from current period
			( (SELECT t.v FROM act_forward t) AND
					act.date_time >= (SELECT t.v FROM cur_per t)
					AND act.date_time <= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)<=date_trunc('second',in_date_time)
						ORDER BY l.date_time DESC
						LIMIT 1
						)
			)
			--backward from next period
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND
					act.date_time >= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)>=date_trunc('second',in_date_time)
						ORDER BY l.date_time ASC
						LIMIT 1
						)			
					AND act.date_time <= (SELECT t.v FROM next_per t)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (act.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (act.material_id=ANY(in_material_id_ar)))
		AND (
			act.quant<>0
			 OR act.total<>0
		)
		ORDER BY doc_log.date_time,doc_log.id
		)
	) AS sub
	WHERE
		( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (sub.store_id=ANY(in_store_id_ar)))
		 AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (sub.material_id=ANY(in_material_id_ar)))
	GROUP BY
		sub.store_id
		,sub.material_id
	HAVING
		SUM(sub.quant)<>0
		 OR SUM(sub.total)<>0
	ORDER BY
		sub.store_id
		,sub.material_id
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(timestampTZ,int[],int[])
  OWNER TO ;

