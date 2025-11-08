import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface CajaRegistradoraAttributes {
  idCaja: number;
  numeroCaja: string;
  montoInicialRequerido: number;
  ubicacion?: string | null;
  estadoActiva: boolean;
  fechaRegistro?: Date;
}

export interface CajaRegistradoraCreationAttributes
  extends Optional<CajaRegistradoraAttributes, 'idCaja' | 'ubicacion' | 'fechaRegistro' | 'estadoActiva'> {}

export class CajaRegistradora
  extends Model<CajaRegistradoraAttributes, CajaRegistradoraCreationAttributes>
  implements CajaRegistradoraAttributes
{
  public idCaja!: number;
  public numeroCaja!: string;
  public montoInicialRequerido!: number;
  public ubicacion?: string | null;
  public estadoActiva!: boolean;
  public fechaRegistro?: Date;
}

CajaRegistradora.init(
  {
    idCaja: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    numeroCaja: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    montoInicialRequerido: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
    },
    ubicacion: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    estadoActiva: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    fechaRegistro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'cajas_registradoras',
    timestamps: false,
    indexes: [
      {
        name: 'idx_cajas_numero',
        unique: true,
        fields: ['numeroCaja'],
      },
    ],
  }
);


