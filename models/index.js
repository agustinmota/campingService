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

    const cabinSeeds = [
      {
        identifier: "A",
        maxCapacity: 5,
        pricePerDay: 1000,
        description: "Cozy wooden cabin with a private deck, natural shade, and easy access to shared services.",
        imageUrl: "/cabins/cabin-a.jpg"
      },
      {
        identifier: "B",
        maxCapacity: 8,
        pricePerDay: 1200,
        description: "Spacious family cabin with warm timber interiors, a large dining area, and views of the trees.",
        imageUrl: "/cabins/cabin-b.jpg"
      },
      {
        identifier: "C",
        maxCapacity: 7,
        pricePerDay: 1100,
        description: "Quiet cabin designed for restful stays, group meals, and slow mornings near nature.",
        imageUrl: "/cabins/cabin-c.jpg"
      },
      {
        identifier: "D",
        maxCapacity: 4,
        pricePerDay: 1350,
        description: "Premium couple cabin tucked into the woods, ideal for a calm weekend retreat.",
        imageUrl: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=80"
      },
      {
        identifier: "E",
        maxCapacity: 6,
        pricePerDay: 1450,
        description: "Modern rustic cabin with a covered porch, firepit area, and extra room for families.",
        imageUrl: "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=1200&q=80"
      }
    ];

    const campsiteSeeds = [
      {
        identifier: "P1",
        maxCapacity: 4,
        pricePerPerson: 350,
        description: "Shaded tent site with a flat pitch, nearby bathrooms, and a relaxed forest setting.",
        imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80"
      },
      {
        identifier: "P2",
        maxCapacity: 6,
        pricePerPerson: 420,
        description: "Spacious family campsite with room for a large tent, outdoor cooking, and longer stays.",
        imageUrl: "https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1200&q=80"
      },
      {
        identifier: "P3",
        maxCapacity: 2,
        pricePerPerson: 300,
        description: "Quiet minimalist pitch for two, perfect for a small tent and a peaceful night outdoors.",
        imageUrl: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?auto=format&fit=crop&w=1200&q=80"
      },
      {
        identifier: "P4",
        maxCapacity: 5,
        pricePerPerson: 390,
        description: "Forest campsite with natural privacy, soft evening light, and space for a medium tent.",
        imageUrl: "https://images.unsplash.com/photo-1545157000-85f257f7b040?auto=format&fit=crop&w=1200&q=80"
      },
      {
        identifier: "P5",
        maxCapacity: 8,
        pricePerPerson: 450,
        description: "Large group campsite with an open layout, great for friends, gear, and shared meals.",
        imageUrl: "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&w=1200&q=80"
      },
      {
        identifier: "P6",
        maxCapacity: 3,
        pricePerPerson: 330,
        description: "Private corner campsite surrounded by trees, suited for travelers who want extra quiet.",
        imageUrl: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=1200&q=80"
      },
      {
        identifier: "P7",
        maxCapacity: 6,
        pricePerPerson: 410,
        description: "Open meadow campsite with easy vehicle access, bright mornings, and plenty of fresh air.",
        imageUrl: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80"
      }
    ];

    const seedCabin = async (cabinSeed) => {
      const [accommodation] = await Accommodation.findOrCreate({
        where: { type: "cabin", identifier: cabinSeed.identifier },
        defaults: { type: "cabin", identifier: cabinSeed.identifier }
      });
      const values = {
        id: accommodation.id,
        identifier: cabinSeed.identifier,
        maxCapacity: cabinSeed.maxCapacity,
        pricePerDay: cabinSeed.pricePerDay,
        description: cabinSeed.description,
        imageUrl: cabinSeed.imageUrl
      };
      const cabin = await Cabin.findByPk(accommodation.id);
      if (cabin) {
        await cabin.update(values);
      } else {
        await Cabin.create(values);
      }
    };

    const seedCampsite = async (campsiteSeed) => {
      const [accommodation] = await Accommodation.findOrCreate({
        where: { type: "campsite", identifier: campsiteSeed.identifier },
        defaults: { type: "campsite", identifier: campsiteSeed.identifier }
      });
      const values = {
        id: accommodation.id,
        identifier: campsiteSeed.identifier,
        maxCapacity: campsiteSeed.maxCapacity,
        pricePerPerson: campsiteSeed.pricePerPerson,
        description: campsiteSeed.description,
        imageUrl: campsiteSeed.imageUrl
      };
      const campsite = await Campsite.findByPk(accommodation.id);
      if (campsite) {
        await campsite.update(values);
      } else {
        await Campsite.create(values);
      }
    };

    for (const cabinSeed of cabinSeeds) {
      await seedCabin(cabinSeed);
    }

    for (const campsiteSeed of campsiteSeeds) {
      await seedCampsite(campsiteSeed);
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
