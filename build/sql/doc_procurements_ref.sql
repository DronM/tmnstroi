CREATE OR REPLACE FUNCTION doc_procurements_ref(doc_procurements)
  RETURNS json AS
$$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.id    
			),	
		'descr','Поступление №'||$1.id::text||' от '||to_char($1.date_time,'DD/MM/YY HH24:MI:SS'),
		'dataType','doc_procurements'
	);
$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION doc_procurements_ref(doc_procurements) OWNER TO ;	
	
