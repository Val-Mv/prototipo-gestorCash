import sequelize from '../config/database';
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

Usuario.hasMany(VentaDiaria, { foreignKey: 'idUsuario', as: 'ventasRegistradas' });
VentaDiaria.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuarioVenta' });

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

ReporteDiario.hasMany(Conteo, { foreignKey: 'idReporte', as: 'conteos' });
Conteo.belongsTo(ReporteDiario, { foreignKey: 'idReporte', as: 'reporte' });

ReporteDiario.hasMany(VentaDiaria, { foreignKey: 'idReporte', as: 'ventasDiarias' });
VentaDiaria.belongsTo(ReporteDiario, { foreignKey: 'idReporte', as: 'reporte' });

Conteo.hasMany(DiferenciaCaja, { foreignKey: 'idConteo', as: 'diferencias' });
DiferenciaCaja.belongsTo(Conteo, { foreignKey: 'idConteo', as: 'conteo' });

TipoDiferencia.hasMany(DiferenciaCaja, { foreignKey: 'idTipoDiferencia', as: 'diferencias' });
DiferenciaCaja.belongsTo(TipoDiferencia, { foreignKey: 'idTipoDiferencia', as: 'tipoDiferencia' });

Usuario.hasMany(DiferenciaCaja, { foreignKey: 'idUsuario', as: 'diferenciasCaja' });
DiferenciaCaja.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuarioDiferencia' });

// Exportar modelos
export {
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
    
    // Sincronizar modelos (crear tablas si no existen)
    await sequelize.sync({ alter: false });
    console.log('✅ Modelos sincronizados con la base de datos.');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    throw error;
  }
};

export { sequelize };
export default {
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
