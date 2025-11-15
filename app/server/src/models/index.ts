import sequelize from '../config/database';
import { Store } from './Store';
import { Usuario } from './Usuario';
import { Rol } from './Rol';
import { CajaRegistradora } from './CajaRegistradora';
import { CategoriaGasto } from './CategoriaGasto';
import { Gasto } from './Gasto';
import { EstadoGasto } from './EstadoGasto';
import { CajaFuerte } from './CajaFuerte';
import { VentaDiaria } from './VentaDiaria';
import { BitacoraAuditoria } from './BitacoraAuditoria';
import { Conteo } from './Conteo';
import { DiferenciaCaja } from './DiferenciaCaja';
import { TipoConteo } from './TipoConteo';
import { TipoDiferencia } from './TipoDiferencia';
import { ReporteDiario } from './ReporteDiario';

// Definir asociaciones principales del nuevo modelo en español
Rol.hasMany(Usuario, { foreignKey: 'idRol', as: 'usuarios' });
Usuario.belongsTo(Rol, { foreignKey: 'idRol', as: 'rol' });

Usuario.hasMany(CategoriaGasto, { foreignKey: 'idUsuarioCreacion', as: 'categoriasCreadas' });
CategoriaGasto.belongsTo(Usuario, { foreignKey: 'idUsuarioCreacion', as: 'usuarioCreacion' });

CajaRegistradora.hasMany(Gasto, { foreignKey: 'idCaja', as: 'gastos' });
Gasto.belongsTo(CajaRegistradora, { foreignKey: 'idCaja', as: 'caja' });

CajaFuerte.hasMany(Gasto, { foreignKey: 'idCajaOrigen', as: 'gastosOrigen' });
Gasto.belongsTo(CajaFuerte, { foreignKey: 'idCajaOrigen', as: 'cajaOrigen' });

Usuario.hasMany(Gasto, { foreignKey: 'idUsuarioRegistro', as: 'gastosRegistrados' });
Gasto.belongsTo(Usuario, { foreignKey: 'idUsuarioRegistro', as: 'usuarioRegistro' });

Usuario.hasMany(Gasto, { foreignKey: 'idUsuarioAprobacion', as: 'gastosAprobados' });
Gasto.belongsTo(Usuario, { foreignKey: 'idUsuarioAprobacion', as: 'usuarioAprobacion' });

CategoriaGasto.hasMany(Gasto, { foreignKey: 'idCategoria', as: 'gastos' });
Gasto.belongsTo(CategoriaGasto, { foreignKey: 'idCategoria', as: 'categoria' });

EstadoGasto.hasMany(Gasto, { foreignKey: 'idEstadoGasto', as: 'gastos' });
Gasto.belongsTo(EstadoGasto, { foreignKey: 'idEstadoGasto', as: 'estado' });

CajaRegistradora.hasMany(VentaDiaria, { foreignKey: 'idCaja', as: 'ventasDiarias' });
VentaDiaria.belongsTo(CajaRegistradora, { foreignKey: 'idCaja', as: 'caja' });

// VentaDiaria usa idusuariogeneral, no idusuario
Usuario.hasMany(VentaDiaria, { foreignKey: 'idUsuario', sourceKey: 'idUsuario', as: 'ventasRegistradas' });
VentaDiaria.belongsTo(Usuario, { foreignKey: 'idUsuario', targetKey: 'idUsuario', as: 'usuarioVenta' });

Usuario.hasMany(BitacoraAuditoria, { foreignKey: 'idUsuario', as: 'bitacoras' });
BitacoraAuditoria.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuarioBitacora' });

Usuario.hasMany(ReporteDiario, { foreignKey: 'idUsuarioGenerador', as: 'reportesGenerados' });
ReporteDiario.belongsTo(Usuario, { foreignKey: 'idUsuarioGenerador', as: 'usuarioGenerador' });

CajaRegistradora.hasMany(Conteo, { foreignKey: 'idCaja', as: 'conteos' });
Conteo.belongsTo(CajaRegistradora, { foreignKey: 'idCaja', as: 'caja' });

Usuario.hasMany(Conteo, { foreignKey: 'idUsuario', as: 'conteos' });
Conteo.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario' });

TipoConteo.hasMany(Conteo, { foreignKey: 'idTipoConteo', as: 'conteos' });
Conteo.belongsTo(TipoConteo, { foreignKey: 'idTipoConteo', as: 'tipoConteo' });

// NOTA: Comentado porque la columna idReporte no existe en conteo según el DDL real
// ReporteDiario.hasMany(Conteo, { foreignKey: 'idReporte', as: 'conteos' });
// Conteo.belongsTo(ReporteDiario, { foreignKey: 'idReporte', as: 'reporte' });

// NOTA: Comentado temporalmente porque la columna idReporte no existe en venta_diaria
// TODO: Agregar columna idreporte a venta_diaria si esta relación es necesaria
// ReporteDiario.hasMany(VentaDiaria, { foreignKey: 'idReporte', as: 'ventasDiarias' });
// VentaDiaria.belongsTo(ReporteDiario, { foreignKey: 'idReporte', as: 'reporte' });

