-- Function: rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2))

-- DROP FUNCTION rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2));

CREATE OR REPLACE FUNCTION rg_materials_update_periods(
    in_date_time timestampTZ
    ,in_store_id int
    ,in_material_id int
    ,in_quant numeric(19,3)
    ,in_total numeric(15,2)
    )
  RETURNS void AS
$BODY$
DECLARE
	v_loop_rg_period timestamp without time zone;
	v_calc_interval interval;			  			
	CURRENT_BALANCE_DATE_TIME timestamp without time zone;
	CALC_DATE_TIME timestamp without time zone;
BEGIN
	CALC_DATE_TIME = rg_calc_period('material'::reg_types);
	v_loop_rg_period = rg_calc_period_start('material'::reg_types,in_date_time);
	v_calc_interval = rg_calc_interval('material'::reg_types);
	IF v_calc_interval IS NULL THEN
		RAISE EXCEPTION 'Interval for register "material" not defined.';
	END IF;

	LOOP
		UPDATE rg_materials
		SET
			quant = quant + in_quant
			,total = total + in_total
		WHERE 
			date_time=v_loop_rg_period
			AND store_id = in_store_id
			AND material_id = in_material_id
			;
				
		IF NOT FOUND THEN
			BEGIN
				INSERT INTO rg_materials (date_time
				,store_id
				,material_id
				,quant
				,total
				)				
				VALUES (v_loop_rg_period
				,in_store_id
				,in_material_id
				,in_quant
				,in_total
				);
			EXCEPTION WHEN OTHERS THEN
				UPDATE rg_materials
				SET
					quant = quant + in_quant
					,total = total + in_total
				WHERE date_time = v_loop_rg_period
				AND  store_id = in_store_id
				AND  material_id = in_material_id
				;
			END;
		END IF;
		v_loop_rg_period = v_loop_rg_period + v_calc_interval;
		IF v_loop_rg_period > CALC_DATE_TIME THEN
			EXIT;  -- exit loop
		END IF;
	END LOOP;
	
	--Current balance
	CURRENT_BALANCE_DATE_TIME = rg_current_balance_time();
	UPDATE rg_materials
	SET
		quant = quant + in_quant
		,total = total + in_total
	WHERE 
		date_time=CURRENT_BALANCE_DATE_TIME
		AND store_id = in_store_id
		AND material_id = in_material_id
		;
		
	IF NOT FOUND THEN
		BEGIN
			INSERT INTO rg_materials (date_time
			,store_id
			,material_id
			,quant
			,total
			)
			VALUES (CURRENT_BALANCE_DATE_TIME
			,in_store_id
			,in_material_id
			,in_quant
			,in_total
			);
		EXCEPTION WHEN OTHERS THEN
			UPDATE rg_materials
			SET
				quant = quant + in_quant
				,total = total + in_total
			WHERE 
				date_time=CURRENT_BALANCE_DATE_TIME
				AND store_id = in_store_id
				AND material_id = in_material_id
				;
		END;
	END IF;					
	
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2))
  OWNER TO ;

