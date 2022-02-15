-- FUNCTION: public.reg_current_balance_time()

-- DROP FUNCTION public.reg_current_balance_time();

CREATE OR REPLACE FUNCTION public.reg_current_balance_time(
	)
    RETURNS timestamp without time zone
    LANGUAGE 'sql'

    COST 100
    VOLATILE 
AS $BODY$
SELECT '3000-01-01 00:00:00'::timestamp without time zone;
$BODY$;

ALTER FUNCTION public.reg_current_balance_time()
    OWNER TO ;

