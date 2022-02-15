-- FUNCTION: public.rg_calc_interval(reg_types)

-- DROP FUNCTION public.rg_calc_interval(reg_types);

CREATE OR REPLACE FUNCTION public.rg_calc_interval(
	in_reg_type reg_types)
    RETURNS interval
    LANGUAGE 'sql'

    COST 100
    IMMUTABLE 
AS $BODY$
SELECT
		CASE $1
		WHEN 'material'::reg_types THEN '1 month'::interval
		END;
$BODY$;

ALTER FUNCTION public.rg_calc_interval(reg_types)
    OWNER TO ;

