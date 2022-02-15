-- Function: ra_orders_add_act(ra_orders)

-- DROP FUNCTION ra_orders_add_act(ra_orders);

CREATE OR REPLACE FUNCTION ra_orders_add_act(reg_act ra_orders)
  RETURNS void AS
$BODY$
	INSERT INTO ra_orders
	(date_time,doc_type,doc_id
	,deb
	,material_id
	,quant
	)
	VALUES (
	reg_act.date_time,reg_act.doc_type,reg_act.doc_id
	,reg_act.deb
	,reg_act.material_id
	,reg_act.quant
	);
$BODY$
  LANGUAGE sql VOLATILE STRICT
  COST 100;
ALTER FUNCTION ra_orders_add_act(ra_orders)
  OWNER TO ;

