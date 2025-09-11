const {Sequelize, DataTypes, Model} = require("sequelize")

class Parcela extends Model {
    static initModel(sequelize){
        return super.init({
            id: { type: DataTypes.INTEGER, primaryKey: true },
            identificador: { type: DataTypes.STRING, allowNull: false }, // número como string o integer
            maximaCapacidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 4 },
            precioPorPersona: { type: DataTypes.DECIMAL, allowNull: false }
        },{
            sequelize,
            modelName: "Parcela",
            tableName: "parcelas",
            timestamps: false
        });
    }

    static associate(models){
        this.belongsTo(models.Alojamiento, { foreignKey: "id", onDelete: "CASCADE" });
        models.Alojamiento.hasOne(this, { foreignKey: "id" });
    }
}
module.exports = Parcela;