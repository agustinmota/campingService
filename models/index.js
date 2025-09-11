const { Sequelize } = require("sequelize");
const Alojamiento = require("./Alojamiento");
const Cabana = require("./Cabana");
const Parcela = require("./Parcela");
const Titular = require("./Titular");
const Estadia = require("./Estadia");

const sequelize = new Sequelize('campingservice', 'root', 'root', {
  dialect: "mysql",
  host: "localhost",
  logging: console.log 

});

async function init() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');


    Alojamiento.initModel(sequelize);
    Cabana.initModel(sequelize);
    Parcela.initModel(sequelize);
    Titular.initModel(sequelize);
    Estadia.initModel(sequelize);

  
    Cabana.associate({ Alojamiento });
    Parcela.associate({ Alojamiento });
    Estadia.associate({ Alojamiento, Titular });
    Titular.associate({ Estadia });

    
    await sequelize.sync({ force: true });
    console.log("All tables created successfully!");

    await Titular.bulkCreate([
      {
        nombre: "Juan",
        apellido: "Pérez",
        documento: "12345678",
        telefono: "099111111",
        esUruguayo: true,
        tarjetaDeCredito: "1111-2222-3333-4444"
      },
      {
        nombre: "María",
        apellido: "Gómez",
        documento: "87654321",
        telefono: "099222222",
        esUruguayo: false,
        tarjetaDeCredito: "5555-6666-7777-8888"
      },
      {
        nombre: "Pedro",
        apellido: "Rodríguez",
        documento: "45678912",
        telefono: "099333333",
        esUruguayo: true,
        tarjetaDeCredito: "9999-0000-1111-2222"
      }
      
    ]);
const alojamientos = await Alojamiento.bulkCreate([
    { tipo: 'cabana', identificador: 'A' },
    { tipo: 'cabana', identificador: 'B' },
    { tipo: 'cabana', identificador: 'C' },
    
]);

await Cabana.bulkCreate([
    { id: alojamientos[0].id, identificador: alojamientos[0].identificador, maximaCapacidad: 5, precioPorDia: 1000 },
    { id: alojamientos[1].id, identificador: alojamientos[1].identificador, maximaCapacidad: 8, precioPorDia: 1200 },
    { id: alojamientos[2].id, identificador: alojamientos[2].identificador, maximaCapacidad: 7, precioPorDia: 1100 },
]);


    console.log("✅ Titulares de prueba creados!");
  } catch (error) {
    console.error('Unable to connect or create tables:', error);
  }
}


init();


module.exports = { sequelize, Alojamiento, Cabana, Parcela, Titular, Estadia, init };
