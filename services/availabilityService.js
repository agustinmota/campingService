const { Op } = require("sequelize");
const Booking = require("../models/Booking");
const { BLOCKING_BOOKING_STATUSES } = require("../constants/bookingStatuses");

function validateAvailabilityQuery({ checkIn, checkOut }) {
  if (!checkIn || !checkOut) {
    return "checkIn and checkOut are required";
  }

  if (new Date(checkOut) <= new Date(checkIn)) {
    return "checkOut must be after checkIn";
  }

  return null;
}

async function findAvailableUnits(Model, { checkIn, checkOut, amountOfPeople }) {
  const queryError = validateAvailabilityQuery({ checkIn, checkOut });
  if (queryError) {
    throw new Error(queryError);
  }

  const where = amountOfPeople ? { maxCapacity: { [Op.gte]: Number(amountOfPeople) } } : {};
  const units = await Model.findAll({ where });
  const unitIds = units.map((unit) => unit.id);

  if (unitIds.length === 0) {
    return [];
  }

  const blockedBookings = await Booking.findAll({
    attributes: ["accommodationId"],
    where: {
      accommodationId: { [Op.in]: unitIds },
      status: { [Op.in]: BLOCKING_BOOKING_STATUSES },
      checkIn: { [Op.lt]: checkOut },
      checkOut: { [Op.gt]: checkIn }
    }
  });
  const blockedIds = new Set(blockedBookings.map((booking) => booking.accommodationId));

  return units.filter((unit) => !blockedIds.has(unit.id));
}

module.exports = {
  findAvailableUnits,
  validateAvailabilityQuery
};
