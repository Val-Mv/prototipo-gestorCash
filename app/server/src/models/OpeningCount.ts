import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface OpeningCountAttributes {
  id: string;
  register_id?: string | null;
  store_id: string;
  amount: number;
  timestamp?: Date;
  user_id: string;
  user_name: string;
  date: string; // YYYY-MM-DD
}

interface OpeningCountCreationAttributes extends Optional<OpeningCountAttributes, 'id' | 'timestamp'> {}

export class OpeningCount extends Model<OpeningCountAttributes, OpeningCountCreationAttributes> 
  implements OpeningCountAttributes {
  public id!: string;
  public register_id!: string | null;
  public store_id!: string;
  public amount!: number;
  public timestamp!: Date;
  public user_id!: string;
  public user_name!: string;
  public date!: string;
}

OpeningCount.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    register_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    store_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'opening_counts',
    timestamps: false,
  }
);

