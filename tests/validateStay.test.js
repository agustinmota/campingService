const test = require("node:test");
const assert = require("node:assert/strict");
const { Op } = require("sequelize");

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

function loadValidateStay({ accommodation, conflict = null }) {
  const modelsPath = require.resolve("../models");
  const middlewarePath = require.resolve("../middlewares/validateStay");

  delete require.cache[modelsPath];
  delete require.cache[middlewarePath];

  require.cache[modelsPath] = {
    id: modelsPath,
    filename: modelsPath,
    loaded: true,
    exports: {
      Accommodation: {
        findByPk: async () => accommodation
      },
      Cabin: {},
      Campsite: {},
      Booking: {
        findOne: async (query) => {
          assert.deepEqual(query.where.status[Op.in], ["pending", "confirmed", "checked_in"]);
          return conflict;
        }
      }
    }
  };

  return require("../middlewares/validateStay");
}

function createRequest(overrides = {}) {
  return {
    body: {
      checkIn: "2026-06-01",
      checkOut: "2026-06-03",
      accommodationId: 10,
      amountOfPeople: 2,
      ...overrides
    }
  };
}

test("validateStay calls next when capacity and dates are valid", async () => {
  const validateStay = loadValidateStay({
    accommodation: { Cabin: { maxCapacity: 4 } }
  });
  const req = createRequest();
  const res = mockResponse();
  let nextCalls = 0;

  await validateStay(req, res, () => {
    nextCalls += 1;
  });

  assert.equal(nextCalls, 1);
  assert.equal(res.body, null);
});

test("validateStay rejects stays over max capacity", async () => {
  const validateStay = loadValidateStay({
    accommodation: { Cabin: { maxCapacity: 2 } }
  });
  const req = createRequest({ amountOfPeople: 3 });
  const res = mockResponse();

  await validateStay(req, res, () => assert.fail("next should not be called"));

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { message: "Max capacity exceeded" });
});

test("validateStay rejects unavailable dates", async () => {
  const validateStay = loadValidateStay({
    accommodation: { Campsite: { maxCapacity: 6 } },
    conflict: { id: 99 }
  });
  const req = createRequest();
  const res = mockResponse();

  await validateStay(req, res, () => assert.fail("next should not be called"));

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { message: "Accommodation not available on these dates" });
});

test("validateStay returns 404 when accommodation does not exist", async () => {
  const validateStay = loadValidateStay({
    accommodation: null
  });
  const req = createRequest();
  const res = mockResponse();

  await validateStay(req, res, () => assert.fail("next should not be called"));

  assert.equal(res.statusCode, 404);
  assert.deepEqual(res.body, { message: "Accommodation not found" });
});
