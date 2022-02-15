-- Trigger: doc_movements_before_trigger on doc_movements

-- DROP TRIGGER doc_movements_before_trigger ON doc_movements;


 CREATE TRIGGER doc_movements_before_trigger
  BEFORE INSERT OR UPDATE
  ON doc_movements
  FOR EACH ROW
  EXECUTE PROCEDURE doc_movements_process();
