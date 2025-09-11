const { Model, DataTypes } = require("sequelize");

class Estadia extends Model {
  static initModel(sequelize) {
    return super.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      ingreso: { type: DataTypes.DATE, allowNull: false },
      egreso: { type: DataTypes.DATE, allowNull: false },
      cantidadDePersonas: { type: DataTypes.INTEGER, allowNull: false },
      montoTotal: { type: DataTypes.DECIMAL, allowNull: false }
    }, {
      sequelize,
      modelName: "Estadia",
      tableName: "estadias",
      timestamps: false
    });
  }

  static associate(models) {
    this.belongsTo(models.Titular, { foreignKey: "titularId" });
    this.belongsTo(models.Alojamiento, { foreignKey: "alojamientoId" });
  }
}

module.exports = Estadia;
