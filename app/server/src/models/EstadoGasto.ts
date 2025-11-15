import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface EstadoGastoAttributes {
  idEstadoGasto: number;
  nombreEstado: string;
}

export interface EstadoGastoCreationAttributes extends Optional<EstadoGastoAttributes, 'idEstadoGasto'> {}

export class EstadoGasto
  extends Model<EstadoGastoAttributes, EstadoGastoCreationAttributes>
  implements EstadoGastoAttributes
{
  public idEstadoGasto!: number;
  public nombreEstado!: string;
}

EstadoGasto.init(
  {
    idEstadoGasto: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idestadogasto',
    },
    nombreEstado: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: 'nombreestado',
    },
  },
  {
    sequelize,
    tableName: 'estado_gasto',
    timestamps: false,
    indexes: [
      {
        name: 'idx_estados_gasto_nombre',
        unique: true,
        fields: ['nombreestado'],
      },
    ],
  }
);


