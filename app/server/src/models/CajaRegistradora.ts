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
      field: 'idcaja',
    },
    numeroCaja: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: 'numerocaja',
    },
    montoInicialRequerido: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 75.00,
      field: 'montoinicialrequerido',
    },
    ubicacion: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'ubicacion',
    },
    estadoActiva: {
      type: DataTypes.INTEGER,
      field: 'estadoactiva',
      allowNull: false,
      defaultValue: 1,
      get() {
        const raw = this.getDataValue('estadoActiva') as unknown as number;
        return raw === 1;
      },
      set(value: boolean) {
        this.setDataValue('estadoActiva', value ? 1 : 0 as any);
      },
    },
    fechaRegistro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecharegistro',
    },
  },
  {
    sequelize,
    tableName: 'caja_registradora',
    timestamps: false,
    indexes: [
      {
        name: 'idx_cajas_numero',
        unique: true,
        fields: ['numerocaja'],
      },
    ],
  }
);


