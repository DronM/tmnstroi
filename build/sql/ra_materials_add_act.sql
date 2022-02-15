-- Function: ra_materials_add_act(ra_materials)

-- DROP FUNCTION ra_materials_add_act(ra_materials);

CREATE OR REPLACE FUNCTION ra_materials_add_act(reg_act ra_materials)
  RETURNS void AS
$BODY$
	INSERT INTO ra_materials
	(date_time,doc_type,doc_id
	,deb
	,store_id
	,material_id
	,quant
	,total
	)
	VALUES (
	reg_act.date_time,reg_act.doc_type,reg_act.doc_id
	,reg_act.deb
	,reg_act.store_id
	,reg_act.material_id
	,reg_act.quant
	,reg_act.total
	);
$BODY$
  LANGUAGE sql VOLATILE STRICT
  COST 100;
ALTER FUNCTION ra_materials_add_act(ra_materials)
  OWNER TO ;

