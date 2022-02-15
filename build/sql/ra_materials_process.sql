-- Function: ra_materials_process()

-- DROP FUNCTION ra_materials_process();

CREATE OR REPLACE FUNCTION ra_materials_process()
  RETURNS trigger AS
$BODY$
DECLARE
	--Facts
	v_delta_quant numeric(19,3) DEFAULT 0;
	v_delta_total numeric(15,2) DEFAULT 0;
	
	CALC_DATE_TIME timestamp without time zone;
	CURRENT_BALANCE_DATE_TIME timestamp without time zone;
	v_loop_rg_period timestamp without time zone;
	v_calc_interval interval;			  			
BEGIN
	IF (TG_WHEN='BEFORE' AND TG_OP='INSERT') THEN
		RETURN NEW;
		
	ELSIF (TG_WHEN='BEFORE' AND TG_OP='UPDATE') THEN
		RETURN NEW;
		
	ELSIF (TG_WHEN='AFTER' AND (TG_OP='UPDATE' OR TG_OP='INSERT')) THEN
		CALC_DATE_TIME = rg_calc_period('material'::reg_types);
		IF (CALC_DATE_TIME IS NULL) OR (NEW.date_time::date > rg_period_balance('material'::reg_types, CALC_DATE_TIME)) THEN
			CALC_DATE_TIME = rg_calc_period_start('material'::reg_types,NEW.date_time);
			PERFORM rg_materials_set_custom_period(CALC_DATE_TIME);						
		END IF;

		IF TG_OP='UPDATE' AND
		(NEW.date_time<>OLD.date_time
		OR NEW.store_id<>OLD.store_id
		OR NEW.material_id<>OLD.material_id
		) THEN
			--delete old data completely
			PERFORM rg_materials_update_periods(
				OLD.date_time
				,OLD.store_id
				,OLD.material_id
				,-1*OLD.quant
				,-1*OLD.total
			);
			v_delta_quant = 0;
			v_delta_total = 0;
			
		ELSIF TG_OP='UPDATE' THEN						
			v_delta_quant = OLD.quant;
			v_delta_total = OLD.total;
		ELSE
			v_delta_quant = 0;
			v_delta_total = 0;
		END IF;		
		v_delta_quant = NEW.quant - v_delta_quant;
		v_delta_total = NEW.total - v_delta_total;
		IF NOT NEW.deb THEN
			v_delta_quant = -1 * v_delta_quant;
			v_delta_total = -1 * v_delta_total;
		END IF;

		PERFORM rg_materials_update_periods(
			NEW.date_time
			,NEW.store_id
			,NEW.material_id
			,v_delta_quant
			,v_delta_total
			);		
		
		RETURN NEW;					
		
	ELSIF (TG_WHEN='BEFORE' AND TG_OP='DELETE') THEN
		RETURN OLD;
		
	ELSIF (TG_WHEN='AFTER' AND TG_OP='DELETE') THEN
		CALC_DATE_TIME = rg_calc_period('material'::reg_types);
		IF (CALC_DATE_TIME IS NULL) OR (OLD.date_time::date > rg_period_balance('material'::reg_types, CALC_DATE_TIME)) THEN
			CALC_DATE_TIME = rg_calc_period_start('material'::reg_types,OLD.date_time);
			PERFORM rg_materials_set_custom_period(CALC_DATE_TIME);						
		END IF;
		v_delta_quant = OLD.quant;
		v_delta_total = OLD.total;
		IF OLD.deb THEN
			v_delta_quant = -1*v_delta_quant;
			v_delta_total = -1*v_delta_total;
		END IF;

		PERFORM rg_materials_update_periods(
			OLD.date_time
			,OLD.store_id
			,OLD.material_id
			,v_delta_quant
			,v_delta_total
		);
	
		RETURN OLD;					
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION ra_materials_process() OWNER TO ;

