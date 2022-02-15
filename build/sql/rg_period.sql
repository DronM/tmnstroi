-- FUNCTION: public.rg_period(reg_types, timestamp without time zone)

-- DROP FUNCTION public.rg_period(reg_types, timestamp without time zone);

CREATE OR REPLACE FUNCTION public.rg_period(
	in_reg_type reg_types,
	in_date_time timestamp without time zone)
    RETURNS timestamp without time zone
    LANGUAGE 'sql'

    COST 100
    IMMUTABLE 
AS $BODY$
	SELECT date_trunc('MONTH', in_date_time)::timestamp without time zone;
$BODY$;

ALTER FUNCTION public.rg_period(reg_types, timestamp without time zone)
    OWNER TO ;

