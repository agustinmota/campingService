const {Sequelize, DataTypes, Model} = require("sequelize")

class Alojamiento extends Model {
    static initModel(sequelize){
        return super.init({
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            tipo: { type: DataTypes.ENUM("cabana", "parcela"), allowNull: false },
             identificador: { type: DataTypes.STRING, allowNull: false }

        },{
            sequelize,
            modelName: "Alojamiento",
            tableName: "alojamientos",
            timestamps: false
        });
    }
}
module.exports = Alojamiento;