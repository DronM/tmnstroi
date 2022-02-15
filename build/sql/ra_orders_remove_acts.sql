-- Function:  ra_orders_remove_acts(doc_types, integer)

-- DROP FUNCTION  ra_orders_remove_acts(doc_types, integer);

CREATE OR REPLACE FUNCTION ra_orders_remove_acts(
    in_doc_type doc_types,
    in_doc_id integer)
  RETURNS void AS
$BODY$
	DELETE FROM ra_orders WHERE doc_type=$1 AND doc_id=$2;
$BODY$
  LANGUAGE sql VOLATILE STRICT
  COST 100;
ALTER FUNCTION  ra_orders_remove_acts(doc_types, integer)
  OWNER TO ;

