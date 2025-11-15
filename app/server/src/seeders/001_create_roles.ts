/**
 * Seeder para crear roles iniciales del sistema
 * 
 * Este seeder crea los roles básicos necesarios para el funcionamiento
 * del sistema: ADMIN, CAJERO y SUPERVISOR
 */
import sequelize from '../config/database';
import { Rol } from '../models/Rol';

export async function seedRoles() {
  try {
    // La secuencia de auto-increment se verifica automáticamente en fixSequences()
    const dialect = sequelize.getDialect();

    const roles = [
      { 
        nombreRol: 'ADMIN', 
        descripcion: 'Administrador del sistema con acceso completo' 
      },
      { 
        nombreRol: 'CAJERO', 
        descripcion: 'Encargado de caja registradora y operaciones diarias' 
      },
      { 
        nombreRol: 'SUPERVISOR', 
        descripcion: 'Supervisor general con permisos de revisión y aprobación' 
      },
    ];

    let createdCount = 0;
    let existingCount = 0;

    for (const rolData of roles) {
      // Verificar si el rol ya existe
      const existing = await Rol.findOne({
        where: { nombreRol: rolData.nombreRol },
      });

      if (existing) {
        existingCount++;
        console.log(`  ℹ️  Rol "${rolData.nombreRol}" ya existe (ID: ${existing.idRol})`);
      } else {
        // Crear el rol usando SQL directo para evitar problemas con auto-increment
        try {
          if (dialect === 'postgres') {
            const [result] = await sequelize.query(`
              INSERT INTO rol (nombrerol, descripcion)
              VALUES (:nombreRol, :descripcion)
              RETURNING idrol, nombrerol, descripcion
            `, {
              replacements: {
                nombreRol: rolData.nombreRol,
                descripcion: rolData.descripcion,
              },
            });

            if (Array.isArray(result) && result.length > 0) {
              const inserted = result[0] as any;
              createdCount++;
              console.log(`  ✅ Rol "${rolData.nombreRol}" creado (ID: ${inserted.idrol})`);
            }
          } else {
            // Para SQLite u otros dialectos, usar el modelo directamente
            const rol = await Rol.create(rolData);
            createdCount++;
            console.log(`  ✅ Rol "${rolData.nombreRol}" creado (ID: ${rol.idRol})`);
          }
        } catch (createError: any) {
          // Si falla por conflicto único, el rol ya existe
          if (createError.name === 'SequelizeUniqueConstraintError' || 
              createError.code === '23505' ||
              (createError.parent && createError.parent.code === '23505')) {
            existingCount++;
            console.log(`  ℹ️  Rol "${rolData.nombreRol}" ya existe`);
          } else {
            throw createError;
          }
        }
      }
    }

    if (createdCount > 0) {
      console.log(`✅ Se crearon ${createdCount} rol(es) nuevo(s)`);
    }
    if (existingCount > 0) {
      console.log(`ℹ️  ${existingCount} rol(es) ya existían`);
    }
    if (createdCount === 0 && existingCount === 0) {
      console.log('✅ Roles iniciales verificados');
    }
  } catch (error) {
    console.error('❌ Error al crear roles iniciales:', error);
    throw error;
  }
}

