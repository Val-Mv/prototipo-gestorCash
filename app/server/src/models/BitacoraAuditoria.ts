import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface BitacoraAuditoriaAttributes {
  idBitacora: number;
  fechaHora: Date;
  accion: string;
  tablaModificada: string;
  registroAfectado: string;
  descripcion?: string | null;
  valoresAnteriores?: string | null;
  valoresNuevos?: string | null;
  direccionIP?: string | null;
  idUsuario: number;
}

export interface BitacoraAuditoriaCreationAttributes
  extends Optional<
    BitacoraAuditoriaAttributes,
    'idBitacora' | 'fechaHora' | 'descripcion' | 'valoresAnteriores' | 'valoresNuevos' | 'direccionIP'
  > { }

export class BitacoraAuditoria
  extends Model<BitacoraAuditoriaAttributes, BitacoraAuditoriaCreationAttributes>
  implements BitacoraAuditoriaAttributes {
  public idBitacora!: number;
  public fechaHora!: Date;
  public accion!: string;
  public tablaModificada!: string;
  public registroAfectado!: string;
  public descripcion?: string | null;
  public valoresAnteriores?: string | null;
  public valoresNuevos?: string | null;
  public direccionIP?: string | null;
  public idUsuario!: number;
}

BitacoraAuditoria.init(
  {
    idBitacora: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idbitacora',
    },
    fechaHora: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fechahora',
    },
    accion: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'accion',
    },
    tablaModificada: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'moduloAfectado',
    },
    registroAfectado: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'registroId',
    },
    descripcion: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      field: 'descripcion',
    },
    valoresAnteriores: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'valoresanteriores',
    },
    valoresNuevos: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'valoresnuevos',
    },
    direccionIP: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'direccionip',
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idusuario',
    },
  },
  {
    sequelize,
    tableName: 'bitacora_auditoria',
    timestamps: false,
    indexes: [
      {
        name: 'idx_bitacoras_fecha',
        fields: ['fechahora'],
      },
      {
        name: 'idx_bitacoras_usuario',
        fields: ['idusuario'],
      },
    ],
  }
);


