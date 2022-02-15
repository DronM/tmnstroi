-- Function: rg_orders_balance(timestampTZ,int[])

-- DROP FUNCTION rg_orders_balance(timestampTZ,int[]);

CREATE OR REPLACE FUNCTION rg_orders_balance(
    IN in_date_time timestampTZ
    ,IN in_material_id_ar int[]
    )
  RETURNS TABLE(
  	material_id int
  	,quant numeric(19,3)
  	) AS
$BODY$
	WITH
	last_calc_per AS (SELECT rg_period_balance('order'::reg_types, rg_calc_period('order'::reg_types)) AS v ),
	cur_per AS (SELECT rg_calc_period_start('order'::reg_types, in_date_time::timestamp without time zone) AS v ),
	next_per AS (SELECT rg_calc_period_start('order'::reg_types, (SELECT v FROM cur_per)+rg_calc_interval('order'::reg_types)) AS v ),
	act_forward AS (
		SELECT
			rg_period_balance('order'::reg_types,in_date_time::timestamp without time zone) - in_date_time >
			in_date_time - (SELECT t.v FROM cur_per t)
			AS v
	),
	act_sg AS (SELECT CASE WHEN t.v THEN 1 ELSE -1 END AS v FROM act_forward t)
	SELECT
		sub.material_id
		,SUM(sub.quant)::numeric(19,3) AS quant
	FROM(
		-- *** BALANCE ***
		(SELECT
			b.material_id
			,b.quant
		FROM rg_orders AS b
		WHERE
		(
			--date bigger than last calc period
			( in_date_time > (SELECT v FROM last_calc_per) AND b.date_time = (SELECT rg_current_balance_time()) )
			OR (
				in_date_time <= (SELECT v FROM last_calc_per)
				AND (				
					--forward from previous period
					( (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)-rg_calc_interval('order'::reg_types)
					)
					--backward from current
					OR			
					( NOT (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)
					)
				)
			)
		)
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
		)
		)
		
		UNION ALL
		
		-- *** ACTS ***
		(SELECT
			act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant * (SELECT t.v FROM act_sg t)
			ELSE -act.quant * (SELECT t.v FROM act_sg t)
		END AS quant
		
		FROM doc_log
		LEFT JOIN ra_orders AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE
		--date less then last calc period otherwise - no actions
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
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (act.material_id=ANY(in_material_id_ar)))
		AND (
			act.quant<>0
		)
		ORDER BY doc_log.date_time,doc_log.id
		)
	) AS sub
	WHERE
		( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (sub.material_id=ANY(in_material_id_ar)))
	GROUP BY
		sub.material_id
	HAVING
		SUM(sub.quant)<>0
	ORDER BY
		sub.material_id
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_orders_balance(timestampTZ,int[])
  OWNER TO ;

