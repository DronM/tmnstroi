-- Function: rg_orders_update_periods(timestampTZ,int,numeric(19,3))

-- DROP FUNCTION rg_orders_update_periods(timestampTZ,int,numeric(19,3));

CREATE OR REPLACE FUNCTION rg_orders_update_periods(
    in_date_time timestampTZ
    ,in_material_id int
    ,in_quant numeric(19,3)
    )
  RETURNS void AS
$BODY$
DECLARE
	v_loop_rg_period timestamp without time zone;
	v_calc_interval interval;			  			
	CURRENT_BALANCE_DATE_TIME timestamp without time zone;
	CALC_DATE_TIME timestamp without time zone;
BEGIN
	CALC_DATE_TIME = rg_calc_period('order'::reg_types);
	v_loop_rg_period = rg_calc_period_start('order'::reg_types,in_date_time);
	v_calc_interval = rg_calc_interval('order'::reg_types);
	IF v_calc_interval IS NULL THEN
		RAISE EXCEPTION 'Interval for register "order" not defined.';
	END IF;
	
	LOOP
		UPDATE rg_orders
		SET
			quant = quant + in_quant
		WHERE 
			date_time=v_loop_rg_period
			AND material_id = in_material_id
			;
			
		IF NOT FOUND THEN
			BEGIN
				INSERT INTO rg_orders (date_time
				,material_id
				,quant
				)				
				VALUES (v_loop_rg_period
				,in_material_id
				,in_quant
				);
			EXCEPTION WHEN OTHERS THEN
				UPDATE rg_orders
				SET
					quant = quant + in_quant
				WHERE date_time = v_loop_rg_period
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
	UPDATE rg_orders
	SET
		quant = quant + in_quant
	WHERE 
		date_time=CURRENT_BALANCE_DATE_TIME
		AND material_id = in_material_id
		;
		
	IF NOT FOUND THEN
		BEGIN
			INSERT INTO rg_orders (date_time
			,material_id
			,quant
			)
			VALUES (CURRENT_BALANCE_DATE_TIME
			,in_material_id
			,in_quant
			);
		EXCEPTION WHEN OTHERS THEN
			UPDATE rg_orders
			SET
				quant = quant + in_quant
			WHERE 
				date_time=CURRENT_BALANCE_DATE_TIME
				AND material_id = in_material_id
				;
		END;
	END IF;					
	
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION rg_orders_update_periods(timestampTZ,int,numeric(19,3))
  OWNER TO ;

