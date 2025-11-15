import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface TipoDiferenciaAttributes {
  idTipoDiferencia: number;
  nombreTipo: string;
}

export interface TipoDiferenciaCreationAttributes extends Optional<TipoDiferenciaAttributes, 'idTipoDiferencia'> {}

export class TipoDiferencia
  extends Model<TipoDiferenciaAttributes, TipoDiferenciaCreationAttributes>
  implements TipoDiferenciaAttributes
{
  public idTipoDiferencia!: number;
  public nombreTipo!: string;
}

TipoDiferencia.init(
  {
    idTipoDiferencia: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idtipodiferencia',
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
    tableName: 'tipo_diferencia',
    timestamps: false,
    indexes: [
      {
        name: 'idx_tipos_diferencia_nombre',
        unique: true,
        fields: ['nombretipo'],
      },
    ],
  }
);


