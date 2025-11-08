import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface VentaDiariaAttributes {
  idVenta: number;
  fecha: Date;
  numeroClientes: number;
  totalEfectivo: number;
  totalTarjeta: number;
  ventaTotal: number;
  idCaja: number;
  idUsuario: number;
  idReporte?: number | null;
}

export interface VentaDiariaCreationAttributes
  extends Optional<VentaDiariaAttributes, 'idVenta' | 'fecha' | 'idReporte'> {}

export class VentaDiaria
  extends Model<VentaDiariaAttributes, VentaDiariaCreationAttributes>
  implements VentaDiariaAttributes
{
  public idVenta!: number;
  public fecha!: Date;
  public numeroClientes!: number;
  public totalEfectivo!: number;
  public totalTarjeta!: number;
  public ventaTotal!: number;
  public idCaja!: number;
  public idUsuario!: number;
  public idReporte?: number | null;
}

VentaDiaria.init(
  {
    idVenta: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    numeroClientes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    totalEfectivo: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      defaultValue: 0,
    },
    totalTarjeta: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      defaultValue: 0,
    },
    ventaTotal: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      defaultValue: 0,
    },
    idCaja: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idReporte: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'ventas_diarias',
    timestamps: false,
    indexes: [
      {
        name: 'idx_ventas_diarias_fecha',
        fields: ['fecha'],
      },
      {
        name: 'idx_ventas_diarias_caja',
        fields: ['idCaja'],
      },
      {
        name: 'idx_ventas_diarias_usuario',
        fields: ['idUsuario'],
      },
    ],
  }
);


