import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface StoreAttributes {
  id: string;
  name: string;
  code: string;
  active: boolean;
}

interface StoreCreationAttributes extends Optional<StoreAttributes, 'active'> {}

export class Store extends Model<StoreAttributes, StoreCreationAttributes> 
  implements StoreAttributes {
  public id!: string;
  public name!: string;
  public code!: string;
  public active!: boolean;
}

Store.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    active: {
      type: DataTypes.INTEGER,
      field: 'active',
      allowNull: false,
      defaultValue: 1,
      get() {
        const raw = this.getDataValue('active') as unknown as number;
        return raw === 1;
      },
      set(value: boolean) {
        this.setDataValue('active', value ? 1 : 0 as any);
      },
    },
  },
  {
    sequelize,
    tableName: 'store',
    timestamps: false,
  }
);

