-- Migración 002: Agregar columna is_active a products
-- 
-- ¿Por qué una migración separada y no modificar la 001?
-- Porque la 001 ya fue ejecutada en producción (o en el equipo del otro dev).
-- Si la modificamos, el script de migración no la volvería a ejecutar.
-- Las migraciones son APPEND-ONLY: siempre se agregan nuevas, nunca se modifican las existentes.

ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Marcar todos los productos existentes como activos
UPDATE products SET is_active = true WHERE is_active IS NULL;
