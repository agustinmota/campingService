const test = require("node:test");
const assert = require("node:assert/strict");
const { Op } = require("sequelize");

function loadAvailabilityService({ blockedBookings = [] } = {}) {
  const bookingPath = require.resolve("../models/Booking");
  const servicePath = require.resolve("../services/availabilityService");

  delete require.cache[bookingPath];
  delete require.cache[servicePath];

  require.cache[bookingPath] = {
    id: bookingPath,
    filename: bookingPath,
    loaded: true,
    exports: {
      findAll: async (query) => {
        assert.deepEqual(query.where.status[Op.in], ["pending", "confirmed", "checked_in"]);
        return blockedBookings;
      }
    }
  };

  return require("../services/availabilityService");
}

test("findAvailableUnits filters blocked accommodations", async () => {
  const { findAvailableUnits } = loadAvailabilityService({
    blockedBookings: [{ accommodationId: 2 }]
  });
  const Model = {
    findAll: async (query) => {
      assert.equal(query.where.maxCapacity[Op.gte], 3);
      return [
        { id: 1, identifier: "A" },
        { id: 2, identifier: "B" }
      ];
    }
  };

  const availableUnits = await findAvailableUnits(Model, {
    checkIn: "2026-06-01",
    checkOut: "2026-06-03",
    amountOfPeople: 3
  });

  assert.deepEqual(availableUnits, [{ id: 1, identifier: "A" }]);
});

test("validateAvailabilityQuery requires a valid date range", () => {
  const { validateAvailabilityQuery } = loadAvailabilityService();

  assert.equal(validateAvailabilityQuery({ checkIn: "", checkOut: "2026-06-03" }), "checkIn and checkOut are required");
  assert.equal(validateAvailabilityQuery({ checkIn: "2026-06-03", checkOut: "2026-06-01" }), "checkOut must be after checkIn");
  assert.equal(validateAvailabilityQuery({ checkIn: "2026-06-01", checkOut: "2026-06-03" }), null);
});
