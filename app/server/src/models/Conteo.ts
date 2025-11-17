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
}

export interface ConteoCreationAttributes
  extends Optional<ConteoAttributes, 'idConteo' | 'fechaHora' | 'observaciones' | 'diferencia'> { }

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
}

Conteo.init(
  {
    idConteo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idconteo',
    },
    fechaHora: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fechahora',
    },
    montoContado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'montocontado',
    },
    montoEsperado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'montoesperado',
    },
    diferencia: {
      type: DataTypes.VIRTUAL,
      get(): number {
        const contado = Number(this.getDataValue('montoContado') || '0');
        const esperado = Number(this.getDataValue('montoEsperado') || '0');
        return contado - esperado;
      },
    },
    observaciones: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'observaciones',
    },
    idCaja: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idcaja',
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idusuario',
    },
    idTipoConteo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idtipoconteo',
    },
  },
  {
    sequelize,
    tableName: 'conteo',
    timestamps: false,
    indexes: [
      {
        name: 'idx_conteos_fecha',
        fields: ['fechahora'],
      },
      {
        name: 'idx_conteos_caja',
        fields: ['idcaja'],
      },
      {
        name: 'idx_conteos_usuario',
        fields: ['idusuario'],
      },
      {
        name: 'idx_conteos_tipo',
        fields: ['idtipoconteo'],
      },
    ],
  }
);


