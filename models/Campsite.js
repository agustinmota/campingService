const {Sequelize, DataTypes, Model} = require("sequelize")

class Campsite extends Model {
    static initModel(sequelize){
        return super.init({
            id: { type: DataTypes.INTEGER, primaryKey: true },
            identifier: { type: DataTypes.STRING, allowNull: false }, // número como string o integer
            maxCapacity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 4 },
            pricePerPerson: { type: DataTypes.DECIMAL, allowNull: false }
        },{
            sequelize,
            modelName: "Campsite",
            tableName: "campsites",
            timestamps: false
        });
    }

    static associate(models){
        this.belongsTo(models.Accommodation, { foreignKey: "id", onDelete: "CASCADE" });
        models.Accommodation.hasOne(this, { foreignKey: "id" });
    }
}
module.exports = Campsite;