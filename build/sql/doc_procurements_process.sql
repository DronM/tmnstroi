-- Function: doc_procurements_process()

-- DROP FUNCTION doc_procurements_process();

CREATE OR REPLACE FUNCTION doc_procurements_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('procurement'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('procurement'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('procurement'::doc_types, OLD.id);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--приход на склад
			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'procurement'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= TRUE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		SELECT
			sum((mat_rows.r->'fields'->>'total')::numeric(15,2))
		INTO NEW.total
		FROM (
		SELECT
			jsonb_array_elements(NEW.materials->'rows') r
		FROM doc_procurements
		) mat_rows;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('procurement'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('procurement'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_procurements_process()
  OWNER TO ;

