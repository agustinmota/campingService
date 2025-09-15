const { Model, DataTypes } = require("sequelize");

class Booking extends Model {
  static initModel(sequelize) {
    return super.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      checkIn: { type: DataTypes.DATE, allowNull: false },
      checkOut: { type: DataTypes.DATE, allowNull: false },
      amountOfPeople: { type: DataTypes.INTEGER, allowNull: false },
      totalAmount: { type: DataTypes.DECIMAL, allowNull: false }
    }, {
      sequelize,
      modelName: "Booking",
      tableName: "bookings",
      timestamps: false
    });
  }

  static associate(models) {
    this.belongsTo(models.Guest, { foreignKey: "guestId" });
    this.belongsTo(models.Accommodation, { foreignKey: "accommodationId" });
    this.belongsTo(models.User, { foreignKey: "userId" });
  }
}

module.exports = Booking;
