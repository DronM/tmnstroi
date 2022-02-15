-- Trigger: ra_materials_after on ra_materials
-- DROP TRIGGER ra_materials_after ON ra_materials;

CREATE TRIGGER ra_materials_after
  AFTER INSERT OR UPDATE OR DELETE
  ON ra_materials
  FOR EACH ROW
  EXECUTE PROCEDURE ra_materials_process();


-- Trigger: ra_materials_before on ra_materials
-- DROP TRIGGER public.ra_materials_before ON ra_materials;

CREATE TRIGGER ra_materials_before
  BEFORE INSERT OR UPDATE OR DELETE
  ON ra_materials
  FOR EACH ROW
  EXECUTE PROCEDURE ra_materials_process();

