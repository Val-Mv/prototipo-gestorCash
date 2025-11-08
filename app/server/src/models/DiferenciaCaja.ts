import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface DiferenciaCajaAttributes {
  idDiferencia: number;
  fecha: Date;
  montoEsperado: number;
  montoReal: number;
  diferencia: number;
  justificacion?: string | null;
  resuelta: boolean;
  idConteo: number;
  idTipoDiferencia: number;
  idUsuario: number;
}

export interface DiferenciaCajaCreationAttributes
  extends Optional<DiferenciaCajaAttributes, 'idDiferencia' | 'fecha' | 'justificacion' | 'resuelta'> {}

export class DiferenciaCaja
  extends Model<DiferenciaCajaAttributes, DiferenciaCajaCreationAttributes>
  implements DiferenciaCajaAttributes
{
  public idDiferencia!: number;
  public fecha!: Date;
  public montoEsperado!: number;
  public montoReal!: number;
  public diferencia!: number;
  public justificacion?: string | null;
  public resuelta!: boolean;
  public idConteo!: number;
  public idTipoDiferencia!: number;
  public idUsuario!: number;
}

DiferenciaCaja.init(
  {
    idDiferencia: {
      type: DataTypes.DECIMAL(12, 0),
      autoIncrement: true,
      primaryKey: true,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    montoEsperado: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
    },
    montoReal: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
    },
    diferencia: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
    },
    justificacion: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    resuelta: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    idConteo: {
      type: DataTypes.DECIMAL(12, 0),
      allowNull: false,
    },
    idTipoDiferencia: {
      type: DataTypes.DECIMAL(5, 0),
      allowNull: false,
    },
    idUsuario: {
      type: DataTypes.DECIMAL(12, 0),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'diferencias_caja',
    timestamps: false,
    indexes: [
      {
        name: 'idx_diferencias_fecha',
        fields: ['fecha'],
      },
      {
        name: 'idx_diferencias_conteo',
        fields: ['idConteo'],
      },
      {
        name: 'idx_diferencias_tipo',
        fields: ['idTipoDiferencia'],
      },
      {
        name: 'idx_diferencias_usuario',
        fields: ['idUsuario'],
      },
    ],
  }
);


