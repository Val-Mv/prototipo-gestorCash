-- Migración: Agregar columna codigo a caja_fuerte
-- Fecha: 2024-11-12
-- Descripción: Agrega la columna codigo con índice único a la tabla caja_fuerte
--              para alinearla con el modelo Sequelize CajaFuerte

-- Verificar si la columna ya existe antes de agregarla
DO $$
BEGIN
  -- Verificar si la columna codigo no existe
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'caja_fuerte'
      AND column_name = 'codigo'
  ) THEN
    -- Agregar la columna codigo como nullable primero
    ALTER TABLE public.caja_fuerte
    ADD COLUMN codigo VARCHAR(100);
    
    -- Actualizar los valores existentes con un código único basado en idcajafuerte
    UPDATE public.caja_fuerte
    SET codigo = 'CAJA-' || idcajafuerte::text
    WHERE codigo IS NULL;
    
    -- Ahora hacer la columna NOT NULL
    ALTER TABLE public.caja_fuerte
    ALTER COLUMN codigo SET NOT NULL;
    
    -- Crear el índice único (Sequelize espera este índice)
    CREATE UNIQUE INDEX idx_cajas_fuertes_codigo
    ON public.caja_fuerte(codigo);
    
    RAISE NOTICE 'Columna codigo agregada a caja_fuerte con éxito';
  ELSE
    RAISE NOTICE 'La columna codigo ya existe en caja_fuerte, omitiendo...';
    
    -- Si la columna existe pero algunos registros tienen NULL, actualizarlos
    UPDATE public.caja_fuerte
    SET codigo = 'CAJA-' || idcajafuerte::text
    WHERE codigo IS NULL;
  END IF;
  
  -- Verificar si el índice existe, si no, crearlo
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'caja_fuerte'
      AND indexname = 'idx_cajas_fuertes_codigo'
  ) THEN
    -- Si la columna existe pero el índice no, crear el índice
    CREATE UNIQUE INDEX IF NOT EXISTS idx_cajas_fuertes_codigo
    ON public.caja_fuerte(codigo);
    
    RAISE NOTICE 'Índice idx_cajas_fuertes_codigo creado con éxito';
  ELSE
    RAISE NOTICE 'El índice idx_cajas_fuertes_codigo ya existe, omitiendo...';
  END IF;
END
$$ LANGUAGE plpgsql;

-- Comentario para documentar la columna
COMMENT ON COLUMN public.caja_fuerte.codigo IS 'Código único identificador de la caja fuerte';

