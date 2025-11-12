import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface CajaFuerteAttributes {
  idCajaFuerte: number;
  codigo: string;
  saldoActual: number;
  limiteMaximo: number;
  ubicacion?: string | null;
  fechaUltimaActualizacion?: Date;
}

export interface CajaFuerteCreationAttributes
  extends Optional<CajaFuerteAttributes, 'idCajaFuerte' | 'ubicacion' | 'fechaUltimaActualizacion'> {}

export class CajaFuerte
  extends Model<CajaFuerteAttributes, CajaFuerteCreationAttributes>
  implements CajaFuerteAttributes
{
  public idCajaFuerte!: number;
  public codigo!: string;
  public saldoActual!: number;
  public limiteMaximo!: number;
  public ubicacion?: string | null;
  public fechaUltimaActualizacion?: Date;
}

CajaFuerte.init(
  {
    idCajaFuerte: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idcajafuerte',
    },
    codigo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'codigo',
    },
    saldoActual: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'saldoactual',
    },
    limiteMaximo: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      field: 'limitemaximo',
    },
    ubicacion: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: 'ubicacion',
    },
    fechaUltimaActualizacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fechaultimaactualizacion',
    },
  },
  {
    sequelize,
    tableName: 'caja_fuerte',
    timestamps: false,
    indexes: [
      {
        name: 'idx_cajas_fuertes_codigo',
        unique: true,
        fields: ['codigo'],
      },
    ],
  }
);


