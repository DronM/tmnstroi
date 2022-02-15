-- Function: pdfn_stores_base()

-- DROP FUNCTION pdfn_stores_base();

CREATE OR REPLACE FUNCTION pdfn_stores_base()
  RETURNS int AS
$$
	SELECT 1;
$$
  LANGUAGE sql STABLE
  COST 100;
ALTER FUNCTION pdfn_stores_base() OWNER TO ;
