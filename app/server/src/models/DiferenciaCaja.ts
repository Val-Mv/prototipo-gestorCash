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
}

DiferenciaCaja.init(
  {
    idDiferencia: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'iddiferencia',
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha',
    },
    montoEsperado: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      field: 'montoesperado',
    },
    montoReal: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      field: 'montoreal',
    },
    diferencia: {
      type: DataTypes.VIRTUAL,
      get(): number {
        const esperado = Number(this.getDataValue('montoEsperado') || '0');
        const real = Number(this.getDataValue('montoReal') || '0');
        return real - esperado;
      },
    },
    justificacion: {
      type: DataTypes.VIRTUAL,
      // Nota: Esta columna no existe en la tabla, se marca como virtual
    },
    resuelta: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'resuelta',
    },
    idConteo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idconteo',
    },
    idTipoDiferencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idtipodiferencia',
    },
  },
  {
    sequelize,
    tableName: 'diferencia_caja',
    timestamps: false,
    indexes: [
      {
        name: 'idx_diferencias_fecha',
        fields: ['fecha'],
      },
      {
        name: 'idx_diferencias_conteo',
        fields: ['idconteo'],
      },
      {
        name: 'idx_diferencias_tipo',
        fields: ['idtipodiferencia'],
      },
    ],
  }
);


