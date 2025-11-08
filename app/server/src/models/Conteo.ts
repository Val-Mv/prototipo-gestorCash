import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ConteoAttributes {
  idConteo: number;
  fechaHora: Date;
  montoContado: number;
  montoEsperado: number;
  diferencia: number;
  observaciones?: string | null;
  idCaja: number;
  idUsuario: number;
  idTipoConteo: number;
  idReporte?: number | null;
}

export interface ConteoCreationAttributes
  extends Optional<ConteoAttributes, 'idConteo' | 'fechaHora' | 'observaciones' | 'idReporte'> {}

export class Conteo extends Model<ConteoAttributes, ConteoCreationAttributes> implements ConteoAttributes {
  public idConteo!: number;
  public fechaHora!: Date;
  public montoContado!: number;
  public montoEsperado!: number;
  public diferencia!: number;
  public observaciones?: string | null;
  public idCaja!: number;
  public idUsuario!: number;
  public idTipoConteo!: number;
  public idReporte?: number | null;
}

Conteo.init(
  {
    idConteo: {
      type: DataTypes.DECIMAL(12, 0),
      autoIncrement: true,
      primaryKey: true,
    },
    fechaHora: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    montoContado: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
    },
    montoEsperado: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
    },
    diferencia: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
    },
    observaciones: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    idCaja: {
      type: DataTypes.DECIMAL(12, 0),
      allowNull: false,
    },
    idUsuario: {
      type: DataTypes.DECIMAL(12, 0),
      allowNull: false,
    },
    idTipoConteo: {
      type: DataTypes.DECIMAL(5, 0),
      allowNull: false,
    },
    idReporte: {
      type: DataTypes.DECIMAL(12, 0),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'conteos',
    timestamps: false,
    indexes: [
      {
        name: 'idx_conteos_fecha',
        fields: ['fechaHora'],
      },
      {
        name: 'idx_conteos_caja',
        fields: ['idCaja'],
      },
      {
        name: 'idx_conteos_usuario',
        fields: ['idUsuario'],
      },
      {
        name: 'idx_conteos_tipo',
        fields: ['idTipoConteo'],
      },
    ],
  }
);


