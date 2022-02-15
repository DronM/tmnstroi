-- FUNCTION: public.rg_total_recalc_materials()

-- DROP FUNCTION public.rg_total_recalc_materials();

CREATE OR REPLACE FUNCTION public.rg_total_recalc_materials(
	)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
DECLARE
	period_row RECORD;
	v_act_date_time timestamp without time zone;
	v_cur_period timestamp without time zone;
BEGIN	
	v_act_date_time = reg_current_balance_time();
	SELECT date_time INTO v_cur_period FROM rg_calc_periods;
	
	FOR period_row IN
		WITH
		periods AS (
			(SELECT
				DISTINCT date_trunc('month', date_time) AS d,
				production_base_id,
				material_id
			FROM ra_materials)
			UNION		
			(SELECT
				date_time AS d,
				production_base_id,
				material_id
			FROM rg_materials WHERE date_time<=v_cur_period
			)
			ORDER BY d			
		)
		SELECT sub.d,sub.production_base_id,sub.material_id,sub.balance_fact,sub.balance_paper
		FROM
		(
		SELECT
			periods.d,
			periods.production_base_id,
			periods.material_id,
			COALESCE((
				SELECT SUM(CASE WHEN deb THEN quant ELSE 0 END)-SUM(CASE WHEN NOT deb THEN quant ELSE 0 END)
				FROM ra_materials AS ra WHERE ra.date_time <= last_month_day(periods.d::date)+'23:59:59'::interval AND ra.production_base_id=periods.production_base_id AND ra.material_id=periods.material_id
			),0) AS balance_fact,
			
			(
			SELECT SUM(quant) FROM rg_materials WHERE date_time=periods.d AND production_base_id=periods.production_base_id AND material_id=periods.material_id
			) AS balance_paper
			
		FROM periods
		) AS sub
		WHERE sub.balance_fact<>sub.balance_paper ORDER BY sub.d	
	LOOP
		
		UPDATE rg_materials AS rg
		SET quant = period_row.balance_fact
		WHERE rg.date_time=period_row.d AND rg.production_base_id=period_row.production_base_id AND rg.material_id=period_row.material_id;
		
		IF NOT FOUND THEN
			INSERT INTO rg_materials (date_time, production_base_id, material_id,quant)
			VALUES (period_row.d, period_row.production_base_id, period_row.material_id, period_row.balance_fact);
		END IF;
	END LOOP;

	--АКТУАЛЬНЫЕ ИТОГИ
	DELETE FROM rg_materials WHERE date_time>v_cur_period;
	
	INSERT INTO rg_materials (date_time, production_base_id, material_id,quant)
	(
	SELECT
		v_act_date_time,
		rg.production_base_id,
		rg.material_id,
		COALESCE(rg.quant,0) +
		COALESCE((
		SELECT sum(ra.quant) FROM
		ra_materials AS ra
		WHERE ra.date_time BETWEEN v_cur_period AND last_month_day(v_cur_period::date)+'23:59:59'::interval
			AND ra.production_base_id=rg.production_base_id
			AND ra.material_id=rg.material_id
			AND ra.deb=TRUE
		),0) - 
		COALESCE((
		SELECT sum(ra.quant) FROM
		ra_materials AS ra
		WHERE ra.date_time BETWEEN v_cur_period AND last_month_day(v_cur_period::date)+'23:59:59'::interval
			AND ra.production_base_id=rg.production_base_id
			AND ra.material_id=rg.material_id
			AND ra.deb=FALSE
		),0)
		
	FROM rg_materials AS rg
	WHERE date_time=(v_cur_period-'1 month'::interval)
	);	
END;
$BODY$;

ALTER FUNCTION public.rg_total_recalc_materials()
    OWNER TO tmnstroi;

