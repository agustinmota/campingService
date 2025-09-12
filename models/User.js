const { Model, DataTypes } = require("sequelize");

class User extends Model {
  static initModel(sequelize) {
    return super.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nombreDeUsuario: { type: DataTypes.STRING, allowNull: false },
      eMail: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },

    }, {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: false
    });
  }

  static associate(models) {
    this.hasMany(models.Estadia, { foreignKey: "UserId" });
  }
}

module.exports = User;
