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
  extends Optional<UsuarioAttributes, 'idUsuario' | 'telefono' | 'fechaCreacion' | 'estadoActivo'> { }

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
      type: DataTypes.INTEGER,
      field: 'estadoactivo',
      allowNull: true,
      defaultValue: 1,
      get() {
        const raw = this.getDataValue('estadoActivo') as unknown as number | null;
        return raw === 1;
      },
      set(value: boolean) {
        this.setDataValue('estadoActivo', (value ? 1 : 0) as unknown as boolean);
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


