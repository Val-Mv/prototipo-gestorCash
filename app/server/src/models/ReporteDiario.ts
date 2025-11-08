import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ReporteDiarioAttributes {
  idReporte: number;
  fecha: Date;
  totalVentas: number;
  totalGastos: number;
  saldoFinal: number;
  numeroClientesTotal: number;
  totalEfectivo: number;
  totalTarjeta: number;
  resumenDiferencias?: string | null;
  cantidadDiferencias: number;
  idUsuarioGenerador: number;
}

export interface ReporteDiarioCreationAttributes
  extends Optional<
    ReporteDiarioAttributes,
    | 'idReporte'
    | 'fecha'
    | 'totalVentas'
    | 'totalGastos'
    | 'saldoFinal'
    | 'numeroClientesTotal'
    | 'totalEfectivo'
    | 'totalTarjeta'
    | 'resumenDiferencias'
    | 'cantidadDiferencias'
  > {}

export class ReporteDiario
  extends Model<ReporteDiarioAttributes, ReporteDiarioCreationAttributes>
  implements ReporteDiarioAttributes
{
  public idReporte!: number;
  public fecha!: Date;
  public totalVentas!: number;
  public totalGastos!: number;
  public saldoFinal!: number;
  public numeroClientesTotal!: number;
  public totalEfectivo!: number;
  public totalTarjeta!: number;
  public resumenDiferencias?: string | null;
  public cantidadDiferencias!: number;
  public idUsuarioGenerador!: number;
}

ReporteDiario.init(
  {
    idReporte: {
      type: DataTypes.DECIMAL(12, 0),
      autoIncrement: true,
      primaryKey: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    totalVentas: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0,
    },
    totalGastos: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0,
    },
    saldoFinal: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0,
    },
    numeroClientesTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    totalEfectivo: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0,
    },
    totalTarjeta: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0,
    },
    resumenDiferencias: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    cantidadDiferencias: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    idUsuarioGenerador: {
      type: DataTypes.DECIMAL(12, 0),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'reportes_diarios',
    timestamps: false,
    indexes: [
      {
        name: 'idx_reportes_diarios_fecha',
        fields: ['fecha'],
      },
      {
        name: 'idx_reportes_diarios_usuario',
        fields: ['idUsuarioGenerador'],
      },
    ],
  }
);


