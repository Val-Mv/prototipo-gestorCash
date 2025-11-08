import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface DailyReportAttributes {
  id: string;
  store_id: string;
  date: string; // YYYY-MM-DD
  customers: number;
  sales_cash: number;
  sales_card: number;
  total_expenses: number;
  total_difference: number;
  generated_at?: Date;
  anomalies?: string | null; // JSON string
}

interface DailyReportCreationAttributes extends Optional<DailyReportAttributes, 'id' | 'generated_at'> {}

export class DailyReport extends Model<DailyReportAttributes, DailyReportCreationAttributes> 
  implements DailyReportAttributes {
  public id!: string;
  public store_id!: string;
  public date!: string;
  public customers!: number;
  public sales_cash!: number;
  public sales_card!: number;
  public total_expenses!: number;
  public total_difference!: number;
  public generated_at!: Date;
  public anomalies!: string | null;
}

DailyReport.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    store_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customers: {
      type: DataTypes.INTEGER,
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
    total_expenses: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    total_difference: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    generated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    anomalies: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'daily_reports',
    timestamps: false,
  }
);

