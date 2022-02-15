CREATE OR REPLACE FUNCTION okei_ref(okei)
  RETURNS json AS
$$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.code    
			),	
		'descr',$1.name_nat,
		'dataType','okei'
	);
$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION okei_ref(okei) OWNER TO ;	
	
