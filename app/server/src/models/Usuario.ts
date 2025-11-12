import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface UsuarioAttributes {
  idUsuario: number;
  nombreCompleto: string;
  email: string;
  contrasenaHash: string;
  telefono?: string | null;
  fechaCreacion?: Date;
  estadoActivo: number;  // La BD usa numeric(1,0): 0 = false, 1 = true
  idRol: number;
}

export interface UsuarioCreationAttributes
  extends Optional<UsuarioAttributes, 'idUsuario' | 'telefono' | 'fechaCreacion' | 'estadoActivo'> { }

export class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes> implements UsuarioAttributes {
  public idUsuario!: number;
  public nombreCompleto!: string;
  public email!: string;
  public contrasenaHash!: string;
  public telefono?: string | null;
  public fechaCreacion?: Date;
  public estadoActivo!: number;  // 0 = false, 1 = true
  public idRol!: number;
}

Usuario.init(
  {
    idUsuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idusuario',
    },
    nombreCompleto: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'nombrecompleto',
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      field: 'email',
    },
    contrasenaHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'contrasenahash',
    },
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: 'telefono',
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fechacreacion',
    },
    estadoActivo: {
      type: DataTypes.INTEGER,  // La BD usa numeric(1,0), no boolean
      allowNull: false,
      defaultValue: 1,
      field: 'estadoactivo',
    },
    idRol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idrol',
    },
  },
  {
    sequelize,
    tableName: 'usuario',
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


