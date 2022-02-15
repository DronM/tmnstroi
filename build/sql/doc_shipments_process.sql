-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text default '';	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	/*
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
*/
		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
		
		ELSIF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		v_store_id = pdfn_stores_base();
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(NEW.materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, E'\n') AS error_s, --E'\n'
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'price',CASE WHEN coalesce(m_data.quant,0) = coalesce(bal.quant,0) THEN coalesce(m_data.total,0)/coalesce(m_data.quant,0)
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant, 2)
							END,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN coalesce(bal.quant,0) < coalesce(m_data.quant,0) THEN
						'Материал: "'||coalesce(m.name,'')||'", остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(NEW.date_time, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION 'Ошибка проведения: %', v_error_s;
		END IF;
--RAISE EXCEPTION 'materials: %', NEW.materials;		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO ;

