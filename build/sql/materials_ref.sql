-- FUNCTION: public.materials_ref(materials)

-- DROP FUNCTION public.materials_ref(materials);

CREATE OR REPLACE FUNCTION public.materials_ref(
	materials)
    RETURNS json
    LANGUAGE 'sql'

    COST 100
    VOLATILE 
AS $BODY$
SELECT json_build_object(
		'keys',json_build_object(
			  'id',  $1.id
			),	
		'descr',$1.name,
		'dataType','materials'
	);
$BODY$;

ALTER FUNCTION public.materials_ref(materials)
    OWNER TO tmnstroi;

