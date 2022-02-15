CREATE OR REPLACE FUNCTION doc_shipments_ref(doc_shipments)
  RETURNS json AS
$$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.id    
			),	
		'descr','Отгрузка №'||$1.id::text||' от '||to_char($1.date_time,'DD/MM/YY HH24:MI:SS'),
		'dataType','doc_shipments'
	);
$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION doc_shipments_ref(doc_shipments) OWNER TO ;	
	
