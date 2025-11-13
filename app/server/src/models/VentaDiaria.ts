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
}

export interface VentaDiariaCreationAttributes
  extends Optional<VentaDiariaAttributes, 'idVenta' | 'fecha' | 'ventaTotal'> {}

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
}

VentaDiaria.init(
  {
    idVenta: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idventa',
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha',
    },
    numeroClientes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'totalclientes',
    },
    totalEfectivo: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'totalefectivo',
    },
    totalTarjeta: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'totaltarjeta',
    },
    ventaTotal: {
      type: DataTypes.VIRTUAL,
      get(): number {
        const efectivo = Number(this.getDataValue('totalEfectivo') || '0');
        const tarjeta = Number(this.getDataValue('totalTarjeta') || '0');
        return efectivo + tarjeta;
      },
    },
    idCaja: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idcaja',
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idusuariogeneral',
    },
  },
  {
    sequelize,
    tableName: 'venta_diaria',
    timestamps: false,
    indexes: [
      {
        name: 'idx_ventas_diarias_fecha',
        fields: ['fecha'],
      },
      {
        name: 'idx_ventas_diarias_caja',
        fields: ['idcaja'],
      },
      {
        name: 'idx_ventas_diarias_usuario',
        fields: ['idusuariogeneral'],
      },
    ],
  }
);


