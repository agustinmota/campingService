const { Model, DataTypes } = require("sequelize");

class Guest extends Model {
  static initModel(sequelize) {
    return super.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      document: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING },

    }, {
      sequelize,
      modelName: "Guest",
      tableName: "guests",
      timestamps: false
    });
  }

  static associate(models) {
    this.hasMany(models.Booking, { foreignKey: "guestId" });
  }
}

module.exports = Guest;
