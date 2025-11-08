import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface GastoAttributes {
  idGasto: number;
  fecha: Date;
  monto: number;
  descripcion: string;
  numeroComprobante: string;
  rutaComprobante: string;
  idCaja: number | null;
  idUsuarioRegistro: number;
  idUsuarioAprobacion: number | null;
  idCajaOrigen: number | null;
  idCategoria: number;
  idEstadoGasto: number;
}

export interface GastoCreationAttributes
  extends Optional<
    GastoAttributes,
    'idGasto' | 'fecha' | 'idCaja' | 'idUsuarioAprobacion' | 'idCajaOrigen'
  > {}

export class Gasto extends Model<GastoAttributes, GastoCreationAttributes> implements GastoAttributes {
  public idGasto!: number;
  public fecha!: Date;
  public monto!: number;
  public descripcion!: string;
  public numeroComprobante!: string;
  public rutaComprobante!: string;
  public idCaja!: number | null;
  public idUsuarioRegistro!: number;
  public idUsuarioAprobacion!: number | null;
  public idCajaOrigen!: number | null;
  public idCategoria!: number;
  public idEstadoGasto!: number;
}

Gasto.init(
  {
    idGasto: {
      type: DataTypes.DECIMAL(12, 0),
      autoIncrement: true,
      primaryKey: true,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    monto: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    numeroComprobante: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    rutaComprobante: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    idCaja: {
      type: DataTypes.DECIMAL(12, 0),
      allowNull: true,
    },
    idUsuarioRegistro: {
      type: DataTypes.DECIMAL(12, 0),
      allowNull: false,
    },
    idUsuarioAprobacion: {
      type: DataTypes.DECIMAL(12, 0),
      allowNull: true,
    },
    idCajaOrigen: {
      type: DataTypes.DECIMAL(12, 0),
      allowNull: true,
    },
    idCategoria: {
      type: DataTypes.DECIMAL(12, 0),
      allowNull: false,
    },
    idEstadoGasto: {
      type: DataTypes.DECIMAL(5, 0),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'gastos',
    timestamps: false,
    indexes: [
      {
        name: 'idx_gastos_fecha',
        fields: ['fecha'],
      },
      {
        name: 'idx_gastos_estado',
        fields: ['idEstadoGasto'],
      },
    ],
  }
);


