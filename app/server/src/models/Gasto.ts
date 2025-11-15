import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface GastoAttributes {
  idGasto: number;
  fecha: Date;
  monto: number;
  descripcion: string;
  numeroComprobante: string | null;
  rutaComprobante: string | null;
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
  public numeroComprobante!: string | null;
  public rutaComprobante!: string | null;
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
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idgasto',
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha',
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'monto',
    },
    descripcion: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: 'descripcion',
    },
    numeroComprobante: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'numerocomprobante',
    },
    rutaComprobante: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: 'rutacomprobante',
    },
    idCaja: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'idcaja',
    },
    idUsuarioRegistro: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idusuarioregistro',
    },
    idUsuarioAprobacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'idusuarioaprobacion',
    },
    idCajaOrigen: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'idcajaorigen',
    },
    idCategoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idcategoria',
    },
    idEstadoGasto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idestadogasto',
    },
  },
  {
    sequelize,
    tableName: 'gasto',
    timestamps: false,
    indexes: [
      {
        name: 'idx_gastos_fecha',
        fields: ['fecha'],
      },
      {
        name: 'idx_gastos_estado',
        fields: ['idestadogasto'],
      },
    ],
  }
);


