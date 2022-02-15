-- Function: pdfn_stores_in_route()

-- DROP FUNCTION pdfn_stores_in_route();

CREATE OR REPLACE FUNCTION pdfn_stores_in_route()
  RETURNS int AS
$$
	SELECT 2;
$$
  LANGUAGE sql STABLE
  COST 100;
ALTER FUNCTION pdfn_stores_in_route() OWNER TO ;
