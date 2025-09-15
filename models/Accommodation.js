const {Sequelize, DataTypes, Model} = require("sequelize")

class Accommodation extends Model {
    static initModel(sequelize){
        return super.init({
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            type: { type: DataTypes.ENUM("cabin", "campsite"), allowNull: false },
             identifier: { type: DataTypes.STRING, allowNull: false }

        },{
            sequelize,
            modelName: "Accommodation",
            tableName: "accommodations",
            timestamps: false
        });
    }
}
module.exports = Accommodation;