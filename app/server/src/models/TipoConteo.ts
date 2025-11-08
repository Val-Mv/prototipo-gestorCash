import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface TipoConteoAttributes {
  idTipoConteo: number;
  nombreTipo: string;
}

export interface TipoConteoCreationAttributes extends Optional<TipoConteoAttributes, 'idTipoConteo'> {}

export class TipoConteo extends Model<TipoConteoAttributes, TipoConteoCreationAttributes>
  implements TipoConteoAttributes
{
  public idTipoConteo!: number;
  public nombreTipo!: string;
}

TipoConteo.init(
  {
    idTipoConteo: {
      type: DataTypes.DECIMAL(5, 0),
      autoIncrement: true,
      primaryKey: true,
    },
    nombreTipo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'tipos_conteo',
    timestamps: false,
    indexes: [
      {
        name: 'idx_tipos_conteo_nombre',
        unique: true,
        fields: ['nombreTipo'],
      },
    ],
  }
);


