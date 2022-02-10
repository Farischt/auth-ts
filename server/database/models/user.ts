import { Model, Optional, DataTypes, Op } from "sequelize"
import bcryptjs from "bcryptjs"

interface UserAttributes {
  id: number
  firstName: string
  lastName: string
  email: string
  password: string | null
  createdAt?: Date
  updatedAt?: Date
}
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number
  declare firstName: string
  declare lastName: string
  declare email: string
  declare password: string | null
  declare createdAt?: Date
  declare updatedAt?: Date
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models: any) {
    User.hasMany(models.AuthToken, {
      foreignKey: "userId",
    })
  }

  static async getByEmail(email: string) {
    return await User.findOne({
      where: { email: email.trim() },
    })
  }

  static async emailTaken(email: string, userId?: number) {
    return (await User.findOne({
      where: { email, id: { [Op.ne]: userId ?? null } },
    }))
      ? true
      : false
  }

  async setPassword(password: string) {
    this.password = await bcryptjs.hash(password, 10)
  }

  async checkPassword(password: string) {
    return this.password && (await bcryptjs.compare(password, this.password))
  }
}

export default (sequelize: any) =>
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  )