Conteo.hasMany(DiferenciaCaja, { foreignKey: 'idConteo', as: 'diferencias' });
DiferenciaCaja.belongsTo(Conteo, { foreignKey: 'idConteo', as: 'conteo' });

TipoDiferencia.hasMany(DiferenciaCaja, { foreignKey: 'idTipoDiferencia', as: 'diferencias' });
DiferenciaCaja.belongsTo(TipoDiferencia, { foreignKey: 'idTipoDiferencia', as: 'tipoDiferencia' });

// NOTA: Comentado temporalmente porque la columna idUsuario no existe en diferencia_caja
// TODO: Agregar columna idusuario a diferencia_caja si esta relación es necesaria
// Usuario.hasMany(DiferenciaCaja, { foreignKey: 'idUsuario', as: 'diferenciasCaja' });
// DiferenciaCaja.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuarioDiferencia' });

// Exportar modelos
export {
  Store,
  Usuario,
  Rol,
  CajaRegistradora,
  CategoriaGasto,
  Gasto,
  EstadoGasto,
  CajaFuerte,
  VentaDiaria,
  BitacoraAuditoria,
  Conteo,
  DiferenciaCaja,
  TipoConteo,
  TipoDiferencia,
  ReporteDiario,
};

// Sincronizar modelos con la base de datos
export const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
    console.log('Database connection established');

    const shouldSync = process.env.SHOULD_SYNC_DB === 'true';
    const alterSync = process.env.SHOULD_SYNC_DB_ALTER === 'true';
    const forceSync = process.env.SHOULD_SYNC_DB_FORCE === 'true';

    if (forceSync && alterSync) {
      console.warn('⚠️  Ignorando SHOULD_SYNC_DB_FORCE porque SHOULD_SYNC_DB_ALTER está activo.');
    }

    const queryInterface = sequelize.getQueryInterface();
    const normalizeTableName = (table: unknown): string => {
      const extractName = (value: string | undefined): string => {
        if (!value) {
          return '';
        }

        const lower = value.toLowerCase();
        const cleaned = lower.replace(/["'`]/g, '');
        const parts = cleaned.split('.');
        return parts[parts.length - 1] ?? '';
      };

      if (typeof table === 'string') {
        return extractName(table);
      }

      if (table && typeof table === 'object') {
        const candidate = (table as { tableName?: string; schema?: string }).tableName;
        return extractName(candidate);
      }

      return '';
    };

    try {
      const existingTablesRaw = await queryInterface.showAllTables();
      const existingTables = Array.isArray(existingTablesRaw) ? existingTablesRaw : [];
      const hasStoreTable = (existingTables as Array<unknown>)
        .map(normalizeTableName)
        .some((tableName) => tableName === 'store');

      if (!hasStoreTable) {
        console.warn('⚠️  La tabla "store" no existe. Creándola automáticamente...');
        await Store.sync({ alter: false });
        console.log('✅ Tabla "store" creada correctamente.');
      }

      const shouldSeedDefaults =
        (process.env.SEED_DEFAULT_DATA ??
          ((process.env.NODE_ENV ?? 'development') !== 'production' ? 'true' : 'false')) === 'true';

      if (shouldSeedDefaults) {
        const defaultStoreId = process.env.DEFAULT_STORE_ID ?? 'berwyn-il';
        const defaultStoreName = process.env.DEFAULT_STORE_NAME ?? 'Dollar Tree Berwyn';
        const defaultStoreCode = process.env.DEFAULT_STORE_CODE ?? 'DT-BYW';

        const [store, created] = await Store.findOrCreate({
          where: { id: defaultStoreId },
          defaults: {
            id: defaultStoreId,
            name: defaultStoreName,
            code: defaultStoreCode,
            active: true,
          },
        });

        if (created) {
          console.log(`✅ Datos iniciales cargados: tienda "${store.name}" (${store.id}).`);
        } else {
          console.log(`ℹ️  Tienda por defecto "${store.name}" ya existe (ID ${store.id}).`);
        }
      } else {
        console.log('ℹ️  SEED_DEFAULT_DATA deshabilitado. No se crearán datos iniciales.');
      }
    } catch (tableError) {
      console.error('❌ No se pudo verificar/crear la tabla "store":', tableError);
      throw tableError;
    }

    if (shouldSync || alterSync || forceSync) {
      await sequelize.sync({
        alter: alterSync,
        force: forceSync && !alterSync,
      });
      console.log(
        `✅ Modelos sincronizados con la base de datos (alter=${alterSync ? 'sí' : 'no'}, force=${forceSync && !alterSync ? 'sí' : 'no'
        }).`
      );
    } else {
      console.log('ℹ️  SHOULD_SYNC_DB/ALTER/FORCE no habilitados. Se omite la sincronización automática.');
    }
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    throw error;
  }
};

export { sequelize };
export default {
  Store,
  Usuario,
  Rol,
  CajaRegistradora,
  CategoriaGasto,
  Gasto,
  EstadoGasto,
  CajaFuerte,
  VentaDiaria,
  BitacoraAuditoria,
  Conteo,
  DiferenciaCaja,
  TipoConteo,
  TipoDiferencia,
  ReporteDiario,
};
