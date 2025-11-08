import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CashRegisterAttributes {
  id: string;
  store_id: string;
  number: number;
  active: boolean;
}

interface CashRegisterCreationAttributes extends Optional<CashRegisterAttributes, 'active'> {}

export class CashRegister extends Model<CashRegisterAttributes, CashRegisterCreationAttributes> 
  implements CashRegisterAttributes {
  public id!: string;
  public store_id!: string;
  public number!: number;
  public active!: boolean;
}

CashRegister.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    store_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'cash_registers',
    timestamps: false,
  }
);

