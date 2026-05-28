const { Sequelize } = require("sequelize");
const Accommodation = require("./Accommodation");
const Cabin = require("./Cabin");
const Campsite = require("./Campsite");
const Guest = require("./Guest");
const Booking = require("./Booking");
const User = require("./User");
const { hash } = require("bcryptjs");
require('dotenv').config();
const hashPassword = require ("../utils/hashPassword");

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


    


    await sequelize.sync({ alter: true });
    console.log("All tables created successfully!");

    const guestCount = await Guest.count();
    if (guestCount === 0) {
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
    }

    const accommodationCount = await Accommodation.count();
    if (accommodationCount === 0) {
const accommodations= await Accommodation.bulkCreate([
    { type: 'cabin', identifier: 'A' },
    { type: 'cabin', identifier: 'B' },
    { type: 'cabin', identifier: 'C' },
    { type: 'campsite', identifier: 'P1' },
    { type: 'campsite', identifier: 'P2' },

]);

await Cabin.bulkCreate([
    { id: accommodations[0].id, identifier: accommodations[0].identifier, maxCapacity: 5, pricePerDay: 1000, description: "Cabana compacta con deck, sombra natural y acceso cercano a servicios.", imageUrl: "/cabins/cabin-a.jpg" },
    { id: accommodations[1].id, identifier: accommodations[1].identifier, maxCapacity: 8, pricePerDay: 1200, description: "Cabana amplia para grupos, con comedor integrado y buena vista al entorno.", imageUrl: "/cabins/cabin-b.jpg" },
    { id: accommodations[2].id, identifier: accommodations[2].identifier, maxCapacity: 7, pricePerDay: 1100, description: "Cabana familiar en zona tranquila, ideal para estadias de descanso.", imageUrl: "/cabins/cabin-c.jpg" },
]);

await Campsite.bulkCreate([
    { id: accommodations[3].id, identifier: accommodations[3].identifier, maxCapacity: 4, pricePerPerson: 350, description: "Parcela arbolada para carpa chica, con facil acceso a banos y parrillero.", imageUrl: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=900&q=80" },
    { id: accommodations[4].id, identifier: accommodations[4].identifier, maxCapacity: 6, pricePerPerson: 420, description: "Parcela espaciosa para familia o grupo, pensada para estadias largas.", imageUrl: "https://images.unsplash.com/photo-1478827387698-1527781a4887?auto=format&fit=crop&w=900&q=80" },
]);
    }

    const cabinDefaults = [
      { identifier: "A", description: "Cabana compacta con deck, sombra natural y acceso cercano a servicios.", imageUrl: "/cabins/cabin-a.jpg" },
      { identifier: "B", description: "Cabana amplia para grupos, con comedor integrado y buena vista al entorno.", imageUrl: "/cabins/cabin-b.jpg" },
      { identifier: "C", description: "Cabana familiar en zona tranquila, ideal para estadias de descanso.", imageUrl: "/cabins/cabin-c.jpg" }
    ];

    for (const cabinDefault of cabinDefaults) {
      const cabin = await Cabin.findOne({ where: { identifier: cabinDefault.identifier } });
      if (cabin && (!cabin.description || !cabin.imageUrl || cabin.imageUrl.includes("images.unsplash.com"))) {
        await cabin.update(cabinDefault);
      }
    }

await User.findOrCreate({
  where: { email: "admin@e.com" },
  defaults: {
    username: "admin",
    email: "admin@e.com",
    password: await hashPassword("1234"),
    role: "admin"
  }
});
    console.log("Sample data inserted successfully!");
  } catch (error) {
    console.error('Unable to connect or create tables:', error);
  }
}





module.exports = { sequelize, Accommodation, Cabin, Campsite, Guest, Booking, init };
