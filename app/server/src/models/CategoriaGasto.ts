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
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idcategoria',
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    presupuestoMensual: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'presupuestomensual',
    },
    activa: {
      type: DataTypes.INTEGER,
      field: 'activa',
      allowNull: false,
      defaultValue: 1,
      get() {
        const raw = this.getDataValue('activa') as unknown as number;
        return raw === 1;
      },
      set(value: boolean) {
        this.setDataValue('activa', value ? 1 : 0 as any);
      },
    },
    idUsuarioCreacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idusuariocreacion',
    },
  },
  {
    sequelize,
    tableName: 'categoriagasto',
    timestamps: false,
    indexes: [
      {
        name: 'idx_categorias_nombre',
        unique: true,
        fields: ['nombre'],
      },
      {
        name: 'idx_categorias_usuario',
        fields: ['idUsuarioCreacion'],  // La tabla usa camelCase
      },
    ],
  }
);


