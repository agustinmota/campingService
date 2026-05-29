const test = require("node:test");
const assert = require("node:assert/strict");

function mockResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
}

function loadBookingController({ bookingModel = {}, guestModel = {}, service = {} }) {
  const bookingPath = require.resolve("../models/Booking");
  const guestPath = require.resolve("../models/Guest");
  const accommodationPath = require.resolve("../models/Accommodation");
  const servicePath = require.resolve("../services/campingService");
  const controllerPath = require.resolve("../controllers/BookingControllers");

  delete require.cache[bookingPath];
  delete require.cache[guestPath];
  delete require.cache[accommodationPath];
  delete require.cache[servicePath];
  delete require.cache[controllerPath];

  require.cache[bookingPath] = {
    id: bookingPath,
    filename: bookingPath,
    loaded: true,
    exports: bookingModel
  };
  require.cache[guestPath] = {
    id: guestPath,
    filename: guestPath,
    loaded: true,
    exports: guestModel
  };
  require.cache[accommodationPath] = {
    id: accommodationPath,
    filename: accommodationPath,
    loaded: true,
    exports: {}
  };
  require.cache[servicePath] = {
    id: servicePath,
    filename: servicePath,
    loaded: true,
    exports: service
  };

  return require("../controllers/BookingControllers");
}

test("booking create builds holder guest and creates pending booking", async () => {
  const createdGuest = { id: 12 };
  let guestPayload = null;
  let bookingPayload = null;
  let amountPayload = null;
  const controller = loadBookingController({
    guestModel: {
      create: async (payload) => {
        guestPayload = payload;
        return createdGuest;
      }
    },
    bookingModel: {
      create: async (payload) => {
        bookingPayload = payload;
        return { id: 22, ...payload };
      }
    },
    service: {
      calculateAmount: async (payload) => {
        amountPayload = payload;
        return 2400;
      }
    }
  });
  const req = {
    auth: { id: 5 },
    body: {
      checkIn: "2026-06-01",
      checkOut: "2026-06-03",
      amountOfPeople: 2,
      accommodationId: 8,
      firstName: "Ana",
      lastName: "Stone",
      document: "12345678",
      phone: "099111111"
    }
  };
  const res = mockResponse();

  await controller.create(req, res);

  assert.deepEqual(guestPayload, {
    firstName: "Ana",
    lastName: "Stone",
    document: "12345678",
    phone: "099111111"
  });
  assert.deepEqual(amountPayload, {
    accommodationId: 8,
    amountOfPeople: 2,
    checkIn: "2026-06-01",
    checkOut: "2026-06-03"
  });
  assert.deepEqual(bookingPayload, {
    checkIn: "2026-06-01",
    checkOut: "2026-06-03",
    amountOfPeople: 2,
    totalAmount: 2400,
    status: "pending",
    guestId: 12,
    accommodationId: 8,
    userId: 5
  });
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.message, "booking created successfully");
  assert.equal(res.body.booking.status, "pending");
});

test("booking create rejects missing holder data", async () => {
  const controller = loadBookingController({
    guestModel: {
      create: async () => assert.fail("guest should not be created")
    },
    bookingModel: {
      create: async () => assert.fail("booking should not be created")
    },
    service: {
      calculateAmount: async () => assert.fail("amount should not be calculated")
    }
  });
  const req = {
    auth: { id: 5 },
    body: {
      checkIn: "2026-06-01",
      checkOut: "2026-06-03",
      amountOfPeople: 2,
      accommodationId: 8,
      firstName: "Ana"
    }
  };
  const res = mockResponse();

  await controller.create(req, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { message: "holder firstName, lastName and document are required" });
});

test("updateStatus saves valid booking status", async () => {
  let saved = false;
  const booking = {
    id: 22,
    status: "pending",
    save: async () => {
      saved = true;
    }
  };
  const controller = loadBookingController({
    bookingModel: {
      findByPk: async (id) => {
        assert.equal(id, "22");
        return booking;
      }
    },
    guestModel: {}
  });
  const req = { params: { id: "22" }, body: { status: "confirmed" } };
  const res = mockResponse();

  await controller.updateStatus(req, res);

  assert.equal(saved, true);
  assert.equal(booking.status, "confirmed");
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.message, "booking status updated successfully");
});

test("updateStatus rejects invalid booking status", async () => {
  const controller = loadBookingController({
    bookingModel: {
      findByPk: async () => assert.fail("booking should not be loaded")
    },
    guestModel: {}
  });
  const req = { params: { id: "22" }, body: { status: "unknown" } };
  const res = mockResponse();

  await controller.updateStatus(req, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { message: "Invalid booking status" });
});

test("updateStatus returns 404 when booking does not exist", async () => {
  const controller = loadBookingController({
    bookingModel: {
      findByPk: async () => null
    },
    guestModel: {}
  });
  const req = { params: { id: "404" }, body: { status: "cancelled" } };
  const res = mockResponse();

  await controller.updateStatus(req, res);

  assert.equal(res.statusCode, 404);
  assert.deepEqual(res.body, { message: "booking not found" });
});
