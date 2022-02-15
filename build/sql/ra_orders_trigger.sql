-- Trigger: ra_orders_after on ra_orders
-- DROP TRIGGER ra_orders_after ON ra_orders;

CREATE TRIGGER ra_orders_after
  AFTER INSERT OR UPDATE OR DELETE
  ON ra_orders
  FOR EACH ROW
  EXECUTE PROCEDURE ra_orders_process();


-- Trigger: ra_orders_before on ra_orders
-- DROP TRIGGER public.ra_orders_before ON ra_orders;

CREATE TRIGGER ra_orders_before
  BEFORE INSERT OR UPDATE OR DELETE
  ON ra_orders
  FOR EACH ROW
  EXECUTE PROCEDURE ra_orders_process();

