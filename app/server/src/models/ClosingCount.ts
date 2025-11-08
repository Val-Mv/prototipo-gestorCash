import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ClosingCountAttributes {
  id: string;
  register_id?: string | null;
  store_id: string;
  amount: number;
  safe_amount: number;
  sales_cash: number;
  sales_card: number;
  customer_count: number;
  total_difference: number;
  timestamp?: Date;
  user_id: string;
  user_name: string;
  date: string; // YYYY-MM-DD
}

interface ClosingCountCreationAttributes extends Optional<ClosingCountAttributes, 'id' | 'timestamp'> {}

export class ClosingCount extends Model<ClosingCountAttributes, ClosingCountCreationAttributes> 
  implements ClosingCountAttributes {
  public id!: string;
  public register_id!: string | null;
  public store_id!: string;
  public amount!: number;
  public safe_amount!: number;
  public sales_cash!: number;
  public sales_card!: number;
  public customer_count!: number;
  public total_difference!: number;
  public timestamp!: Date;
  public user_id!: string;
  public user_name!: string;
  public date!: string;
}

ClosingCount.init(
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
    safe_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    sales_cash: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    sales_card: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    customer_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_difference: {
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
    tableName: 'closing_counts',
    timestamps: false,
  }
);

