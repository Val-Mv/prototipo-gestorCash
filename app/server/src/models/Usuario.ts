import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface UsuarioAttributes {
  idUsuario: number;
  nombreCompleto: string;
  email: string;
  contrasenahash: string;
  telefono?: string | null;
  fechaCreacion?: Date;
  estadoActivo: boolean;
  idRol: number;
}

export interface UsuarioCreationAttributes
  extends Optional<UsuarioAttributes, 'idUsuario' | 'telefono' | 'fechaCreacion' | 'estadoActivo'> { }

export class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes> implements UsuarioAttributes {
  public idUsuario!: number;
  public nombreCompleto!: string;
  public email!: string;
  public contrasenahash!: string;
  public telefono?: string | null;
  public fechaCreacion?: Date;
  public estadoActivo!: boolean;
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
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'email',
    },
    contrasenahash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'contrasenahash',
    },
    telefono: {
      type: DataTypes.STRING(20),
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
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'estadoactivo',
      get() {
        const raw = (this as any).getDataValue('estadoactivo');
        return Number(raw) === 1;
      },
      set(value: boolean | number | string) {
        const val = value === true || value === 1 || value === "1" ? 1 : 0;
        (this as any).setDataValue('estadoactivo', val);
      },
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


