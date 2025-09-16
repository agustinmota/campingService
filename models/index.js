const { Sequelize } = require("sequelize");
const Accommodation = require("./Accommodation");
const Cabin = require("./Cabin");
const Campsite = require("./Campsite");
const Guest = require("./Guest");
const Booking = require("./Booking");
const User = require("./User");
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  logging: console.log

});

async function init() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');


    Accommodation.initModel(sequelize);
    Cabin.initModel(sequelize);
    Campsite.initModel(sequelize);
    Guest.initModel(sequelize);
    Booking.initModel(sequelize);

    User.initModel(sequelize);

    Cabin.associate({ Accommodation });
    Campsite.associate({ Accommodation });
    Booking.associate({ Accommodation, Guest, User  });
    Guest.associate({ Booking });
    User.associate({ Booking });


    


    await sequelize.sync({ force: true });
    console.log("All tables created successfully!");

    await Guest.bulkCreate([
      {
        firstName: "Juan",
        lastName: "Pérez",
        document: "12345678",
        phone: "099111111",

      },
      {
        firstName: "María",
        lastName: "Gómez",
        document: "87654321",
        phone: "099222222",

      },
      {
        firstName: "Pedro",
        lastName: "Rodríguez",
        document: "45678912",
        phone: "099333333",

      }
      
    ]);
const accommodations= await Accommodation.bulkCreate([
    { type: 'cabin', identifier: 'A' },
    { type: 'cabin', identifier: 'B' },
    { type: 'cabin', identifier: 'C' },

]);

await Cabin.bulkCreate([
    { id: accommodations[0].id, identifier: accommodations[0].identifier, maxCapacity: 5, pricePerDay: 1000 },
    { id: accommodations[1].id, identifier: accommodations[1].identifier, maxCapacity: 8, pricePerDay: 1200 },
    { id: accommodations[2].id, identifier: accommodations[2].identifier, maxCapacity: 7, pricePerDay: 1100 },
]);


    console.log("Sample data inserted successfully!");
  } catch (error) {
    console.error('Unable to connect or create tables:', error);
  }
}


init();


module.exports = { sequelize, Accommodation, Cabin, Campsite, Guest, Booking, init };
