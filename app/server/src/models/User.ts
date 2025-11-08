import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UserAttributes {
  uid: string;
  email: string;
  display_name?: string | null;
  role: string; // DM, SM, ASM
  store_id?: string | null;
  active: boolean;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'active'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> 
  implements UserAttributes {
  public uid!: string;
  public email!: string;
  public display_name!: string | null;
  public role!: string;
  public store_id!: string | null;
  public active!: boolean;
}

User.init(
  {
    uid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    display_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    store_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false,
  }
);

