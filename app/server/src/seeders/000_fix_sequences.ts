/**
 * Helper para verificar y corregir secuencias de auto-increment en PostgreSQL
 * 
 * Este módulo asegura que todas las tablas con auto-increment tengan
 * sus secuencias correctamente configuradas
 */
import sequelize from '../config/database';

interface SequenceConfig {
  tableName: string;
  columnName: string;
  sequenceName: string;
}

const sequencesToFix: SequenceConfig[] = [
  {
    tableName: 'rol',
    columnName: 'idrol',
    sequenceName: 'rol_idrol_seq',
  },
  {
    tableName: 'usuario',
    columnName: 'idusuario',
    sequenceName: 'usuario_idusuario_seq',
  },
];

/**
 * Verifica y corrige las secuencias de auto-increment para todas las tablas configuradas
 */
export async function fixSequences() {
  const dialect = sequelize.getDialect();
  
  if (dialect !== 'postgres') {
    // Solo aplica a PostgreSQL
    return;
  }

  try {
    console.log('🔧 Verificando secuencias de auto-increment...');

    for (const config of sequencesToFix) {
      await sequelize.query(`
        DO $$
        BEGIN
          -- Verificar si la secuencia existe, si no, crearla
          IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = '${config.sequenceName}') THEN
            -- Crear la secuencia
            CREATE SEQUENCE ${config.sequenceName};
            -- Asignar el valor actual máximo si hay registros (cast a bigint para evitar error de tipo)
            PERFORM setval('${config.sequenceName}', COALESCE((SELECT MAX(${config.columnName})::bigint FROM ${config.tableName}), 0)::bigint + 1, false);
            -- Asignar la secuencia a la columna
            ALTER TABLE ${config.tableName} ALTER COLUMN ${config.columnName} SET DEFAULT nextval('${config.sequenceName}');
            RAISE NOTICE 'Secuencia % creada y configurada para tabla %', '${config.sequenceName}', '${config.tableName}';
          ELSE
            -- Si la secuencia ya existe, solo asegurar que esté asignada a la columna
            ALTER TABLE ${config.tableName} ALTER COLUMN ${config.columnName} SET DEFAULT nextval('${config.sequenceName}');
            -- Ajustar el valor de la secuencia si es necesario
            PERFORM setval('${config.sequenceName}', GREATEST(
              (SELECT COALESCE(MAX(${config.columnName})::bigint, 0) FROM ${config.tableName}) + 1,
              currval('${config.sequenceName}')
            ), false);
          END IF;
        END $$;
      `);
    }

    console.log('✅ Secuencias de auto-increment verificadas y corregidas');
  } catch (error) {
    console.error('❌ Error al verificar secuencias:', error);
    // No lanzar el error para que el servidor pueda continuar iniciando
    // Las secuencias se pueden corregir manualmente si es necesario
  }
}

