const {Sequelize, DataTypes, Model} = require("sequelize")
Alojamiento=require("./Alojamiento");

class Cabana extends Model {
    static initModel(sequelize){
        return super.init({
            id: { type: DataTypes.INTEGER, primaryKey: true ,autoIncrement:true},
            identificador: { type: DataTypes.STRING, allowNull: false }, // letra
            maximaCapacidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
            precioPorDia: { type: DataTypes.DECIMAL, allowNull: false }
        },{
            sequelize,
            modelName: "Cabana",
            tableName: "cabanas",
            timestamps: false
        });
    }

    static associate(models){
        this.belongsTo(models.Alojamiento, { foreignKey: "id", onDelete: "CASCADE" });
        models.Alojamiento.hasOne(this, { foreignKey: "id" });
    }
}
module.exports = Cabana;