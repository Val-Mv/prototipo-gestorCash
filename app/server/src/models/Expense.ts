import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ExpenseAttributes {
  id: string;
  category: string; // store_supplies, maintenance, paperwork, transport
  item: string;
  amount: number;
  description: string;
  attachment_url?: string | null;
  store_id?: string | null;
  register_id?: string | null;
  date?: string | null; // YYYY-MM-DD
  user_id?: string | null;
  created_at?: Date;
}

interface ExpenseCreationAttributes extends Optional<ExpenseAttributes, 'id' | 'created_at'> {}

export class Expense extends Model<ExpenseAttributes, ExpenseCreationAttributes> 
  implements ExpenseAttributes {
  public id!: string;
  public category!: string;
  public item!: string;
  public amount!: number;
  public description!: string;
  public attachment_url!: string | null;
  public store_id!: string | null;
  public register_id!: string | null;
  public date!: string | null;
  public user_id!: string | null;
  public created_at!: Date;
}

Expense.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    item: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    attachment_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    store_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    register_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'expenses',
    timestamps: false,
  }
);

