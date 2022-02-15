CREATE OR REPLACE FUNCTION oktmo_ref(oktmo)
  RETURNS json AS
$$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.id    
			),	
		'descr',$1.name,
		'dataType','oktmo'
	);
$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION oktmo_ref(oktmo) OWNER TO ;	
	
