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
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idtipoconteo',
    },
    nombreTipo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: 'nombretipo',
    },
  },
  {
    sequelize,
    tableName: 'tipo_conteo',
    timestamps: false,
    indexes: [
      {
        name: 'idx_tipos_conteo_nombre',
        unique: true,
        fields: ['nombretipo'],
      },
    ],
  }
);


