const { Model, DataTypes } = require("sequelize");

class Titular extends Model {
  static initModel(sequelize) {
    return super.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: DataTypes.STRING, allowNull: false },
      apellido: { type: DataTypes.STRING, allowNull: false },
      documento: { type: DataTypes.STRING, allowNull: false },
      telefono: { type: DataTypes.STRING },
      esUruguayo: { type: DataTypes.BOOLEAN },
      tarjetaDeCredito: { type: DataTypes.STRING }
    }, {
      sequelize,
      modelName: "Titular",
      tableName: "titulares",
      timestamps: false
    });
  }

  static associate(models) {
    this.hasMany(models.Estadia, { foreignKey: "titularId" });
  }
}

module.exports = Titular;
