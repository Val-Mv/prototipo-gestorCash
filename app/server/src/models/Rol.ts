import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface RolAttributes {
  idRol: number;
  nombreRol: string;
  descripcion?: string | null;
}

export interface RolCreationAttributes extends Optional<RolAttributes, 'idRol' | 'descripcion'> {}

export class Rol extends Model<RolAttributes, RolCreationAttributes> implements RolAttributes {
  public idRol!: number;
  public nombreRol!: string;
  public descripcion?: string | null;
}

Rol.init(
  {
    idRol: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombreRol: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'roles',
    timestamps: false,
    indexes: [
      {
        name: 'idx_roles_nombre',
        unique: true,
        fields: ['nombreRol'],
      },
    ],
  }
);


