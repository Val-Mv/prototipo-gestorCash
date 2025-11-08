import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface CategoriaGastoAttributes {
  idCategoria: number;
  nombre: string;
  descripcion?: string | null;
  presupuestoMensual?: number | null;
  activa: boolean;
  idUsuarioCreacion: number;
}

export interface CategoriaGastoCreationAttributes
  extends Optional<CategoriaGastoAttributes, 'idCategoria' | 'descripcion' | 'presupuestoMensual' | 'activa'> {}

export class CategoriaGasto
  extends Model<CategoriaGastoAttributes, CategoriaGastoCreationAttributes>
  implements CategoriaGastoAttributes
{
  public idCategoria!: number;
  public nombre!: string;
  public descripcion?: string | null;
  public presupuestoMensual?: number | null;
  public activa!: boolean;
  public idUsuarioCreacion!: number;
}

CategoriaGasto.init(
  {
    idCategoria: {
      type: DataTypes.DECIMAL(12, 0),
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    presupuestoMensual: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
    },
    activa: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    idUsuarioCreacion: {
      type: DataTypes.DECIMAL(12, 0),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'categorias_gasto',
    timestamps: false,
    indexes: [
      {
        name: 'idx_categorias_nombre',
        unique: true,
        fields: ['nombre'],
      },
      {
        name: 'idx_categorias_usuario',
        fields: ['idUsuarioCreacion'],
      },
    ],
  }
);


