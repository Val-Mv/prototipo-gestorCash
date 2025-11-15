import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ReporteDiarioAttributes {
  idReporte: number;
  fecha: Date;
  totalVentas: number;
  saldoFinal: number;
  totalClientes: number;
  totalEfectivo: number;
  totalTarjeta: number;
  totalGastosDia: number;
  totalDiferencias: number;
  idUsuarioGenerador: number;
}

export interface ReporteDiarioCreationAttributes
  extends Optional<
    ReporteDiarioAttributes,
    | 'idReporte'
    | 'fecha'
    | 'totalVentas'
    | 'saldoFinal'
    | 'totalClientes'
    | 'totalEfectivo'
    | 'totalTarjeta'
    | 'totalGastosDia'
    | 'totalDiferencias'
  > {}

export class ReporteDiario
  extends Model<ReporteDiarioAttributes, ReporteDiarioCreationAttributes>
  implements ReporteDiarioAttributes
{
  public idReporte!: number;
  public fecha!: Date;
  public totalVentas!: number;
  public saldoFinal!: number;
  public totalClientes!: number;
  public totalEfectivo!: number;
  public totalTarjeta!: number;
  public totalGastosDia!: number;
  public totalDiferencias!: number;
  public idUsuarioGenerador!: number;
}

ReporteDiario.init(
  {
    idReporte: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idreporte',
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha',
    },
    totalVentas: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'totalventas',
    },
    saldoFinal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'saldofinal',
    },
    totalClientes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'totalclientestotal',
    },
    totalEfectivo: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'totalefectivototal',
    },
    totalTarjeta: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'totaltarjeta',
    },
    totalGastosDia: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'totalgastosdia',
    },
    totalDiferencias: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'totaldiferencias',
    },
    idUsuarioGenerador: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idusuariogenerador',
    },
  },
  {
    sequelize,
    tableName: 'reporte_diario',
    timestamps: false,
    indexes: [
      {
        name: 'idx_reportes_diarios_fecha',
        fields: ['fecha'],
      },
      {
        name: 'idx_reportes_diarios_usuario',
        fields: ['idusuariogenerador'],
      },
    ],
  }
);


