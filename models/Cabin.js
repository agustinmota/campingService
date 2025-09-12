const {Sequelize, DataTypes, Model} = require("sequelize")
Alojamiento=require("./Accommodation");

class Cabin extends Model {
    static initModel(sequelize){
        return super.init({
            id: { type: DataTypes.INTEGER, primaryKey: true ,autoIncrement:true},
            identifier: { type: DataTypes.STRING, allowNull: false }, // letra
            maxCapacity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
            pricePerDay: { type: DataTypes.DECIMAL, allowNull: false }
        },{
            sequelize,
            modelName: "Cabin",
            tableName: "cabins",
            timestamps: false
        });
    }

    static associate(models){
        this.belongsTo(models.Alojamiento, { foreignKey: "id", onDelete: "CASCADE" });
        models.Alojamiento.hasOne(this, { foreignKey: "id" });
    }
}
module.exports = Cabin;