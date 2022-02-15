
CREATE OR REPLACE FUNCTION rg_material_set_custom_period(IN in_new_period timestamp without time zone)
  RETURNS void AS
$BODY$
DECLARE
	NEW_PERIOD timestamp without time zone;
	v_prev_current_period timestamp without time zone;
	v_current_period timestamp without time zone;
	CURRENT_PERIOD timestamp without time zone;
	TA_PERIOD timestamp without time zone;
	REG_INTERVAL interval;
BEGIN
	NEW_PERIOD = rg_calc_period_start('material'::reg_types, in_new_period);
	SELECT date_time INTO CURRENT_PERIOD FROM rg_calc_periods WHERE reg_type = 'material'::reg_types;
	TA_PERIOD = reg_current_balance_time();
	--iterate through all periods between CURRENT_PERIOD and NEW_PERIOD
	REG_INTERVAL = rg_calc_interval('material'::reg_types);
	v_prev_current_period = CURRENT_PERIOD;		
	LOOP
		v_current_period = v_prev_current_period + REG_INTERVAL;
		IF v_current_period > NEW_PERIOD THEN
			EXIT;  -- exit loop
		END IF;
		
		--clear period
		DELETE FROM rg_materials
		WHERE date_time = v_current_period;
		
		--new data
		INSERT INTO rg_materials
		(date_time
		
		,store_id
		,material_id
		,quant
		,total						
		)
		(SELECT
				v_current_period
				
				,rg.store_id
				,rg.material_id
				,rg.quant
				,rg.total				
			FROM rg_materials As rg
			WHERE (
			
			rg.quant<>0
			OR
			rg.total<>0
										
			)
			AND (rg.date_time=v_prev_current_period)
		);

		v_prev_current_period = v_current_period;
	END LOOP;

	--new TA data
	DELETE FROM rg_materials
	WHERE date_time=TA_PERIOD;
	INSERT INTO rg_materials
	(date_time
	
	,store_id
	,material_id
	,quant
	,total	
	)
	(SELECT
		TA_PERIOD
		
		,rg.store_id
		,rg.material_id
		,rg.quant
		,rg.total
		FROM rg_materials AS rg
		WHERE (
		
		rg.quant<>0
		OR
		rg.total<>0
											
		)
		AND (rg.date_time=NEW_PERIOD-REG_INTERVAL)
	);

	DELETE FROM rg_materials WHERE (date_time>NEW_PERIOD)
	AND (date_time<>TA_PERIOD);

	--set new period
	UPDATE rg_calc_periods SET date_time = NEW_PERIOD
	WHERE reg_type='material'::reg_types;		
END
$BODY$
LANGUAGE plpgsql VOLATILE COST 100;

ALTER FUNCTION rg_material_set_custom_period(IN in_new_period timestamp without time zone) OWNER TO ;

