import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface UsuarioAttributes {
  idUsuario: number;
  nombreCompleto: string;
  email: string;
  contrasenaHash: string;
  telefono?: string | null;
  fechaCreacion?: Date;
  estadoActivo: boolean;
  idRol: number;
}

export interface UsuarioCreationAttributes
  extends Optional<UsuarioAttributes, 'idUsuario' | 'telefono' | 'fechaCreacion' | 'estadoActivo'> {}

export class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes> implements UsuarioAttributes {
  public idUsuario!: number;
  public nombreCompleto!: string;
  public email!: string;
  public contrasenaHash!: string;
  public telefono?: string | null;
  public fechaCreacion?: Date;
  public estadoActivo!: boolean;
  public idRol!: number;
}

Usuario.init(
  {
    idUsuario: {
      type: DataTypes.DECIMAL(12, 0),
      autoIncrement: true,
      primaryKey: true,
    },
    nombreCompleto: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    contrasenaHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    estadoActivo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    idRol: {
      type: DataTypes.DECIMAL(5, 0),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'usuarios',
    timestamps: false,
    indexes: [
      {
        name: 'idx_usuarios_email',
        unique: true,
        fields: ['email'],
      },
    ],
  }
);


